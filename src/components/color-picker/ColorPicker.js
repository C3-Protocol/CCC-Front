import React, { useState, useEffect } from 'react'
import Map from './Map'
import Slider from './Slider'
import { Input } from 'antd'
import * as ColorUtils from '@/utils/ColorUtils'
import { transformPxToRem } from '@/utils/utils'
import { ColorPickerWrapper, ColorInputContent, HuaSliderWrapper, ColorInputWrapper } from './color-picker.js'

const ColorPicker = (props) => {
  const [color, setColor] = useState(ColorUtils.parseToHsv(props.color || '#ffffff'))
  const [hue, saturation, value] = color
  const [colorString, setColorString] = useState(props.color || '#ffffff')
  const [colorRGBA, setColorArray] = useState(
    ColorUtils.toHexRGBAArray(ColorUtils.parseToHsv(props.color || '#ffffff'))
  )

  useEffect(() => {
    if (props.color) {
      let propsColor = ColorUtils.parseToHsv(props.color)
      if (propsColor !== color) {
        update(propsColor)
      }
    }
  }, [props.color])

  const getBackgroundHue = () => {
    return ColorUtils.toRgbString([color[0], 100, 100])
  }

  const handleHueChange = (hue) => {
    const [, s, v, a] = color
    update([hue, 100, 100, a])
  }

  const handleSaturationValueChange = (saturation, value) => {
    const [h, , , a] = color
    update([h, saturation, value, a])
  }

  const update = (color) => {
    setColor(color)
    setColorString(ColorUtils.toHexRGBString(color))
    setColorArray(ColorUtils.toHexRGBAArray(color))
    props.onChange(ColorUtils.toRgbString(color))
  }

  const handleColorStringChange = (e) => {
    if (!e.target.value || !e.target.value.length) {
      setColorString('#')
      return
    }
    if (e.target.value.length <= 7) {
      let tmp = (e.target.value + Array(7).join(0)).slice(0, 7)
      setColorString(tmp)
      update(ColorUtils.parseToHsv(tmp))
    }
  }

  const handleColorRGBChange = (e, type) => {
    if (type === 'HEX') {
      handleColorStringChange(e)
      return
    }
    let color
    type === 'R' && (color = [parseInt(e.target.value), colorRGBA[1], colorRGBA[2]])
    type === 'G' && (color = [colorRGBA[0], parseInt(e.target.value), colorRGBA[2]])
    type === 'B' && (color = [colorRGBA[0], colorRGBA[1], parseInt(e.target.value)])
    setColorArray(color)
    update(ColorUtils.parseToHsv(ColorUtils.getHexColorString(color)))
  }

  const onHandlerInputChange = (e, type) => {
    if (type === 'HEX') {
      if (!e.target.value || !e.target.value.length) {
        setColorString('#')
        return
      }
      if (e.target.value.length <= 7) {
        setColorString(e.target.value)
      }
      return
    }
    let temp = [...colorRGBA]
    type === 'R' && (temp[0] = parseInt(e.target.value || 0))
    type === 'G' && (temp[1] = parseInt(e.target.value || 0))
    type === 'B' && (temp[2] = parseInt(e.target.value || 0))
    setColorArray(temp)
  }

  const initInputBox = (width, value, type) => {
    return (
      <ColorInputContent width={transformPxToRem(width)}>
        <Input
          style={{ width: transformPxToRem(width), height: '35px' }}
          className="ant-input-violet input-radius4"
          value={value}
          onPressEnter={(e) => handleColorRGBChange(e, type)}
          onChange={(e) => onHandlerInputChange(e, type)}
        ></Input>
        <h5 style={{ textAlign: 'center' }}>{type}</h5>
      </ColorInputContent>
    )
  }
  return (
    <ColorPickerWrapper>
      <Map
        x={saturation}
        y={value}
        max={100}
        backgroundColor={getBackgroundHue()}
        onChange={handleSaturationValueChange}
      />

      <HuaSliderWrapper>
        <Slider vertical={false} value={hue} max={360} onChange={handleHueChange} />
      </HuaSliderWrapper>

      <ColorInputWrapper>
        {initInputBox('100px', colorString, 'HEX')}
        {initInputBox('65px', colorRGBA[0], 'R')}
        {initInputBox('65px', colorRGBA[1], 'G')}
        {initInputBox('65px', colorRGBA[2], 'B')}
      </ColorInputWrapper>
    </ColorPickerWrapper>
  )
}

export default ColorPicker
