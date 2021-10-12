import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Nav from './Navbar'
import { searchMovies } from '../../../redux/actions'
import { AppState } from '../../../redux/types'

function NavbarComponent() {
  const [input, setInput] = useState('')
  const [iconDisplay, setDisplay] = useState<'none' | 'flex'>('none')

  const dispatch = useDispatch()
  const avatar = useSelector((state: AppState) => state.auth.userData.photo)
  const newMovie = useSelector((state: AppState) => state.movies.newMovie)

  const isFirstRun = useRef(true)

  //**This make sure that we don't make api request on first render*/
  //** but only when input changes*/
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    dispatch(searchMovies(input))
    setDisplay('flex')
  }, [input, dispatch])

  useEffect(() => {
    if (input.length === 0) {
      setDisplay('none')
    }
  }, [input])

  return (
    <>
      <Nav
        setInput={setInput}
        iconDisplay={iconDisplay}
        avatar={avatar}
        newMovie={newMovie}
      />
    </>
  )
}

export default NavbarComponent
