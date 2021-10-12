import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

import axios, { AxiosError } from 'axios'
import { url } from '../../../App'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

export default function SignIn() {
  const [movieId, setMovieId] = useState('')
  const classes = useStyles()

  const handleFormInput = async (event: React.FormEvent<HTMLFormElement>) => {
    const target = event.target
    const value = (target as HTMLInputElement).value

    setMovieId(value)
  }

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    try {
      const res = await axios.delete(`${url}/api/v1/movies/delete/${movieId}`)
      if (res.status === 204) return alert('Movie Deleted')
    } catch (error) {
      const axiosError = error as AxiosError
      alert(axiosError.response?.data.message)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <form
          className={classes.form}
          onChange={(e) => handleFormInput(e)}
          onSubmit={(e) => handleFormSubmit(e)}
        >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="movieId"
            label="Movie ID"
            name="movieId"
            autoComplete="movieId"
            autoFocus
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Delete
          </Button>
        </form>
      </div>
    </Container>
  )
}
