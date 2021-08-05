import React from 'react'
import { ContentWrapper, BackgroundWrapper, ChartWrapper, SubHeader } from '../utils/wrappers'
import InjectionGraph from '../graphs/InjectionGraph'
import UnusedVaccineGraph from '../graphs/UnusedVaccineGraph'
import OrderGraph from '../graphs/OrderGraph'
import SpecificDateGraph from '../graphs/SpecificDateGraph'
import AggregatedDataGraph from '../graphs/AggregatedDataGraph'
import PropTypes from 'prop-types'

const Charts = props => {
  return (
    <>
      {props.showDateCharts && <ContentWrapper>
        <BackgroundWrapper>
          <SubHeader>Date-specific charts</SubHeader>
        </BackgroundWrapper>
        <ChartWrapper>
          Injections expiring in the next 10 days: <b>{props.tenDayExpirations}</b>
        </ChartWrapper>
        <ChartWrapper>
          <SpecificDateGraph injectionsOnDate={props.injectionsOnDate} ordersOnDate={props.ordersOnDate}/>
        </ChartWrapper>
        <ChartWrapper>
          <AggregatedDataGraph injectedUpToDate={props.injectedUpToDate} expiredUpToDate={props.expiredUpToDate} usableOnDate={props.usableOnDate}/>
        </ChartWrapper>
      </ContentWrapper>}
      {props.showAggregatedCharts && <ContentWrapper>
        <BackgroundWrapper>
          <SubHeader>Aggregated charts</SubHeader>
        </BackgroundWrapper>
        <ChartWrapper>
          <InjectionGraph antiqua={props.antiqua} solarBuddhica={props.solarBuddhica} zerpfy={props.zerpfy}/>
        </ChartWrapper>
        <ChartWrapper>
          <OrderGraph antiqua={props.antiqua} solarBuddhica={props.solarBuddhica} zerpfy={props.zerpfy}/>
        </ChartWrapper>
        <ChartWrapper>
          <UnusedVaccineGraph usedVaccineCount={props.usedVaccineCount} unusedVaccineCount={props.unusedVaccineCount}/>
        </ChartWrapper>
      </ContentWrapper>}
    </>
  )
}

Charts.propTypes = {
  showDateCharts: PropTypes.bool,
  showAggregatedCharts: PropTypes.bool,
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