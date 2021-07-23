import axios from 'axios'
import { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Pie, Doughnut, Bar } from 'react-chartjs-2'
import colors from './colors'
import styled from 'styled-components'
import './css/base.css'
import React from 'react'



const baseUrl = 'http://localhost:3001'

const MainWrapper = styled.div`
  margin: 0;
  border: 0;
  min-width: 768px;
  background: linear-gradient(#F3F2C9, #c4c488);
  padding-bottom: 5rem;
  //font settings
  font-family: "Open Sans";
  font-style: normal;
  line-height: 1.25rem;
  display: flex;
  flex-direction: row;


`

const Divider = styled.div`
  display: flex;
  padding-left: 1rem;
  width: 50%;
  flex-direction: column;
`

const ContentWrapper = styled.div`
  width: 90%;
  align-items: left;
`

const InfoWrapper = styled.div`
  padding: 0.5rem 0 0.5rem 1rem;
`

const ChartWrapper = styled.div`
  max-width: 80%;
  padding: 0.5rem;
  background-color: #eeeeee;
  border: 1px solid #777777;
  border-radius: 0.75rem;
  margin: 0.5rem;
`

const Header = styled.h1`
  font-size: 1.5rem;
  margin: 0;
  padding: 1.5rem 0;
`

const SubHeader = styled.h2`
  font-size: 1.25rem;
  margin: 0;
  padding: 0.25rem 0;
`

const App = () => {

  const placeholder = {
    orderCount: 0,
    vaccineCount: 0,
    usedVaccines: 0, 
    expiredVaccines: 0,
    // ...
  }
   
  const [loading, setLoading] = useState(true)

  const [antiquaData, setAntiquaData] = useState([])
  const [solarBuddhicaData, setSolarBuddhicaData] = useState([])
  const [zerpfyData, setZerpfyData] = useState([])
  const [vaccinationData, setVaccinationData] = useState([])

  const [antiqua, setAntiqua] = useState(placeholder)
  const [solarBuddhica, setSolarBuddhica] = useState(placeholder)
  const [zerpfy, setZerpfy] = useState(placeholder)
  // const allProducers = [antiqua, solarBuddhica, zerpfy]

  const [selectedDate, setSelectedDate] = useState(new Date())

  // helper array to loop through all producers' data
  const allData = [antiquaData, solarBuddhicaData, zerpfyData]

  useEffect(() => {
    console.log('useEffect')
    getBaseData()
    setLoading(false)
    return () => {
      // cleanup function
    }
  }, [])

  const getBaseData = async () => {
    const antiquaResult = await axios.get(`${baseUrl}/antiqua`)
    setAntiquaData(antiquaResult.data)
    setAntiqua({
      ...antiqua, 
      orderCount: getOrderCount(antiquaResult.data),
      vaccineCount: getUsedVaccinesPerProducer(antiquaResult.data),
    })
    
    const solarBuddhicaResult = await axios.get(`${baseUrl}/solarBuddhica`)
    setSolarBuddhicaData(solarBuddhicaResult.data)
    setSolarBuddhica({
      ...solarBuddhica,
      orderCount: getOrderCount(solarBuddhicaResult.data),
      vaccineCount: getUsedVaccinesPerProducer(solarBuddhicaResult.data),
      //vaccineCount: await axios.get(`${baseUrl}/solarBuddhica/vaccines`)
    })
    const zerpfyResult = await axios.get(`${baseUrl}/zerpfy`)
    setZerpfyData(zerpfyResult.data)
    setZerpfy({
      ...zerpfy,
      orderCount: getOrderCount(zerpfyResult.data),
      vaccineCount: getUsedVaccinesPerProducer(zerpfyResult.data),
    })

    const vaccinationsResult = await axios.get(`${baseUrl}/vaccinations`)
    setVaccinationData(vaccinationsResult.data)
  }

  // How many orders per producer?
  const getOrderCount = data => {
    if (!data) return 0
    return data.length
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

  // Total amount of usable vaccines
  // simply adds together all ordered vaccines and subtracts the total amount of used vaccinations
  const getUnusedVaccineCount = () => {
    return antiqua.vaccineCount + solarBuddhica.vaccineCount + zerpfy.vaccineCount - vaccinationData.length
  }

  // given vaccines up to a given date
  const givenVaccinesUpToDate = date => {
    let givenCount = 0
    let nextVaccinationDate = new Date()
    for (let i = 0; i < vaccinationData.length; i++) {
      console.log('Calculating total vaccinations until a certain date...')
      nextVaccinationDate = new Date(vaccinationData[i].vaccinationDate).getTime()
      if (date.getTime()  - nextVaccinationDate > 0) {
        givenCount++
      }
    }
    return givenCount
  }

  // arrived orders on a certain date
  // check that year, month, and day match. (Mismatch with helper data but still working)
  const ordersOnDate = date => {
    let orderCount = 0
    let nextDate = new Date()
    // loop through all data and check for a matching arrival date
    for (let i = 0; i < allData.length; i++) {
      console.log(allData[i][0].vaccine)
      for (let j = 0; j < allData[i].length; j++) {
        nextDate = new Date(allData[i][j].arrived)
        if (nextDate.getFullYear() === date.getFullYear() && 
          nextDate.getMonth() === date.getMonth() && 
          nextDate.getDate() === date.getDate()) {
          orderCount++
        }
      }
    }
    return orderCount
  }

  // "How many bottles have expired on the given day (remember a bottle expires 30 days after arrival)"
  // Returns the amount of expired vaccines on given date
  const expiredVaccinationsOnDate = date => {
    let arrivalTime = 0
    const thirtyDaysMilliseconds = 30 * 24 * 60 * 60 * 1000
    let [totalExpiredCount, producerExpiredCount]  = [0, 0]
    let producerExpiredVaccines = [0, 0, 0]
    // loop through all producers and check for expired vaccinations
    for (let i = 0; i < allData.length; i++) {
      producerExpiredCount = 0
      for (let j = 0; j < allData[i].length; j++) {
        // check if 30 days have passed since arrival
        arrivalTime = new Date(allData[i][j].arrived).getTime()
        console.log('Searching for expired vaccines...')
        // check that it's been 30+ days from the arrival
        if (date.getTime() - arrivalTime > thirtyDaysMilliseconds) {        
          totalExpiredCount += allData[i][j].injections
          producerExpiredCount += allData[i][j].injections
        } 
      }
      producerExpiredVaccines[i] = producerExpiredCount
    }
    // update state with expiration data
    setAntiqua({
      ...antiqua,
      expiredVaccines: producerExpiredVaccines[0]
    })
    setSolarBuddhica({
      ...solarBuddhica,
      expiredVaccines: producerExpiredVaccines[1]
    })
    setZerpfy({
      ...zerpfy,
      expiredVaccines: producerExpiredVaccines[2]
    })
    return totalExpiredCount
  }

  const handleDateChange = date => {
    setSelectedDate(date)
  }

  const getTotalOrderCount = () => {
    return antiqua.orderCount + solarBuddhica.orderCount + zerpfy.orderCount
  }

  const getTotalVaccineCount = () => {
    return antiqua.vaccineCount + solarBuddhica.vaccineCount + zerpfy.vaccineCount
  }

  const drawInjectionData = () => {
    const data = {
      labels: ['Antiqua vaccines', 'SolarBuddhica vaccines', 'Zerpfy vaccines'],
      datasets: [
        {
          label: '# of ordered injections',
          data: [antiqua.vaccineCount, 
            solarBuddhica.vaccineCount, 
            zerpfy.vaccineCount],
          backgroundColor: [
            colors.antiquaPrimary,
            colors.solarBuddhicaPrimary,
            colors.zerpfyPrimary,
          ],
          borderColor: [
            colors.antiquaSecondary,
            colors.solarBuddhicaSecondary,
            colors.zerpfySecondary,
          ],
          borderWidth: 1,
        },
      ],
    }
    const options = {

      plugins: {
        title: {
          display: true,
          text: 'Number of vaccines by producer',
        },
      },
    }
    return <Doughnut data={data} options={options} />
  }

  const drawUnusedVaccineData = () => {
    const data = {
      labels: ['Used vaccines', 'Unused vaccines'],
      datasets: [
        {
          label: '# of all vaccines and # of unused vaccines',
          data: [
            vaccinationData.length,
            getUnusedVaccineCount(),
          ],
          backgroundColor: [
            colors.usedPrimary,
            colors.unusedPrimary,

          ],
          borderColor: [
            colors.usedSecondary,
            colors.unusedSecondary,

          ],
          borderWidth: 1,
        },
      ],
    }
    const options = {
      plugins: {
        title: {
          display: true,
          text: 'Comparison between used and unused vaccines',
        },
      },
    }
    return <Pie data={data} options={options} />
  }
  const drawOrderData = () => {

    const data = {
      labels: ['Antiqua orders', 'SolarBuddhica orders', 'Zerpfy orders'],
      datasets: [
        {
          label: '# of orders',
          data: [antiqua.orderCount, 
            solarBuddhica.orderCount, 
            zerpfy.orderCount],
          backgroundColor: [
            colors.antiquaPrimary,
            colors.solarBuddhicaPrimary,
            colors.zerpfyPrimary,
          ],
          borderColor: [
            colors.antiquaSecondary,
            colors.solarBuddhicaSecondary,
            colors.zerpfySecondary,
          ],
          borderWidth: 1,
        },
      ],
    }

    const options = {
      indexAxis: 'y',
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Number of orders by producer',
        },
      },
    }
    return <Bar data={data} options={options} />
  }
  
  if (loading) {
    return <div>Loading data...</div>
  }
  return (
    <MainWrapper>
      <Divider>
        <ContentWrapper>
          <Header>Vaccination infographic</Header>
        </ContentWrapper>
        <ContentWrapper>
          <SubHeader>How many orders and vaccines have arrived total?</SubHeader>
          <InfoWrapper>
            <div>All in all, there are this many orders in total: {getTotalOrderCount()}</div> 
            <div>All in all, there are this many vaccines in total: {getTotalVaccineCount()}</div> 
          </InfoWrapper>
        </ContentWrapper>
        <ContentWrapper>
          <SubHeader>How many of the vaccinations have been used?</SubHeader>
          <div>This many vaccinations have been distributed: {vaccinationData.length}</div> 
        </ContentWrapper>
        <ContentWrapper>
          <SubHeader>How many orders/vaccines per producer?</SubHeader>
          <InfoWrapper>
            <div>There are this many Antiqua-vaccination orders: {antiqua.orderCount}</div>
            <div>Antiqua vaccine count: {antiqua.vaccineCount}</div>
            <div>There are this many SolarBuddhica-vaccination orders: {solarBuddhica.orderCount}</div>
            <div>SolarBuddhica vaccine count: {solarBuddhica.vaccineCount}</div>
            <div>There are this many Zerpfy-vaccination orders: {zerpfy.orderCount}</div>
            <div>Zerpfy vaccine count: {zerpfy.vaccineCount}</div>
          </InfoWrapper>
        </ContentWrapper>
        <ContentWrapper>
          <SubHeader>Select a date to display interesting data!</SubHeader>
          <InfoWrapper>
            <DatePicker selected={selectedDate} onChange={(date) => handleDateChange(date)} />
            <div><i>Selected date: {selectedDate.toString()}</i></div>
            <button onClick={() => console.log(expiredVaccinationsOnDate(selectedDate))}>Total amount of vaccines that had expired on selected date!</button><br/>
            <button onClick={() => console.log('todo')}>Total amount of vaccines that ever expired!</button><br/>
            <button onClick={() => console.log(getUnusedVaccineCount())}>Amount of unused vaccines!</button><br/>
            <button onClick={() => console.log('todo')}>Vaccinations expiring in the next 10 days!</button><br/>
            <button onClick={() => console.log(ordersOnDate(selectedDate))}>New orders that arrived on selected date!</button><br/>
            <button onClick={() => console.log(givenVaccinesUpToDate(selectedDate))}>All given vaccinations up until selected date!</button><br/>
          </InfoWrapper>
        </ContentWrapper>
      </Divider>
      <Divider>
        <ContentWrapper>
          <Header>Cool charts</Header>
          <ChartWrapper>
            {drawInjectionData()}
          </ChartWrapper>
          <ChartWrapper>
            {drawUnusedVaccineData()}
          </ChartWrapper>
          <ChartWrapper>
            {drawOrderData()}
          </ChartWrapper>
        </ContentWrapper>
        <ContentWrapper>
          <SubHeader>Helpful buttons for development</SubHeader>
          <button onClick={() => console.log(antiquaData)}>Click for Antiqua data logging!</button><br/>
          <button onClick={() => console.log(solarBuddhicaData)}>Click for SolarBuddhica data logging!</button><br/>
          <button onClick={() => console.log(zerpfyData)}>Click for Zerpfy data logging!</button><br/>
          <button onClick={() => console.log(vaccinationData)}>Click for vaccination data logging!</button><br/>
        </ContentWrapper>
      </Divider>
    </MainWrapper>
  )
}

export default App


