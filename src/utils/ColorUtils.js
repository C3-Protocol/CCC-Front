import parse from 'pure-color/parse'
import rgb2hsv from 'pure-color/convert/rgb2hsv'
import hsv2rgb from 'pure-color/convert/hsv2rgb'
import rgb2string from 'pure-color/convert/rgb2string'
import rgb2grayscale from 'pure-color/convert/rgb2grayscale'

export function parseToHsv(color) {
  color = parse(color)
  const hsv = rgb2hsv(color)

  const alpha = color.length === 4 ? color[3] : 1
  hsv.push(alpha)

  return hsv
}

export function toRgbString(hsv) {
  let rgb = toHexRGBAArray(hsv)
  return rgb2string(rgb)
}

export function toHexRGBAArray(hsv) {
  const rgb = hsv2rgb(hsv)
  if (hsv.length === 4) {
    rgb.push(hsv[3])
  } else {
    rgb.push(1)
  }
  rgb[3] = parseInt(rgb[3] * 255)
  for (let i = 0; i < rgb.length; i++) {
    rgb[i] = Math.round(rgb[i])
  }
  return rgb
}

export function toHexRGBString(hsv) {
  const rgb = toHexRGBAArray(hsv)
  return getHexColorString(rgb)
}

export function equals(hsv1, hsv2) {
  return toRgbString(hsv1) === toRgbString(hsv2)
}

export function isDark(hsv) {
  return rgb2grayscale(hsv2rgb(hsv)) <= 128
}

export function getColorString(colorInt) {
  let color = parseInt(colorInt)
  let string = color.toString(16)
  string = (Array(6).join(0) + string).slice(-6)
  let r = parseInt('0x' + string.slice(0, 2))
  let g = parseInt('0x' + string.slice(2, 4))
  let b = parseInt('0x' + string.slice(4, 6))
  return rgb2string([r, g, b])
}

export function getReverseColorString(colorInt) {
  let color = parseInt(colorInt)
  color = 16777215 - color
  return getColorString(color)
}

export function getColorString8(colorInt) {
  let color = parseInt(colorInt)
  let string = color.toString(16)
  string = (Array(8).join(0) + string).slice(-8)
  let a = parseInt('0x' + string.slice(6, 8))
  if (a <= 26) {
    return
  }
  let r = parseInt('0x' + string.slice(0, 2))
  let g = parseInt('0x' + string.slice(2, 4))
  let b = parseInt('0x' + string.slice(4, 6))
  return rgb2string([r, g, b])
}

export function getColorInt(rgba) {
  let res = getHexColorString(rgba)
  let color = parseInt(res.replace('#', '0x'))
  return color
}

export function getHexColorString(rgba) {
  let res =
    '#' +
    ('0' + Math.round(rgba[0]).toString(16)).slice(-2) +
    ('0' + Math.round(rgba[1]).toString(16)).slice(-2) +
    ('0' + Math.round(rgba[2]).toString(16)).slice(-2)
  return res
}

export function getColorIntFromString(color) {
  var values = color
    .replace(/rgba?\(/, '')
    .replace(/\)/, '')
    .replace(/[\s+]/g, '')
    .split(',')
  var r = parseInt(values[0]),
    g = parseInt(values[1]),
    b = parseInt(values[2])

  return getColorInt([r, g, b])
}
