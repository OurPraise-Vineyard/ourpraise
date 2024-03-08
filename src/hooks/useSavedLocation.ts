import { useCallback, useEffect, useState } from 'react'

export const locations = [
  { value: 'aav', label: 'Aarhus Vineyard' },
  { value: 'rov', label: 'Roskilde Vineyard' }
]

export const getLatestLocation = () => {
  return localStorage.getItem('event_location') ?? locations[0].value
}

export function useSavedLocation(): [
  string,
  React.Dispatch<React.SetStateAction<string>>
] {
  const [location, setLocation] = useState(() => getLatestLocation())

  const handleStorageChange = useCallback((event: StorageEvent) => {
    if (event.key === 'event_location' && event.newValue) {
      setLocation(event.newValue)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('event_location', location)
  }, [location])

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [handleStorageChange])

  return [location, setLocation]
}
