// require('dotenv').config()
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
import { getVaccinesPerProducer, 
  getVaccinesOnDate,  
  getOrdersOnDate, 
  calculateAggregatedData } from './helpers/calculations'

// development URL 
// const baseUrl = process.env.REACT_APP_DEV_URL
// relative path for deployment
const baseUrl = ''

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
  * Updates all date-related states upon selecting a new date.
  * 
  * @param {Date} date selected date is used for all calculations
  */
  const handleDateChange = date => {
    setSelectedDate(date)
    setOrdersOnDate(getOrdersOnDate(antiqua.data, date) + 
      getOrdersOnDate(solarBuddhica.data, date) + 
      getOrdersOnDate(zerpfy.data, date))
    setInjectionsOnDate(getVaccinesOnDate(vaccinationData, date))
    const aggregatedData = calculateAggregatedData([antiqua.data, solarBuddhica.data, zerpfy.data], vaccinationData, date)
    setUsableOnDate(aggregatedData.usable)
    setInjectedUpToDate(aggregatedData.injected)
    setTenDayExpirations(aggregatedData.tenDayExpirations)
    setExpiredUpToDate(aggregatedData.expiredUpToDate)
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
