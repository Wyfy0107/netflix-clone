import React from 'react'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import DashboardIcon from '@material-ui/icons/Dashboard'
import DeleteIcon from '@material-ui/icons/Delete'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const CustomLink = styled(Link)`
  text-decoration: none;
  color: black;
`

export const mainListItems = (
  <div>
    <CustomLink to="/user/admin/create-movie">
      <ListItem button>
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Create Movie" />
      </ListItem>
    </CustomLink>

    <CustomLink to="/user/admin/delete-movie">
      <ListItem button>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText primary="Delete Movie" />
      </ListItem>
    </CustomLink>
  </div>
)

export const textField = [
  {
    name: 'movieName',
    label: 'Movie Name',
    type: 'text',
  },
  {
    name: 'movieDescription',
    label: 'Movie Description',

    type: 'text',
  },
  {
    name: 'publishedYear',
    label: 'Published Year',
    type: 'number',
  },
  {
    name: 'genres',
    label: 'Genres',
    type: 'text',
  },
  {
    name: 'duration',
    label: 'Duration',
    type: 'number',
  },
  {
    name: 'rating',
    label: 'Rating',
    type: 'number',
  },
  {
    name: 'cast',
    label: 'Cast',
    type: 'text',
  },
  {
    name: 'poster',
    label: 'Poster',
    type: 'text',
  },
  {
    name: 'background',
    label: 'Background',
    type: 'text',
  },
]
