import { HomeNFTCoverWrapper } from './style'
import React, { memo, useRef, useEffect, useState } from 'react'
import { AloneCreate, CanvasWidth } from '@/constants'
import PixelThumb from '@/components/canvas-pixel/pixel-thumb'
import { getValueDivide8 } from '@/utils/utils'
import ButtonBuy from '@/assets/images/icons/home-buy.png'

// 首页挂在market的nft
function HomeNFT(props) {
  const { canvasInfo, type, canvasPrinId, listingInfo } = props
  const isAlone = () => {
    return type === AloneCreate
  }
  const pixParent = useRef()
  const [scale, setScale] = useState(1)

  const handlerOnItemClick = () => {
    props.onItemClick && props.onItemClick()
  }

  useEffect(() => {
    setScale((pixParent.current.clientWidth - 20) / CanvasWidth)
  }, [props.windowWidth])

  return (
    <HomeNFTCoverWrapper onClick={handlerOnItemClick}>
      <div className="info-right">
        <div className="canvas-index">
          <span>{`${isAlone() ? '#A-' : '#M-'}${canvasInfo.tokenIndex}`}</span>
          <span>{`${canvasInfo.name}`}</span>
        </div>
        <div className="canvas-edit">
          <div className="price">{`${getValueDivide8(listingInfo.price)} WICP`}</div>
          <img className="nft-buy" src={ButtonBuy}></img>
        </div>
      </div>
      <div className="pixel-bg">
        <div className="pixel-wrapper" ref={pixParent}>
          {canvasInfo.canisterId && (
            <PixelThumb scale={scale} prinId={canvasPrinId} type={props.type} canvasInfo={canvasInfo} />
          )}
        </div>
      </div>
    </HomeNFTCoverWrapper>
  )
}

export default memo(HomeNFT)
