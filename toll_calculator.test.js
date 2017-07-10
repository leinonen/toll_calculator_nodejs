const calculator = require('./toll_calculator')

test('Some vehicle types are fee-free', () => {
  [
    'motorbike',
    'tractor',
    'emergency',
    'diplomat',
    'foreign',
    'military'
  ].forEach(vehicle => expect(calculator(vehicle)).toBe(0))
})

test('Weekends and holidays are fee-free', () => {
  const dates = [
    '2017-07-15', // saturday
    '2017-07-16', // sunday
    '2017-12-25' // Christmas eve
  ]
  expect(calculator('car', dates)).toBe(0)
})

test('Fees will differ between 8 SEK and 18 SEK, depending on the time of day', () => {
  expect(calculator('car', ['2017-07-10T06:10:00'])).toBe(8)
  expect(calculator('car', ['2017-07-10T06:40:00'])).toBe(13)
  expect(calculator('car', ['2017-07-10T07:10:00'])).toBe(18)
  expect(calculator('car', ['2017-07-10T08:15:00'])).toBe(13)
  expect(calculator('car', ['2017-07-10T08:35:00'])).toBe(8)
  expect(calculator('car', ['2017-07-10T10:35:00'])).toBe(8)
  expect(calculator('car', ['2017-07-10T14:35:00'])).toBe(8)
  expect(calculator('car', ['2017-07-10T15:00:00'])).toBe(13)
  expect(calculator('car', ['2017-07-10T16:00:00'])).toBe(18)
  expect(calculator('car', ['2017-07-10T17:00:00'])).toBe(13)
  expect(calculator('car', ['2017-07-10T18:22:00'])).toBe(8)
  expect(calculator('car', ['2017-07-10T19:22:00'])).toBe(0)
})

test('A vehicle should only be charged once an hour', () => {
  const dates = [
    '2017-07-10T10:35:00',
    '2017-07-10T10:45:00',
    '2017-07-10T10:55:00'
  ]
  expect(calculator('car', dates)).toBe(8)
})

test('The maximum fee for one day is 60 SEK', () => {
  const dates = [
    '2017-07-10T06:10:00',
    '2017-07-10T06:40:00',
    '2017-07-10T07:10:00',
    '2017-07-10T08:15:00',
    '2017-07-10T08:35:00',
    '2017-07-10T10:35:00',
    '2017-07-10T14:35:00',
    '2017-07-10T15:00:00',
    '2017-07-10T16:00:00',
    '2017-07-10T17:00:00',
    '2017-07-10T18:22:00',
    '2017-07-10T19:22:00'
  ]
  expect(calculator('car', dates)).toBe(60)
})
