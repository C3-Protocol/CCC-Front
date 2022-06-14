import React, { memo, useEffect, useState } from 'react'
import * as ColorUtils from '@/utils/ColorUtils'
import { shallowEqual, useSelector } from 'react-redux'
import { getCanvasWidth } from '@/constants'

function CanvasBanner(props) {
  const [colorInfo] = useState({})
  const { prinId, type, bannerHeight } = props
  const CanvasWidth = getCanvasWidth(type)
  let showWidth = bannerHeight
  let multiple = bannerHeight / CanvasWidth
  let emptyWidth = 0
  let backgroundColor =
    props.canvasInfo && props.canvasInfo.backGround != undefined
      ? ColorUtils.getColorString(props.canvasInfo.backGround)
      : '#ffffff'

  const gaussBlur = (colorInfo) => {
    var width = CanvasWidth
    var height = CanvasWidth
    var gaussMatrix = [],
      gaussSum = 0,
      x,
      y,
      r,
      g,
      b,
      a,
      i,
      j,
      k,
      len

    var radius = 8
    var sigma = 4

    a = 1 / (Math.sqrt(2 * Math.PI) * sigma)
    b = -1 / (2 * sigma * sigma)
    //生成高斯矩阵
    for (i = 0, x = -radius; x <= radius; x++, i++) {
      g = a * Math.exp(b * x * x)
      gaussMatrix[i] = g
      gaussSum += g
    }

    //归一化, 保证高斯矩阵的值在[0,1]之间
    for (i = 0, len = gaussMatrix.length; i < len; i++) {
      gaussMatrix[i] /= gaussSum
    }
    //x 方向一维高斯运算
    for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
        r = g = b = a = 0
        gaussSum = 0
        for (j = -radius; j <= radius; j++) {
          k = x + j
          if (k >= 0 && k < width) {
            //确保 k 没超出 x 的范围
            //r,g,b,a 四个一组
            i = (y * width + k) * 4
            let color = ColorUtils.getColorArray(colorInfo[k + '-' + y])
            r += color[0] * gaussMatrix[j + radius]
            g += color[1] * gaussMatrix[j + radius]
            b += color[2] * gaussMatrix[j + radius]
            gaussSum += gaussMatrix[j + radius]
          }
        }
        i = (y * width + x) * 4
        // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
        // console.log(gaussSum)
        colorInfo[x + '-' + y] = ColorUtils.getColorInt([r / gaussSum, g / gaussSum, b / gaussSum])
      }
    }
    //y 方向一维高斯运算
    for (x = 0; x < width; x++) {
      for (y = 0; y < height; y++) {
        r = g = b = a = 0
        gaussSum = 0
        for (j = -radius; j <= radius; j++) {
          k = y + j
          if (k >= 0 && k < height) {
            //确保 k 没超出 y 的范围
            i = (k * width + x) * 4
            let color = ColorUtils.getColorArray(colorInfo[x + '-' + k])
            r += color[0] * gaussMatrix[j + radius]
            g += color[1] * gaussMatrix[j + radius]
            b += color[2] * gaussMatrix[j + radius]
            // a += pixes[i + 3] * gaussMatrix[j];
            gaussSum += gaussMatrix[j + radius]
          }
        }
        i = (y * width + x) * 4
        colorInfo[x + '-' + y] = ColorUtils.getColorInt([r / gaussSum, g / gaussSum, b / gaussSum])
      }
    }
  }

  const { pixelInfo } = useSelector((state) => {
    let key = `pixelInfo-${type}-${prinId}`
    let pixelInfo = state.piexls && state.piexls.getIn([key])
    for (let key in colorInfo) {
      delete colorInfo[key]
    }
    if (pixelInfo && pixelInfo.length) {
      for (let info of pixelInfo) {
        let pos = info[0].x + '-' + info[0].y
        colorInfo[pos] = info[1].color || info[1]
      }
      let bgcolor = parseInt(backgroundColor.replace('#', '0x'))
      for (let i = 0; i < CanvasWidth; i++) {
        for (let j = 0; j < CanvasWidth; j++) {
          if (!colorInfo[i + '-' + j]) {
            colorInfo[i + '-' + j] = bgcolor
          }
        }
      }
      // gaussBlur(colorInfo)
    }

    return {
      pixelInfo: pixelInfo
    }
  }, shallowEqual)

  const initPixels = (r) => {
    if (r) {
      var context = r.getContext('2d')
      if (pixelInfo) {
        let yStart = 0
        for (let i = 0; i < CanvasWidth; i++) {
          for (let j = yStart; j < yStart + CanvasWidth; j++) {
            let pos = i + '-' + j
            let color = colorInfo[pos] //兼容alone画布
            if (color) {
              drawRect(context, i, j - yStart, ColorUtils.getColorString(color))
            }
          }
        }
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
    <div
      style={{ justifyContent: 'space-between', display: 'flex', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      <canvas
        width={CanvasWidth * multiple}
        height={CanvasWidth * multiple}
        ref={(r) => {
          initPixels(r)
        }}
        style={{
          filter: 'blur(3px)'
        }}
      ></canvas>
      <canvas
        width={CanvasWidth * multiple}
        height={CanvasWidth * multiple}
        ref={(r) => {
          initPixels(r)
        }}
        style={{
          filter: 'blur(3px)'
        }}
      ></canvas>
      {/* <img style={{ objectFit: 'cover', height: `${bannerHeight}px` }} src={BannnerBg}></img> */}
    </div>
  )
}

export default memo(CanvasBanner)
