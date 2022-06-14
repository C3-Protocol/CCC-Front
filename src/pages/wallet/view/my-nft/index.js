import React, { memo, useState, useEffect, useRef } from 'react'
import './style.less'
import { Input, message } from 'antd'
import { AloneCreate, CrowdCreate, ThemeCreate, M1155Create, Theme1155Create } from '@/constants'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import ConfirmModal from '@/components/confirm-modal'
import { requestCanister } from '@/api/handler'
import { getAllNFTByType, cancelNFTList, nftTransferFrom, getRoyaltyFeeRatio } from '@/api/nftHandler'
import { getBlindBoxStatus } from '@/pages/home/store/actions'
import Toast from '@/components/toast'
import { ListingUpdate, OwnedNFTUpdate } from '@/message'
import PubSub from 'pubsub-js'
import NFTList from '@/pages/wallet/cpns/nft-list'
import SellModal from '@/components/sell-modal'
import { is1155Canvas } from '@/utils/utils'
import { getCreateNFTByType } from '@/api/createHandler'
import { find } from 'lodash-es'

export default memo(function MyNFT(props) {
  let mount = true
  const dispatch = useDispatch()
  const [type, setType] = useState(null)
  const [curTokenIndex, setCurTokenIndex] = useState(null)
  const [nfts, setNFTData] = useState({})
  const nftsRef = useRef()
  nftsRef.current = nfts
  const [royalty, setRoyaltyData] = useState({})
  const royaltyRef = useRef()
  royaltyRef.current = royalty

  const canvasList = [CrowdCreate, M1155Create, AloneCreate, ThemeCreate, Theme1155Create]
  const { authToken, collectionsConfig, allCreateCollection } = useSelector((state) => {
    return {
      authToken: state.auth.getIn(['authToken']) || '',
      collectionsConfig: state.auth.getIn(['collection']) || [],
      allCreateCollection: state.auth.getIn(['allCreateCollection']) || []
    }
  }, shallowEqual)

  const [listVisible, setListVisible] = useState(false)
  const [transFerVisible, setTransFerVisible] = useState(false)
  const [trans2Address, setTrans2Address] = useState('')
  const [quantity, setQuantity] = useState(null)
  const [m1155Info, setM1155Info] = useState(null)
  const [sellRoyalty, setSellRoyalty] = useState(0)
  const [sellFork, setSellFork] = useState(0)

  const params = props.match.params
  const account = params.account
  const user = account === 'wallet' ? authToken : params.user
  const defaultType = params.type
  const isSelf = user === authToken

  const requestData = (type) => {
    requestCanister(
      getAllNFTByType,
      {
        prinId: user,
        type,
        success: (res) => {
          if (mount) {
            let newData = {}
            for (let key in nftsRef.current) {
              if (key !== type) newData[key] = nftsRef.current[key]
            }
            newData[type] = res
            setNFTData(newData)
          }
        }
      },
      false
    )
  }
  const requestRoyaltyFee = (type) => {
    requestCanister(
      getRoyaltyFeeRatio,
      {
        type,
        success: (res) => {
          if (mount) {
            let newData = {}
            for (let key in royaltyRef.current) {
              if (key !== type) newData[key] = royaltyRef.current[key]
            }
            newData[type] = res
            setRoyaltyData(newData)
          }
        }
      },
      false
    )
  }

  const requestCreateItemData = (type) => {
    requestCanister(
      getCreateNFTByType,
      {
        prinId: user,
        type,
        success: (res) => {
          if (mount) {
            let newData = {}
            for (let key in nftsRef.current) {
              if (key !== type) newData[key] = nftsRef.current[key]
            }
            newData[type] = res
            setNFTData(newData)
          }
        }
      },
      false
    )
  }

  const nftUpdateFunc = (topic, info) => {
    if (info) requestData(info.type)
  }

  useEffect(() => {
    if (user) {
      for (let type of canvasList) {
        requestData(type)
        requestRoyaltyFee(type)
      }
    }
    return () => {
      mount = false
    }
  }, [user])

  useEffect(() => {
    for (let item of collectionsConfig) {
      requestData(item.key)
      requestRoyaltyFee(item.key)
      if (item?.nftType === 'blindbox') {
        dispatch(getBlindBoxStatus(item))
      }
    }
  }, [collectionsConfig])

  useEffect(() => {
    for (let item of allCreateCollection) {
      requestCreateItemData(item.key)
    }
  }, [allCreateCollection])

  useEffect(() => {
    const nftUpdate = PubSub.subscribe(OwnedNFTUpdate, nftUpdateFunc)
    return () => {
      mount = false
      PubSub.unsubscribe(nftUpdate)
    }
  }, [])

  const handlerClose = () => {
    setListVisible(false)
    setType(null)
    setCurTokenIndex(null)
    setSellRoyalty(0)
    setSellFork(0)
  }

  const handlerTransferClose = () => {
    setTransFerVisible(false)
    setTrans2Address('')
    setQuantity(null)
    setM1155Info(null)
    setType(null)
    setCurTokenIndex(null)
  }

  const handlerTransfer = async () => {
    if (is1155Canvas(type)) {
      if (quantity > m1155Info.available) {
        message.error('Insufficient balance')
        return
      }
    }
    if (!trans2Address) {
      message.error('Principal ID empty')
      return
    }
    let notice = Toast.loading('Transfering', 0)
    let address = trans2Address.replace(/\s+/g, '')
    let data = {
      type: type,
      tokenIndex: curTokenIndex,
      to: address,
      quantity: quantity,
      success: (res) => {
        if (res) {
          message.info('transfer successfully')
          handlerTransferClose()
          PubSub.publish(OwnedNFTUpdate, { type })
        }
      },
      fail: (error) => {
        if (error) message.error(error)
      },
      notice: notice
    }
    requestCanister(nftTransferFrom, data)
  }

  const cancelListing = (type, tokenIndex) => {
    let msg = 'cancel listing'
    let func = cancelNFTList
    let notice = Toast.loading(msg, 0)
    let data = {
      tokenIndex: BigInt(tokenIndex),
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

  const onButtonClick = (info, type, operation) => {
    if (isSelf) {
      setType(type)
      setCurTokenIndex(info.tokenIndex)
      setSellRoyalty(info?.baseInfo?.royaltyRatio || royalty[type])
      let forkItem = find(allCreateCollection, { key: type })
      forkItem && setSellFork(forkItem?.forkRoyaltyRatio)
      if (operation === 'change') {
        if (info.listingInfo && info.listingInfo.seller) {
          cancelListing(type, info.tokenIndex) //取消挂单
        } else {
          setListVisible(true) //去挂单
        }
      } else if (operation === 'update') {
        setListVisible(true) //去挂单
      }
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
    setM1155Info(info.m1155Info)
  }

  const handleSetTransfer2Address = (e) => {
    setTrans2Address(e.target.value)
  }

  const handlerSetQuantity = (e) => {
    if (e.target.value) {
      setQuantity(parseInt(e.target.value))
    } else setQuantity(null)
  }

  const getNFTListData = () => {
    let data = {}
    for (let key of canvasList) {
      data[key] = nfts[key] || []
    }
    for (let item of collectionsConfig) {
      data[item.key] = nfts[item.key] || []
    }
    for (let item of allCreateCollection) {
      data[item.key] = nfts[item.key] || []
    }
    return data
  }

  const getLoadingData = () => {
    let data = {}
    for (let key in nfts) {
      data[key] = true
    }
    return data
  }

  return (
    <div className="nft-content-wrapper">
      <NFTList
        nfts={getNFTListData()}
        loading={getLoadingData()}
        thumbType={'wallet-nft'}
        nftType={'nft'}
        self={true}
        onButton1Click={onTransferClick}
        onButtonClick={onButtonClick}
        user={user}
        defaultType={defaultType}
      />
      {listVisible && (
        <SellModal
          index={curTokenIndex}
          listVisible={listVisible}
          type={type}
          setListVisible={handlerClose}
          royaltyFee={sellRoyalty}
          forkFee={sellFork}
        />
      )}
      <ConfirmModal
        title={'Transfer'}
        width={428}
        onModalClose={handlerTransferClose}
        onModalConfirm={handlerTransfer}
        modalVisible={transFerVisible}
      >
        <Input
          type="text"
          placeholder={'To Principal ID'}
          value={trans2Address}
          className="ant-input-black input-radius6"
          onChange={(e) => handleSetTransfer2Address(e)}
        />

        {is1155Canvas(type) && (
          <div>
            <Input
              type="number"
              style={{ marginTop: '20px' }}
              placeholder={'Quantity'}
              value={quantity}
              className="ant-input-black input-radius6"
              onChange={(e) => handlerSetQuantity(e)}
            />
            <div style={{ marginTop: '5px', textAlign: 'right' }}>{`Available: ${m1155Info?.available || 0}`} </div>
          </div>
        )}
      </ConfirmModal>
    </div>
  )
})
