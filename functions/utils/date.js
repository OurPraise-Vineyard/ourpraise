const dateFormat = require('dateformat')

dateFormat.i18n.monthNames = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'okt',
  'nov',
  'dec',
  'januar',
  'februar',
  'marts',
  'april',
  'maj',
  'juni',
  'juli',
  'august',
  'september',
  'oktober',
  'november',
  'december'
]

exports.formatDate = function formatDate(date) {
  return dateFormat(date, 'd. mmmm yyyy')
}

exports.getTimestamp = function getTimestamp() {
  return dateFormat(Date.now(), 'yyyy-mm-dd')
}
