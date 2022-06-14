import React, { memo, useState, useImperativeHandle } from 'react'
import * as ColorUtils from '@/utils/ColorUtils'

function SelectFrame(props) {
  const [selectFrameLeft, setSelectFrameLeft] = useState(0)
  const [selectFrameTop, setSelectFrameTop] = useState(0)
  const color = ColorUtils.getReverseColorString(props.backGround !== undefined || 16777215)
  const selectWidth = props.selectWidth
  const selectHeight = props.selectWidth
  const canvasScale = props.canvasScale
  const frameW = selectWidth / canvasScale
  const frameH = selectHeight / canvasScale

  const [mouseDown, setMouseDown] = useState(false)
  const [downX, setDownX] = useState(-1)
  const [downY, setDownY] = useState(-1)
  const [originalX, setOriginalX] = useState(0)
  const [originalY, setOriginalY] = useState(0)

  useImperativeHandle(props.cRef, () => ({
    updatePosition: (left, top) => {
      setSelectFrameTop(top)
      setSelectFrameLeft(left)
    }
  }))

  const getPointerPos = (e) => {
    let frame = document.getElementById('frame')
    const rect = frame.getBoundingClientRect()

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
    setMouseDown(true)
    const { offsetX, offsetY } = getPointerPos(e)
    setDownX(offsetX)
    setDownY(offsetY)
    setOriginalX(selectFrameLeft)
    setOriginalY(selectFrameTop)
  }

  const handleMouseMove = (e) => {
    if (mouseDown) {
      e.stopPropagation()
      const { offsetX, offsetY } = getPointerPos(e)
      let left = originalX + offsetX - downX
      let top = originalY + offsetY - downY
      left < 0 && (left = 0)
      top < 0 && (top = 0)
      if (left > selectWidth - frameW) {
        left = selectWidth - frameW
      }
      if (top > selectHeight - frameH) {
        top = selectHeight - frameH
      }
      setSelectFrameLeft(left)
      setSelectFrameTop(top)
    }
  }
  const handleMouseUp = (e) => {
    if (mouseDown) {
      e.stopPropagation()
      setMouseDown(false)
      setDownX(-1)
      setDownY(-1)
      props.updateSelect(selectFrameLeft, selectFrameTop)
    }
  }

  return canvasScale > 1 ? (
    <div
      id="frame"
      style={{
        position: 'absolute',
        height: selectHeight + 'px',
        bottom: 0
      }}
    >
      {selectFrameTop > 0 && (
        <div
          style={{
            position: 'absolute',
            width: selectWidth + 'px',
            height: selectFrameTop + 'px',
            backgroundColor: '#00000099',
            left: 0,
            top: 0
          }}
        ></div>
      )}
      {selectHeight - selectFrameTop - frameH > 0 && (
        <div
          style={{
            position: 'absolute',
            width: selectWidth + 'px',
            height: selectHeight - selectFrameTop - frameH + 'px',
            backgroundColor: '#00000099',
            left: 0,
            top: selectFrameTop + frameH + 'px'
          }}
        ></div>
      )}
      {selectFrameLeft > 0 && (
        <div
          style={{
            position: 'absolute',
            width: selectFrameLeft + 'px',
            height: frameH + 'px',
            backgroundColor: '#00000099',
            left: 0,
            top: selectFrameTop + 'px'
          }}
        ></div>
      )}

      {selectWidth - selectFrameLeft - frameW > 0 && (
        <div
          style={{
            position: 'absolute',
            width: selectWidth - selectFrameLeft - frameW + 'px',
            height: frameH + 'px',
            backgroundColor: '#00000099',
            left: selectFrameLeft + frameW,
            top: selectFrameTop + 'px'
          }}
        ></div>
      )}
      <div
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        onTouchCancel={handleMouseUp}
        style={{
          position: 'absolute',
          width: frameW + 'px',
          height: frameH + 'px',
          border: '1px solid ' + color,
          left: selectFrameLeft,
          top: selectFrameTop
        }}
      ></div>
    </div>
  ) : (
    <div></div>
  )
}

export default memo(SelectFrame)
