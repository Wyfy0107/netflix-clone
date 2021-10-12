import React, { useEffect, useRef, useState } from 'react'
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import InputBase from '@material-ui/core/InputBase'
import Badge from '@material-ui/core/Badge'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import SearchIcon from '@material-ui/icons/Search'
import NotificationsIcon from '@material-ui/icons/Notifications'
import MoreIcon from '@material-ui/icons/MoreVert'
import { useDispatch, useSelector } from 'react-redux'
import ClearIcon from '@material-ui/icons/Clear'
import Avatar from '@material-ui/core/Avatar'
import { Link, useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { setLogOut } from '../../../redux/actions'
import { Movie } from '../../../redux/actions/types'
import { AppState } from '../../../redux/types'

type StyleProps = {
  display: 'none' | 'flex'
}

const CustomLink = styled(Link)`
  text-decoration: none;
  color: black;
`

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: fade(theme.palette.common.black, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.black, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
      display: 'flex',
      flexFlow: 'row',
      justifyContent: 'space-between',
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    clearIcon: {
      display: (props: StyleProps) => props.display,
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': {
        cursor: 'pointer',
      },
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
  })
)

type Props = {
  setInput: React.Dispatch<React.SetStateAction<string>>
  iconDisplay: 'none' | 'flex'
  avatar: string
  newMovie: Partial<Movie>[]
}

export default function PrimarySearchAppBar({
  setInput,
  iconDisplay,
  avatar,
  newMovie,
}: Props) {
  const styleProps = {
    display: iconDisplay,
  }
  const dispatch = useDispatch()
  const history = useHistory()
  const classes = useStyles(styleProps)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [noti, setNoti] = useState<null | HTMLElement>(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null)
  const [notiCount, setNotiCount] = useState(-1)
  const isAdmin = useSelector((state: AppState) => state.auth.userData.isAdmin)
  const isLoggedIn = useSelector((state: AppState) => state.auth.isLoggedIn)

  useEffect(() => {
    setNotiCount((prev) => prev + 1)
  }, [newMovie])

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
  const isNotiOpen = Boolean(noti)
  const textInput = useRef<HTMLInputElement>()

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleNotiMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNoti(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleNotiClose = () => {
    setNoti(null)
  }

  const handleLogOut = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
    dispatch(setLogOut())
    if (!isLoggedIn) {
      history.push('/login')
    }
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist()
    setTimeout(() => setInput(e.target.value), 1500)
  }

  const clearSearch = () => {
    const element = textInput.current as HTMLInputElement
    element.value = ''
    setInput('')
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {isAdmin && (
        <CustomLink to="/user/admin">
          <MenuItem onClick={handleMenuClose}>Admin</MenuItem>
        </CustomLink>
      )}
      <MenuItem onClick={handleLogOut}>
        {isLoggedIn ? 'Log Out' : 'Login'}
      </MenuItem>
    </Menu>
  )

  const notiId = 'notification'
  const renderNotiMenu = (
    <Menu
      anchorEl={noti}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={notiId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isNotiOpen}
      onClose={handleNotiClose}
    >
      {newMovie.map((movie, index) => (
        <MenuItem key={index}>
          {movie !== null && (
            <Typography variant="subtitle1">
              New Arrival: {movie.name}
            </Typography>
          )}
        </MenuItem>
      ))}
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="new movies" color="inherit">
          <Badge badgeContent={notiCount} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="profile"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <Avatar src={avatar} alt="Avatar" />
        </IconButton>
      </MenuItem>
    </Menu>
  )

  return (
    <>
      <AppBar position="sticky" style={{ background: 'black' }}>
        <Toolbar>
          <Typography className={classes.title} variant="h6" noWrap>
            Wetflix
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              inputComponent="input"
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              onChange={inputHandler}
              inputRef={textInput}
            />
            <div className={classes.clearIcon} onClick={clearSearch}>
              <ClearIcon display={iconDisplay} />
            </div>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label="notifications"
              color="inherit"
              aria-haspopup="true"
              aria-controls={notiId}
              onClick={handleNotiMenuOpen}
            >
              <Badge badgeContent={notiCount} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            {
              <IconButton
                edge="end"
                aria-label="profile"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar src={avatar} alt="Avatar" />
              </IconButton>
            }
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      {renderNotiMenu}
    </>
  )
}
