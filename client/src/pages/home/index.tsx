import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import io from 'socket.io-client'

import NavBar from '../../components/organisms/navbar'
import MovieBanner from '../../components/organisms/banner'

import { getMovies, getUserData } from '../../redux/actions'
import { AppState } from '../../redux/types'
import MovieCarousel from '../../components/organisms/carousel'
import SearchDisplay from '../../components/organisms/search-display'

import { newMovieReceived } from '../../redux/actions'
import { Movie } from '../../redux/actions/types'

const titles = ['My List', 'Critically Acclaim', 'Latest']

const Wrapper = styled.div`
  background-color: black;
  min-height: 100vh;
`

const devSocketUrl = 'ws://localhost:3000'
const prodSocketUrl = 'wss://wetflix.herokuapp.com'
const checkSocket = process.env.NODE_ENV === 'production'
const socketUrl = checkSocket ? prodSocketUrl : devSocketUrl

function Home() {
  const searchName = useSelector((state: AppState) => state.movies.searchName)
  const dispatch = useDispatch()

  useEffect(() => {
    const socket = io(socketUrl)

    socket.on('initial', (message: string) => console.log(message))

    socket.on('new movie', (newMovie: Movie) => {
      dispatch(newMovieReceived(newMovie))
    })
  }, [dispatch])

  useEffect(() => {
    dispatch(getUserData())
    dispatch(getMovies())
  }, [dispatch])

  const length = searchName.length === 0

  return (
    <Wrapper>
      <NavBar />
      {length && <MovieBanner />}
      {length ? (
        titles.map((title) => <MovieCarousel key={title} title={title} />)
      ) : (
        <SearchDisplay />
      )}
    </Wrapper>
  )
}

export default Home
