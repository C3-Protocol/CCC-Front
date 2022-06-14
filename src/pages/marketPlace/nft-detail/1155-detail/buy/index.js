import React, { memo, useEffect, useState } from 'react'
import { Button, message, Input } from 'antd'
import Toast from '@/components/toast'
import { requestCanister, transferIcp2WIcp } from '@/api/handler'
import { factoryBuyNow } from '@/api/nftHandler'
import { DialogBoxWrapper, M1155BuyContentWrapper } from './style'
import { CloseDialog, UpdateNFTHistory, ListingUpdate, WrapStateChange } from '@/message'
import PubSub from 'pubsub-js'
import icpLogo from '@/assets/images/dfinity.png'
import Close from '@/assets/images/close.svg'
import WICPPrice from '@/components/wicp-price'
import { isAuthTokenEffect, getIndexPrefix, multiBigNumber, getValueDivide8 } from '@/utils/utils'
import { getCanvasWidth } from '@/constants'
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons'
import * as ColorUtils from '@/utils/ColorUtils'
import Owner from '@/pages/marketPlace/cpns/owner'
import { requestICPBalance, requestWICPBalance } from '@/components/auth/store/actions'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'
import Dialog from '@/components/dialog'
import WrappProcess from '@/components/auth/cpns/side-wallet/wrap-process'

function BuyContent(props) {
  const dispatch = useDispatch()
  const [showRechage, setShowRecharge] = useState(false)
  const { pendingItem, tokenIndex, pixelInfo, type } = props
  const { unitPrice, quantity, seller, orderIndex } = pendingItem[1]
  const [buyCount, setBuyCount] = useState(parseInt(quantity))
  const CanvasWidth = getCanvasWidth(type)
  const backgroundColor = '#ffffff'

  const { isAuth, authToken, curWicp, curIcp } = useSelector((state) => {
    let isAuth = state.auth.getIn(['isAuth']) || false
    let authToken = state.auth.getIn(['authToken']) || ''
    let wicp = (state.auth && state.auth.getIn(['wicpBalance'])) || 0
    let icp = (state.auth && state.auth.getIn(['icpBalance'])) || 0
    return {
      isAuth: isAuth,
      authToken: authToken,
      curWicp: wicp,
      curIcp: icp
    }
  }, shallowEqual)

  useEffect(() => {
    if (isAuthTokenEffect(isAuth, authToken)) {
      dispatch(requestWICPBalance(authToken))
      dispatch(requestICPBalance(authToken))
    }
  }, [authToken])

  const handlerTransfer = async (transAmount) => {
    transAmount = parseFloat(transAmount)
    if (transAmount > new BigNumber(curIcp).dividedBy(Math.pow(10, 8))) {
      message.error('Insufficient ICP')
      return
    }
    if (transAmount <= 0.0001) {
      message.error('At least 0.0001 ICP is required in this transation')
      return
    }
    Dialog.createAndShowDialog(<WrappProcess />, 0)
    let data = {
      amount: parseFloat(transAmount),
      onChange: async (state) => {
        PubSub.publish(WrapStateChange, { state })
        if (state === 3) {
          message.success('successful')
          if (isAuth && authToken) {
            dispatch(requestWICPBalance(authToken))
            dispatch(requestICPBalance(authToken))
          }
        }
      }
    }
    requestCanister(transferIcp2WIcp, data)
  }

  const handlerBuy = async () => {
    let limit = curWicp < multiBigNumber(unitPrice, buyCount || 0)
    if (limit) {
      message.error('Insufficient balance')
      return
    }
    if (!buyCount) {
      message.error('At least buy one')
      return
    }
    PubSub.publish(CloseDialog, {})
    let notice = Toast.loading('buy', 0)
    let data = {
      tokenIndex: BigInt(tokenIndex),
      quantity: buyCount,
      unitPrice: unitPrice,
      orderIndex: orderIndex,
      type: type,
      success: (res) => {
        console.debug('marketplace handlerListing res:', res)
        if (res) {
          message.info('success')
          PubSub.publish(ListingUpdate, { type: type, tokenIndex: tokenIndex })
          PubSub.publish(UpdateNFTHistory, { type: type, tokenIndex: tokenIndex })
          props.onBuySuccess && props.onBuySuccess()
        }
      },
      fail: (error) => {
        console.error('marketplace handlerListing fail:', error)
        message.error(error)
      },
      notice: notice
    }
    await requestCanister(factoryBuyNow, data)
  }

  const initPixels = (r) => {
    if (r) {
      var context = r.getContext('2d')
      context.fillStyle = backgroundColor
      context.fillRect(0, 0, CanvasWidth, CanvasWidth)
      if (pixelInfo) {
        for (let piexl of pixelInfo) {
          let pos = piexl[0]
          let color = piexl[1].color || piexl[1] //兼容alone画布
          context.fillStyle = ColorUtils.getColorString(color)
          context.fillRect(parseInt(pos.x), parseInt(pos.y), 1, 1)
        }
      }
    }
  }

  const handleSetSellAmount = (e) => {
    if (e.target.value) {
      let value = parseInt(e.target.value || 0)
      if (value > quantity) {
        value = quantity
      }
      setBuyCount(value)
    } else {
      setBuyCount(null)
    }
  }

  return (
    <DialogBoxWrapper>
      <M1155BuyContentWrapper>
        <div className="title-000">Completed checkout</div>
        <div className="content">
          <canvas
            className="canvas-thumb"
            width={CanvasWidth}
            height={CanvasWidth}
            ref={(r) => {
              initPixels(r)
            }}
          ></canvas>
          <div className="zombie-info">
            <div className="title">
              <span>{`${getIndexPrefix(type, tokenIndex)}`}</span>
            </div>
            <div className="owner">
              <Owner prinId={seller.toText() || ''} />
            </div>
            <div className="tip">Amount</div>
            <div className="owner">
              <MinusCircleOutlined
                onClick={() => {
                  if (buyCount > 1 || !buyCount) setBuyCount(buyCount ? buyCount - 1 : 1)
                }}
              />
              <Input
                style={{ width: '200px' }}
                value={buyCount}
                className="ant-input-violet input-radius"
                onChange={(e) => handleSetSellAmount(e)}
              />

              <PlusCircleOutlined
                onClick={() => {
                  if (buyCount < quantity || !buyCount) setBuyCount(buyCount ? buyCount + 1 : 1)
                }}
              />
            </div>
            <div className="line"></div>
            <div className="tip">Unit price</div>
            <WICPPrice iconSize={20} value={unitPrice} valueStyle={'value-20'} />
            <div className="line"></div>
            <div className="owner">
              <div className="flex1">
                <div className="tip">Total</div>
                <WICPPrice iconSize={20} value={multiBigNumber(unitPrice, buyCount || 0)} valueStyle={'value-20'} />
              </div>
              <div className="flex1">
                <div className="tip"> Balance</div>
                <WICPPrice
                  iconSize={20}
                  value={curWicp}
                  valueStyle={curWicp < multiBigNumber(unitPrice, buyCount || 0) ? 'value-red-20' : 'value-20'}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="button-layout">
          <Button
            type={showRechage ? 'white-gray' : 'violet'}
            className="btn-small"
            onClick={() => {
              setShowRecharge(!showRechage)
            }}
          >
            Recharge
          </Button>
          <Button
            type="violet"
            className="btn-small"
            disabled={curWicp < multiBigNumber(unitPrice, buyCount || 0) || !buyCount}
            onClick={handlerBuy}
          >
            Payment
          </Button>
        </div>
        {showRechage && (
          <div className="charge">
            <div className="line"></div>
            <div className="tip">Total</div>
            <div className="icpValue">
              <img src={icpLogo} style={{ height: '18px' }} />
              {`  ${getValueDivide8(curIcp)}`}
            </div>
            <Input.Group compact>
              <Input
                id="1155-icp-input"
                style={{ width: 'calc(100% - 100px)' }}
                placeholder="amount"
                className="ant-input-violet input-angle"
                prefix={<img src={icpLogo} style={{ height: '18px' }} />}
              />
              <Button
                type="violet-angle"
                onClick={() => {
                  let input = document.getElementById('1155-icp-input')
                  if (input && input.value) {
                    handlerTransfer(input.value)
                  }
                }}
              >
                Confirm
              </Button>
            </Input.Group>
          </div>
        )}
      </M1155BuyContentWrapper>
      <img
        className="close"
        src={Close}
        onClick={() => {
          PubSub.publish(CloseDialog, {})
        }}
      ></img>
    </DialogBoxWrapper>
  )
}
export default memo(BuyContent)
