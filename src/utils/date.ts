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

export function formatDate(date: string | Date): string {
  return dateFormat(date, 'd. mmmm yyyy')
}

export function getTime(date: string | Date): number {
  const dateObj = date instanceof Date ? date : new Date(date)
  return dateObj.getTime()
}

export function todayTime(): number {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return now.getTime()
}
