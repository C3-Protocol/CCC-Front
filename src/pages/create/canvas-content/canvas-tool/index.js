import React, { memo } from 'react'
import { CustomRadioWrapper } from '../style'
import { Popover } from 'antd'
import { AloneCreate } from '@/constants'
import ImageInput from '@/components/image-input'
import Pencil from '@/assets/images/create/pencil.png'
import SmallPencil from '@/assets/images/create/small_pencil.png'
import MiddlePencil from '@/assets/images/create/middle_pencil.png'
import LargePencil from '@/assets/images/create/large_pencil.png'
import Earser from '@/assets/images/create/earser.png'
import SmallEarser from '@/assets/images/create/small_earser.png'
import MiddleEarser from '@/assets/images/create/middle_earser.png'
import LargeEarser from '@/assets/images/create/large_earser.png'
import TakeColor from '@/assets/images/create/takecolor.png'
import Reset from '@/assets/images/create/reset.png'
import Colors from '@/assets/images/create/colors.png'
import ColorsSelected from '@/assets/images/create/colors_selected.png'
import Hide from '@/assets/images/create/hide.png'
import HideSelected from '@/assets/images/create/hide_selected.png'

function CanvasTool(props) {
  const type = props.type
  const UploadImageWidth = 30
  const drawType = props.drawType
  const isAlone = () => {
    return type === AloneCreate
  }

  return (
    <div className="tool">
      <Popover
        content={
          <div style={{ display: 'flex', gap: '10px' }}>
            <CustomRadioWrapper
              isChecked={drawType === 'draw-1'}
              onClick={() => {
                props.setDrawType('draw-1')
              }}
            >
              <img src={SmallPencil}></img>
            </CustomRadioWrapper>
            <CustomRadioWrapper
              isChecked={drawType === 'draw-2'}
              onClick={() => {
                props.setDrawType('draw-2')
              }}
            >
              <img src={MiddlePencil}></img>
            </CustomRadioWrapper>
            <CustomRadioWrapper
              isChecked={drawType === 'draw-3'}
              onClick={() => {
                props.setDrawType('draw-3')
              }}
            >
              <img src={LargePencil}></img>
            </CustomRadioWrapper>
          </div>
        }
        trigger="click"
      >
        <CustomRadioWrapper isChecked={drawType.split('-')[0] === 'draw'}>
          <img src={Pencil}></img>
        </CustomRadioWrapper>
      </Popover>
      {props.changeColorPicker && (
        <CustomRadioWrapper>
          <img src={props.showColorPicker ? ColorsSelected : Colors} onClick={props.changeColorPicker}></img>
        </CustomRadioWrapper>
      )}
      <Popover
        content={
          <div style={{ display: 'flex', gap: '10px' }}>
            <CustomRadioWrapper
              isChecked={drawType === 'eraser-1'}
              onClick={() => {
                props.setDrawType('eraser-1')
              }}
            >
              <img src={SmallEarser}></img>
            </CustomRadioWrapper>
            <CustomRadioWrapper
              isChecked={drawType === 'eraser-2'}
              onClick={() => {
                props.setDrawType('eraser-2')
              }}
            >
              <img src={MiddleEarser}></img>
            </CustomRadioWrapper>
            <CustomRadioWrapper
              isChecked={drawType === 'eraser-3'}
              onClick={() => {
                props.setDrawType('eraser-3')
              }}
            >
              <img src={LargeEarser}></img>
            </CustomRadioWrapper>
          </div>
        }
        trigger="click"
      >
        <CustomRadioWrapper isChecked={drawType.split('-')[0] === 'eraser'}>
          <img src={Earser}></img>
        </CustomRadioWrapper>
      </Popover>

      <CustomRadioWrapper isChecked={drawType === 'takecolor'}>
        <img
          src={TakeColor}
          onClick={() => {
            props.setDrawType('takecolor')
          }}
        ></img>
      </CustomRadioWrapper>
      <CustomRadioWrapper isChecked={false}>
        {/* <Tooltip placement="top" title={'Reset'} >
            </Tooltip> */}
        <img
          src={Reset}
          onClick={() => {
            props.resetColor()
          }}
        ></img>
      </CustomRadioWrapper>
      <CustomRadioWrapper isChecked={false}>
        <ImageInput
          onSelectImage={(res) => {
            props.onSelectImage(res)
          }}
          thumbWidth={UploadImageWidth}
        />
      </CustomRadioWrapper>
      {props.changeSelectFrame && (
        <CustomRadioWrapper>
          <img src={props.showSelectFrame ? HideSelected : Hide} onClick={props.changeSelectFrame}></img>
        </CustomRadioWrapper>
      )}
    </div>
  )
}
export default memo(CanvasTool)
