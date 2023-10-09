interface IRegisterForm {
  email: string
  password: string
  displayName: string
}

type ILoginStatus = 'loggedIn' | 'loggedOut' | 'undetermined'
