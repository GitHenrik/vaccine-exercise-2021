import axios from 'axios'
import { useState, useEffect } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import './css/base.css'
import React from 'react'
import Loader from './components/Loader'
import { SubHeader, DisplayWrapper, SidebarWrapper, MainContentWrapper } from './utils/wrappers'
import Charts from './components/Charts'
import GeneralInfo from './components/GeneralInfo'
import DateSelector from './components/DateSelector'
import Footer from './components/Footer'
import Banner from './components/Banner'

// const devUrl = 'http://localhost:3001'
// const productionUrl = 'https://vast-harbor-53912.herokuapp.com/'

const baseUrl = 'https://vast-harbor-53912.herokuapp.com' 

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

  // states to toggle display from the UI
  const [showGeneralInfo, setShowGeneralInfo] = useState(true)
  const [showDateCharts, setShowDateCharts] = useState(false)
  const [showAggregatedCharts, setShowAggregatedCharts] = useState(false)

  // states for date-specific data display
  const [ordersOnDate, setOrdersOnDate] = useState(0)
  const [injectionsOnDate, setInjectionsOnDate] = useState(0)
  const [expiredUpToDate, setExpiredUpToDate] = useState(0)
  const [injectedUpToDate, setInjectedUpToDate] = useState(0)
  const [usableOnDate, setUsableOnDate] = useState(0)
  const [tenDayExpirations, setTenDayExpirations] = useState(0)

  // states for general data
  const [totalVaccineCount, setTotalVaccineCount] = useState(0)
  const [totalOrderCount, setTotalOrderCount] = useState(0)
  const [usedVaccineCount, setUsedVaccineCount] = useState(0)
  const [unusedVaccineCount, setUnusedVaccineCount] = useState(0)

  useEffect(() => {
    getBaseData()
    // display a nice-looking loader to users for a short while
    setTimeout(() => setLoading(false), 2000)
    return () => {
      // cleanup function
    }
  }, [])

  const getBaseData = async () => {
    const antiquaResult = await axios.get(`${baseUrl}/Antiqua`)
    const antiquaVaccines = getVaccinesPerProducer(antiquaResult.data)
    setAntiqua({
      data: antiquaResult.data,
      orderCount: antiquaResult.data.length,
      vaccineCount: antiquaVaccines,
    })
    setTotalVaccineCount(count => count + antiquaVaccines)
    setTotalOrderCount(count => count + antiquaResult.data.length)
    
    const solarBuddhicaResult = await axios.get(`${baseUrl}/SolarBuddhica`)
    const solarBuddhicaVaccines = getVaccinesPerProducer(solarBuddhicaResult.data)
    setSolarBuddhica({
      data: solarBuddhicaResult.data,
      orderCount: solarBuddhicaResult.data.length,
      vaccineCount: solarBuddhicaVaccines,
    })
    setTotalVaccineCount(count => count + solarBuddhicaVaccines)
    setTotalOrderCount(count => count + solarBuddhicaResult.data.length)

    const zerpfyResult = await axios.get(`${baseUrl}/Zerpfy`)
    const zerpfyVaccines = getVaccinesPerProducer(zerpfyResult.data)
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

  /**
   * 
   * @param {Array} producerData Array of vaccination orders from a single producer
   * @returns {Number} total amount of vaccines included in the order array
   */
  const getVaccinesPerProducer = producerData => {
    if (!producerData || producerData.length === 0) return 0
    let injectionCount = producerData.reduce((injected, next) => {
      return {injections: injected.injections + next.injections}
    })
    return injectionCount.injections
  }

  /**
   * 
   * @param {Date} date selected date for calculations
   * @returns {Number} amount of injections given on the exact date
   */
  const getVaccinesOnDate = date => {
    let vaccineCount = 0
    let nextDate = new Date()
    // loop through all given injections and check that the date matches
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

  /**
   * 
   * @param {Date} date selected date for calculations
   * @returns {Number} amount of orders made on the exact date
   */
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

  /**
   * 
   * @param {Date} date selected date for calculations
   * @returns {Array} two-dimensional array containing expired and not expired vaccines on selected date
   */
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
        if (endTime - nextTime <= thirtyDaysMilliseconds
          && endTime - nextTime >= 0) {
          notExpiredOrders.push(allProducers[producer].data[i])
        }
        //else do nothing, the order would be in the future.
      }
    }
    return [expiredOrders, notExpiredOrders]
  }

  /**
   * 
   * @param {Date} date selected date for calculations
   * @returns {Array} two-dimensional array containing given and not given vaccines on selected date
   */
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
    return [given, notGiven]
  }

 
  /**
   * Counts how many injections arrived in the last 30 days and are not yet injected,
   * and updates state accordingly.
   * 
   * @param {Date} date selected date for calculations
   */
  const calculateUsableAndInjectedVaccines = date => {
    let expirationArrays = calculateExpirationArrays(date)
    let injectionArrays = calculateInjectionArrays(date)
    let notExpiredCount = 0
    let usableCount = 0
    for (let i = 0; i < expirationArrays[1].length; i++) {
      notExpiredCount += expirationArrays[1][i].injections
    }
    let givenNotExpired = 0
    for (let i = 0; i < injectionArrays[0].length; i++) {
      for (let j = 0; j < expirationArrays[1].length; j++) {
        if (injectionArrays[0][i].sourceBottle === expirationArrays[1][j].id) {
          givenNotExpired++
          break
        }
      }
    }
    usableCount = notExpiredCount - givenNotExpired
    setUsableOnDate(usableCount)
    setInjectedUpToDate(injectionArrays[0].length)
  }

  /**
   * updates state based on selected date, updating state with aggregated data
   * @param {Date} date selected date for calculations
   */
  const calculateAggregatedData = date => {
    calculateUsableAndInjectedVaccines(date)
    setExpiredUpToDate(calculateExpirationsUpToDate(date))
    setTenDayExpirations(calculateTenDayExpirations(date))
  }

  /**
   * 
   * @param {Date} date selected date for calculations
   * @returns {Number} total amount of expired vaccines up to the selected date
   */
  const calculateExpirationsUpToDate = date => {
    let expirationArrays = calculateExpirationArrays(date)
    let injectionArrays = calculateInjectionArrays(date)
    let expiredInjections = 0
    // calculate total expirations as if none were given
    for (let i = 0; i < expirationArrays[0].length; i++) {
      expiredInjections += expirationArrays[0][i].injections
    }
    // reduce the potential expirations with those that were actually given
    for (let i = 0; i < injectionArrays[0].length; i++) {
      for (let j = 0; j < expirationArrays[0].length; j++) {
        if (injectionArrays[0][i].sourceBottle === expirationArrays[0][j].id) {
          expiredInjections--
          break
        }
      }
    }
    return expiredInjections
  }
  
  /**
   * Source for this code snippet, slightly modified:
   * https://stackoverflow.com/a/19691491
   * 
   * @param {Date} date selected date for calculations
   * @returns amount of vaccines expiring in 10 days following the selected date
   */
  const calculateTenDayExpirations = date => {
    let currentExpirations = calculateExpirationsUpToDate(date)
    let futureDate = new Date(date)
    futureDate.setDate(futureDate.getDate() + 10)
    let futureExpirations = calculateExpirationsUpToDate(futureDate)
    return futureExpirations - currentExpirations
  }

  // updates all date-related states upon selecting a new date
  const handleDateChange = date => {
    setSelectedDate(date)
    setOrdersOnDate(getOrdersOnDate(date))
    setInjectionsOnDate(getVaccinesOnDate(date))
    calculateAggregatedData(date)
    // displays charts about the date
    setShowGeneralInfo(false)
    setShowDateCharts(true)
  }
  
  if (loading) {
    return (
      <>
        <Banner/>
        <Loader/>
        <Footer/>
      </>
    )
  }

  // TODO: make view stretch to 100% height
  return (
    <>
      <Banner/>
      <MainContentWrapper>
        <SidebarWrapper>
          <DateSelector selectedDate={selectedDate} handleDateChange={handleDateChange}/>
          <button onClick={() => setShowGeneralInfo(!showGeneralInfo)}>{showGeneralInfo ? 'Hide ' : 'Show '}general data</button>
          <button onClick={() => setShowDateCharts(!showDateCharts)}>{showDateCharts ? 'Hide ' : 'Display '}date-specific charts</button>
          <button onClick={() => setShowAggregatedCharts(!showAggregatedCharts)}>{showAggregatedCharts ? 'Hide ' : 'Display '}aggregated charts</button>
        </SidebarWrapper>
        <DisplayWrapper>
          {!showGeneralInfo && !showAggregatedCharts && !showDateCharts && <SubHeader>Select something to display from the side bar!</SubHeader>}
          {showGeneralInfo && <GeneralInfo antiqua={antiqua} 
            solarBuddhica={solarBuddhica} 
            zerpfy={zerpfy} 
            totalOrderCount={totalOrderCount} 
            totalVaccineCount={totalVaccineCount} 
            injections={vaccinationData.length}/>}
          <Charts 
            showAggregatedCharts={showAggregatedCharts}
            showDateCharts={showDateCharts}
            injectionsOnDate={injectionsOnDate} 
            ordersOnDate={ordersOnDate}
            injectedUpToDate={injectedUpToDate}
            expiredUpToDate={expiredUpToDate} 
            usableOnDate={usableOnDate}
            tenDayExpirations={tenDayExpirations}
            antiqua={antiqua}
            solarBuddhica={solarBuddhica}
            zerpfy={zerpfy}
            usedVaccineCount={usedVaccineCount} 
            unusedVaccineCount={unusedVaccineCount}/>      
        </DisplayWrapper>
      </MainContentWrapper>
      <Footer/>
    </>

  )
}



export default App
