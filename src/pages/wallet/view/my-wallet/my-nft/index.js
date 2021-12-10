import React, { memo, useState } from 'react'
import { NFTContentWrapper, NFTListWrapper } from './style'
import { Input, message } from 'antd'
import { AloneCreate, CrowdCreate } from '@/constants'
import NFTItem from '@/components/canvas-cover'
import ConfirmModal from '@/components/confirm-modal'
import { addFactoryList, cancelNFTList, nftTransferFrom, requestCanister } from '@/api/handler'
import Toast from '@/components/toast'
import { ListingUpdate, OwnedNFTUpdate } from '@/message'
import PubSub from 'pubsub-js'
import { bignumberToBigInt } from '@/utils/utils'
import BigNumber from 'bignumber.js'
import { createHashHistory } from 'history'

export default memo(function MyNFT(props) {
  const [type, setType] = useState(null)
  const [curTokenIndex, setCurTokenIndex] = useState(null)
  const { alone, crowd } = props.nft
  const [listVisible, setListVisible] = useState(false)
  const [sellPrice, setsellPrice] = useState(null)

  const [transFerVisible, setTransFerVisible] = useState(false)
  const [trans2Address, setTrans2Address] = useState('')

  const onItemClick = (info, type) => {
    let history = createHashHistory()
    history.push(`/detail/${type}/${info.canvasInfo.tokenIndex}/${info.prinId}`)
  }

  const handlerClose = () => {
    setListVisible(false)
    setsellPrice(null)
    setType(null)
    setCurTokenIndex(null)
  }

  const handlerTransferClose = () => {
    setTransFerVisible(false)
    setTrans2Address('')
    setType(null)
    setCurTokenIndex(null)
  }

  const handlerTransfer = async () => {
    let notice = Toast.loading('Transfering...', 0)
    let address = trans2Address.replace(/\s+/g, '')
    let data = {
      type: type,
      tokenIndex: curTokenIndex,
      to: address,
      success: (res) => {
        if (res) {
          handlerTransferClose()
          PubSub.publish(OwnedNFTUpdate, {})
        }
      },
      fail: (error) => {
        if (error) message.error(error)
      },
      notice: notice
    }
    requestCanister(nftTransferFrom, data)
  }

  const handlerListing = (listing, type, tokenIndex, sellPrice = 0) => {
    if (listing && sellPrice < 0.0001) {
      message.error('Selling price > 0.0001 WICP is required')
      return
    }
    let msg = listing ? 'listing...' : 'cancel listing...'
    let func = listing ? addFactoryList : cancelNFTList
    let notice = Toast.loading(msg, 0)
    let data = {
      tokenIndex: BigInt(tokenIndex),
      price: bignumberToBigInt(new BigNumber(sellPrice).multipliedBy(Math.pow(10, 8))),
      type: type,
      success: (res) => {
        if (res) {
          handlerClose()
          PubSub.publish(ListingUpdate, { type: type, tokenIndex: tokenIndex })
        }
      },
      fail: (error) => {
        message.error(error)
      },
      notice: notice
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
    setsellPrice(e.target.value)
  }

  const onButtonClick = (info, type) => {
    setType(type)
    setCurTokenIndex(info.tokenIndex)
    if (info.listingInfo && info.listingInfo.seller) {
      handlerListing(false, type, info.tokenIndex) //取消挂单
    } else {
      setListVisible(true) //去挂单
    }
  }

  const onTransferClick = (info, type) => {
    if (info.listingInfo && info.listingInfo.seller) {
      message.error('This NFT is listed on the marketplace, please cancel first')
      return
    }
    setType(type)
    setCurTokenIndex(info.tokenIndex)
    setTransFerVisible(true)
  }

  const handleSetTransfer2Address = (e) => {
    setTrans2Address(e.target.value)
  }

  return (
    <NFTContentWrapper>
      <div className="title">
        <h1>Non-fungible tokens</h1>
        <h2>{`${alone && crowd ? alone.length + crowd.length : 0} NFTs`}</h2>
      </div>
      <NFTListWrapper>
        <div className="nft-list">
          {alone &&
            alone.map((item) => {
              return (
                <NFTItem
                  key={item[0]}
                  type={AloneCreate}
                  info={item}
                  thumbType={'wallet-nft'}
                  className="nft-list"
                  onButton1Click={onTransferClick}
                  onButtonClick={onButtonClick}
                  onItemClick={onItemClick}
                ></NFTItem>
              )
            })}
          {crowd &&
            crowd.map((item) => {
              return (
                <NFTItem
                  key={item[0]}
                  type={CrowdCreate}
                  info={item}
                  thumbType={'wallet-nft'}
                  className="nft-list"
                  onButton1Click={onTransferClick}
                  onButtonClick={onButtonClick}
                  onItemClick={onItemClick}
                ></NFTItem>
              )
            })}
        </div>
      </NFTListWrapper>
      <ConfirmModal
        title={'Sell'}
        width={328}
        onModalClose={handlerClose}
        onModalConfirm={() => handlerListing(true, type, curTokenIndex, sellPrice)}
        modalVisible={listVisible}
      >
        <Input
          type="number"
          placeholder="price"
          className="ant-input-violet"
          value={sellPrice}
          onChange={(e) => handleSetSellPrice(e)}
        />

        <Input
          type="text"
          style={{ marginTop: '20px' }}
          className="ant-input-violet"
          disabled
          value={'Commision fee   2%'}
        />
      </ConfirmModal>
      <ConfirmModal
        title={'Transfer'}
        width={328}
        onModalClose={handlerTransferClose}
        onModalConfirm={handlerTransfer}
        modalVisible={transFerVisible}
      >
        <Input
          type="text"
          placeholder={'To Principal ID'}
          value={trans2Address}
          className="ant-input-violet"
          onChange={(e) => handleSetTransfer2Address(e)}
        />
      </ConfirmModal>
    </NFTContentWrapper>
  )
})
