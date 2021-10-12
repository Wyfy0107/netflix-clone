import { put, takeLatest, select } from 'redux-saga/effects'
import axios, { AxiosError } from 'axios'

import {
  submitRegisterSuccess,
  submitLoginSuccess,
  setLoggedIn,
  setLogOut as setLogout,
} from '../actions'
import { AppState } from '../types'
import { url } from '../../App'

const registerUrl = `${url}/api/v1/auth/register`
const loginUrl = `${url}/api/v1/auth/login/local`
const userUrl = `${url}/api/v1/user/data`

const registerForm = (state: AppState) => state.auth.registerForm
const loginForm = (state: AppState) => state.auth.loginForm

function* submitRegisterForm(): any {
  try {
    const formData = yield select(registerForm)
    const res = yield axios.post(registerUrl, { ...formData })
    yield alert(res.data.message)
    yield put(submitRegisterSuccess())
  } catch (error) {
    const axiosError = error as AxiosError
    alert(axiosError.response?.data.message)
  }
}

function* submitLoginForm(): any {
  try {
    const formData = yield select(loginForm)
    const res = yield axios.post(loginUrl, { ...formData })
    yield put(submitLoginSuccess(res.data.user))
    yield put(setLoggedIn())
    yield localStorage.setItem('token', res.data.token)
  } catch (error) {
    const axiosError = error as AxiosError
    alert(axiosError.response?.data.message)
  }
}

function* getUserData(): any {
  try {
    const res = yield axios.get(userUrl)
    yield put(submitLoginSuccess(res.data.user))
  } catch (error) {
    return yield put(setLogout())
  }
}

//Delete cookie functions
function getCookie(name: string) {
  return document.cookie.split(';').some((c) => {
    return c.trim().startsWith(name + '=')
  })
}

function deleteCookie(name: string, path: string, domain: string) {
  if (getCookie(name)) {
    document.cookie =
      name +
      '=' +
      (path ? ';path=' + path : '') +
      (domain ? ';domain=' + domain : '') +
      ';expires=Thu, 01 Jan 1970 00:00:01 GMT'
  }
}
function* setLogOut() {
  yield localStorage.removeItem('token')
  yield deleteCookie('token', '/', 'localhost')
}

const sagaWatcher = [
  takeLatest('SUBMIT_REGISTER_FORM', submitRegisterForm),
  takeLatest('SUBMIT_LOGIN_FORM', submitLoginForm),
  takeLatest('GET_USER_DATA', getUserData),
  takeLatest('SET_LOG_OUT', setLogOut),
]

export default sagaWatcher
