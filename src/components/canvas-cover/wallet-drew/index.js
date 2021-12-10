import { WalletDrewCoverWrapper } from './style'
import React, { memo, useRef, useEffect, useState } from 'react'
import { AloneCreate, CanvasWidth } from '@/constants'
import PixelThumb from '@/components/canvas-pixel/pixel-thumb'
import { getValueDivide8 } from '@/utils/utils'
import { Button } from 'antd'

// 市场中的drew
function WalletDrew(props) {
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
    <WalletDrewCoverWrapper onClick={handlerOnItemClick}>
      <div className="pixel-wrapper" ref={pixParent}>
        {canvasInfo.canisterId && (
          <PixelThumb scale={scale} prinId={canvasPrinId} type={props.type} canvasInfo={canvasInfo} canvas={true} />
        )}
      </div>
      <div className="footer-wrapper">
        <div className="text">
          <div className="name">{`${isAlone() ? '#A-' : '#M-'}${canvasInfo.tokenIndex}`}</div>
          <div className="worth">
            Total invested:<span>{`${getValueDivide8(canvasInfo.totalWorth)} WICP`}</span>
          </div>
        </div>

        <div className="btn">
          <Button className="nft-buy" type="violet" disabled={canvasInfo.isNFTOver}>
            Go on
          </Button>
        </div>
      </div>
    </WalletDrewCoverWrapper>
  )
}

export default memo(WalletDrew)
