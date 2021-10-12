import React from 'react'
import styled from 'styled-components'

import Movie from '../../components/organisms/movie-page'

const Wrapper = styled.div`
  background-color: black;
  color: white;
`

function MoviePage() {
  return (
    <Wrapper>
      <Movie />
    </Wrapper>
  )
}

export default MoviePage
