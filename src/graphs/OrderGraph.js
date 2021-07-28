
import { Bar } from 'react-chartjs-2'
import PropTypes from 'prop-types'
import colors from '../utils/colors'
import React from 'react'
  
const OrderGraph = ({antiqua, solarBuddhica, zerpfy}) => {

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

OrderGraph.propTypes = {
  antiqua: PropTypes.object,
  solarBuddhica: PropTypes.object,
  zerpfy: PropTypes.object,
}

export default OrderGraph