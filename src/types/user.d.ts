interface IUser extends IUserMetadata {
  email: string
  displayName: string
}

interface IUserMetadata {
  role: 'user' | 'admin'
}
