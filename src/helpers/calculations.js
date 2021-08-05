/**
   * Updates state based on selected date, updating state with aggregated data.
   * 
   * @param {Array} orderData two-dimensional array of all producers' orders
   * @param {Array} vaccinationData array of data on given injections
   * @param {Date} date selected date for calculations
   * @returns {Object} all aggregated data combined into a single object
   */
export const calculateAggregatedData = (orderData, vaccinationData, date) => {
  const usableAndInjected = calculateUsableAndInjectedVaccines(orderData, vaccinationData, date)
  const tenDayExpirations = calculateTenDayExpirations(orderData, vaccinationData, date)
  const expiredUpToDate = calculateExpirationsUpToDate(orderData, vaccinationData, date)
  return {
    usable: usableAndInjected.usable,
    injected: usableAndInjected.injected,
    tenDayExpirations: tenDayExpirations,
    expiredUpToDate: expiredUpToDate,
  }
}
  
/**
   * Loops through order data and counts how many vaccines are included in them.
   * 
   * @param {Array} producerData array of vaccination orders from a single producer
   * @returns {Number} total amount of vaccines included in the order array
   */
export const getVaccinesPerProducer = producerData => {
  if (!producerData || producerData.length === 0) return 0
  let injectionCount = producerData.reduce((injected, next) => {
    return {injections: injected.injections + next.injections}
  })
  return injectionCount.injections
}

/**
   * Counts how many vaccines are usable on and were injected up to the selected date.
   * 
   * @param {Array} orderData two-dimensional array of all producers' orders
   * @param {Array} vaccinationData array of data on given injections
   * @param {Date} date selected date for calculations
   * @returns {Object} object containing the number of usable and injected vaccines
   */
export const calculateUsableAndInjectedVaccines = (orderData, vaccinationData, date) => {
  let expirationArrays = calculateExpirationArrays(orderData, date)
  let injectionArrays = calculateInjectionArrays(vaccinationData, date)
  let notExpiredCount = 0
  let usableCount = 0
  for (let i = 0; i < expirationArrays[1].length; i++) {
    notExpiredCount += expirationArrays[1][i].injections
  }
  let givenNotExpired = 0
  for (let i = 0; i < injectionArrays[0].length; i++) {
    for (let j = 0; j < expirationArrays[1].length; j++) {
      if (injectionArrays[0][i].sourceBottle === expirationArrays[1][j].id) {
        givenNotExpired++
        break
      }
    }
  }
  usableCount = notExpiredCount - givenNotExpired
  return {
    usable: usableCount,
    injected: injectionArrays[0].length
  }
}
  
/**
   * Source for this code snippet, slightly modified:
   * https://stackoverflow.com/a/19691491
   * 
   * Creates a secondary date 10 days in the future, and counts how many vaccines will expire in that time.
   * @param {Array} orderData two-dimensional array of all producers' orders
   * @param {Array} vaccinationData array of data on given injections
   * @param {Date} date selected date for calculations
   * @returns {Number} amount of vaccines expiring in 10 days following the selected date
   */
export const calculateTenDayExpirations = (orderData, vaccinationData, date) => {
  let currentExpirations = calculateExpirationsUpToDate(orderData, vaccinationData, date)
  let futureDate = new Date(date)
  futureDate.setDate(futureDate.getDate() + 10)
  let futureExpirations = calculateExpirationsUpToDate(orderData, vaccinationData, futureDate)
  return futureExpirations - currentExpirations
}


/**
   * Calculates how many vaccinations had expired up to the selected date.
   * 
   * @param {Array} orderData two-dimensional array of all producers' orders
   * @param {Array} vaccinationData array of data on given injections
   * @param {Date} date selected date for calculations
   * @returns {Number} total amount of expired vaccines up to the selected date
   */
export const calculateExpirationsUpToDate = (orderData, vaccinationData, date) => {
  let expirationArrays = calculateExpirationArrays(orderData, date)
  let injectionArrays = calculateInjectionArrays(vaccinationData, date)
  let expiredInjections = 0
  // calculate total expirations as if none were given
  for (let i = 0; i < expirationArrays[0].length; i++) {
    expiredInjections += expirationArrays[0][i].injections
  }
  // reduce the potential expirations with those that were actually given
  for (let i = 0; i < injectionArrays[0].length; i++) {
    for (let j = 0; j < expirationArrays[0].length; j++) {
      if (injectionArrays[0][i].sourceBottle === expirationArrays[0][j].id) {
        expiredInjections--
        break
      }
    }
  }
  return expiredInjections
}


/**
   * Creates two arrays, separating expired and not expired vaccinations from the order data.
   * 
   * @param {Array} orderData two-dimensional array containing all producers' orders
   * @param {Date} date selected date for calculations
   * @returns {Array} two-dimensional array containing expired and not expired vaccines on selected date
   */
export const calculateExpirationArrays = (orderData, date) => {
  const expiredOrders = []
  const notExpiredOrders = []
  let nextTime = 0
  const thirtyDaysMilliseconds = 30 * 24 * 60 * 60 * 1000
  let endTime = date.getTime()
  // search through all orders from all producers, split into expired and not expired arrays
  for (let i = 0; i < orderData.length; i++) {
    for (let j = 0; j < orderData[i].length; j++) {
      nextTime = new Date(orderData[i][j].arrived).getTime()
      if (endTime - nextTime > thirtyDaysMilliseconds) {
        expiredOrders.push(orderData[i][j])
      }
      if (endTime - nextTime <= thirtyDaysMilliseconds
              && endTime - nextTime >= 0) {
        notExpiredOrders.push(orderData[i][j])
      }
      // else do nothing, the order would be in the future.
    }
  }
  return [expiredOrders, notExpiredOrders]
}

/**
   * Counts how many orders a producer placed on the selected date.
   * 
   * @param {Array} data vaccine producer's order data
   * @param {Date} date selected date for calculations
   * @returns {Number} amount of orders made on the exact date
   */
export const getOrdersOnDate = (data, date) => {
  let orderCount = 0
  let nextDate = new Date()
  // loop through all data and check for a matching arrival date
  for (let i = 0; i < data.length; i++) {
    nextDate = new Date(data[i].arrived)
    if (nextDate.getFullYear() === date.getFullYear() && 
            nextDate.getMonth() === date.getMonth() && 
            nextDate.getDate() === date.getDate()) {
      orderCount++
    }
  }
  return orderCount
}

/**
   * Creates two arrays, separating given and not given injections from the injection data.
   * 
   * @param {Array} data array of data on given injections
   * @param {Date} date selected date for calculations
   * @returns {Array} two-dimensional array containing given and not given vaccines on selected date
   */
export const calculateInjectionArrays = (data, date) => {
  let nextTime = 0
  let endTime = date.getTime()
  const given = []
  const notGiven = []
  // loop through all injections and check the date
  for (let i = 0; i < data.length; i++) {
    nextTime = new Date(data[i].vaccinationDate).getTime()
    // split data into given and not given based on date
    if (endTime  - nextTime > 0) {
      given.push(data[i])
    } else {
      notGiven.push(data[i])
    }
  }
  return [given, notGiven]
}

/**
   * Counts how many vaccines were injected exactly on the selected date.
   * 
   * @param {Array} data array of data on given injections
   * @param {Date} date selected date for calculations
   * @returns {Number} amount of injections given on the date
   */
export const getVaccinesOnDate = (data, date) => {
  let vaccineCount = 0
  let nextDate = new Date()
  // loop through all given injections and check that the date matches
  for (let i = 0; i < data.length; i++) {
    nextDate = new Date(data[i].vaccinationDate)
    if (nextDate.getFullYear() === date.getFullYear() && 
              nextDate.getMonth() === date.getMonth() && 
              nextDate.getDate() === date.getDate()) {
      vaccineCount++
    } 
  }
  return vaccineCount
}

