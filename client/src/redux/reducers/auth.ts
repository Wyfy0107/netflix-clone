import { ActionTypes } from '../actions/types'

const initialState = {
  registerForm: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  },
  loginForm: {
    email: '',
    password: '',
  },
  userData: {
    googleId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    favMovie: [],
    photo: '',
  },
  isLoggedIn: true,
  loading: false,
}

const auth = (state = initialState, action: ActionTypes) => {
  switch (action.type) {
    case 'SUBMIT_REGISTER_FORM':
      if ('payload' in action) {
        return {
          ...state,
          registerForm: { ...state.registerForm, ...action.payload },
        }
      }
      break

    case 'SUBMIT_REGISTER_SUCCESS':
      if ('payload' in action) {
        return {
          ...state,
        }
      }
      break

    case 'SUBMIT_LOGIN_FORM':
      if ('payload' in action) {
        return {
          ...state,
          loginForm: { ...state.loginForm, ...action.payload },
        }
      }
      break

    case 'SUBMIT_LOGIN_SUCCESS':
      if ('payload' in action) {
        return {
          ...state,
          userData: { ...state.userData, ...action.payload },
          isLoggedIn: true,
          loading: false,
        }
      }
      break

    case 'GET_USER_DATA':
      return {
        ...state,
        loading: true,
      }

    case 'SET_LOG_OUT':
      return {
        ...initialState,
        isLoggedIn: false,
        loading: false,
      }

    case 'SET_LOGGED_IN':
      return {
        ...state,
        isLoggedIn: true,
        loading: false,
      }

    default:
      return state
  }
}

export default auth
