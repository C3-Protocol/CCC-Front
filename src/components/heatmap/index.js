import React, { memo, useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { AloneCreate } from '@/constants'
import { getValueDivide8 } from '../../utils/utils'
import Heatmap from 'heatmap.js'

function CanvasHeatMap(props) {
  const canvasPrinId = props.prinId
  const [hMap, setHeatMap] = useState(null)

  const { pixelInfo } = useSelector((state) => {
    let key = `multiPixelInfo-${canvasPrinId}`
    let pixelInfo = state.piexls && state.piexls.getIn([key])
    return {
      pixelInfo: pixelInfo
    }
  }, shallowEqual)

  const updateHeatMap = (map) => {
    let data = []
    let max = 1
    if (pixelInfo) {
      for (let piexl of pixelInfo) {
        let pos = piexl[0]
        if (piexl[1].price) {
          let value = Math.ceil(Math.log10(getValueDivide8(piexl[1].price) * 10000) / Math.log10(1.3)) + 1
          data.push({
            x: parseInt(pos.x) * props.multiple + props.emptyWidth,
            y: parseInt(pos.y) * props.multiple + props.emptyWidth,
            value: value
          })
          if (value > max) {
            max = value
          }
        }
      }
    }
    if (data.length && map) {
      map.setData({ max: max, data })
    }
  }

  useEffect(() => {
    let map = Heatmap.create({
      container: document.getElementById('hotMap'),
      radius: props.multiple * 1.25,
      maxOpacity: 1,
      minOpacity: 1,
      gradient: {
        '.1': '#52c41a',
        '.4': '#ffff00',
        '.7': '#ff0000',
        '.85': '#bb0000',
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
