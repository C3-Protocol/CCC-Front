import { CrowdDoneCoverAvailableWrapper } from './style'
import React, { memo, useRef, useEffect, useState } from 'react'
import { CrowdCreate, CanvasWidth } from '@/constants'
import PixelThumb from '@/components/canvas-pixel/pixel-thumb'
import { getValueDivide8, isCollapsed } from '@/utils/utils'
import WicpLogo from '@/assets/images/wicp-logo.png'
import { Avatar } from 'antd'

// 首页完成的众创画布
function CrowdDone(props) {
  const { canvasInfo, highestInfo, canvasPrinId, finishTime } = props
  const pixParent = useRef()
  const [scale, setScale] = useState(1)

  useEffect(() => {
    setScale((pixParent.current.clientWidth - 20) / CanvasWidth)
  }, [props.colCount, props.windowWidth])

  const handlerOnItemClick = () => {
    props.onItemClick && props.onItemClick()
  }

  return (
    <CrowdDoneCoverAvailableWrapper width={props.colCount > 1 ? '48%' : '96%'} onClick={handlerOnItemClick}>
      <div className="pixel-wrapper" ref={pixParent}>
        {canvasInfo.canisterId && (
          <PixelThumb scale={scale} prinId={canvasPrinId} type={CrowdCreate} canvasInfo={canvasInfo} />
        )}
      </div>
      <div className="info-right">
        <div className="canvas-index">
          <span>{`#M-${canvasInfo.tokenIndex}`}</span>
        </div>
        <ul>
          <li>
            <label>CID:</label>
            {isCollapsed() && props.colCount > 1 ? `${canvasPrinId.slice(0, 12)}...` : canvasPrinId}
          </li>
          {!isCollapsed() && (
            <li>
              <label>Total invested:</label>
              {`${getValueDivide8(canvasInfo.totalWorth)} WICP`}
            </li>
          )}
          {!isCollapsed() && (
            <li>
              <label>Bonus to vest:</label>
              {`${getValueDivide8(canvasInfo.bonus)} WICP`}
            </li>
          )}
          {!isCollapsed() && (
            <li>
              <label>Number of Updated Pixels:</label>
              {`${canvasInfo.changeTotal}`}
            </li>
          )}
          <li>
            <label>Number of Players:</label>
            {`${canvasInfo.paintersNum}`}
          </li>
          {!isCollapsed() && (
            <li>
              <label>MVP (Most Valuable Pixel):</label>
              {` ${getValueDivide8(highestInfo.length ? highestInfo[0][1].curPrice : 0)} WICP, Coordinates:(${
                highestInfo.length ? highestInfo[0][0].x : 0
              },${highestInfo.length ? highestInfo[0][0].y : 0})`}
            </li>
          )}
        </ul>
        {isCollapsed() && <div className="invested">Total invested</div>}
        <div className="canvas-edit">
          <Avatar src={WicpLogo} size={isCollapsed() && 20} />
          <div className="price">{`${getValueDivide8(canvasInfo.totalWorth)}`}</div>
        </div>
      </div>
    </CrowdDoneCoverAvailableWrapper>
  )
}

export default memo(CrowdDone)
