import React, { Ref, useImperativeHandle } from 'react'
import Canvas from './components/canvas'
import {
  ToolTypeContext,
  ShapeTypeContext,
  ShapeOutlineContext,
  LineWidthContext,
  ColorContext,
  FillContext,
  TextContext,
  SizeContext,
  DispatcherContext
} from './context'
import './style.less'
import { useState } from 'react'
import { ColorType, LineWidthType, ShapeOutlineType, ShapeToolType, ToolType } from './util/toolType'
import ToolPanel from './components/toolBar/tool'
import Dispatcher from './util/dispatcher'
import Right from './components/toolBar/right'
import Edit from './components/edit'

interface PaintProps {
  imgSrc?: string
  width?: number
  height?: number
  background?: string
  id: string
  cRef: any
  onClick?: (type: any) => void
}

function Paint(props: PaintProps): JSX.Element {
  const { id, imgSrc, width, height, background, onClick, cRef } = props
  const [toolType, setToolType] = useState<ToolType>(ToolType.PEN)
  const [shapeType, setShapeType] = useState<ShapeToolType>(ShapeToolType.LINE)
  const [shapeOutlineType, setShapeOutlineType] = useState<ShapeOutlineType>(ShapeOutlineType.SOLID)
  const [lineWidthType, setLineWidthType] = useState<LineWidthType>(LineWidthType.LINESIZE)
  const [lineSize, setLineFontSize] = useState<number>(1)
  const [fillColor, setFillColor] = useState<string>('')
  const [size, setSize] = useState({})
  const [activeColorType, setActiveColorType] = useState<ColorType>(ColorType.MAIN)
  const [fontStyle, setFontStyle] = useState({})
  const [mainColor, setMainColor] = useState<string>('black')
  const [subColor, setSubColor] = useState<string>('white')
  const [dispatcher] = useState(new Dispatcher())

  const setColor = (value: string) => {
    if (activeColorType === ColorType.MAIN) {
      setMainColor(value)
    } else {
      setSubColor(value)
    }
  }

  useImperativeHandle(cRef, () => ({
    getCurrentImageData: () => {
      let canvasElem: any = document.getElementById(`ccc-paint-canvas ${id}`)
      var imageData = canvasElem.toDataURL("image/png");
      return imageData
    }
  }))

  return (
    <ToolTypeContext.Provider value={{ type: toolType, setType: setToolType }}>
      <ShapeTypeContext.Provider
        value={{
          type: shapeType,
          setType: (type: ShapeToolType) => {
            setToolType(ToolType.SHAPE)
            setShapeType(type)
          }
        }}
      >
        <ShapeOutlineContext.Provider value={{ type: shapeOutlineType, setType: setShapeOutlineType }}>
          <LineWidthContext.Provider
            value={{
              type: lineWidthType,
              lineSize: lineSize,
              setType: setLineWidthType,
              setLineSize: setLineFontSize
            }}
          >
            <DispatcherContext.Provider value={{ dispatcher }}>
              <ColorContext.Provider
                value={{
                  mainColor,
                  subColor,
                  activeColor: activeColorType,
                  setColor,
                  setActiveColor: setActiveColorType
                }}
              >
                <SizeContext.Provider value={{ size, onSize: setSize }}>
                  <FillContext.Provider
                    value={{
                      fillColor,
                      setFillColor
                    }}
                  >
                    <TextContext.Provider
                      value={{
                        fontStyle,
                        setFont: setFontStyle
                      }}
                    >
                      <div className="ccc">
                        <div className="ccc-edit">
                          <Edit />
                        </div>
                        <div className="ccc-content">
                          <div className="ToolPanel">
                            <ToolPanel className="toolbar-item" />
                          </div>
                          <div className="show-Canvas">
                            <Canvas
                              id={id}
                              CanvasSize={size}
                              imgSrc={imgSrc}
                              background={background}
                              onClick={onClick}
                              CanvasWidth={width}
                              CanvasHeight={height}
                              fillColor={fillColor}
                              toolType={toolType}
                              fontStyle={fontStyle}
                              shapeType={shapeType}
                              shapeOutlineType={shapeOutlineType}
                              mainColor={mainColor}
                              subColor={subColor}
                              lineSize={lineSize}
                              lineWidthType={lineWidthType}
                              setColor={setColor}
                            />
                          </div>
                          <div className="show-type">
                            <Right toolType={toolType} />
                          </div>
                        </div>
                      </div>
                    </TextContext.Provider>
                  </FillContext.Provider>
                </SizeContext.Provider>
              </ColorContext.Provider>
            </DispatcherContext.Provider>
          </LineWidthContext.Provider>
        </ShapeOutlineContext.Provider>
      </ShapeTypeContext.Provider>
    </ToolTypeContext.Provider>
  )
}

export default Paint
