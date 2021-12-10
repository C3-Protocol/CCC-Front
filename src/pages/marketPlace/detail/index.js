import React, { memo, useRef, useEffect, useState } from 'react'
import { Button, message, Table, TreeSelect, Checkbox } from 'antd'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { AloneCreate, CrowdCreate, CanvasWidth } from '@/constants'
import PixelThumb from '@/components/canvas-pixel/pixel-thumb'
import { getValueDivide8, formatMinuteSecond } from '@/utils/utils'
import ConfirmModal from '@/components/confirm-modal'
import Toast from '@/components/toast'
import Favorite from '@/assets/images/market/favorite.png'
import Detail from '@/assets/images/market/detail.png'
import History from '@/assets/images/market/history.png'
import List from '@/assets/images/market/list.png'
import Mint from '@/assets/images/market/mint.png'
import Sale from '@/assets/images/market/sale.png'
import CancelList from '@/assets/images/market/cancelList.png'
import Transfer from '@/assets/images/market/transfer.png'
import wicpLogo from '@/assets/images/wicp-logo.png'
import {
  getCanvasInfoById,
  getNFTListingInfoByType,
  getHighestInfoById,
  getNFTOwnerByIndex,
  isNFTFavorite,
  changeNFTFavoriteAction
} from '@/pages/home/store/actions'
import { factoryBuyNow, requestCanister, setFavorite, cancelFavorite, getTradeHistoryByIndex } from '@/api/handler'
import {
  MarketDetailWrapper,
  MarketDetailTopWrapper,
  MarketDetailLeft,
  PixelContent,
  MarketDetailRight,
  MarketDetailBlock
} from './style'
import { transformPxToRem } from '@/utils/utils'
import CanvasHeatMap from '@/components/heatmap'

// canvas缩略图组件
function MarketDetail(props) {
  let mount = true
  const params = props.match.params
  // canvas index
  const tokenIndex = parseInt(params.index)
  const type = params.type
  // id,cansiterid
  const canvasPrinId = params.prinId
  const [buyVisible, setBuyVisible] = useState(false)
  const [tradeHistory, setTradeHistory] = useState([])
  const [filterHistory, setFilterTradeHistory] = useState([])
  const pixParent = useRef()
  const [scale, setScale] = useState(1)
  const [heatMapShow, setHeatMapShow] = useState(false)

  const treeData = [
    {
      title: 'All',
      value: ''
    },
    {
      title: 'List',
      value: 'List',
      image: List
    },
    {
      title: 'Mint',
      value: 'Mint',
      image: Mint
    },
    {
      title: 'Sale',
      value: 'Sale',
      image: Sale
    },
    {
      title: 'CancelList',
      value: 'CancelList',
      image: CancelList
    },
    {
      title: 'Transfer',
      value: 'Transfer',
      image: Transfer
    }
  ]
  const [selectEvent, setSelectEvent] = useState(treeData[0].value)

  const dispatch = useDispatch()
  const isAlone = () => {
    return type === AloneCreate
  }
  const columns = [
    {
      title: 'Event',
      dataIndex: 'event',
      key: 'event',
      render: (event) => {
        let image
        for (let item of treeData) {
          if (item.title === event) {
            image = item.image
            break
          }
        }
        return (
          <div style={{ display: 'flex', gap: '5px' }}>
            {image && <img src={image}></img>}
            <div>{event}</div>
          </div>
        )
      }
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => {
        return price ? (
          <div style={{ display: 'flex', gap: '5px' }}>
            <img src={wicpLogo} style={{ height: '22px' }}></img>
            <div>{price}</div>
          </div>
        ) : (
          <div></div>
        )
      }
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
      ellipsis: true
    },
    {
      title: 'To',
      key: 'to',
      dataIndex: 'to',
      ellipsis: true
    },
    {
      title: 'Date',
      key: 'date',
      dataIndex: 'date'
    }
  ]

  const { canvasInfo, listingInfo, highestInfo, isAuth, authToken, owner, isFavorite } = useSelector((state) => {
    let isAuth = state.auth.getIn(['isAuth']) || false
    let authToken = state.auth.getIn(['authToken']) || ''
    let key1 = isAlone() ? `aloneInfo-${canvasPrinId}` : `multiInfo-${canvasPrinId}`
    let canvasInfo = (state.allcavans && state.allcavans.getIn([key1])) || {}
    let key2 = isAlone() ? `aloneNFTInfo-${tokenIndex}` : `multiNFTInfo-${tokenIndex}`
    let listingInfo = (state.allcavans && state.allcavans.getIn([key2])) || {}
    let key3 = isAlone() ? `aloneNFTOwner-${tokenIndex}` : `multiNFTOwner-${tokenIndex}`
    let owner = (state.allcavans && state.allcavans.getIn([key3])) || ''
    let key4 = isAlone() ? `aloneNFTFavorite-${tokenIndex}` : `multiNFTFavorite-${tokenIndex}`
    let favorite = (state.allcavans && state.allcavans.getIn([key4])) || false
    let highestInfo = []
    if (!isAlone()) {
      highestInfo = (state.allcavans && state.allcavans.getIn([`multiPriceHighestInfo-${canvasPrinId}`])) || []
    }
    return {
      canvasInfo: canvasInfo,
      listingInfo: listingInfo,
      highestInfo: highestInfo,
      owner: owner,
      isAuth: isAuth,
      authToken: authToken,
      isFavorite: favorite
    }
  }, shallowEqual)

  // other hooks
  useEffect(() => {
    //获取画布的相关信息：name、desc等
    if (canvasInfo.tokenIndex === undefined) dispatch(getCanvasInfoById(type, canvasPrinId))
    dispatch(getNFTListingInfoByType(type, tokenIndex))
    //获取最高价格的像素点
    if (type === CrowdCreate && !highestInfo.length) {
      dispatch(getHighestInfoById(canvasPrinId))
    }
    dispatch(getNFTOwnerByIndex(type, tokenIndex))
    dispatch(isNFTFavorite(type, canvasPrinId, tokenIndex))
    getTradeHistory()
    if (document?.documentElement || document?.body) {
      document.documentElement.scrollTop = document.body.scrollTop = 0
    }
    //事件信息绑定
  }, [dispatch, isAuth])
  const addListener = () => {
    window.addEventListener('resize', onWindowResize)
    onWindowResize()
  }
  const removeListener = () => {
    window.removeEventListener('resize', onWindowResize)
  }

  const onWindowResize = () => {
    pixParent && pixParent.current && setScale((pixParent.current.clientWidth - 20) / CanvasWidth)
  }

  useEffect(() => {
    addListener()
    setScale((pixParent.current.clientWidth - 20) / CanvasWidth)
    return () => {
      mount = false
      removeListener()
    }
  }, [])

  const getTradeHistory = () => {
    requestCanister(
      getTradeHistoryByIndex,
      {
        type: type,
        tokenIndex: tokenIndex,
        success: (res) => {
          if (mount && res) {
            let history = []
            let index = 0
            for (let item of res) {
              let event
              if (item.op) {
                for (let key in item.op) {
                  event = key
                  break
                }
              }
              history.push({
                key: index + '',
                from: item.from && item.from.length ? item.from[0].toText() : '',
                to: item.to && item.to.length ? item.to[0].toText() : '',
                price: item.price[0] ? getValueDivide8(item.price[0] || 0) : '',
                date: formatMinuteSecond(item.timestamp, true),
                event: event
              })
              index++
            }
            filterTradeHistory(history, selectEvent)
            setTradeHistory(history)
          }
        }
      },
      false
    )
  }

  const handlerClose = () => {
    setBuyVisible(false)
  }

  const handlerBuy = async () => {
    let notice = Toast.loading('buy ...', 0)
    let data = {
      tokenIndex: BigInt(tokenIndex),
      type: type,
      success: (res) => {
        console.debug('marketplace handlerListing res:', res)
        if (mount && res) {
          handlerClose()
          history.back()
        }
      },
      fail: (error) => {
        console.error('marketplace handlerListing fail:', error)
        dispatch(getNFTListingInfoByType(type, tokenIndex))
        handlerClose()
        message.error(error)
      },
      notice: notice
    }
    await requestCanister(factoryBuyNow, data)
  }

  const onFavoriteClick = () => {
    if (!isAuth) {
      message.error('Please sign in first')
      return
    }
    let func
    if (isFavorite) {
      func = cancelFavorite
    } else {
      func = setFavorite
    }
    let notice = Toast.loading(isFavorite ? 'cancel favoriting...' : 'set favoriting...', 0)
    let data = {
      type: type,
      tokenIndex: tokenIndex,
      prinId: canvasPrinId,
      success: (res) => {
        mount && dispatch(changeNFTFavoriteAction({ type: type, tokenIndex: tokenIndex, res: !isFavorite }))
      },
      fail: (error) => {
        message.error(error)
      },
      notice: notice
    }
    requestCanister(func, data)
  }

  const onClickBuy = () => {
    if (!isAuth) {
      message.error('Please sign in first')
      return
    }
    if (listingInfo.seller.toText() === authToken) {
      message.error(
        'Are you kidding me? You are selling this NFT as the owner. You can cancel it in your Wallet if you want. '
      )
      return
    }
    setBuyVisible(true)
  }

  const filterTradeHistory = (history, value) => {
    let res = history.filter((item) => {
      if (!value || item.event == value) {
        return true
      }
      return false
    })
    setFilterTradeHistory(res)
  }

  const onHistoryFilter = (value) => {
    filterTradeHistory(tradeHistory, value)
    setSelectEvent(value)
  }

  const onChangeShowHeatmap = (e) => {
    setHeatMapShow(e.target.checked)
  }

  return (
    <MarketDetailWrapper>
      <MarketDetailTopWrapper>
        <MarketDetailLeft gray={isFavorite ? 0 : 100}>
          <div className="title">
            {!isAlone() && (
              <Checkbox onChange={onChangeShowHeatmap} checked={heatMapShow}>
                HeatMap
              </Checkbox>
            )}
            <img className="favorite" src={Favorite} onClick={onFavoriteClick}></img>
          </div>
          <PixelContent width={CanvasWidth} scale={scale}>
            <div className="canvas-pixel" ref={pixParent}>
              {canvasInfo.canisterId && (
                <PixelThumb scale={scale} prinId={canvasPrinId} type={type} canvasInfo={canvasInfo} />
              )}
              {!isAlone() && (
                <div className="heatmap">
                  <CanvasHeatMap
                    showWidth={CanvasWidth}
                    heatMapShow={heatMapShow}
                    multiple={1}
                    emptyWidth={0}
                    prinId={canvasPrinId}
                  />
                </div>
              )}
            </div>
          </PixelContent>
        </MarketDetailLeft>
        <MarketDetailRight>
          <div className="title"> {`${isAlone() ? '#A-' : '#M-'}${canvasInfo.tokenIndex}`}</div>
          <div className="owner">
            <div>{`Owned by `}</div>
            <div className="seller">{`${owner}`}</div>
          </div>
          <MarketDetailBlock height={transformPxToRem('220px')} marginTop={transformPxToRem('20px')}>
            <div className="priceTip">Current price</div>
            <div className="priceValue">{listingInfo.price ? `${getValueDivide8(listingInfo.price)} WICP` : 'N/A'}</div>
            <Button type="violet buy" onClick={onClickBuy} disabled={!listingInfo.price}>
              Buy now
            </Button>
          </MarketDetailBlock>

          <MarketDetailBlock height={transformPxToRem('83px')} marginTop={transformPxToRem('7px')}>
            <div className="titleLayout">
              <img src={Detail}></img>
              <div className="titleValue">Detail</div>
            </div>
          </MarketDetailBlock>
          <MarketDetailBlock height={transformPxToRem('270px')} marginTop={transformPxToRem('1px')}>
            <div className="contentValue">
              Name:
              <span>{` ${canvasInfo.name}`}</span>
            </div>
            <div className="contentValue">
              Description:
              <span>{` ${canvasInfo.desc}`}</span>
            </div>
            <div className="contentValue">
              Total invested:
              <span>{`${getValueDivide8(canvasInfo.totalWorth)} WICP`}</span>
            </div>
            <div className="contentValue">
              CID:
              <span>{` ${canvasPrinId}`}</span>
            </div>
            <div className="contentValue">
              Create By:
              <span>{` ${canvasInfo.createBy}`}</span>
            </div>
            {!isAlone() && (
              <div>
                <div className="contentValue">
                  Number of Updated Pixels:
                  <span>{` ${canvasInfo.changeTotal}`}</span>
                </div>
                <div className="contentValue">
                  Number of Players:
                  <span>{` ${canvasInfo.paintersNum || 1}`}</span>
                </div>
                <div className="contentValue">
                  Bonus winner:
                  <span>{` ${
                    canvasInfo.changeTotal >= canvasInfo.bonusPixelThreshold ? canvasInfo.bonusWinner || 'N/A' : 'N/A'
                  }`}</span>
                </div>
                <div className="contentValue">
                  MVP (Most Valuable Pixel):
                  <span>{` ${getValueDivide8(
                    highestInfo.length ? highestInfo[0][1].curPrice : 0.0001
                  )} WICP, Coordinates:${highestInfo.length ? highestInfo[0][0].x : 0},${
                    highestInfo.length ? highestInfo[0][0].y : 0
                  }`}</span>
                </div>
              </div>
            )}
          </MarketDetailBlock>
        </MarketDetailRight>
      </MarketDetailTopWrapper>
      <MarketDetailBlock height={transformPxToRem('83px')} marginTop={transformPxToRem('48px')}>
        <div className="titleLayout">
          <img src={History}></img>
          <div className="titleValue">Trading History</div>
        </div>
      </MarketDetailBlock>

      <MarketDetailBlock height={transformPxToRem('250px')} marginTop={transformPxToRem('1px')}>
        <TreeSelect
          style={{ width: '100%', marginBottom: '20px' }}
          value={selectEvent}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={treeData}
          placeholder="Filter"
          onChange={onHistoryFilter}
        />
        <div className="history">
          <Table columns={columns} dataSource={filterHistory} />
        </div>
      </MarketDetailBlock>
      <ConfirmModal
        title={'Buy'}
        width={328}
        onModalClose={handlerClose}
        onModalConfirm={handlerBuy}
        modalVisible={buyVisible}
      ></ConfirmModal>
    </MarketDetailWrapper>
  )
}

export default memo(MarketDetail)
