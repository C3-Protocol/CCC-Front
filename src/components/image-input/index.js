import React, { memo, useState, useRef } from 'react'
import Picture from '@/assets/images/create/picture.png'
import { getColorString8, getColorString } from '@/utils/ColorUtils'
const Jimp = require('jimp').default

function ImageInput(props) {
  const imageInputRef = useRef()
  const onImageClick = () => {
    imageInputRef.current.focus()
    imageInputRef.current.click()
  }

  const onSelectImageChange = (e) => {
    let file = e.target.files[0]
    if (file && file instanceof Blob) {
      var reader = new FileReader()
      reader.readAsArrayBuffer(file)
      reader.onload = function (e) {
        let buffer = e.target.result //此时是arraybuffer类型
        Jimp.read(buffer)
          .then((image) => {
            let width = image.bitmap.width
            let height = image.bitmap.height
            if (width > props.thumbWidth || height > props.thumbWidth) {
              let scale = Math.min(props.thumbWidth / width, props.thumbWidth / height)
              width = Math.floor(scale * width)
              height = Math.floor(scale * height)
              return image.resize(width, height) // resize
            }
            return image
          })
          .then((image) => {
            let res = []
            for (let i = 0; i < image.bitmap.width; i++) {
              for (let j = 0; j < image.bitmap.height; j++) {
                let colorInt = image.getPixelColor(i, j)
                let color = getColorString8(colorInt)
                if (color) {
                  res.push({ x: i, y: j, color: color })
                }
              }
            }
            props.onSelectImage && props.onSelectImage({ ok: res })
          })
          .catch((err) => {
            props.onSelectImage && props.onSelectImage({ error: err })
            console.error(err)
          })
      }
    }
    imageInputRef.current.value = null
  }

  return (
    <div>
      <img src={Picture} onClick={onImageClick}></img>
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onSelectImageChange}
      />
    </div>
  )
}

export default memo(ImageInput)
