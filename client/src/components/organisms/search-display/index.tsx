import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import Card from '../carousel/CardItem'
import { Text } from '../../atoms'
import { AppState } from '../../../redux/types'

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-template-rows: auto;
  margin: 2rem;
  background-color: black;
`

function SearchDisplay() {
  const searchResult = useSelector(
    (state: AppState) => state.movies.searchResult
  )

  const emptyCheck = searchResult.length === 0

  return (
    <Wrapper>
      {!emptyCheck ? (
        searchResult.map((movie) => (
          <Card key={movie._id} img={movie.poster} movieId={movie._id} />
        ))
      ) : (
        <Text>Movie not found</Text>
      )}
    </Wrapper>
  )
}

export default SearchDisplay
