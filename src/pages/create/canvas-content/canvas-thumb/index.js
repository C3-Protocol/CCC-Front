import React, { memo, useState, useImperativeHandle } from 'react'
import * as ColorUtils from '@/utils/ColorUtils'
import { shallowEqual, useSelector } from 'react-redux'
import { AloneCreate, CanvasWidth } from '@/constants'

function CanvasThumb(props) {
  //const [newPixelInfo] = useState({})
  const [colorInfo] = useState({})
  const canvasPrinId = props.prinId
  // const [imagePixelInfo, setImagePixelInfo] = useState(null)
  let showWidth = Math.max(props.width, CanvasWidth)
  let multiple = Math.floor(showWidth / CanvasWidth) || 1
  let emptyWidth = Math.floor((showWidth - multiple * CanvasWidth) / 2)

  let backgroundColor =
    props.canvasInfo.backGround != undefined ? ColorUtils.getColorString(props.canvasInfo.backGround) : '#ffffff'
  const [selectLeft, setSelectLeft] = useState(0)
  const [selectTop, setSelectTop] = useState(0)
  const isAlone = () => {
    return props.type === AloneCreate
  }

  useImperativeHandle(props.cRef, () => ({
    updateSelectPosition: (left, top) => {
      setSelectTop(top)
      setSelectLeft(left)
    },

    pixelInfoUpdateFunc: (info) => {
      if (info.type === props.type && info.prinId === canvasPrinId) {
        if (info.resetCanvas) {
          for (let key in newPixelInfo) {
            delete newPixelInfo[key]
          }
        }
      }
    }
  }))

  const { pixelInfo, newPixelInfo, imagePixelInfo } = useSelector((state) => {
    let key = isAlone() ? `alonePixelInfo-${canvasPrinId}` : `multiPixelInfo-${canvasPrinId}`
    let pixelInfo = state.piexls && state.piexls.getIn([key])
    let newPixelInfo = (state.piexls && state.piexls.getIn(['newPixelInfo'])) || {}
    let imagePixelInfo = (state.piexls && state.piexls.getIn(['imagePixelInfo'])) || {}
    for (let key in colorInfo) {
      delete colorInfo[key]
    }
    if (pixelInfo && pixelInfo.length) {
      for (let info of pixelInfo) {
        let pos = info[0].x + '-' + info[0].y
        colorInfo[pos] = ColorUtils.getColorString(info[1].color || info[1])
      }
    }
    return {
      pixelInfo: pixelInfo,
      newPixelInfo: newPixelInfo,
      imagePixelInfo: imagePixelInfo
    }
  }, shallowEqual)

  const initPixels = (r) => {
    if (r) {
      var context = r.getContext('2d')
      context.fillStyle = backgroundColor
      context.fillRect(0, 0, showWidth, showWidth)
      if (pixelInfo && !props.hideLineInfo) {
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
      for (let key in imagePixelInfo) {
        let temp = key.split('-')
        let x = parseInt(temp[0]) + selectLeft
        let y = parseInt(temp[1]) + selectTop
        drawRect(context, x, y, imagePixelInfo[key])
      }
    }
  }

  const drawRect = (context, offsetX, offsetY, color) => {
    let positionX = offsetX * multiple + emptyWidth
    let positionY = offsetY * multiple + emptyWidth
    context.fillStyle = color
    context.fillRect(positionX, positionY, multiple, multiple)
  }

  return (
    <canvas
      id="canvas-thumb"
      width={showWidth}
      height={showWidth}
      style={{
        transform: `scale(${Math.min(props.width / showWidth, 1)})`,
        transformOrigin: 'left bottom',
        position: 'absolute',
        bottom: 0
      }}
      ref={(r) => {
        initPixels(r)
      }}
    ></canvas>
  )
}

export default memo(CanvasThumb)
