import { Bar } from 'react-chartjs-2'
import PropTypes from 'prop-types'
import colors from '../utils/colors'
import React from 'react'
  
//displays date-specific information.
const SpecificDateGraph = ({ordersOnDate, injectionsOnDate}) => {
  const data = {
    labels: ['Orders', 'Injections'],
    datasets: [
      {
        label: '# of events on exact date',
        data: [ordersOnDate, injectionsOnDate],
        backgroundColor: [
          colors.antiquaPrimary,
          colors.zerpfyPrimary,
        ],
        borderColor: [
          colors.antiquaSecondary,
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
        text: 'Events on the selected date',
      },
    },
  }
  return <Bar data={data} options={options} />
}

SpecificDateGraph.propTypes = {
  ordersOnDate: PropTypes.number,
  injectionsOnDate: PropTypes.number,
}

export default SpecificDateGraph
  