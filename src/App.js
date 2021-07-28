import axios from 'axios'
import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './css/base.css'
import React from 'react'
import Loader from './components/Loader'
import { MainWrapper, Divider, ContentWrapper, InfoWrapper, BackgroundWrapper, ChartWrapper, Header, SubHeader } from './utils/wrappers'
import InjectionGraph from './graphs/InjectionGraph'
import UnusedVaccineGraph from './graphs/UnusedVaccineGraph'
import OrderGraph from './graphs/OrderGraph'
import SpecificDateGraph from './graphs/SpecificDateGraph'
import AggregatedDataGraph from './graphs/AggregatedDataGraph'

const baseUrl = 'http://localhost:3001'

const App = () => {

  const placeholder = {
    data: [],
    orderCount: 0,
    vaccineCount: 0,
    // ...
  }

  const [loading, setLoading] = useState(true)

  const [vaccinationData, setVaccinationData] = useState([])
  const [antiqua, setAntiqua] = useState(placeholder)
  const [solarBuddhica, setSolarBuddhica] = useState(placeholder)
  const [zerpfy, setZerpfy] = useState(placeholder)

  const allProducers = [antiqua, solarBuddhica, zerpfy]

  const [selectedDate, setSelectedDate] = useState(new Date('2021-04-12T11:10:06.473587Z'))

  // states for date-specific data display
  const [ordersOnDate, setOrdersOnDate] = useState(0)
  const [injectionsOnDate, setInjectionsOnDate] = useState(0)
  const [expiredUpToDate, setExpiredUpToDate] = useState(0)
  const [injectedUpToDate, setInjectedUpToDate] = useState(0)
  const [usableOnDate, setUsableOnDate] = useState(0)

  // states for aggregated data
  const [expiredOrdersUpToDateArray, setExpiredOrdersUpToDateArray] = useState([])
  const [notExpiredOrdersUpToDateArray, setNotExpiredOrdersUpToDateArray] = useState([])
  const [injectedUpToDateArray, setInjectedUpToDateArray] = useState([])
  const [notInjectedUpToDateArray, setNotInjectedUpToDateArray] = useState([])

  // states for general data
  const [totalVaccineCount, setTotalVaccineCount] = useState(0)
  const [totalOrderCount, setTotalOrderCount] = useState(0)
  const [usedVaccineCount, setUsedVaccineCount] = useState(0)
  const [unusedVaccineCount, setUnusedVaccineCount] = useState(0)

  useEffect(() => {
    getBaseData()
    // display a nice-looking loader to users during loading
    setTimeout(() => setLoading(false), 2000)
    return () => {
      // cleanup function
    }
  }, [])

  const getBaseData = async () => {
    const antiquaResult = await axios.get(`${baseUrl}/antiqua`)
    const antiquaVaccines = getUsedVaccinesPerProducer(antiquaResult.data)
    setAntiqua({
      data: antiquaResult.data,
      orderCount: antiquaResult.data.length,
      vaccineCount: antiquaVaccines,
    })
    setTotalVaccineCount(count => count + antiquaVaccines)
    setTotalOrderCount(count => count + antiquaResult.data.length)
    
    const solarBuddhicaResult = await axios.get(`${baseUrl}/solarBuddhica`)
    const solarBuddhicaVaccines = getUsedVaccinesPerProducer(solarBuddhicaResult.data)
    setSolarBuddhica({
      data: solarBuddhicaResult.data,
      orderCount: solarBuddhicaResult.data.length,
      vaccineCount: solarBuddhicaVaccines,
    })
    setTotalVaccineCount(count => count + solarBuddhicaVaccines)
    setTotalOrderCount(count => count + solarBuddhicaResult.data.length)

    const zerpfyResult = await axios.get(`${baseUrl}/zerpfy`)
    const zerpfyVaccines = getUsedVaccinesPerProducer(zerpfyResult.data)
    setZerpfy({
      data: zerpfyResult.data,
      orderCount: zerpfyResult.data.length,
      vaccineCount: zerpfyVaccines,
    })
    setTotalVaccineCount(count => count + zerpfyVaccines)
    setTotalOrderCount(count => count + zerpfyResult.data.length)

    const vaccinationResult = await axios.get(`${baseUrl}/vaccinations`)
    setVaccinationData(vaccinationResult.data)
    setUsedVaccineCount(vaccinationResult.data.length)
    setUnusedVaccineCount(antiquaVaccines + solarBuddhicaVaccines + zerpfyVaccines - vaccinationResult.data.length)
  }

  // How many vaccines per producer?
  const getUsedVaccinesPerProducer = data => {
    if (!data) return 0
    let orderCount = 0
    for (let i = 0; i < data.length; i++) {
      orderCount += data[i].injections
    }
    return orderCount
  }

  // given vaccines exactly on the selected date
  // check that year, month, and day match.
  const getVaccinesOnDate = date => {
    let vaccineCount = 0
    let nextDate = new Date()
    // loop through all given injections and check the date
    for (let i = 0; i < vaccinationData.length; i++) {
      nextDate = new Date(vaccinationData[i].vaccinationDate)
      if (nextDate.getFullYear() === date.getFullYear() && 
          nextDate.getMonth() === date.getMonth() && 
          nextDate.getDate() === date.getDate()) {
        vaccineCount++
      } 
    }
    return vaccineCount
  }

  // arrived orders on a certain date
  // check that year, month, and day match.
  const getOrdersOnDate = date => {
    let orderCount = 0
    let nextDate = new Date()
    // loop through all data and check for a matching arrival date
    for (let i = 0; i < allProducers.length; i++) {
      for (let j = 0; j < allProducers[i].data.length; j++) {
        nextDate = new Date(allProducers[i].data[j].arrived)
        if (nextDate.getFullYear() === date.getFullYear() && 
          nextDate.getMonth() === date.getMonth() && 
          nextDate.getDate() === date.getDate()) {
          orderCount++
        }
      }
    }
    return orderCount
  }

  //updates state with expired orders and not expired orders as complete datasets
  const calculateExpirationArrays = date => {
    const expiredOrders = []
    const notExpiredOrders = []
    let nextTime = 0
    const thirtyDaysMilliseconds = 30 * 24 * 60 * 60 * 1000
    let endTime = date.getTime()
    // search through all orders from all producers, split into expired and not expired arrays
    for (let producer = 0; producer < allProducers.length; producer++) {
      for (let i = 0; i < allProducers[producer].data.length; i++) {
        nextTime = new Date(allProducers[producer].data[i].arrived).getTime()
        if (endTime - nextTime > thirtyDaysMilliseconds) {
          expiredOrders.push(allProducers[producer].data[i])
        }
        if (endTime - nextTime < thirtyDaysMilliseconds
          && endTime - nextTime >= 0) {
          notExpiredOrders.push(allProducers[producer].data[i])
        }
        //else do nothing, the order would be in the future.
      }
    }
    setExpiredOrdersUpToDateArray(expiredOrders)
    setNotExpiredOrdersUpToDateArray(notExpiredOrders)
  }

  //updates state with given and not given injections as complete datasets
  const calculateInjectionArrays = date => {
    let nextTime = 0
    let endTime = date.getTime()
    const given = []
    const notGiven = []
    // loop through all injections and check the date
    for (let i = 0; i < vaccinationData.length; i++) {
      nextTime = new Date(vaccinationData[i].vaccinationDate).getTime()
      // split data into given and not given based on date
      if (endTime  - nextTime > 0) {
        given.push(vaccinationData[i])
      } else {
        notGiven.push(vaccinationData[i])
      }
    }
    setInjectedUpToDateArray(given)
    setNotInjectedUpToDateArray(notGiven)
  }

  /**
   * Counts how many injections arrived in the last 30 days and are not yet injected
   */
  const calculateUsableVaccines = () => {
    let notExpiredCount = 0
    for (let i = 0; i < notExpiredOrdersUpToDateArray.length; i++) {
      notExpiredCount += notExpiredOrdersUpToDateArray[i].injections
    }
    let givenNotExpired = 0
    for (let i = 0; i < injectedUpToDateArray.length; i++) {
      for (let j = 0; j < notExpiredOrdersUpToDateArray.length; j++) {
        if (injectedUpToDateArray[i].sourceBottle === notExpiredOrdersUpToDateArray[j].id) {
          givenNotExpired++
          break
        }
      }
    }
    let usableCount = notExpiredCount - givenNotExpired
    setUsableOnDate(usableCount)
  }

  // updates state based on selected date, aggregating source data arrays into more specific ones
  // FIXME: state updates too late, and changes are displayed only after the next state change.
  const calculateAggregatedData = date => {
    calculateExpirationArrays(date)
    calculateInjectionArrays(date)
    // calculateGivenNotExpiredInjections() 
    calculateUsableVaccines()
    calculateExpirationsUpToDate()
    setInjectedUpToDate(injectedUpToDateArray.length)
  }

  // looks through given vaccinations, and checks how many of them were a part of expired orders.
  const calculateExpirationsUpToDate = () => {
    let potentialExpiredInjections = 0
    // calculate total expirations as if none were given
    for (let i = 0; i < expiredOrdersUpToDateArray.length; i++) {
      potentialExpiredInjections += expiredOrdersUpToDateArray[i].injections
    }
    // reduce the potential expirations with those that were actually given
    for (let i = 0; i < injectedUpToDateArray.length; i++) {
      for (let j = 0; j < expiredOrdersUpToDateArray.length; j++) {
        if (injectedUpToDateArray[i].sourceBottle === expiredOrdersUpToDateArray[j].id) {
          potentialExpiredInjections--
          break
        }
      }
    }
    setExpiredUpToDate(potentialExpiredInjections)
  }

  const handleDateChange = date => {
    setSelectedDate(date)
    setOrdersOnDate(getOrdersOnDate(date))
    setInjectionsOnDate(getVaccinesOnDate(date))
    calculateAggregatedData(date)
  }
  
  if (loading) {
    return <Loader/>
  }
  // TODO: split into smaller components.
  return (
    <MainWrapper>
      <Divider>
        <ContentWrapper>
          <Header>Vaccination infographic</Header>
        </ContentWrapper>
        <ContentWrapper>
          <BackgroundWrapper>
            <SubHeader>How many orders and vaccines have arrived total?</SubHeader>
            <InfoWrapper>
              <div>All in all, there are this many orders in total: {totalOrderCount}</div> 
              <div>All in all, there are this many vaccines in total: {totalVaccineCount}</div> 
            </InfoWrapper>
          </BackgroundWrapper>
        </ContentWrapper>
        <ContentWrapper>
          <BackgroundWrapper>
            <SubHeader>How many of the vaccinations have been used?</SubHeader>
            <InfoWrapper>
              <div>This many vaccinations have been distributed: {vaccinationData.length}</div> 
            </InfoWrapper>
          </BackgroundWrapper>
        </ContentWrapper>
        <ContentWrapper>
          <BackgroundWrapper>
            <SubHeader>How many orders/vaccines per producer?</SubHeader>
            <InfoWrapper>
              <div>There are this many Antiqua-vaccination orders: {antiqua.orderCount}</div>
              <div>Antiqua vaccine count: {antiqua.vaccineCount}</div>
              <div>There are this many SolarBuddhica-vaccination orders: {solarBuddhica.orderCount}</div>
              <div>SolarBuddhica vaccine count: {solarBuddhica.vaccineCount}</div>
              <div>There are this many Zerpfy-vaccination orders: {zerpfy.orderCount}</div>
              <div>Zerpfy vaccine count: {zerpfy.vaccineCount}</div>
            </InfoWrapper>
          </BackgroundWrapper>
        </ContentWrapper>
        <ContentWrapper>
          <BackgroundWrapper>
            <SubHeader>Select a date to inspect!</SubHeader>
            <InfoWrapper>
              <DatePicker selected={selectedDate} onChange={(date) => handleDateChange(date)} />
              <div><i>Selected date: {selectedDate.toString()}</i></div>
              <div>Things to display:</div>
              <div>How many vaccines had expired on the date? (expired - given)</div>
              <div>How many are still usable on the date?</div>
              <div>How many expire in the next 10 days?</div>
              <div>How many were injected up to the date?</div>
            </InfoWrapper>
          </BackgroundWrapper>
        </ContentWrapper>
        <ContentWrapper>
          <BackgroundWrapper>
            <SubHeader>Helpful buttons for development</SubHeader>
            <button onClick={() => console.log(antiqua.data)}>Click for producer data logging!</button><br/>
            <button onClick={() => console.log(vaccinationData)}>Click for vaccination data logging!</button><br/>
          </BackgroundWrapper>
        </ContentWrapper>
      </Divider>
      <Divider>
        <ContentWrapper>
          <Header>Cool charts</Header>
          <BackgroundWrapper>
            <SubHeader>Date-specific information</SubHeader>
          </BackgroundWrapper>
          <ChartWrapper>
            <SpecificDateGraph injectionsOnDate={injectionsOnDate} ordersOnDate={ordersOnDate}/>
          </ChartWrapper>
          <ChartWrapper>
            <AggregatedDataGraph injectedUpToDate={injectedUpToDate} expiredUpToDate={expiredUpToDate} usableOnDate={usableOnDate}/>
          </ChartWrapper>
          <BackgroundWrapper>
            <SubHeader>General information</SubHeader>
          </BackgroundWrapper>
          <ChartWrapper>
            <InjectionGraph antiqua={antiqua} solarBuddhica={solarBuddhica} zerpfy={zerpfy}/>
          </ChartWrapper>
          <ChartWrapper>
            <OrderGraph antiqua={antiqua} solarBuddhica={solarBuddhica} zerpfy={zerpfy}/>
          </ChartWrapper>
          <ChartWrapper>
            <UnusedVaccineGraph usedVaccineCount={usedVaccineCount} unusedVaccineCount={unusedVaccineCount}/>
          </ChartWrapper>
          
        </ContentWrapper>
        
      </Divider>
    </MainWrapper>
  )
}

export default App
