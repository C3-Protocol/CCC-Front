import React, { memo, useEffect, useState } from 'react'
import { Button, message, Dropdown, Menu } from 'antd'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import TotalIcon from '@/assets/images/market/m1155/total.svg'
import GroupIcon from '@/assets/images/market/m1155/group.svg'
import OwnIcon from '@/assets/images/market/m1155/own.svg'
import ListIcon from '@/assets/images/market/m1155/list.svg'
import Detail from '@/assets/images/market/detail.png'
import History from '@/assets/images/market/history.png'
import { DownOutlined } from '@ant-design/icons'
import { getCanvasInfoById, getHighestInfoById } from '@/pages/home/store/actions'
import { getM1155Listing } from '@/pages/home/store/request'
import { requestCanister } from '@/api/handler'
import { get1155CopiesByIndex, balance1155PixelByIndex } from '@/api/nftHandler'
import M1155Listing from './1155-listing'
import WICPPrice from '@/components/wicp-price'
import CanvasPictureInfo from '../../cpns/canvas-thv'

import { MarketDetailLeft } from './style'
import { MarketDetailTopWrapper, MarketDetailWrapper, MarketDetailBlock, MarketDetailRight } from '../style'
import { transformPxToRem, getIndexPrefix, isAuthTokenEffect } from '@/utils/utils'
import NFTTradeHistory from '../../cpns/nft-history/index'
import { ListingUpdate } from '@/message'
import PubSub from 'pubsub-js'
import SellPage from './sell-page'
import Dialog from '@/components/dialog'
import BuyContent from './buy'
import FavoriteIcon from '../../cpns/favorite-icon'
import CanvasInfo from '@/pages/create/canvas-content/canvas-info'
import { is1155Canvas } from '../../../../utils/utils'

function MarketDetail(props) {
  let mount = true
  const params = props.match.params
  // canvas index
  const tokenIndex = parseInt(params.index)
  const type = params.type
  // id,cansiterid
  const canvasPrinId = params.prinId
  const [listVisible, setListVisible] = useState(false)

  const [owner, setNFTOwner] = useState(0)
  const [available, setAvailable] = useState(0)
  const [freezen, setFreezen] = useState(0)
  const [totalPixels, setTotalPixels] = useState(0)

  const listType = ['All listings', 'My listings']
  const [curListType, setCurListType] = useState(listType[0])
  const [listing, setListing] = useState([])
  const [minimumList, setMinimumList] = useState(null)
  const dispatch = useDispatch()

  const { canvasInfo, highestInfo, isAuth, authToken, pixelInfo } = useSelector((state) => {
    let isAuth = state.auth.getIn(['isAuth']) || false
    let authToken = state.auth.getIn(['authToken']) || ''
    let key1 = `canvasInfo-${type}-${canvasPrinId}`
    let canvasInfo = (state.allcavans && state.allcavans.getIn([key1])) || {}
    let key2 = `nftInfo-${type}-${tokenIndex}`
    let highestInfo = []
    highestInfo = (state.allcavans && state.allcavans.getIn([`priceHighestInfo-${canvasPrinId}`])) || []
    let key3 = `pixelInfo-${type}-${canvasPrinId}`
    let pixelInfo = state.piexls && state.piexls.getIn([key3])

    return {
      canvasInfo: canvasInfo,
      highestInfo: highestInfo,
      isAuth: isAuth,
      authToken: authToken,
      pixelInfo: pixelInfo
    }
  }, shallowEqual)

  const requestListings = () => {
    getM1155Listing(type, tokenIndex, (res) => {
      mount && setListing(res)
    })
  }
  // other hooks
  useEffect(() => {
    //获取画布的相关信息：name、desc等
    if (canvasInfo.tokenIndex === undefined) dispatch(getCanvasInfoById(type, canvasPrinId))
    //获取最高价格的像素点
    if (!highestInfo.length) {
      dispatch(getHighestInfoById(type, canvasPrinId))
    }
    requestListings()
    is1155Canvas(type) &&
      requestCanister(
        get1155CopiesByIndex,
        {
          type: type,
          tokenIndex: tokenIndex,
          success: (res) => {
            if (res.length === 2) {
              mount && setTotalPixels(res[0])
              mount && setNFTOwner(res[1])
            }
          }
        },
        false
      )
    if (document?.documentElement || document?.body) {
      document.documentElement.scrollTop = document.body.scrollTop = 0
    }
    //事件信息绑定
  }, [dispatch, isAuth])

  const getMinimumItem = (listing) => {
    let res
    for (let item of listing) {
      if (item[1].seller.toText() !== authToken) {
        res = item
        break
      }
    }
    setMinimumList(res)
  }
  const requestSelfData = () => {
    if (isAuthTokenEffect(isAuth, authToken)) {
      requestCanister(balance1155PixelByIndex, {
        type,
        tokenIndex: tokenIndex,
        success: (res) => {
          setAvailable(parseInt(res.available))
          setFreezen(parseInt(res.freezen))
        }
      })
    }
  }
  useEffect(() => {
    if (isAuthTokenEffect(isAuth, authToken)) {
      requestSelfData()
    }
    getMinimumItem(listing)
  }, [isAuth, authToken, listing])

  const addListener = () => {
    window.addEventListener('resize', onWindowResize)
    onWindowResize()
  }
  const removeListener = () => {
    window.removeEventListener('resize', onWindowResize)
  }

  const onWindowResize = () => {}

  const listingUpdateFunc = (topic, info) => {
    if (info.type === type && info.tokenIndex === tokenIndex) {
      requestListings()
      requestSelfData()
    }
  }

  useEffect(() => {
    addListener()
    const listUpdate = PubSub.subscribe(ListingUpdate, listingUpdateFunc)
    return () => {
      mount = false
      PubSub.unsubscribe(listUpdate)
      removeListener()
    }
  }, [])

  const onClickBuy = () => {
    if (!isAuth) {
      message.error('Please sign in first')
      return
    }
    if (minimumList[1].seller.toText() === authToken) {
      message.error(
        'Are you kidding me? You are selling this NFT as the owner. You can cancel it in your Wallet if you want. '
      )
      return
    }
    Dialog.createAndShowDialog(
      <BuyContent
        isAuth={isAuth}
        authToken={authToken}
        pendingItem={minimumList}
        type={type}
        tokenIndex={tokenIndex}
        pixelInfo={pixelInfo}
      />,
      0
    )
  }

  const handlerListClose = () => {
    setListVisible(false)
  }

  const onSellButtonClick = () => {
    let mylist = listing.filter((item) => {
      return item[1].seller.toText() === authToken
    })
    if (mylist && mylist.length >= 5) {
      message.error('Reach max order num')
      return
    }
    setListVisible(true) //去挂单
  }

  const onChangeTab = (key) => {
    setCurListType(key)
  }

  const allListTypeMenu = (
    <Menu
      onClick={(e) => {
        onChangeTab(e.key)
      }}
    >
      {listType.map((item) => {
        return <Menu.Item key={item}>{item}</Menu.Item>
      })}
    </Menu>
  )

  return (
    <MarketDetailWrapper>
      <MarketDetailTopWrapper>
        <MarketDetailLeft>
          <CanvasPictureInfo type={type} index={tokenIndex} prinId={canvasPrinId} />

          <MarketDetailBlock height={transformPxToRem('240px')} marginTop={transformPxToRem('8px')}>
            <div className="titleLayout">
              <img src={Detail}></img>
              <div className="titleValue">Detail</div>
            </div>
            <CanvasInfo
              canvasInfo={canvasInfo}
              highestInfo={highestInfo}
              type={type}
              prinId={canvasPrinId}
              detailExpand={true}
              hideLine={true}
            />
          </MarketDetailBlock>
        </MarketDetailLeft>
        <MarketDetailRight>
          <div className="title">
            <div className="index">
              <span>{`${getIndexPrefix(type, canvasInfo.tokenIndex)}`}</span>
            </div>
          </div>
          <div className="owner">
            <div className="flex-10">
              <img className="favorite-count" src={TotalIcon}></img>
              <div className="seller">{`${totalPixels} total`}</div>
              <img className="favorite-count" src={GroupIcon}></img>
              <div className="seller">{`${owner} owners`}</div>
              {isAuth && <img className="favorite-count" src={OwnIcon}></img>}
              {isAuth && <div className="seller">{`${available + freezen} You own`}</div>}
            </div>
            <FavoriteIcon index={tokenIndex} prinId={canvasPrinId} type={type} />
          </div>
          <MarketDetailBlock height={transformPxToRem('160px')} marginTop={transformPxToRem('20px')}>
            <div className="content-between">
              <div>
                <div className="priceTip">Current price</div>
                <div className="priceValue">
                  <WICPPrice iconSize={30} value={minimumList && minimumList[1].unitPrice} valueStyle={'value-48'} />
                </div>
              </div>
              <div className="content-flex">
                <Button type="violet" className="buy" onClick={onClickBuy} disabled={!minimumList}>
                  Buy now
                </Button>
                {available > 0 && (
                  <Button type="violet" className="buy" onClick={onSellButtonClick}>
                    Sell
                  </Button>
                )}
              </div>
            </div>
          </MarketDetailBlock>
          <MarketDetailBlock height={transformPxToRem('560px')} marginTop={transformPxToRem('8px')}>
            <div className="content-between borderBottom">
              <div className="flex-10">
                <img src={ListIcon}></img>
                <div className="titleValue">Listings</div>
              </div>
              <Dropdown overlay={allListTypeMenu} trigger="click">
                <Button>
                  {curListType}
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
            <M1155Listing
              type={type}
              self={authToken}
              tokenIndex={tokenIndex}
              listing={listing}
              filter={curListType}
              prinId={canvasPrinId}
            ></M1155Listing>
          </MarketDetailBlock>
        </MarketDetailRight>
      </MarketDetailTopWrapper>

      <MarketDetailBlock height={transformPxToRem('250px')} marginTop={transformPxToRem('48px')}>
        <div className="titleLayout">
          <img src={History}></img>
          <div className="titleValue">Trading History</div>
        </div>
        <NFTTradeHistory type={type} tokenIndex={tokenIndex} />
      </MarketDetailBlock>

      {listVisible && (
        <SellPage
          index={tokenIndex}
          prinId={canvasPrinId}
          type={type}
          available={available}
          setListVisible={handlerListClose}
        />
      )}
    </MarketDetailWrapper>
  )
}

export default memo(MarketDetail)
