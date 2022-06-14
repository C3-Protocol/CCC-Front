import React, { memo, useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { AloneCreate } from '@/constants'
import { getValueDivide8, getValueMultiplied8 } from '../../utils/utils'
import Heatmap from 'heatmap.js'

function CanvasHeatMap(props) {
  const canvasPrinId = props.prinId
  const type = props.type
  const [hMap, setHeatMap] = useState(null)
  const canvasInfo = props.canvasInfo

  const { pixelInfo } = useSelector((state) => {
    let key = `pixelInfo-${type}-${canvasPrinId}`
    let pixelInfo = state.piexls && state.piexls.getIn([key])
    return {
      pixelInfo: pixelInfo
    }
  }, shallowEqual)

  const updateHeatMap = (map) => {
    let data = []
    let max = 0
    let min = 99999
    if (pixelInfo) {
      let sum = 0
      for (let piexl of pixelInfo) {
        let pos = piexl[0]
        if (piexl[1].price) {
          let value =
            Math.ceil(
              Math.log10(
                getValueDivide8(getValueMultiplied8(piexl[1].price) / parseInt(canvasInfo.basePrice || 10000))
              ) / Math.log10(1.3)
            ) + 1
          data.push({
            x: parseInt(pos.x) * props.multiple + props.emptyWidth,
            y: parseInt(pos.y) * props.multiple + props.emptyWidth,
            value: value
          })
          sum += value
          if (value > max) {
            max = value
          }
          if (value < min) {
            min = value
          }
        }
      }
      let ava = sum / pixelInfo.length
      for (let item of data) {
        if (item.value < ava) {
          item.value = Math.ceil((item.value / ava) * 30)
        } else {
          item.value = Math.ceil(((item.value - ava) / (max - ava)) * 70 + 30)
        }
      }
      max = max - min
      for (let item of data) {
        item.value -= min
      }
    }

    if (data.length && map) {
      map.setData({ max: 100, data, min: 0 })
    }
  }

  useEffect(() => {
    let map = Heatmap.create({
      container: document.getElementById('hotMap'),
      radius: props.multiple * 1.25,
      maxOpacity: 1,
      minOpacity: 1,
      gradient: {
        '.2': '#52c41a',
        '.4': '#ffff00',
        '.6': '#ff0000',
        '.8': '#bb0000',
        1: '#880000'
      }
    })
    setHeatMap(map)
    updateHeatMap(map)
  }, [])

  useEffect(() => {
    updateHeatMap(hMap)
  }, [pixelInfo])

  return (
    <div
      id="hotMap"
      style={{ width: props.showWidth, height: props.showWidth, visibility: props.heatMapShow ? 'visible' : 'hidden' }}
    ></div>
  )
}

export default memo(CanvasHeatMap)
