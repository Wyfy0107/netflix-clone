#!/usr/bin/env node

import mongoose from 'mongoose'
import Movie from '../models/Movie'
import axios from 'axios'

mongoose.connect('mongodb://localhost:27017/netflix', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})

const url =
  'https://api.themoviedb.org/3/discover/movie?api_key=9540313e90640b8a84e8c785fe514abe&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=4'
const imgSrc = 'https://image.tmdb.org/t/p/w200'
const bgSrc = 'https://image.tmdb.org/t/p/w1280'

const extractYear = (string: string) => {
  const arr = string.split('-')
  const year = arr[0]

  return parseInt(year)
}

const genres = [
  {
    id: 28,
    name: 'Action',
  },
  {
    id: 12,
    name: 'Adventure',
  },
  {
    id: 16,
    name: 'Animation',
  },
  {
    id: 35,
    name: 'Comedy',
  },
  {
    id: 80,
    name: 'Crime',
  },
  {
    id: 99,
    name: 'Documentary',
  },
  {
    id: 18,
    name: 'Drama',
  },
  {
    id: 10751,
    name: 'Family',
  },
  {
    id: 14,
    name: 'Fantasy',
  },
  {
    id: 36,
    name: 'History',
  },
  {
    id: 27,
    name: 'Horror',
  },
  {
    id: 10402,
    name: 'Music',
  },
  {
    id: 9648,
    name: 'Mystery',
  },
  {
    id: 10749,
    name: 'Romance',
  },
  {
    id: 878,
    name: 'Science Fiction',
  },
  {
    id: 10770,
    name: 'TV Movie',
  },
  {
    id: 53,
    name: 'Thriller',
  },
  {
    id: 10752,
    name: 'War',
  },
  {
    id: 37,
    name: 'Western',
  },
]

const findGenres = (idArr: string[]) => {
  const res: string[] = []
  idArr.forEach((id) => {
    const obj = genres.find((obj) => obj.id === parseInt(id))
    if (obj) {
      res.push(obj.name)
    }
  })

  return res
}

const getDuration = async (id: number) => {
  const movie = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}?api_key=9540313e90640b8a84e8c785fe514abe`
  )
  const duration = movie.data.runtime
  return parseInt(duration)
}

const getCast = async (id: number) => {
  const data = await axios.get(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=9540313e90640b8a84e8c785fe514abe`
  )
  const list = data.data.cast
    .filter((obj: any) => obj.hasOwnProperty('character'))
    .map((obj: any) => obj.name)
    .slice(0, 5)

  return list
}

const add = async () => {
  const result = await axios.get(url)
  const data = result.data.results

  data.forEach(async (movie: any) => {
    const newMovie = new Movie({
      name: movie.title,
      description: movie.overview,
      publishedYear: extractYear(movie.release_date),
      genres: findGenres(movie.genre_ids),
      duration: await getDuration(movie.id),
      rating: movie.vote_average,
      cast: await getCast(movie.id),
      poster: `${imgSrc}${movie.poster_path}`,
      background: `${bgSrc}${movie.backdrop_path}`,
    })

    await newMovie.save()
  })
}

add()
