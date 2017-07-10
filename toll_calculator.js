const moment = require('moment')
const { tollFreeVehicles, holidays2017 } = require('./constants')

const isTollFreeVehicle = vehicle => tollFreeVehicles.includes(vehicle)

const calculateTollFee = (date, vehicle) => {
  const current = moment(date)
  const hour = current.get('hour')
  const minute = current.get('minute')

  if (hour === 6) {
    return minute < 30 ? 8 : 13
  }
  if (hour === 7) {
    return 18
  }
  if (hour === 8 && minute < 30) {
    return 13
  }
  if (hour >= 8 && hour <= 14 && minute >= 30) {
    return 8
  }
  if (hour === 15 && minute < 30) {
    return 13
  }
  if (hour === 15 || hour === 16) {
    return 18
  }
  if (hour === 17) {
    return 13
  }
  if (hour === 18 && minute < 30) {
    return 8
  }
  return 0
}

const isTollFreeDate = date => {
  const current = moment(date)
  const isWeekend = [6, 7].includes(current.isoWeekday())
  const isHoliday = holidays2017.some(holiday => current.isSame(holiday, 'day'))
  return isWeekend || isHoliday
}

/**
 * Calculate the total toll fee for one day.
 * @param {*} vehicle the vehicle
 * @param {*} dates date and time of all passes on one day
 */
const getTollFee = (vehicle, dates) => {
  if (isTollFreeVehicle(vehicle)) {
    return 0
  }
  const totalFee = dates
    .filter(date => !isTollFreeDate(date))
    .reduce((accumulatedFee, date) => {
      const nextFee = calculateTollFee(date, vehicle)
      const currentDate = moment(date)
      const initialDate = moment(dates[0])
      const minutes = currentDate.diff(initialDate, 'minutes')
      if (minutes > 60) {
        return accumulatedFee + nextFee
      } else {
        const initialFee = calculateTollFee(dates[0], vehicle)
        if (accumulatedFee > 0) {
          return (nextFee > initialFee)
            ? accumulatedFee + nextFee
            : accumulatedFee - initialFee
        }
        return accumulatedFee + initialFee
      }
    }, 0)
  return Math.min(totalFee, 60)
}

module.exports = getTollFee
