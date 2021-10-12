import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'

import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import InfoIcon from '@material-ui/icons/Info'
import joker from '../../../images/jk.jpg'
import Button from '../../atoms/Button'

const Wrapper = styled(motion.div)`
  display: 'none';
  height: 100vh;
  opacity: 0;
  background-image: url(${joker});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`
const ButtonWrapper = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: center;
  position: relative;
  top: 90%;
  padding-bottom: 2rem;
`

function MovieBanner() {
  return (
    <Wrapper animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
      <ButtonWrapper>
        <Button style={{ margin: '1rem' }}>
          <PlayArrowIcon style={{ margin: '5px' }} /> Play
        </Button>
        <Button style={{ margin: '1rem' }}>
          <InfoIcon style={{ margin: '5px' }} />
          More Info
        </Button>
      </ButtonWrapper>
    </Wrapper>
  )
}

export default MovieBanner
