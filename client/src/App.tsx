import React, { Suspense, lazy } from 'react'
import './css/App.css'
import { Switch, Route, Redirect } from 'react-router-dom'

import Loading from './components/organisms/loading'

const Register = lazy(() => import('./pages/register'))
const Login = lazy(() => import('./pages/login'))
const MoviePage = lazy(() => import('./pages/movie-page'))
const Admin = lazy(() => import('./pages/admin'))
const Home = lazy(() => import('./pages/home'))

const devUrl = 'http://localhost:5000'
const prodUrl = 'https://netflix.mlem-mlem.net'
const check = process.env.NODE_ENV === 'production'
export const url = check ? prodUrl : devUrl

function App() {
  return (
    <div>
      <Switch>
        <Suspense fallback={<Loading />}>
          <Route path="/">
            <Redirect to="/home" />
          </Route>
          <Route path="/home" component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/movie/:movieId" component={MoviePage} />
          <Route path="/user/admin" component={Admin} />
        </Suspense>
      </Switch>
    </div>
  )
}

export default App
