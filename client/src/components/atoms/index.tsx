import styled from 'styled-components'

export const Button = styled.button<{
  width?: string
  radius?: string
  height?: string
}>`
  border-radius: ${(props) => (props.radius ? props.radius : '4px')};
  background: #a6a6a4;
  border: none;
  width: ${(props) => (props.width ? props.width : '10rem')};
  height: ${(props) => (props.height ? props.height : '3rem')};
  &:hover {
    opacity: 0.7;
    cursor: pointer;
  }
`

export const Input = styled.input<{
  width?: string
  height?: string
  background?: string
  color?: string
}>`
  background: ${({ background }) => (background ? background : 'black')};
  color: ${({ color }) => (color ? color : 'white')};
  height: ${({ height }) => (height ? height : '1.3rem')};
  width: ${({ width }) => (width ? width : '15rem')};
  border-style: none;
  border: 1px solid white;
`

export const Text = styled.p<{ fontWeight?: string }>`
  font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : 'normal')};
  color: white;
`

export const Img = styled.img``

export const H1 = styled.h1<{ fontWeight?: string }>`
  font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : 'normal')};
`

export const H2 = styled.h2<{ fontWeight?: string }>`
  font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : 'normal')};
`

export const H3 = styled.h3<{ fontWeight?: string }>`
  margin: 1rem 2rem 0;
  font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : 'normal')};
  color: white;
`
