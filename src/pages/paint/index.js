import React from 'react'
import Paint from './Paint'

export default ({ width, height, background, onClick, id, imgSrc, cRef }) => {
  return (
    <Paint
      width={width}
      height={height}
      id={id}
      background={background}
      imgSrc={imgSrc}
      onClick={onClick}
      cRef={cRef}
    />
  )
}
