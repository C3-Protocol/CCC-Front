import React, { memo, useState, useImperativeHandle } from 'react'
import { PixelSelectFrameBgWrapper, PixelSelectFrame } from './style'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'

let mouseDown = false
let downX = -1
let downY = -1
let originalX = 0
let originalY = 0
function SelectImage(props) {
  const [selectFrameLeft, setSelectFrameLeft] = useState(0)
  const [selectFrameTop, setSelectFrameTop] = useState(0)
  const selectWidth = 30
  const multiple = props.multiple
  const [imagePixel, setImagePixel] = useState(null)

  useImperativeHandle(props.cRef, () => ({
    // drawImage 就是暴露给父组件的方法
    drawImage: (res) => {
      if (res) {
        setImagePixel(res)
      }
    },
    resetImage: () => {
      setImagePixel(null)
      let canvasElem = document.getElementById('canvasImage')
      if (canvasElem) {
        var context = canvasElem.getContext('2d')
        context.clearRect(0, 0, selectWidth * multiple, selectWidth * multiple)
      }
    }
  }))

  const initPixels = (canvasElem) => {
    if (canvasElem) {
      var context = canvasElem.getContext('2d')
      context.clearRect(0, 0, selectWidth * multiple, selectWidth * multiple)
      for (let item of imagePixel) {
        let positionX = item.x * multiple
        let positionY = item.y * multiple
        context.fillStyle = item.color
        context.fillRect(positionX, positionY, multiple, multiple)
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
    if (e.target.id === 'canvasImage') {
      mouseDown = true
      const { offsetX, offsetY } = getPointerPos(e)
      downX = offsetX //offsetx 是鼠标相对frame的位置，这里换算成在父节点的位置
      downY = offsetY
      originalX = selectFrameLeft
      originalY = selectFrameTop
      e.nativeEvent.stopImmediatePropagation()
    } else if (e.target.id === 'image-ok' || e.target.id === 'image-cancel') {
      e.nativeEvent.stopImmediatePropagation()
    }
  }

  const handleMouseMove = (e) => {
    if (mouseDown) {
      const { offsetX, offsetY } = getPointerPos(e)
      let left = originalX + Math.floor((offsetX - downX) / multiple) * multiple
      let top = originalY + Math.floor((offsetY - downY) / multiple) * multiple
      left < 0 && (left = 0)
      top < 0 && (top = 0)
      if (left > props.showWidth - selectWidth * multiple) {
        left = props.showWidth - selectWidth * multiple
      }
      if (top > props.showWidth - selectWidth * multiple) {
        top = props.showWidth - selectWidth * multiple
      }
      setSelectFrameLeft(left)
      setSelectFrameTop(top)
      e.nativeEvent.stopImmediatePropagation()
    }
  }
  const handleMouseUp = (e) => {
    if (mouseDown) {
      mouseDown = false
      props.updateSelect(Math.floor(selectFrameLeft / multiple), Math.floor(selectFrameTop / multiple))
      e.nativeEvent.stopImmediatePropagation()
    }
  }

  const onHandlerConfirm = (res) => {
    props.onHandlerImageConfirm(res)
    props.updateSelect(0, 0)
    setImagePixel(null)
    setSelectFrameLeft(0)
    setSelectFrameTop(0)
  }

  return (
    <PixelSelectFrameBgWrapper
      id="pixel-content"
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
      onTouchCancel={handleMouseUp}
    >
      {imagePixel && imagePixel.length && (
        <PixelSelectFrame
          width={selectWidth * multiple + 2}
          height={selectWidth * multiple + 2}
          style={{ left: selectFrameLeft - 1 + 'px', top: selectFrameTop - 1 + 'px', cursor: 'auto' }}
        >
          <canvas
            id="canvasImage"
            width={selectWidth * multiple}
            height={selectWidth * multiple}
            ref={(r) => {
              initPixels(r)
            }}
          ></canvas>
          <CloseOutlined
            id="image-cancel"
            className="cancel"
            onClick={(e) => {
              onHandlerConfirm(false)
            }}
          />
          <CheckOutlined
            id="image-ok"
            className="ok"
            onClick={(e) => {
              onHandlerConfirm(true)
            }}
          />
        </PixelSelectFrame>
      )}
    </PixelSelectFrameBgWrapper>
  )
}

export default memo(SelectImage)
