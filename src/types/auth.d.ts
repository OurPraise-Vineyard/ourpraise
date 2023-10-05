interface IRegisterForm {
  email: string
  password: string
  displayName: string
}

type LoginStatus = 'loggedIn' | 'loggedOut' | 'undetermined'
