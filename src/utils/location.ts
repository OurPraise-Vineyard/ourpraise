export const locations = [
  { value: 'aav', label: 'Aarhus Vineyard' },
  { value: 'rov', label: 'Roskilde Vineyard' }
]

export type LocationValue = (typeof locations)[number]['value']

export function getLatestLocation(): LocationValue {
  return localStorage.getItem('event_location') ?? locations[0].value
}

export function getLatestLocationLabel(): string {
  const location = getLatestLocation()
  return locations.find(l => l.value === location)!.label
}

export function setLocation(location: LocationValue): void {
  localStorage.setItem('event_location', location)
}
