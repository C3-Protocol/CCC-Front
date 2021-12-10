import { NFTMarketCoverWrapper } from './style'
import React, { memo, useRef, useEffect, useState } from 'react'
import { AloneCreate, CanvasWidth } from '@/constants'
import PixelThumb from '@/components/canvas-pixel/pixel-thumb'
import { getValueDivide8 } from '@/utils/utils'
import WicpLogo from '@/assets/images/wicp-logo.png'
import { Avatar } from 'antd'

// 钱包中的nft
function WalletNFT(props) {
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
  }, [props.colCount, props.windowWidth])

  return (
    <NFTMarketCoverWrapper width={props.colCount > 1 ? '48%' : '98%'} onClick={handlerOnItemClick}>
      <div className="pixel-wrapper" ref={pixParent}>
        {canvasInfo.canisterId && (
          <PixelThumb scale={scale} prinId={canvasPrinId} type={props.type} canvasInfo={canvasInfo} />
        )}
      </div>
      <div className="detail">
        <div className="nft-index">{`${isAlone() ? '#A-' : '#M-'}${canvasInfo.tokenIndex}`}</div>
        <div className="canvas-worth">{`${canvasInfo.name}`}</div>
      </div>
      <div className="canvas-price">
        <Avatar src={WicpLogo} size={20} />
        <div className="price">{`${getValueDivide8(listingInfo.price)}`}</div>
      </div>
    </NFTMarketCoverWrapper>
  )
}

export default memo(WalletNFT)
