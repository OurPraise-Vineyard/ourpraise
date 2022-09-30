import dateFormat, { i18n } from 'dateformat'

i18n.monthNames = [
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

export default function formatDate(date: string | Date): string {
  return dateFormat(date, 'd. mmmm yyyy')
}
