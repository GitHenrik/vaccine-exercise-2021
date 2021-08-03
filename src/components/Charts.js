import React from 'react'
import { ContentWrapper, BackgroundWrapper, ChartWrapper, Header, SubHeader } from '../utils/wrappers'
import InjectionGraph from '../graphs/InjectionGraph'
import UnusedVaccineGraph from '../graphs/UnusedVaccineGraph'
import OrderGraph from '../graphs/OrderGraph'
import SpecificDateGraph from '../graphs/SpecificDateGraph'
import AggregatedDataGraph from '../graphs/AggregatedDataGraph'
import PropTypes from 'prop-types'

const Charts = props => {
  return (
    <ContentWrapper>
      <Header>Cool charts</Header>
      <BackgroundWrapper>
        <SubHeader>Date-specific charts</SubHeader>
      </BackgroundWrapper>
      <ChartWrapper>
        <SpecificDateGraph injectionsOnDate={props.injectionsOnDate} ordersOnDate={props.ordersOnDate}/>
      </ChartWrapper>
      <ChartWrapper>
        <AggregatedDataGraph injectedUpToDate={props.injectedUpToDate} expiredUpToDate={props.expiredUpToDate} usableOnDate={props.usableOnDate}/>
      </ChartWrapper>
      <BackgroundWrapper>
        <SubHeader>Aggregated charts</SubHeader>
      </BackgroundWrapper>
      <ChartWrapper>
        Injections expiring in the next 10 days: {props.tenDayExpirations}
      </ChartWrapper>
      <ChartWrapper>
        <InjectionGraph antiqua={props.antiqua} solarBuddhica={props.solarBuddhica} zerpfy={props.zerpfy}/>
      </ChartWrapper>
      <ChartWrapper>
        <OrderGraph antiqua={props.antiqua} solarBuddhica={props.solarBuddhica} zerpfy={props.zerpfy}/>
      </ChartWrapper>
      <ChartWrapper>
        <UnusedVaccineGraph usedVaccineCount={props.usedVaccineCount} unusedVaccineCount={props.unusedVaccineCount}/>
      </ChartWrapper>
    </ContentWrapper>
  )
}

Charts.propTypes = {
  injectionsOnDate: PropTypes.number,
  ordersOnDate: PropTypes.number,
  injectedUpToDate: PropTypes.number,
  expiredUpToDate: PropTypes.number,
  usableOnDate: PropTypes.number,
  tenDayExpirations: PropTypes.number,
  antiqua: PropTypes.object,
  solarBuddhica: PropTypes.object,
  zerpfy: PropTypes.object,
  usedVaccineCount: PropTypes.number,
  unusedVaccineCount: PropTypes.number,
}

export default Charts