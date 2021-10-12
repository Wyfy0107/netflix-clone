import { RegisterForm, LoginForm, User, ActionTypes } from './types'

//**Register actions */
export const submitRegisterForm = (form: RegisterForm): ActionTypes => {
  return {
    type: 'SUBMIT_REGISTER_FORM',
    payload: form,
  }
}

export const submitRegisterSuccess = (): ActionTypes => {
  return {
    type: 'SUBMIT_REGISTER_SUCCESS',
  }
}

//**Login actions */
export const submitLoginForm = (form: LoginForm): ActionTypes => {
  return {
    type: 'SUBMIT_LOGIN_FORM',
    payload: form,
  }
}

export const submitLoginSuccess = (userData: User): ActionTypes => {
  return {
    type: 'SUBMIT_LOGIN_SUCCESS',
    payload: userData,
  }
}

export const setLogOut = (): ActionTypes => {
  return {
    type: 'SET_LOG_OUT',
  }
}

export const setLoggedIn = (): ActionTypes => {
  return {
    type: 'SET_LOGGED_IN',
  }
}
