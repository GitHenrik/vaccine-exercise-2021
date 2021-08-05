import { Doughnut } from 'react-chartjs-2'
import PropTypes from 'prop-types'
import colors from '../utils/colors'
import React from 'react'

const InjectionGraph = ({antiqua, solarBuddhica, zerpfy}) => {
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

InjectionGraph.propTypes = {
  antiqua: PropTypes.object,
  solarBuddhica: PropTypes.object,
  zerpfy: PropTypes.object,
}

export default InjectionGraph