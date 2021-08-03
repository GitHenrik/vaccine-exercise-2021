import PropTypes from 'prop-types'
import React from 'react'
import { ContentWrapper, InfoWrapper, BackgroundWrapper, Header, SubHeader } from '../utils/wrappers'

const GeneralInfo = ({ antiqua, solarBuddhica, zerpfy, totalOrderCount, totalVaccineCount, injections }) => {
  return (<>
    <ContentWrapper>
      <Header>General information</Header>
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
          <div>This many vaccinations have been distributed: {injections}</div> 
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
  </>)
}

GeneralInfo.propTypes = {
  antiqua: PropTypes.object,
  solarBuddhica: PropTypes.object,
  zerpfy: PropTypes.object,
  totalOrderCount: PropTypes.number,
  totalVaccineCount: PropTypes.number,
  injections: PropTypes.number,
}

export default GeneralInfo