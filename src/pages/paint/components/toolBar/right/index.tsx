import React, { useEffect } from 'react'
import './index.less'
import { ToolType } from '../../../util/toolType'
import { FC } from 'react'
import ShowPen from './pen'
import ShowShape from './shape'
import FormatColor from './formatColor'
import Text from './text'
import { useMemo } from 'react'
import { useState } from 'react'
interface ToolbarProps {
  toolType: ToolType
}

const ToolRightBar: FC<ToolbarProps> = (props) => {
  const { toolType } = props

  const renderChild = (): any => {
    let content = null
    switch (toolType) {
      case ToolType.PEN:
        content = <ShowPen />
        break
      case ToolType.SHAPE:
        content = <ShowShape />
        break
      case ToolType.ERASER:
        // setTool(new Eraser());
        break
      case ToolType.TEXT:
        content = <Text />
        break
      case ToolType.COLOR_FILL:
        content = <FormatColor />
        break
      default:
        break
    }
    return content
  }

  return <div className="ccc-showTool">{renderChild()}</div>
}

export default React.memo(ToolRightBar, (preProps: ToolbarProps, nextProps: ToolbarProps) => {
  return nextProps.toolType === ToolType.ERASER
})
