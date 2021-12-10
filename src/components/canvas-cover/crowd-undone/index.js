import { CrowdUndoneCoverAvailableWrapper } from './style'
import React, { memo, useRef, useEffect, useState } from 'react'
import { CrowdCreate, CanvasWidth } from '@/constants'
import Edit from '@/assets/images/icons/edit.svg'
import PixelThumb from '@/components/canvas-pixel/pixel-thumb'
import { getValueDivide8, isCollapsed } from '@/utils/utils'
import CountDown from '@/components/count-down'
import PubSub from 'pubsub-js'
import BigNumber from 'bignumber.js'
import { RefreshCrowdUndone } from '@/message'
import WicpLogo from '@/assets/images/wicp-logo.png'
import { Avatar } from 'antd'

// 首页未完成的众创画布
function CrowdUndone(props) {
  const { canvasInfo, highestInfo, canvasPrinId, finishTime } = props
  const pixParent = useRef()
  const [scale, setScale] = useState(1)
  const handlerOnItemClick = () => {
    props.onItemClick && props.onItemClick()
  }

  useEffect(() => {
    setScale((pixParent.current.clientWidth - 20) / CanvasWidth)
  }, [props.windowWidth])

  const getEndTime = () => {
    let endTime = parseInt(new BigNumber(parseInt(finishTime || 0)).dividedBy(Math.pow(10, 6)))
    return endTime
  }

  const sliceToolongPrice = (str, length) => {
    if (str && str.length && str.length > length) {
      return str.slice(0, length)
    }
    return str
  }

  const endTimeFun = () => {
    //通知主页刷新
    PubSub.publish(RefreshCrowdUndone, {})
  }

  return (
    <CrowdUndoneCoverAvailableWrapper onClick={handlerOnItemClick}>
      <div className="pixel-wrapper" ref={pixParent}>
        {canvasInfo.canisterId && (
          <PixelThumb scale={scale} prinId={canvasPrinId} type={CrowdCreate} canvasInfo={canvasInfo} canvas={true} />
        )}
      </div>
      <div className="info-right">
        <div className="canvas-index">
          <span>{`#M-${canvasInfo.tokenIndex}`}</span>
          <span>
            <CountDown endTime={getEndTime()} endTimeFun={endTimeFun} />
          </span>
        </div>
        <ul>
          <li>
            <label>CID:</label>
            {canvasPrinId}
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
        <div className="canvas-edit">
          <div className="price">
            <Avatar src={WicpLogo} size={isCollapsed() && 20} />
            {`${sliceToolongPrice(getValueDivide8(canvasInfo.totalWorth) + '', 12)}`}
          </div>
          <div className="btn-edit">
            <img src={Edit} />
          </div>
        </div>
      </div>
    </CrowdUndoneCoverAvailableWrapper>
  )
}

export default memo(CrowdUndone)
