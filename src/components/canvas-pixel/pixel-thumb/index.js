import React, { memo, useEffect } from 'react'
import * as ColorUtils from '@/utils/ColorUtils'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { getPixelInfoById } from '@/components/canvas-pixel/store/actions'
import { AloneCreate, CanvasWidth } from '@/constants'
import { PixelThumbWrapper } from './style'

function PixelThumb(props) {
  const canvasPrinId = props.prinId
  let canvasWidth = CanvasWidth
  let multiple = 1
  let backgroundColor =
    props.canvasInfo.backGround !== undefined ? ColorUtils.getColorString(props.canvasInfo.backGround) : '#ffffff'

  const isAlone = () => {
    return props.type === AloneCreate
  }
  const dispatch = useDispatch()

  const { pixelInfo } = useSelector((state) => {
    let key = isAlone() ? `alonePixelInfo-${canvasPrinId}` : `multiPixelInfo-${canvasPrinId}`
    let pixelInfo = state.piexls && state.piexls.getIn([key])

    return {
      pixelInfo: pixelInfo
    }
  }, shallowEqual)

  const initPixels = (r) => {
    if (r) {
      var context = r.getContext('2d')
      context.fillStyle = backgroundColor
      context.fillRect(0, 0, canvasWidth, canvasWidth)
      if (pixelInfo) {
        for (let piexl of pixelInfo) {
          let pos = piexl[0]
          let color = piexl[1].color || piexl[1] //兼容alone画布
          drawRect(context, parseInt(pos.x), parseInt(pos.y), ColorUtils.getColorString(color))
        }
      }
    }
  }

  const drawRect = (context, offsetX, offsetY, color) => {
    let positionX = offsetX * multiple
    let positionY = offsetY * multiple
    context.fillStyle = color
    context.fillRect(positionX, positionY, multiple, multiple)
  }

  useEffect(() => {
    if (!pixelInfo || props.canvas) dispatch(getPixelInfoById(props.type, canvasPrinId))
  }, [dispatch])

  return (
    <PixelThumbWrapper scale={props.scale || 1} width={canvasWidth} height={canvasWidth}>
      <canvas
        className="canvas"
        width={canvasWidth}
        height={canvasWidth}
        ref={(r) => {
          initPixels(r)
        }}
      ></canvas>
    </PixelThumbWrapper>
  )
}

export default memo(PixelThumb)
