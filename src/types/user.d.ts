interface OrganisationType {
  name: string,
  selected: boolean,
  id: string,
  members: string[],
  roles: Record<string, 'user' | 'admin'>
}

interface UserType {
  email: string,
  displayName: string
}
