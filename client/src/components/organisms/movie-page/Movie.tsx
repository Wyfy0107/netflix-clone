import React, { useState, useEffect, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Container from '@material-ui/core/Container'
import MainFeaturedPost from './MainFeaturedMovie'
import Main from './Main'
import Sidebar from './SideBar'
import { useParams } from 'react-router-dom'
import axios from 'axios'

import { Movie } from '../../../redux/actions/types'
import { url } from '../../../App'

const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}))

type Params = {
  movieId: string
}

export default function MovieDisplay() {
  const [movieData, setMovieData] = useState<Movie | null>(null)
  const classes = useStyles()
  const { movieId } = useParams<Params>()

  const fetchMovie = useCallback(async () => {
    const movie = await axios.get(`${url}/api/v1/movies/id/${movieId}`)
    setMovieData(movie.data as Movie)
  }, [movieId])

  useEffect(() => {
    fetchMovie()
  }, [fetchMovie])

  return (
    <React.Fragment>
      {movieData && (
        <Container maxWidth="lg">
          <main>
            <MainFeaturedPost
              background={movieData.background}
              name={movieData.name}
            />

            <Grid container spacing={5} className={classes.mainGrid}>
              <Main description={movieData.description} />
              <Sidebar
                movieId={movieData._id}
                publishedYear={movieData.publishedYear}
                cast={movieData.cast}
                rating={movieData.rating}
                likedBy={movieData.likedBy}
                duration={movieData.duration}
              />
            </Grid>
          </main>
        </Container>
      )}
    </React.Fragment>
  )
}
