import React, { useState, useEffect } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { Link, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import axios from 'axios'

const devUrl = 'http://localhost:3000'
const prodUrl = 'https://netflix-movie-api.herokuapp.com'
const check = process.env.NODE_ENV === 'production'
const url = check ? prodUrl : devUrl

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

export default function SignIn() {
  const [email, setEmail] = useState('')

  const classes = useStyles()

  const handleFormInput = async (event: React.FormEvent<HTMLFormElement>) => {
    const target = event.target
    const value = (target as HTMLInputElement).value

    setEmail(value)
  }

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    axios.post(`${url}/api/v1/user/forgot-password`, { email })
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Submit
          </Button>
        </form>
      </div>
    </Container>
  )
}
