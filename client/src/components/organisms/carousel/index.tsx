import React from 'react'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { useSelector } from 'react-redux'

import Card from './CardItem'
import { H3 } from '../../atoms'
import './style.css'

import { AppState } from '../../../redux/types'

const responsive = {
  bigScreen: {
    breakpoint: { max: 3000, min: 1900 },
    items: 8,
    partialVisibilityGutter: 20,
    marginBottom: 0,
  },
  desktop: {
    breakpoint: { max: 1900, min: 1024 },
    items: 5,
    partialVisibilityGutter: 20,
    marginBottom: 0,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 4,
    partialVisibilityGutter: 20,
    marginBottom: 0,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2,
    partialVisibilityGutter: 20,
    marginBottom: 0,
  },
}

type CarouselProps = {
  title: string
}

const MovieCarousel = ({ title }: CarouselProps) => {
  const movies = useSelector((state: AppState) => state.movies.moviesList)
  const favMovies = useSelector(
    (state: AppState) => state.auth.userData.favMovie
  )

  let items: typeof movies = []

  if (title === 'Critically Acclaim') {
    items = movies.sort((a, b) => b.rating - a.rating).slice(0, 20)
  } else if (title === 'My List') {
    items = favMovies
  } else if (title === 'Latest') {
    items = movies
      .sort((a, b) => b.publishedYear - a.publishedYear)
      .slice(0, 20)
  }

  return (
    <div>
      <H3 fontWeight="bold">{title}</H3>
      <Carousel
        itemClass="image-item"
        slidesToSlide={8}
        partialVisible
        responsive={responsive}
        containerClass="container"
      >
        {items.map((movie) => (
          <Card key={movie._id} img={movie.poster} movieId={movie._id} />
        ))}
      </Carousel>
    </div>
  )
}

export default MovieCarousel
