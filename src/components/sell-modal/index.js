import React, { memo, useState, useEffect } from 'react'
import { Input, message } from 'antd'
import ConfirmModal from '@/components/confirm-modal'
import { requestCanister } from '@/api/handler'
import { addFactoryList, updateFactoryList, getMarketFeeRatio } from '@/api/nftHandler'
import Toast from '@/components/toast'
import { ListingUpdate, UpdateNFTHistory } from '@/message'
import PubSub from 'pubsub-js'
import { bignumberToBigInt, is1155Canvas } from '@/utils/utils'
import BigNumber from 'bignumber.js'
import { shallowEqual, useSelector } from 'react-redux'

export default memo(function SellModal(props) {
  const [sellPrice, setsellPrice] = useState(null)
  const [sellAmount, setsellAmount] = useState(null)

  const listVisible = props.listVisible
  const tokenIndex = props.index
  const type = props.type
  const royaltyFee = props.royaltyFee
  const forkFee = props.forkFee

  const { listingInfo } = useSelector((state) => {
    let key3 = `nftInfo-${props.type}-${tokenIndex}`
    let listingInfo = (state.allcavans && state.allcavans.getIn([key3])) || {}
    return {
      listingInfo
    }
  }, shallowEqual)

  const handlerClose = () => {
    setsellPrice(null)
    setsellAmount(null)
    props.setListVisible(false)
  }

  const handlerListing = () => {
    if (sellPrice < 0.0001) {
      message.error('Selling price > 0.0001 WICP is required')
      return
    }
    if (is1155Canvas(type) && sellAmount <= 0) {
      message.error('Quantity must > 0')
      return
    }

    let msg = listingInfo && listingInfo.seller ? 'update' : 'listing'
    let func = listingInfo && listingInfo.seller ? updateFactoryList : addFactoryList
    let notice = Toast.loading(msg, 0)
    let data = {
      tokenIndex: BigInt(tokenIndex),
      price: bignumberToBigInt(new BigNumber(sellPrice).multipliedBy(Math.pow(10, 8))),
      quantity: sellAmount,
      type: type,
      success: (res) => {
        if (res) {
          message.info('success')
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
    setsellPrice(e.target.value)
  }

  const handleSetSellAmount = (e) => {
    let value = parseInt(e.target.value)
    if (value > props.available) {
      value = props.available
    }
    setsellAmount(value)
  }

  return (
    <ConfirmModal
      title={listingInfo && listingInfo.seller ? 'Update' : 'Sell'}
      width={428}
      onModalClose={handlerClose}
      onModalConfirm={() => handlerListing(true, type, tokenIndex, sellPrice)}
      modalVisible={listVisible}
    >
      <Input
        type="number"
        placeholder="price"
        className="ant-input-black input-radius4"
        value={sellPrice}
        onChange={(e) => handleSetSellPrice(e)}
      />

      {is1155Canvas(type) && (
        <Input
          type="number"
          style={{ marginTop: '20px' }}
          placeholder="quantity"
          className="ant-input-black input-radius4"
          value={sellAmount}
          onChange={(e) => handleSetSellAmount(e)}
        />
      )}
      <div className="value value-666 " style={{ marginTop: '18px' }}>
        {`Commision fee ${getMarketFeeRatio(type)}% ${royaltyFee > 0 ? ', royalty fee ' + royaltyFee + '%' : ''} ${
          forkFee > 0 ? ', fork fee ' + forkFee + '%' : ''
        }`}
      </div>
    </ConfirmModal>
  )
})
