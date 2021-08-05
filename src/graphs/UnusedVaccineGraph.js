import { Pie } from 'react-chartjs-2'
import PropTypes from 'prop-types'
import colors from '../utils/colors'
import React from 'react'

const UnusedVaccineGraph = ({usedVaccineCount, unusedVaccineCount}) => {
  const data = {
    labels: ['Used vaccines', 'Unused vaccines'],
    datasets: [
      {
        label: '# of all vaccines and # of unused vaccines',
        data: [
          usedVaccineCount,
          unusedVaccineCount,
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

  
UnusedVaccineGraph.propTypes = {
  usedVaccineCount: PropTypes.number,
  unusedVaccineCount: PropTypes.number,
}

export default UnusedVaccineGraph