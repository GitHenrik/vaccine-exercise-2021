import { ContentWrapper, InfoWrapper, BackgroundWrapper, SubHeader } from '../utils/wrappers'
import React from 'react'
import DatePicker from 'react-datepicker'
import PropTypes from 'prop-types'

const DateSelector = props => {
  return (
    <ContentWrapper>
      <BackgroundWrapper>
        <SubHeader>Select a date to inspect!</SubHeader>
        <InfoWrapper>
          <DatePicker selected={props.selectedDate} onChange={(date) => props.handleDateChange(date)} />
          <div><i>Selected date: {props.selectedDate.toString()}</i></div>
        </InfoWrapper>
      </BackgroundWrapper>
    </ContentWrapper>
  )
}

DateSelector.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  handleDateChange: PropTypes.func,
}


export default DateSelector