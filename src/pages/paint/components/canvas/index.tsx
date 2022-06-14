import React from 'react'
import './index.less'
import { useEffect } from 'react'
import { useRef } from 'react'
import { LineWidthType, ShapeOutlineType, ShapeToolType, ToolType } from '../../util/toolType'
import { FC } from 'react'
import { useState } from 'react'
import TextBox from './TextBox'
import { Pen, Tool, Eraser, ColorExtract, ColorFill, Text } from '../../util/tool'
import Shape from '../../util/tool/shape'
import { useContext } from 'react'
import { DispatcherContext } from '../../context'
import { CLEAR_EVENT, REDO_EVENT, UNDO_EVENT } from '../../util/dispatcher/event'
import SnapShot from '../../util/snapshot'
import Snapshot from '../../util/snapshot'

interface CanvasProps {
  toolType: ToolType
  shapeType: ShapeToolType
  shapeOutlineType: ShapeOutlineType
  lineWidthType: LineWidthType
  mainColor: string
  subColor: string
  lineSize?: number
  fillColor: string
  fontStyle: any
  imgSrc?: string
  CanvasSize: any
  id: string
  CanvasWidth?: number
  background?: string
  CanvasHeight?: number
  onClick?: (type: any) => void
  setColor: (value: string) => void
}

const Canvas: FC<CanvasProps> = (props) => {
  const {
    id,
    toolType,
    lineWidthType,
    mainColor,
    subColor,
    setColor,
    CanvasSize,
    fillColor,
    shapeType,
    shapeOutlineType,
    fontStyle,
    imgSrc,
    CanvasHeight,
    onClick,
    background,
    CanvasWidth,
    lineSize = 1
  } = props
  const [tool, setTool] = useState<Tool>()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dispatcherContext = useContext(DispatcherContext)
  const [snapshot] = useState<SnapShot>(new Snapshot())

  useEffect(() => {
    switch (toolType) {
      case ToolType.PEN:
        setTool(new Pen())
        break
      case ToolType.ERASER:
        setTool(new Eraser())
        break
      case ToolType.COLOR_EXTRACT:
        setTool(new ColorExtract(setColor))
        break
      case ToolType.COLOR_FILL:
        setTool(new ColorFill())
        break
      case ToolType.TEXT:
        //setTool(new Text(fontStyle))
        break
      case ToolType.SHAPE:
        setTool(new Shape(shapeType, shapeOutlineType === ShapeOutlineType.DOTTED))
        break
      default:
        break
    }
  }, [toolType, shapeType, fontStyle])

  useEffect(() => {
    if (tool instanceof Shape) {
      tool.isDashed = shapeOutlineType === ShapeOutlineType.DOTTED
    }
  }, [shapeOutlineType])

  useEffect(() => {
    switch (lineWidthType) {
      case LineWidthType.THIN:
        Tool.lineWidthFactor = 1
        break
      case LineWidthType.MIDDLE:
        Tool.lineWidthFactor = 2
        break
      case LineWidthType.BOLD:
        Tool.lineWidthFactor = 3
        break
      case LineWidthType.MAXBOLD:
        Tool.lineWidthFactor = 4
        break
      case LineWidthType.LINESIZE:
        Tool.lineWidthFactor = lineSize
        break
      default:
        break
    }
  }, [lineWidthType, lineSize])

  useEffect(() => {
    Tool.mainColor = mainColor
  }, [mainColor])

  useEffect(() => {
    Tool.fillColor = fillColor
  }, [fillColor])

  useEffect(() => {
    Tool.subColor = subColor
  }, [subColor])

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      canvas.height = height
      canvas.width = width
      Tool.ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      const ctx = canvas.getContext('2d')

      if (ctx) {
        if (imgSrc) {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.src = imgSrc
          img.onload = function () {
            const { width, height } = img
            /*1.在canvas 中绘制图像*/
            ctx.drawImage(img, 0, 0)
            /*2.从canvas 中获取图像的ImageData*/
            const imgData = ctx.getImageData(0, 0, width, height)
            /*3.在canvas 中显示ImageData*/
            ctx.putImageData(
              imgData,
              //位置
              0,
              height
            )
          }
        } else {
          ctx.fillStyle = background || 'white'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
        if (ctx.getImageData) snapshot.add(ctx.getImageData(0, 0, width, height))
      }

      // 注册清空画布事件
      const dispatcher = dispatcherContext.dispatcher
      const callback = () => {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
      }
      dispatcher.on(CLEAR_EVENT, callback)

      // 注册画布前进事件
      const forward = () => {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const imageData = snapshot.forward()
          if (imageData) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.putImageData(imageData, 0, 0)
          }
        }
      }
      dispatcher.on(REDO_EVENT, forward)

      // 注册画布后退事件
      const back = () => {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          const imageData = snapshot.back()
          if (imageData) {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            ctx.putImageData(imageData, 0, 0)
          }
        }
      }
      dispatcher.on(UNDO_EVENT, back)

      const changeSize = () => {
        const canvasData = Tool.ctx.getImageData(0, 0, canvas.width, canvas.height)
        console.log('---4', CanvasSize)
        canvasPain(Tool.ctx, width, height, canvasData)
        // canvas.height = canvas.clientHeight;
        // canvas.width = canvas.clientWidth;
        // // Tool.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        // Tool.ctx.fillStyle = "white";
        // Tool.ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Tool.ctx.putImageData(canvasData, 0, 0);
      }
      window.addEventListener('resize', changeSize)

      return () => {
        dispatcher.off(CLEAR_EVENT, callback)
      }
    }
  }, [canvasRef])

  useEffect(() => {
    const canvas = canvasRef.current
    console.log('=====3', CanvasSize)
    if (canvas) {
      const canvasData = Tool.ctx.getImageData(0, 0, canvas.width, canvas.height)
      const height = CanvasSize.height || canvas.clientHeight
      const width = CanvasSize.width || canvas.clientWidth
      canvas.height = height
      canvas.width = width
      canvasPain(Tool.ctx, width, height, canvasData)
    }
  }, [CanvasSize])

  // 注册画布size事件
  const canvasPain = (ctx: any, width: number, height: number, canvasData: any) => {
    if (ctx) {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, width, height)
      if (canvasData) {
        Tool.ctx.putImageData(canvasData, 0, 0)
      } else {
        snapshot.add(ctx.getImageData(0, 0, width, height))
      }
    }
  }

  const onMouseDown = (event: MouseEvent) => {
    if (tool) {
      tool.onMouseDown(event)
    }
  }

  const onMouseMove = (event: MouseEvent) => {
    if (tool) {
      tool.onMouseMove(event)
    }
  }

  const onMouseUp = (event: MouseEvent) => {
    if (tool) {
      tool.onMouseUp(event)

      // 存储canvas剪影
      snapshot.add(Tool.ctx.getImageData(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height))
    }
  }

  const onTouchStart = (event: TouchEvent) => {
    if (tool) {
      tool.onTouchStart(event)
    }
  }

  const onTouchMove = (event: TouchEvent) => {
    if (tool) {
      tool.onTouchMove(event)
    }
  }

  const onTouchEnd = (event: TouchEvent) => {
    if (tool) {
      tool.onTouchEnd(event)
    }

    // 存储canvas剪影
    snapshot.add(Tool.ctx.getImageData(0, 0, Tool.ctx.canvas.width, Tool.ctx.canvas.height))
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      canvas.addEventListener('mousedown', onMouseDown)
      canvas.addEventListener('mousemove', onMouseMove)
      canvas.addEventListener('mouseup', onMouseUp)

      canvas.addEventListener('touchstart', onTouchStart)
      canvas.addEventListener('touchmove', onTouchMove)
      canvas.addEventListener('touchend', onTouchEnd)

      return () => {
        canvas.removeEventListener('mousedown', onMouseDown)
        canvas.removeEventListener('mousemove', onMouseMove)
        canvas.removeEventListener('mouseup', onMouseUp)

        canvas.removeEventListener('touchstart', onTouchStart)
        canvas.removeEventListener('touchmove', onTouchMove)
        canvas.removeEventListener('touchend', onTouchEnd)
      }
    }
  }, [canvasRef, onMouseDown, onMouseMove, onMouseUp])

  console.log('====3', CanvasWidth, CanvasHeight)
  return (
    <>
      <canvas
        id={`ccc-paint-canvas ${id}`}
        className="canvas"
        ref={canvasRef}
        width={CanvasWidth || '100%'}
        height={CanvasHeight || '100%'}
        style={{ background: background || '#fff' }}
      ></canvas>
      <TextBox />
    </>
  )
}

export default Canvas
