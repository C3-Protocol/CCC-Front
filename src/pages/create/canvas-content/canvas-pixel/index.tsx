import React, { memo, useImperativeHandle, useState } from 'react'
import './style.less'

let mouseDown = false
function CanvasPixel(props) {
  
  const backgroundColor = props.background
  const [canvasWidth, setCanvasWidth] = useState(props.width) 
  const [canvasHeight, setCanvasHeight] = useState(props.height)
  const curColor = '#000'

  useImperativeHandle(props.cRef, () => ({
    getCurrentImageData: () => {
      let canvasElem: any = document.getElementById('canvas-pixel')
      var imageData = canvasElem.toDataURL("image/png");
      return imageData
    }
  }))

  const initPixels = (r) => {
    if (r) {
      var context = r.getContext('2d')
      if (props.forkIndex !== undefined){
        var imgBg = new Image();
        imgBg.src = props.originImage
        imgBg.setAttribute("crossOrigin",'Anonymous')
        imgBg.onload = (res) => {
          setCanvasWidth(res['path'][0].width)
          setCanvasHeight(res['path'][0].height)
          context.drawImage(imgBg,0,0,res['path'][0].width,res['path'][0].width)
          imgBg.onload = null
        }
      }else{
        if (backgroundColor){
          context.fillStyle = backgroundColor || '#fff'
          context.fillRect(0, 0, canvasWidth, canvasHeight)
        }
      }
     
    }
  }

  const drawRect = (context, offsetX, offsetY, color) => {
    let positionX = offsetX 
    let positionY = offsetY
    context.fillStyle = color
    context.fillRect(positionX, positionY, 1, 1)
  }




  const changeColor = (offsetX, offsetY, bold) => {
    let canvasElem: any = document.getElementById('canvas-pixel')
    if (canvasElem) {
      var context = canvasElem.getContext('2d')
      let x = offsetX 
      let y = offsetY 
      if (x < canvasWidth && x >= 0 && y < canvasHeight && y >= 0) {
        for (let i = 0; i < bold; i++) {
          for (let j = 0; j < bold; j++) {
            drawRect(context, x + i, y + j, curColor)
          }
        }
      }
    }
  }


 

  const getPointerPos = (e) => {
    let canvasElem = document.getElementById('canvas-pixel')
    const rect = canvasElem.getBoundingClientRect()

    // use cursor pos as default
    let clientX = e.clientX
    let clientY = e.clientY

    // use first touch if available
    if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX
      clientY = e.changedTouches[0].clientY
    }

    // return mouse/touch position inside canvas
    return {
      offsetX: clientX - rect.left,
      offsetY: clientY - rect.top
    }
  }

  const handleMouseDown = (e) => {
    e.stopPropagation()
    const { offsetX, offsetY } = getPointerPos(e)
    mouseDown = true
    changeColor(offsetX, offsetY,  1)
   
  }

  const handleMouseMove = (e) => {
    e.stopPropagation()
    if (mouseDown) {
      const { offsetX, offsetY } = getPointerPos(e)
      changeColor(offsetX, offsetY,  1)
    }
  }

  const handleMouseUp = (e) => {
    e.stopPropagation()
    mouseDown = false
   
  }

  const handleMouseLeave = (e) => {
    e.stopPropagation()
    mouseDown = false
  }


  
  return (
    <div className='canvas-pixel-wrapper'
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      onTouchCancel={handleMouseUp}
    >
      <canvas
        id="canvas-pixel"
        className="canvas-thumb"
        width={canvasWidth}
        height={canvasHeight}
        ref={(r) => {
          initPixels(r)
        }}
      ></canvas>

     
    </div>
  )
}

export default memo(CanvasPixel)
