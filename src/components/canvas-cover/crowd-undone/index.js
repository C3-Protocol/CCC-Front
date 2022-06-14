import { CrowdUndoneCoverAvailableWrapper, CrowdUndoneContentAvailableWrapper } from './style'
import React, { memo, useRef, useEffect, useState } from 'react'
import { CrowdCreate, getCanvasWidth, M1155Create, ThemeCreate, Theme1155Create, AloneCreate } from '@/constants'
import PixelThumb from '@/components/pixel-thumb'
import { getValueDivide8, isCollapsed, getIndexPrefix } from '@/utils/utils'
import CountDown from '@/components/count-down'
import PubSub from 'pubsub-js'
import BigNumber from 'bignumber.js'
import { RefreshCrowdUndone } from '@/message'
import WICPPrice from '@/components/wicp-price'
import { Skeleton } from 'antd'

// 首页未完成的众创画布
function CrowdUndone(props) {
  const { type, canvasInfo, highestInfo, canvasPrinId } = props
  const pixParent = useRef()
  const [scale, setScale] = useState(1)
  const handlerOnItemClick = () => {
    props.onItemClick && props.onItemClick()
  }

  useEffect(() => {
    setScale(pixParent.current.clientWidth / getCanvasWidth(type))
  }, [props.windowWidth])

  const getEndTime = () => {
    let endTime = parseInt(new BigNumber(parseInt(canvasInfo.finshTime || 0)).dividedBy(Math.pow(10, 6)))
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

  const getTitle = () => {
    let title
    if (type === CrowdCreate) title = 'Crowd canvas'
    if (type === ThemeCreate || type === Theme1155Create) title = 'Themed canvas'
    if (type === M1155Create) title = '1155 canvas'
    if (type === AloneCreate) title = 'Personal canvas'
    return title
  }

  return (
    <CrowdUndoneCoverAvailableWrapper>
      <div className="title1">{getTitle()}</div>
      <CrowdUndoneContentAvailableWrapper onClick={handlerOnItemClick}>
        <div className="pixel-wrapper" ref={pixParent}>
          <PixelThumb scale={scale} prinId={canvasPrinId} type={CrowdCreate} canvasInfo={canvasInfo} canvas={true} />
        </div>

        {canvasInfo.tokenIndex === undefined ? (
          <div className="info-right">
            <Skeleton active={true} />
            {!isCollapsed() && <Skeleton.Input style={{ marginTop: '10px' }} active={true} size="small" />}
            {!isCollapsed() && <Skeleton.Input style={{ marginTop: '10px' }} active={true} size="small" />}
          </div>
        ) : (
          <div className="info-right">
            <div className="canvas-index">
              <span>{`${getIndexPrefix(type, canvasInfo.tokenIndex)}`}</span>
              <span>
                <CountDown endTime={getEndTime()} endTimeFun={endTimeFun} />
              </span>
            </div>
            <ul>
              <h4>
                <label>CID:</label>
                {canvasPrinId}
              </h4>
              {!isCollapsed() && (
                <h4>
                  <label>Total invested:</label>
                  {`${getValueDivide8(canvasInfo.totalWorth)} WICP`}
                </h4>
              )}
              {!isCollapsed() && type !== ThemeCreate && (
                <h4>
                  <label>Bonus to vest:</label>
                  {`${getValueDivide8(canvasInfo.bonus)} WICP`}
                </h4>
              )}
              {!isCollapsed() && (
                <h4>
                  <label>Number of Updated Pixels:</label>
                  {`${canvasInfo.changeTotal}`}
                </h4>
              )}
              <h4>
                <label>Number of Players:</label>
                {`${canvasInfo.paintersNum}`}
              </h4>
              {!isCollapsed() && (
                <h4>
                  <label>MVP (Most Valuable Pixel):</label>
                  {` ${getValueDivide8(highestInfo.length ? highestInfo[0][1].curPrice : 0)} WICP, Coordinates:(${
                    highestInfo.length ? highestInfo[0][0].x : 0
                  },${highestInfo.length ? highestInfo[0][0].y : 0})`}
                </h4>
              )}
            </ul>
            <div>
              <WICPPrice iconSize={30} value={canvasInfo.totalWorth} valueStyle={'value-30'} />
            </div>
          </div>
        )}
      </CrowdUndoneContentAvailableWrapper>
    </CrowdUndoneCoverAvailableWrapper>
  )
}

export default memo(CrowdUndone)
