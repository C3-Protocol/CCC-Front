import React, { memo, useEffect, useState } from 'react'
import { Button, message, Input } from 'antd'
import Toast from '@/components/toast'
import { requestCanister, transferIcp2WIcp } from '@/api/handler'
import { factoryBuyNow } from '@/api/nftHandler'
import { DialogBoxWrapper, ZombieBuyContentWrapper } from './style'
import { CloseDialog, WrapStateChange } from '@/message'
import PubSub from 'pubsub-js'
import icpLogo from '@/assets/images/dfinity.png'
import Close from '@/assets/images/close.svg'
import { ZombieNFTCreate, TurtlesCreate } from '@/constants'
import WICPPrice from '@/components/wicp-price'
import { isAuthTokenEffect, getValueDivide8, getIndexPrefix } from '@/utils/utils'
import Owner from '@/pages/marketPlace/cpns/owner'
import { requestICPBalance, requestWICPBalance } from '@/components/auth/store/actions'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import BigNumber from 'bignumber.js'
import { find } from 'lodash-es'
import Dialog from '@/components/dialog'
import WrappProcess from '@/components/auth/cpns/side-wallet/wrap-process'

function BuyContent(props) {
  const [showRechage, setShowRecharge] = useState(false)
  const { tokenIndex, prinId, type, imgUrl, listingInfo } = props
  const dispatch = useDispatch()

  const isZombie = () => {
    return type === ZombieNFTCreate
  }

  const { isAuth, authToken, curWicp, curIcp, collectionsConfig } = useSelector((state) => {
    let isAuth = state.auth.getIn(['isAuth']) || false
    let authToken = state.auth.getIn(['authToken']) || ''
    let key1 = `canvasInfo-${type}-${prinId}`
    let canvasInfo = (state.allcavans && state.allcavans.getIn([key1])) || {}
    let wicp = (state.auth && state.auth.getIn(['wicpBalance'])) || 0
    let icp = (state.auth && state.auth.getIn(['icpBalance'])) || 0
    let key2 = `nftInfo-${type}-${tokenIndex}`
    return {
      canvasInfo: canvasInfo,
      isAuth: isAuth,
      authToken: authToken,
      curWicp: wicp,
      curIcp: icp,
      collectionsConfig: state.auth.getIn(['collection']) || []
    }
  }, shallowEqual)
  const item = find(collectionsConfig, { key: type })

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
    let limit = curWicp < listingInfo.price
    if (limit) {
      message.error('Insufficient balance')
      return
    }
    PubSub.publish(CloseDialog, {})
    let notice = Toast.loading('buy', 0)
    let data = {
      tokenIndex: BigInt(tokenIndex),
      type: type,
      price: listingInfo.price,
      success: (res) => {
        console.debug('marketplace handlerListing res:', res)
        if (res) {
          message.success('You have got it')
          props.onBuyUpdate && props.onBuyUpdate()
        }
      },
      fail: (error, key) => {
        console.error('marketplace handlerListing fail:', error)
        message.error(error)
        props.onBuyUpdate && props.onBuyUpdate()
      },
      notice: notice
    }
    await requestCanister(factoryBuyNow, data)
  }

  return (
    <DialogBoxWrapper>
      <ZombieBuyContentWrapper>
        <div className="content">
          {imgUrl && type === TurtlesCreate && <embed className="nftImage adjustment" src={imgUrl} />}
          {imgUrl && type !== TurtlesCreate && (
            <img className={`nftImage ${isZombie() ? '' : 'adjustment'}`} src={imgUrl} />
          )}
          <div className="nft-info">
            <div className="title">
              <span>{item ? `${item.title}#${tokenIndex}` : getIndexPrefix(type, tokenIndex)}</span>
            </div>
            <div className="owner">
              <Owner prinId={listingInfo.seller.toText() || ''} />
            </div>
            <div className="tip">Total</div>
            <WICPPrice iconSize={20} value={listingInfo.price} valueStyle={'value-20'} />
            <div className="tip"> Balance</div>
            <WICPPrice
              iconSize={20}
              value={curWicp}
              valueStyle={curWicp < listingInfo.price ? 'value-red-20' : 'value-20'}
            />
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
              <Button type="violet" className="btn-small" disabled={curWicp < listingInfo.price} onClick={handlerBuy}>
                Payment
              </Button>
            </div>
          </div>
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
                id="icp-input"
                style={{ width: 'calc(100% - 100px)' }}
                placeholder="amount"
                className="ant-input-violet input-angle"
                prefix={<img src={icpLogo} style={{ height: '18px' }} />}
              />
              <Button
                type="violet-angle"
                onClick={() => {
                  let input = document.getElementById('icp-input')
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
      </ZombieBuyContentWrapper>
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
