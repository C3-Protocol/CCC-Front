import { NFTCoverWrapper, WalletNFTDetailWrapper, MarketNFTDetailWrapper, MultiCanvasDoneWrapper } from './style'
import React, { memo, useRef, useEffect, useState } from 'react'
import { getCanvasWidth } from '@/constants'
import PixelThumb from '@/components/pixel-thumb'
import { Button, Skeleton, Tooltip } from 'antd'
import WICPPrice from '@/components/wicp-price'
import { getIndexPrefix, is1155Canvas } from '@/utils/utils'
import { useSelector, shallowEqual } from 'react-redux'
import { NFTTransfer } from '@/icons'

function CanvasNFT(props) {
  const { canvasInfo, type, canvasPrinId, listingInfo, thumbType, m1155Info, m1155List } = props

  const { authToken } = useSelector((state) => {
    return {
      authToken: state.auth.getIn(['authToken']) || ''
    }
  }, shallowEqual)
  const isSelf = authToken === props.user

  const pixParent = useRef()
  const [scale, setScale] = useState(1)

  const handlerOnButtonClick = (e, type) => {
    e.stopPropagation()
    props.onButtonClick && props.onButtonClick(type)
  }

  const handlerOnTransferClick = (e) => {
    e.stopPropagation()
    props.onButton1Click && props.onButton1Click()
  }

  const handlerOnItemClick = () => {
    props.onItemClick && props.onItemClick()
  }

  useEffect(() => {
    setScale(pixParent.current.clientWidth / getCanvasWidth(type))
  }, [props.windowWidth])

  const is1155 = is1155Canvas(type)

  return (
    <NFTCoverWrapper width={props.colCount > 1 ? '50%' : '100%'} onClick={handlerOnItemClick}>
      <div className="pixel-content">
        <div className="pixel-wrapper" ref={pixParent}>
          <PixelThumb scale={scale} prinId={canvasPrinId} type={props.type} canvasInfo={canvasInfo} />
        </div>
        {thumbType === 'wallet-nft' &&
          !(listingInfo && listingInfo.seller) &&
          isSelf &&
          (!is1155 || (m1155Info && m1155Info.available)) && (
            <Tooltip placement="top" title={'Transfer'}>
              <div className="transfer hover-violet" onClick={handlerOnTransferClick}>
                {NFTTransfer}
              </div>
            </Tooltip>
          )}
      </div>

      {canvasInfo.tokenIndex === undefined && (
        <WalletNFTDetailWrapper>
          <Skeleton.Input style={{ width: '100%' }} active={true} size={'small'} />
          <Skeleton.Input style={{ width: '100%', marginTop: '5px' }} active={true} size={'small'} />
        </WalletNFTDetailWrapper>
      )}

      {thumbType === 'wallet-nft' && canvasInfo.tokenIndex !== undefined && (
        <WalletNFTDetailWrapper>
          <div className="info-content">
            <div className="nft-index">{`${getIndexPrefix(type, canvasInfo.tokenIndex)}`}</div>
          </div>
          {is1155 && isSelf && (
            <div>
              <div className="right-info">{`You own: ${
                (m1155Info.available ? parseInt(m1155Info.available) : 0) +
                (m1155Info.freezen ? parseInt(m1155Info.freezen) : 0)
              }`}</div>
              <div className="right-info">{`Pending: ${m1155Info.freezen || 0}`}</div>
            </div>
          )}
          {listingInfo && listingInfo.seller && (
            <div className="info-content">
              <div />
              <div className="canvas-price">
                <WICPPrice iconSize={20} value={listingInfo?.price} valueStyle={'value-20'} ellipsis={18} />
              </div>
            </div>
          )}

          <div className="operation">
            {!is1155 && isSelf ? (
              <div className="flex-20">
                <Button
                  className="btn-mini-fixed"
                  type={listingInfo && listingInfo.seller ? 'white-gray ' : 'violet'}
                  onClick={(e) => handlerOnButtonClick(e, 'change')}
                >
                  {listingInfo && listingInfo.seller ? 'Cancel' : 'Sell'}
                </Button>
                {listingInfo && listingInfo.seller && (
                  <Button className="btn-mini-fixed" type="violet" onClick={(e) => handlerOnButtonClick(e, 'update')}>
                    Update
                  </Button>
                )}
              </div>
            ) : (
              listingInfo &&
              listingInfo.seller && (
                <Button className="btn-mini-fixed" type="violet" onClick={handlerOnButtonClick}>
                  Buy
                </Button>
              )
            )}
          </div>
        </WalletNFTDetailWrapper>
      )}

      {thumbType === 'market-nft' && canvasInfo.tokenIndex !== undefined && (
        <MarketNFTDetailWrapper>
          <div className="detail">
            <div className="nft-index">{`${getIndexPrefix(type, canvasInfo.tokenIndex)}`}</div>
            <div className="nft-index">{`${canvasInfo.name}`}</div>
          </div>

          {!is1155 && (
            <div className="canvas-price">
              <WICPPrice iconSize={20} value={listingInfo.price} valueStyle={'value-20'} />
            </div>
          )}
          {is1155 && (
            <div className="canvas-price">
              <WICPPrice iconSize={20} value={m1155List} valueStyle={'value-20'} />
            </div>
          )}
        </MarketNFTDetailWrapper>
      )}

      {thumbType === 'drew' && canvasInfo.tokenIndex !== undefined && (
        <MultiCanvasDoneWrapper>
          <div className="canvas-index">
            <span>{`${getIndexPrefix(type, canvasInfo.tokenIndex)}`}</span>
          </div>

          <div className="invested">Total invested</div>
          <div className="canvas-edit">
            <WICPPrice iconSize={20} value={canvasInfo.totalWorth} valueStyle={'value-20'} />
          </div>
        </MultiCanvasDoneWrapper>
      )}
    </NFTCoverWrapper>
  )
}

export default memo(CanvasNFT)
