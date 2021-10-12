import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import axios from 'axios'

import './css/index.css'
import App from './App'
import makeStore from './redux/store'

const store = makeStore()

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token')
  const cookieToken = document.cookie.split('=')[1]

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  } else {
    config.headers['Authorization'] = `Bearer ${cookieToken}`
  }
  return config
})

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
