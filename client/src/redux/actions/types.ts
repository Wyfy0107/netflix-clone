//**Auth types */
export type RegisterForm = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type User = {
  _id: string
  googleId: string
  firstName: string
  lastName: string
  email: string
  password: string
  favMovie: Movie[]
  photo: string
  isAdmin: boolean
}

export type Movie = {
  _id: string
  name: string
  description: string
  publishedYear: number
  genres: string[]
  duration: number
  rating: number
  cast: string[]
  poster: string
  background: string
  likedBy: Pick<User, 'firstName' | 'lastName'>[]
}

export type LoginForm = Pick<RegisterForm, 'email' | 'password'>

export type RegisterFormSubmitAction = {
  type: string
  payload: RegisterForm
}

export type LoginFormSubmitAction = {
  type: string
  payload: LoginForm
}

export type LoginActionSuccess = {
  type: string
  payload: User
}

//**Movies types */
export type GetMoviesSuccessAction = {
  type: string
  payload: any
}

export type GetMoviesFailedAction = {
  type: string
}

export type GetMoviesAction = {
  type: string
}

//**User types */
export type GetUserDataAction = {
  type: string
}

export type Options = {
  onSuccess: () => void
}

export type AddFavMovieAction = {
  type: string
  payload: string
  options?: Options
}

export type SearchMoviesAction = Pick<AddFavMovieAction, 'type' | 'payload'>

export type ActionTypes =
  | GetMoviesAction
  | GetMoviesFailedAction
  | GetMoviesSuccessAction
  | RegisterFormSubmitAction
  | LoginFormSubmitAction
  | GetUserDataAction
  | AddFavMovieAction
  | SearchMoviesAction
