import { NFTCoverWrapper } from './style'
import React, { memo, useRef, useEffect, useState } from 'react'
import { AloneCreate, CanvasWidth } from '@/constants'
import PixelThumb from '@/components/canvas-pixel/pixel-thumb'
import { getValueDivide8 } from '@/utils/utils'
import { Button } from 'antd'
import send from '@/assets/images/wallet/send.png'

// 钱包中的nft
function WalletNFT(props) {
  const { canvasInfo, type, canvasPrinId, listingInfo } = props
  const isAlone = () => {
    return type === AloneCreate
  }
  const pixParent = useRef()
  const [scale, setScale] = useState(1)

  const handlerOnButtonClick = (e) => {
    e.stopPropagation()
    props.onButtonClick && props.onButtonClick()
  }

  const handlerOnTransferClick = (e) => {
    e.stopPropagation()
    props.onButton1Click && props.onButton1Click()
  }

  const handlerOnItemClick = () => {
    props.onItemClick && props.onItemClick()
  }

  useEffect(() => {
    setScale((pixParent.current.clientWidth - 20) / CanvasWidth)
  }, [props.windowWidth])

  return (
    <NFTCoverWrapper onClick={handlerOnItemClick}>
      <div className="pixel-content">
        <div className="pixel-wrapper" ref={pixParent}>
          {canvasInfo.canisterId && (
            <PixelThumb scale={scale} prinId={canvasPrinId} type={props.type} canvasInfo={canvasInfo} />
          )}
        </div>
        <img className="transfer" src={send} onClick={handlerOnTransferClick}></img>
      </div>

      <div className="detail">
        <div className="nfo_content">
          <div className="nft-index">{`Number:${isAlone() ? '#A-' : '#M-'}${canvasInfo.tokenIndex}`}</div>
          {listingInfo && listingInfo.seller && (
            <div className="nft-price">{`${getValueDivide8(listingInfo.price)} WICP`}</div>
          )}
        </div>
        <Button className="nft-manage" type="violet" onClick={handlerOnButtonClick}>
          {listingInfo && listingInfo.seller ? 'Cancel' : 'Sell'}
        </Button>
      </div>
    </NFTCoverWrapper>
  )
}

export default memo(WalletNFT)
