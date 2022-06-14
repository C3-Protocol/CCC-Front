import React, { memo, useEffect } from 'react'
import * as ColorUtils from '@/utils/ColorUtils'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { getPixelInfoById, checkImageByTypeAndId } from '@/components/pixel-thumb/store/actions'
import { AloneCreate, getCanvasWidth } from '@/constants'
import { PixelThumbWrapper } from './style'
import { Skeleton } from 'antd'

function PixelThumb(props) {
  const { prinId, type } = props
  let canvasWidth = props.width || getCanvasWidth(type)
  let multiple = Math.floor(canvasWidth / getCanvasWidth(type))
  let backgroundColor =
    props.canvasInfo.backGround !== undefined ? ColorUtils.getColorString(props.canvasInfo.backGround) : '#ffffff'

  const isAlone = () => {
    return type === AloneCreate
  }
  const dispatch = useDispatch()

  const { pixelInfo, existImage } = useSelector((state) => {
    let key = `pixelInfo-${type}-${prinId}`
    let pixelInfo = state.piexls && state.piexls.getIn([key])
    let key1 = `existImage-${type}-${prinId}`
    let existImage = state.piexls && state.piexls.getIn([key1])
    return {
      pixelInfo,
      existImage
    }
  }, shallowEqual)

  const initPixels = (r) => {
    if (r) {
      if (pixelInfo) {
        var context = r.getContext('2d')
        context.fillStyle = backgroundColor
        context.fillRect(0, 0, canvasWidth, canvasWidth)
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
    if (props.canvas) dispatch(getPixelInfoById(type, prinId))
  }, [dispatch])

  useEffect(() => {
    if (!props.canvas && existImage === undefined) dispatch(checkImageByTypeAndId(type, prinId))
    if (!pixelInfo && existImage === false) dispatch(getPixelInfoById(type, prinId))
  }, [existImage])

  return (
    <PixelThumbWrapper scale={props.scale || 1} width={canvasWidth} height={canvasWidth}>
      <Skeleton.Image />
      {existImage ? (
        <img src={`https://${prinId}.raw.ic0.app`} style={{ width: '100%', imageRendering: 'pixelated' }} />
      ) : (
        <canvas
          className="canvas-thumb"
          width={canvasWidth}
          height={canvasWidth}
          ref={(r) => {
            initPixels(r)
          }}
        ></canvas>
      )}
    </PixelThumbWrapper>
  )
}

export default memo(PixelThumb)
