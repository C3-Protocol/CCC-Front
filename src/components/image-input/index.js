import React, { memo, useRef } from 'react'
import { getColorString8 } from '@/utils/ColorUtils'
const Jimp = require('jimp').default

function ImageInput(props) {
  const Picture = (
    <svg width="25" height="22" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.682 9.022A1.946 1.946 0 0 0 9.637 7.08a1.946 1.946 0 0 0-1.955-1.943 1.946 1.946 0 0 0-1.956 1.943c.07 1.11.908 1.943 1.956 1.943Zm8.659-1.18-5.657 7.981-2.933-4.094-4.888 6.87h19.204L16.341 7.842ZM24.022 0H.978A.952.952 0 0 0 0 .972v20.056c0 .556.419.972.978.972h23.044a.952.952 0 0 0 .978-.972V.972A.952.952 0 0 0 24.022 0Zm-.977 20.057H1.955V1.874h21.16v18.183h-.07Z"
        fill="#939393"
        fillRule="nonzero"
      />
    </svg>
  )
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
    <div onClick={onImageClick} style={{ display: 'flex', alignItems: 'center' }}>
      {Picture}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        className="needsclick"
        onChange={onSelectImageChange}
      />
    </div>
  )
}

export default memo(ImageInput)
