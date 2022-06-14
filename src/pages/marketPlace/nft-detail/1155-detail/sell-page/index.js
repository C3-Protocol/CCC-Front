import React, { memo, useRef, useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { getCanvasWidth } from '@/constants'
import PixelThumb from '@/components/pixel-thumb'
import Toast from '@/components/toast'
import WICPPrice from '@/components/wicp-price'
import { Input, message, Button, Avatar } from 'antd'
import { requestCanister } from '@/api/handler'
import { addFactoryList, getMarketFeeRatio } from '@/api/nftHandler'
import { ListingUpdate, UpdateNFTHistory } from '@/message'
import PubSub from 'pubsub-js'
import { bignumberToBigInt, multiBigNumber, getValueMultiplied8, getIndexPrefix, is1155Canvas } from '@/utils/utils'
import BigNumber from 'bignumber.js'
import { LeftOutlined } from '@ant-design/icons'
import WicpLogo from '@/assets/images/wicp_logo.svg'
import {
  SellDetailWrapper,
  SellTopTitleWrapper,
  SellContentWrapper,
  PixelContent,
  SellDetailRight,
  SellDetailLeft
} from './style'

function SellPage(props) {
  // canvas index
  const tokenIndex = parseInt(props.index)
  const type = props.type
  const canvasPrinId = props.prinId
  const available = props.available || 1
  const pixParent = useRef()
  const CanvasWidth = getCanvasWidth(type)
  const [scale, setScale] = useState(1)

  const [sellPrice, setsellPrice] = useState(null)
  const [sellAmount, setsellAmount] = useState(null)

  const { canvasInfo, isAuth, authToken } = useSelector((state) => {
    let isAuth = state.auth.getIn(['isAuth']) || false
    let authToken = state.auth.getIn(['authToken']) || ''
    let key1 = `canvasInfo-${type}-${canvasPrinId}`
    let canvasInfo = (state.allcavans && state.allcavans.getIn([key1])) || {}

    return {
      canvasInfo: canvasInfo,
      isAuth: isAuth,
      authToken: authToken
    }
  }, shallowEqual)

  // other hooks
  useEffect(() => {
    //获取画布的相关信息：name、desc等
    if (document?.documentElement || document?.body) {
      document.documentElement.scrollTop = document.body.scrollTop = 0
    }
    //事件信息绑定
  }, [])

  const handlerClose = () => {
    setsellPrice(null)
    setsellAmount(null)
    props.setListVisible(false)
  }

  const handlerListing = () => {
    if (sellPrice < 0.00000001) {
      message.error('Selling price > 0.00000001 WICP is required')
      return
    }
    if (is1155Canvas(type) && sellAmount <= 0) {
      message.error('Quantity must > 0')
      return
    }

    let msg = 'listing'
    let func = addFactoryList
    let notice = Toast.loading(msg, 0)
    let data = {
      tokenIndex: BigInt(tokenIndex),
      price: bignumberToBigInt(new BigNumber(sellPrice).multipliedBy(Math.pow(10, 8))),
      quantity: sellAmount,
      type: type,
      success: (res) => {
        if (res) {
          handlerClose()
          PubSub.publish(ListingUpdate, { type: type, tokenIndex: tokenIndex })
          PubSub.publish(UpdateNFTHistory, { type: type, tokenIndex: tokenIndex })
        }
      },
      fail: (error) => {
        message.error(error)
      },
      notice: notice
    }
    if (is1155Canvas(type)) {
      data.quantity = sellAmount
    }
    requestCanister(func, data)
  }

  const handleSetSellPrice = (e) => {
    let index = String(e.target.value).indexOf('.')
    if (index !== -1) {
      let x = index + 1 //小数点的位置
      let count = String(e.target.value).length - x
      if (count > 8) {
        return
      }
    }
    if (e.target.value > 100000000) {
      return
    }
    if (e.target.value < 0) {
      setsellPrice(0)
      return
    }
    setsellPrice(e.target.value)
  }

  const handleSetSellAmount = (e) => {
    if (e.target.value) {
      let value = parseInt(e.target.value)
      if (value > available) {
        value = available
      }
      setsellAmount(value)
    } else {
      setsellAmount(null)
    }
  }

  const addListener = () => {
    window.addEventListener('resize', onWindowResize)
    onWindowResize()
  }
  const removeListener = () => {
    window.removeEventListener('resize', onWindowResize)
  }

  const onWindowResize = () => {
    pixParent && pixParent.current && setScale(pixParent.current.clientWidth / CanvasWidth)
  }

  useEffect(() => {
    addListener()
    setScale(pixParent.current.clientWidth / CanvasWidth)
    return () => {
      removeListener()
    }
  }, [])

  return (
    <SellDetailWrapper>
      <SellTopTitleWrapper>
        <div className="go-back">
          <LeftOutlined onClick={handlerClose} />
          <div className="title title-000">{`${getIndexPrefix(type, tokenIndex)}`}</div>
        </div>
      </SellTopTitleWrapper>
      <SellContentWrapper>
        <SellDetailLeft>
          <div className="headline headline-000">Sales confirmation</div>
          <div className="tip tip-000 margin-20">Sales volume</div>
          <Input
            type="number"
            placeholder="Amount"
            className="ant-input-white input-radius4 ant-input-fixed-height margin-10"
            value={sellAmount}
            onChange={(e) => handleSetSellAmount(e)}
          />
          <div className="value value-666 float-right margin-10">{`You own: ${available}`}</div>

          <div className="tip tip-000 margin-20">Unit price</div>
          <div className="margin-10 float-right">
            <Input
              type="number"
              placeholder="price"
              className="ant-input-white input-radius4 ant-input-fixed-height"
              value={sellPrice}
              onChange={(e) => handleSetSellPrice(e)}
            />
            <div className="white-bg">
              <Avatar src={WicpLogo} size={20} />
              <div className="value value-999">WICP</div>
            </div>
          </div>

          <div className="value value-666 float-right margin-10">
            <WICPPrice
              iconSize={20}
              value={multiBigNumber(getValueMultiplied8(sellPrice || 0), sellAmount || 0)}
            ></WICPPrice>
            {`Total: `}
          </div>

          <div className="line"></div>

          <div className="tip tip-000">Fee</div>
          <div className="value value-666 margin-5">{`Commision fee ${getMarketFeeRatio(type)}%`}</div>
          <Button type="violet margin-20" onClick={handlerListing} className="btn-small">
            Sell
          </Button>
        </SellDetailLeft>
        <SellDetailRight>
          <div className="tip tip-000">Preview</div>
          <PixelContent width={CanvasWidth} scale={scale}>
            <div className="canvas-pixel" ref={pixParent}>
              {canvasInfo.canisterId && (
                <PixelThumb scale={scale} prinId={canvasPrinId} type={type} canvasInfo={canvasInfo} />
              )}
            </div>
            <div className="info">
              <div className="headline headline-000">{`${getIndexPrefix(type, canvasInfo.tokenIndex)}`}</div>
              <div className="title title-666 float-right">
                <WICPPrice iconSize={20} value={getValueMultiplied8(sellPrice)} valueStyle={'value-20'} />
                Price:
              </div>
            </div>
          </PixelContent>
        </SellDetailRight>
      </SellContentWrapper>
    </SellDetailWrapper>
  )
}

export default memo(SellPage)
