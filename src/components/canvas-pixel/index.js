import React, { memo, useEffect, useState, useImperativeHandle, useRef } from 'react'
import * as ColorUtils from '@/utils/ColorUtils'
import { message } from 'antd'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import {
  getPixelInfoById,
  changeNewPixelInfoAction,
  changeImagePixelInfoAction
} from '@/components/canvas-pixel/store/actions'
import { AloneCreate, CanvasWidth } from '@/constants'
import { CanvasPixelWrapper, PixelDetailWrapper } from './style'
import { getValueDivide8, deepCopy } from '../../utils/utils'
import SelectImage from '../select-image'

import Pencil from '@/assets/images/create/pencil.png'
import Earser from '@/assets/images/create/earser.png'
import TakeColor from '@/assets/images/create/takecolor.png'
import CanvasHeatMap from '@/components/heatmap'

let mouseDown = false
let backgroundColor
let selectLeft = 0
let selectTop = 0
let timer = 0
let toUpdate = []
function CanvasPixel(props) {
  const [showColor, setShowColor] = useState(null)
  const [showInfo, setShowInfo] = useState(null)
  const [showRect, setShowRect] = useState(null)
  const canvasPrinId = props.prinId
  const [newPixelInfo] = useState({})
  const [imagePixel] = useState({})
  const [priceInfo] = useState({})
  const [colorInfo] = useState({})
  let curColor = props.color
  let drawType = props.drawType
  let showWidth = props.width
  let multiple = Math.floor(showWidth / CanvasWidth)
  let emptyWidth = Math.floor((showWidth - multiple * CanvasWidth) / 2)
  const DEFAULT_PRICE = 10000 //初始像素值
  const NEXT_MULTI = 1.3 //下一次绘制像素价格
  backgroundColor =
    props.canvasInfo.backGround !== undefined ? ColorUtils.getColorString(props.canvasInfo.backGround) : '#ffffff'

  const isAlone = () => {
    return props.type === AloneCreate
  }
  const dispatch = useDispatch()
  const imageCanvas = useRef()

  useImperativeHandle(props.cRef, () => ({
    // drawImage 就是暴露给父组件的方法
    drawImage: (res) => {
      if (res && res.length) {
        for (let key in imagePixel) {
          delete imagePixel[key]
        }
        imageCanvas.current.drawImage(res, 'image')
        for (let item of res) {
          imagePixel[`${item.x}-${item.y}`] = item.color
        }
        dispatch(changeImagePixelInfoAction(deepCopy(imagePixel)))
        let [totalPrice, count] = calPrice()
        props.calPrice && props.calPrice(totalPrice, count)
      }
    },
    getDrawPixelInfo: () => {
      if (newPixelInfo && Object.keys(newPixelInfo).length) {
        let colors = []
        for (let key in newPixelInfo) {
          let tmp = key.split('-')
          colors.push({
            pos: { x: parseInt(tmp[0]), y: parseInt(tmp[1]) },
            color: ColorUtils.getColorIntFromString(newPixelInfo[key])
          })
        }
        return colors
      }
    },
    getPixelPriceToUpdload: () => {
      return calPrice(true)
    },

    pixelInfoUpdateFunc: (info) => {
      if (info.type === props.type && info.prinId === canvasPrinId) {
        if (info.resetCanvas) {
          for (let key in newPixelInfo) {
            delete newPixelInfo[key]
          }
        }
        dispatch(getPixelInfoById(props.type, canvasPrinId))
      }
    },
    resetColor: () => {
      toUpdate.splice(0)
      for (let key in newPixelInfo) {
        let temp = key.split('-')
        let x = parseInt(temp[0])
        let y = parseInt(temp[1])
        toUpdate.push({ x: x, y: y })
        recoverColor(x, y, 1)
        delete newPixelInfo[key]
      }
      for (let key in imagePixel) {
        delete imagePixel[key]
      }
      imageCanvas.current.resetImage('reset')
      dispatch(changeImagePixelInfoAction(null))
      dispatch(changeNewPixelInfoAction(null))
      let [totalPrice, count] = calPrice()
      props.calPrice && props.calPrice(totalPrice, count)
    }
  }))

  const { pixelInfo } = useSelector((state) => {
    let key = isAlone() ? `alonePixelInfo-${canvasPrinId}` : `multiPixelInfo-${canvasPrinId}`
    let pixelInfo = state.piexls && state.piexls.getIn([key])
    for (let key in priceInfo) {
      delete priceInfo[key]
      delete colorInfo[key]
    }
    if (pixelInfo && pixelInfo.length) {
      for (let info of pixelInfo) {
        let pos = info[0].x + '-' + info[0].y
        priceInfo[pos] = parseFloat(info[1].price)
        colorInfo[pos] = ColorUtils.getColorString(info[1].color || info[1])
      }
    }

    return {
      pixelInfo: pixelInfo
    }
  }, shallowEqual)

  const initPixels = (r) => {
    if (r) {
      var context = r.getContext('2d')
      context.fillStyle = backgroundColor
      context.fillRect(0, 0, showWidth, showWidth)
      if (pixelInfo) {
        for (let piexl of pixelInfo) {
          let pos = piexl[0]
          let color = piexl[1].color || piexl[1] //兼容alone画布
          drawRect(context, parseInt(pos.x), parseInt(pos.y), ColorUtils.getColorString(color))
        }
      }
      for (let key in newPixelInfo) {
        let tmp = key.split('-')
        drawRect(context, parseInt(tmp[0]), parseInt(tmp[1]), newPixelInfo[key])
      }
    }
  }

  const drawRect = (context, offsetX, offsetY, color) => {
    let positionX = offsetX * multiple + emptyWidth
    let positionY = offsetY * multiple + emptyWidth
    context.fillStyle = color
    context.fillRect(positionX, positionY, multiple, multiple)
  }

  useEffect(() => {
    if (!pixelInfo || props.canvas) dispatch(getPixelInfoById(props.type, canvasPrinId))
    return () => {
      timer && clearTimeout(timer)
      for (let key in newPixelInfo) {
        delete newPixelInfo[key]
      }
      for (let key in priceInfo) {
        delete priceInfo[key]
        delete colorInfo[key]
      }
      dispatch(changeImagePixelInfoAction(null))
      dispatch(changeNewPixelInfoAction(null))
    }
  }, [dispatch])

  const changeColor = (offsetX, offsetY, bold, isdown = false) => {
    let canvasElem = document.getElementById('canvas-pixel')
    if (canvasElem) {
      var context = canvasElem.getContext('2d')
      let x = Math.floor((offsetX - emptyWidth) / multiple)
      let y = Math.floor((offsetY - emptyWidth) / multiple)
      let res = newPixelInfo[`${x}-${y}`]
      if (!isAlone() && !res && Object.keys(newPixelInfo).length >= 1000) {
        if (isdown) {
          message.info('You can only change up to 1000 pixels at a time')
        }
        return
      }
      if (x < CanvasWidth && x >= 0 && y < CanvasWidth && y >= 0) {
        for (let i = 0; i < bold; i++) {
          for (let j = 0; j < bold; j++) {
            if (newPixelInfo[`${x + i}-${y + j}`] !== curColor) {
              if (!isAlone() && Object.keys(newPixelInfo).length >= 1000) break
              if (x + i >= CanvasWidth || y + j >= CanvasWidth) continue
              drawRect(context, x + i, y + j, curColor)
              newPixelInfo[`${x + i}-${y + j}`] = curColor
              toUpdate.push({ x: x + i, y: y + j, color: curColor })
            }
          }
        }
      }
    }
  }

  const recoverColor = (offsetX, offsetY, bold) => {
    let canvasElem = document.getElementById('canvas-pixel')
    if (canvasElem) {
      var context = canvasElem.getContext('2d')
      let x = Math.floor((offsetX - emptyWidth) / multiple)
      let y = Math.floor((offsetY - emptyWidth) / multiple)
      if (x < CanvasWidth && x >= 0 && y < CanvasWidth && y >= 0) {
        for (let i = 0; i < bold; i++) {
          for (let j = 0; j < bold; j++) {
            if (newPixelInfo[`${x + i}-${y + j}`]) {
              let color = !props.hideLineInfo && colorInfo && colorInfo[`${x + i}-${y + j}`]
              if (!color) {
                color = backgroundColor
              }
              drawRect(context, x + i, y + j, color)
              delete newPixelInfo[`${x + i}-${y + j}`]
              toUpdate.push({ x: x + i, y: y + j, color: curColor })
            }
          }
        }
      }
    }
  }

  const takeColorFromCanvas = (offsetX, offsetY) => {
    let x = Math.floor((offsetX - emptyWidth) / multiple)
    let y = Math.floor((offsetY - emptyWidth) / multiple)
    let color = newPixelInfo[`${x}-${y}`]
    if (!color) {
      color = colorInfo[`${x}-${y}`]
    }
    if (color) props.updateCurrentColor(color)
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
    if (!props.modify) {
      return
    }
    if (e.target.id !== 'pixel-content') {
      return
    }
    if (props.heatMapShow) {
      return
    }
    e.stopPropagation()
    const { offsetX, offsetY } = getPointerPos(e)
    mouseDown = true
    toUpdate.splice(0)
    let array = drawType.split('-')
    let type = array[0]
    if (curColor && type === 'draw') {
      changeColor(offsetX, offsetY, array[1] || 1, true)
    } else if (type === 'eraser') {
      recoverColor(offsetX, offsetY, array[1] || 1)
    } else if (type === 'takecolor') {
      takeColorFromCanvas(offsetX, offsetY)
    }
  }

  const handleMouseMove = (e) => {
    if (!props.modify) {
      return
    }
    if (props.heatMapShow) {
      return
    }
    e.stopPropagation()
    if (!mouseDown) {
      if (!pixelInfo) {
        return
      }
      let { offsetX, offsetY } = getPointerPos(e)
      if (showRect) {
        setShowColor(null)
        setShowInfo(null)
        setShowRect(null)
        return
      }

      timer && clearTimeout(timer)
      let temp = setTimeout(() => {
        if (!mouseDown) {
          let x = Math.floor((offsetX - emptyWidth) / multiple)
          let y = Math.floor((offsetY - emptyWidth) / multiple)
          for (let piexl of pixelInfo) {
            let pos = piexl[0]
            if (parseInt(pos.x) === x && parseInt(pos.y) === y) {
              let color = piexl[1].color || piexl[1]
              let price = getValueDivide8(piexl[1].price || DEFAULT_PRICE)
              setShowColor(ColorUtils.getColorString(color))
              setShowInfo(`${price} WICP, Coordinates:(${x},${y})`)
              let left, right, top, bottom
              offsetX < showWidth / 2
                ? (left = x * multiple + emptyWidth)
                : (right = showWidth - x * multiple - emptyWidth)
              offsetY < showWidth / 2
                ? (top = y * multiple + emptyWidth)
                : (bottom = showWidth - y * multiple - emptyWidth)
              setShowRect([left, top, right, bottom])
              console.log(' x= ' + x + ' y = ' + y)
              break
            }
          }
        }
      }, 1500)
      timer = temp
    } else {
      const { offsetX, offsetY } = getPointerPos(e)
      let array = drawType.split('-')
      let type = array[0]
      if (curColor && type === 'draw') {
        changeColor(offsetX, offsetY, array[1] || 1)
      } else if (type === 'eraser') {
        recoverColor(offsetX, offsetY, array[1] || 1)
      }
    }
  }

  const calPrice = (upload = false) => {
    let totalPrice = 0
    let count = Object.keys(newPixelInfo).length + (!upload ? Object.keys(imagePixel).length : 0)
    if (isAlone()) {
      totalPrice = count * (parseInt(props.canvasInfo.basePrice) || DEFAULT_PRICE)
    } else {
      for (let key in newPixelInfo) {
        let info = priceInfo && priceInfo[key]
        let price = parseInt(props.canvasInfo.basePrice) || DEFAULT_PRICE
        if (info) {
          price = (parseInt(props.canvasInfo.growRatio) / 100 || NEXT_MULTI) * info
        }
        totalPrice += price
      }
      if (!upload) {
        for (let key in imagePixel) {
          let temp = key.split('-')
          let x = parseInt(temp[0]) + selectLeft
          let y = parseInt(temp[1]) + selectTop
          let info = priceInfo && priceInfo[`${x}-${y}`]
          let price = parseInt(props.canvasInfo.basePrice) || DEFAULT_PRICE
          if (info) {
            price = (parseInt(props.canvasInfo.growRatio) / 100 || NEXT_MULTI) * info
          }
          totalPrice += price
        }
      }
    }
    return [totalPrice, count]
  }

  const handleMouseUp = (e) => {
    if (!props.modify) {
      return
    }
    e.stopPropagation()
    mouseDown = false
    timer && clearTimeout(timer)
    if (drawType !== 'takecolor') {
      dispatch(changeNewPixelInfoAction(deepCopy(newPixelInfo)))
      let [totalPrice, count] = calPrice()
      props.calPrice && props.calPrice(totalPrice, count)
    }
  }

  const handleMouseLeave = (e) => {
    e.stopPropagation()
    mouseDown = false
    timer && clearTimeout(timer)
  }

  const updateSelectPosition = (left, top) => {
    selectLeft = left
    selectTop = top
    props.updateSelect(left, top)
    let [totalPrice, count] = calPrice()
    props.calPrice && props.calPrice(totalPrice, count)
  }

  const getCursorImage = () => {
    if (!props.modify) {
      return
    }
    let array = drawType.split('-')
    let type = array[0]
    let img
    let left
    if (type === 'draw') {
      img = Pencil
      left = 11
    } else if (type === 'eraser') {
      img = Earser
      left = 11
    } else if (type === 'takecolor') {
      img = TakeColor
      left = 0
    }
    return `url(${img}) ${left} 22,auto`
  }

  const onHandlerImageConfirm = (res) => {
    dispatch(changeImagePixelInfoAction(null))
    if (res) {
      toUpdate.splice(0)
      let canvasElem = document.getElementById('canvas-pixel')
      var context = canvasElem.getContext('2d')
      for (let key in imagePixel) {
        let temp = key.split('-')
        let x = parseInt(temp[0]) + selectLeft
        let y = parseInt(temp[1]) + selectTop
        newPixelInfo[`${x}-${y}`] = imagePixel[key]
        toUpdate.push({ x: x, y: y, color: imagePixel[key] })
        drawRect(context, x, y, imagePixel[key])
      }
      dispatch(changeNewPixelInfoAction(deepCopy(newPixelInfo)))
    }
    for (let key in imagePixel) {
      delete imagePixel[key]
    }
  }
  return (
    <CanvasPixelWrapper
      width={showWidth}
      height={showWidth}
      style={{ cursor: getCursorImage() }}
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
        className="canvas"
        width={showWidth}
        height={showWidth}
        ref={(r) => {
          initPixels(r)
        }}
      ></canvas>

      {props.modify && !isAlone() && (
        <CanvasHeatMap
          showWidth={showWidth}
          heatMapShow={props.heatMapShow}
          multiple={multiple}
          emptyWidth={emptyWidth}
          prinId={canvasPrinId}
        />
      )}
      {props.modify && (
        <SelectImage
          cRef={imageCanvas}
          multiple={multiple}
          showWidth={showWidth}
          onHandlerImageConfirm={onHandlerImageConfirm}
          updateSelect={updateSelectPosition}
        />
      )}

      {showRect && showInfo && showColor && (
        <PixelDetailWrapper left={showRect[0]} top={showRect[1]} right={showRect[2]} bottom={showRect[3]}>
          <div className="color" style={{ backgroundColor: showColor }}></div>
          <div className="price">{showInfo}</div>
        </PixelDetailWrapper>
      )}
    </CanvasPixelWrapper>
  )
}

export default memo(CanvasPixel)
