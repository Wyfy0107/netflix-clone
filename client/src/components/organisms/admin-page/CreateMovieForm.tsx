import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import axios, { AxiosError } from 'axios'

import { textField } from './listItems'
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

type SubmitForm = {
  name: string
  description: string
  publishedYear: number
  duration: number
  poster: string
  background: string
  genres: string[]
  cast: string[]
  rating: number
}

export default function SignIn() {
  const [form, setForm] = useState({
    movieName: '',
    movieDescription: '',
    rating: '',
    duration: '',
    cast: '',
    poster: '',
    background: '',
    publishedYear: '',
    genres: '',
  })
  const classes = useStyles()

  const handleFormInput = async (event: React.FormEvent<HTMLFormElement>) => {
    const target = event.target
    const value = (target as HTMLInputElement).value
    const name = (target as HTMLInputElement).name

    setForm({
      ...form,
      [name]: value,
    })
  }

  const formFormat = () => {
    const formSanitize = {
      name: form.movieName,
      description: form.movieDescription,
      publishedYear: parseInt(form.publishedYear),
      duration: parseInt(form.duration),
      poster: form.poster,
      background: form.background,
      genres: form.genres.split(','),
      cast: form.cast.split(','),
      rating: parseInt(form.rating),
    }

    return formSanitize
  }

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const formSanitize = formFormat()
    try {
      axios.post(`${url}/api/v1/movies/create`, formSanitize)
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
          {textField.map((field) => (
            <TextField
              key={field.name}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id={field.name}
              label={field.label}
              name={field.name}
              autoComplete="movie name"
              autoFocus
              type={field.type}
            />
          ))}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Add Movie
          </Button>
        </form>
      </div>
    </Container>
  )
}
