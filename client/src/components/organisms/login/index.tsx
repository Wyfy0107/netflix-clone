import React, { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import LinkUi from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { Link, Redirect, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import GoogleLoginButton from 'react-google-login'
import axios from 'axios'

import Copyright from './CopyRight'
import {
  submitLoginForm,
  getUserData,
  submitLoginSuccess,
} from '../../../redux/actions'
import { AppState } from '../../../redux/types'
import { User } from '../../../redux/actions/types'
import { url } from '../../../App'

const CustomLink = styled(Link)`
  text-decoration: none;
  color: #3f51b5;
  &:hover {
    text-decoration: underline;
  }
`

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

type GoogleLoginResponse = {
  user: User
  token: string
}

export default function SignIn() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const history = useHistory()
  const classes = useStyles()
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((state: AppState) => state.auth.isLoggedIn)

  useEffect(() => {
    dispatch(getUserData())
  }, [dispatch])

  if (isLoggedIn) return <Redirect to="/home" />

  const handleFormInput = async (event: React.FormEvent<HTMLFormElement>) => {
    const target = event.target
    const value = (target as HTMLInputElement).value
    const name = (target as HTMLInputElement).name

    setForm({
      ...form,
      [name]: value,
    })
  }

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    dispatch(submitLoginForm(form))
  }

  const responseGoogle = async (response: any) => {
    const tokenId: string | undefined = response?.tokenId
    if (!tokenId) return

    const result = await axios.post<GoogleLoginResponse>(
      `${url}/api/v1/auth/login/google`,
      {
        id_token: tokenId,
      }
    )

    if (result.status === 200) {
      const token = result.data.token
      localStorage.setItem('token', token)

      // save userData to redux or local state
      const userData = result.data.user
      dispatch(submitLoginSuccess(userData))
      history.push('/home')
    } else {
      alert('Login with google failed')
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form
          className={classes.form}
          onChange={(e) => handleFormInput(e)}
          onSubmit={handleFormSubmit}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            aria-required
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            aria-required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid
            container
            direction="column"
            justify="center"
            style={{ margin: '0 1rem 1rem 0' }}
          >
            <Typography component="h6" variant="h6" style={{ margin: 'auto' }}>
              or
            </Typography>
            <GoogleLoginButton
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={'single_host_origin'}
            />
          </Grid>
          <Grid container>
            <Grid item xs>
              <LinkUi href="#" variant="body2">
                Forgot password?
              </LinkUi>
            </Grid>
            <Grid item>
              <CustomLink to="/register">
                {"Don't have an account? Sign Up"}
              </CustomLink>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  )
}
