import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

type Props = {
  description: string
}

export default function Main({ description }: Props) {
  return (
    <Grid item xs={12} md={8}>
      <Typography variant="h5" gutterBottom>
        Description
      </Typography>

      <Typography variant="subtitle1" gutterBottom>
        {description}
      </Typography>
      <Divider />
    </Grid>
  )
}
