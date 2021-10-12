import React, { useState } from 'react'
import styled from 'styled-components'
import PlayIcon from '@material-ui/icons/PlayCircleOutline'
import ThumbUpFilledIcon from '@material-ui/icons/ThumbUp'
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import { Img } from '../../atoms'
import { addFavMovie, getUserData } from '../../../redux/actions'
import { AppState } from '../../../redux/types'

const useStyles = makeStyles({
  root: {
    fontSize: '2rem',
    margin: '5px',
    '&:hover': {
      opacity: 0.8,
      color: '#ee6f57',
      cursor: 'pointer',
    },
  },
})

const CustomLink = styled(Link)`
  text-decoration: none;
  color: white;
`

const Wrapper = styled(motion.div)`
  width: 200px;
  height: 100%;
  transition: 0.5s;
  position: relative;
  opacity: 0;
  &:hover {
    transform: scale(1.2);
    z-index: 1000000;
    cursor: pointer;
  }
`

const Modal = styled.div<{ opacity: number }>`
  width: 200px;
  height: 100%;
  z-index: 1000;
  position: absolute;
  opacity: ${({ opacity }) => opacity};
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
  position: relative;
  top: 70%;
`

type CardProps = {
  img: string
  movieId: string
}

function Card({ img, movieId }: CardProps) {
  const [opacity, setOpacity] = useState(0)
  const classes = useStyles()
  const dispatch = useDispatch()
  const isFavMovie = useSelector((state: AppState) =>
    state.auth.userData.favMovie.some((movie) => movie._id === movieId)
  )
  const isLoggedIn = useSelector((state: AppState) => state.auth.isLoggedIn)

  let likeButton = (
    <Tooltip title="Like " aria-label="Like">
      <ThumbUpOutlinedIcon
        className={classes.root}
        onClick={(e) => addMovieHandler(e, movieId)}
      />
    </Tooltip>
  )

  if (isFavMovie) {
    likeButton = (
      <Tooltip title="Rated" aria-label="Rated">
        <ThumbUpFilledIcon
          className={classes.root}
          onClick={(e) => addMovieHandler(e, movieId)}
        />
      </Tooltip>
    )
  }

  const addMovieHandler = (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isLoggedIn) {
      return alert('Please login first')
    }
    dispatch(addFavMovie(id, { onSuccess: () => dispatch(getUserData()) }))
  }

  return (
    <CustomLink to={`/movie/${movieId}`}>
      <Wrapper animate={{ opacity: 1 }}>
        <Modal
          opacity={opacity}
          onMouseEnter={() => setOpacity(1)}
          onMouseLeave={() => setOpacity(0)}
        >
          <ButtonWrapper>
            <Tooltip title="Play" aria-label="Play">
              <PlayIcon className={classes.root} />
            </Tooltip>

            {likeButton}
          </ButtonWrapper>
        </Modal>
        <Img src={img} width="100%" height="100%" />
      </Wrapper>
    </CustomLink>
  )
}

export default Card
