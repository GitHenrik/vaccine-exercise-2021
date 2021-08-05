import { Bar } from 'react-chartjs-2'
import PropTypes from 'prop-types'
import colors from '../utils/colors'
import React from 'react'


// displays some aggregated data until the selected date.
// Can be updated as more data is ready to be displayed.
const AggregatedDataGraph = ({injectedUpToDate, expiredUpToDate, usableOnDate}) => {
  const data = {
    labels: ['Total given injections', 'Total expired injections', 'Usable injections'],
    datasets: [
      {
        label: '# of all events',
        data: [injectedUpToDate, expiredUpToDate, usableOnDate],
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
        text: 'Aggregated data until the selected date',
      },
    },
  }
  return <Bar data={data} options={options} />
}

    
AggregatedDataGraph.propTypes = {
  injectedUpToDate: PropTypes.number,
  expiredUpToDate: PropTypes.number,
  usableOnDate: PropTypes.number,
}
  
export default AggregatedDataGraph