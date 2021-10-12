import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme) => ({
  sidebarAboutBox: {
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[200],
  },
  sidebarSection: {
    marginTop: theme.spacing(3),
  },
}))

type LikedBy = {
  lastName: string
  firstName: string
}

type Props = {
  publishedYear: number
  cast: string[]
  rating: number
  duration: number
  likedBy: LikedBy[]
  movieId: string
}

export default function Sidebar({
  publishedYear,
  cast,
  rating,
  duration,
  likedBy,
  movieId,
}: Props) {
  const classes = useStyles()

  return (
    <Grid item xs={12} md={4}>
      <Typography variant="h5" gutterBottom className={classes.sidebarSection}>
        Movie ID
      </Typography>
      {movieId}
      <Typography variant="h5" gutterBottom className={classes.sidebarSection}>
        Published Year
      </Typography>
      {publishedYear}
      <Typography variant="h5" gutterBottom className={classes.sidebarSection}>
        Cast
      </Typography>
      {cast.map((name) => (
        <p key={name}>{name}</p>
      ))}
      <Typography variant="h5" gutterBottom className={classes.sidebarSection}>
        Rating
      </Typography>
      {rating}
      <Typography variant="h5" gutterBottom className={classes.sidebarSection}>
        Duration
      </Typography>
      {duration}m
      <Typography variant="h5" gutterBottom className={classes.sidebarSection}>
        Who likes this movie
      </Typography>
      {likedBy.map((user) => (
        <p>{`${user.firstName} ${user.lastName}`}</p>
      ))}
    </Grid>
  )
}

Sidebar.propTypes = {
  archives: PropTypes.array,
  description: PropTypes.string,
  social: PropTypes.array,
  title: PropTypes.string,
}
