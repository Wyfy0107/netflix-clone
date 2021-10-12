import { RegisterForm, LoginForm, User, Movie } from './actions/types'

export type AppState = {
  movies: {
    moviesList: Movie[]
    searchName: string
    searchResult: Movie[]
    newMovie: Partial<Movie>[]
  }
  auth: {
    registerForm: RegisterForm
    loginForm: LoginForm
    userData: User
    isLoggedIn: boolean
    loading: boolean
  }
  user: {
    selectedMovieId: string
  }
}
