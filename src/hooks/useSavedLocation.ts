import { useCallback, useEffect, useState } from 'react'

export const locations = [
  { value: 'aav', label: 'Aarhus Vineyard' },
  { value: 'rov', label: 'Roskilde Vineyard' }
]

export function useSavedLocation() {
  const [location, setLocation] = useState(
    localStorage.getItem('event_location') ?? locations[0].value
  )

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
