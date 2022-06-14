import React, { memo, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { AloneCreate } from '@/constants'
import Detail from '@/assets/images/market/detail.png'
import History from '@/assets/images/market/history.png'
import { getCanvasInfoById, getNFTListingInfoByType, getHighestInfoById } from '@/pages/home/store/actions'
import { getNFTOwnerByIndex } from '@/pages/home/store/request'
import { requestCanister } from '@/api/handler'
import { getAllMemberConsume } from '@/api/canvasHandler'
import { MarketDetailLeft } from './style'
import { MarketDetailTopWrapper, MarketDetailWrapper, MarketDetailBlock, MarketDetailRight } from '../style'
import { transformPxToRem, getIndexPrefix } from '@/utils/utils'
import NFTTradeHistory from '../../cpns/nft-history/index'
import { ListingUpdate } from '@/message'
import PubSub from 'pubsub-js'
import FavoriteIcon from '../../cpns/favorite-icon'
import CanvasInfo from '@/pages/create/canvas-content/canvas-info'
import CanvasPictureInfo from '../../cpns/canvas-thv'
import Owner from '@/pages/marketPlace/cpns/owner'
import BuyNowContent from '@/pages/marketPlace/cpns/buyNow-content'

function MarketDetail(props) {
  const params = props.match.params
  // canvas index
  const tokenIndex = parseInt(params.index)
  const type = params.type
  // id,cansiterid
  const canvasPrinId = params.prinId
  let [allMember, setAllMembers] = useState(null)
  const [owner, setNFTOwner] = useState('')
  const dispatch = useDispatch()
  const isAlone = () => {
    return type === AloneCreate
  }
  const { canvasInfo, highestInfo, isAuth } = useSelector((state) => {
    let isAuth = state.auth.getIn(['isAuth']) || false
    let authToken = state.auth.getIn(['authToken']) || ''
    let key1 = `canvasInfo-${type}-${canvasPrinId}`
    let canvasInfo = (state.allcavans && state.allcavans.getIn([key1])) || {}
    let highestInfo = []
    if (!isAlone()) {
      highestInfo = (state.allcavans && state.allcavans.getIn([`priceHighestInfo-${canvasPrinId}`])) || []
    }
    return {
      canvasInfo: canvasInfo,
      highestInfo: highestInfo,
      isAuth: isAuth
    }
  }, shallowEqual)

  // other hooks
  useEffect(() => {
    //获取画布的相关信息：name、desc等
    if (canvasInfo.tokenIndex === undefined) dispatch(getCanvasInfoById(type, canvasPrinId))
    dispatch(getNFTListingInfoByType(type, tokenIndex))
    //获取最高价格的像素点
    if (type !== AloneCreate && !highestInfo.length) {
      dispatch(getHighestInfoById(type, canvasPrinId))
    }
    getNFTOwnerByIndex(type, tokenIndex, (res) => {
      setNFTOwner(res)
    })
    isAlone() &&
      requestCanister(
        getAllMemberConsume,
        {
          prinId: canvasPrinId,
          success: (res) => {
            setAllMembers(res)
          }
        },
        false
      )
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

  const onWindowResize = () => {}

  const listingUpdateFunc = (topic, info) => {
    if (info.type === type && info.tokenIndex === tokenIndex) {
      dispatch(getNFTListingInfoByType(type, tokenIndex))
    }
  }

  useEffect(() => {
    addListener()
    const listUpdate = PubSub.subscribe(ListingUpdate, listingUpdateFunc)
    return () => {
      PubSub.unsubscribe(listUpdate)
      removeListener()
      setAllMembers = () => false
    }
  }, [])

  const onSuccessBuy = () => {
    dispatch(getNFTListingInfoByType(type, tokenIndex))
    getNFTOwnerByIndex(type, tokenIndex, (res) => {
      setNFTOwner(res)
    })
  }
  return (
    <MarketDetailWrapper>
      <MarketDetailTopWrapper>
        <MarketDetailLeft>
          <CanvasPictureInfo type={type} index={tokenIndex} prinId={canvasPrinId} />
        </MarketDetailLeft>
        <MarketDetailRight>
          <div className="title">
            <div className="index">
              <span>{`${getIndexPrefix(type, canvasInfo.tokenIndex)}`}</span>
            </div>
          </div>
          <div className="owner">
            <Owner prinId={owner ? owner[0].toText() : ''} />
            <FavoriteIcon index={tokenIndex} prinId={canvasPrinId} type={type} />
          </div>
          <MarketDetailBlock height={transformPxToRem('220px')} marginTop={transformPxToRem('20px')}>
            <BuyNowContent
              className={''}
              index={tokenIndex}
              prinId={canvasPrinId}
              type={type}
              owner={owner}
              onSuccessBuy={onSuccessBuy}
            />
          </MarketDetailBlock>

          <MarketDetailBlock
            height={transformPxToRem(isAlone() ? '230px' : '340px')}
            marginTop={transformPxToRem('8px')}
          >
            <div className="titleLayout">
              <img src={Detail}></img>
              <div className="titleValue">Detail</div>
            </div>
            <CanvasInfo
              canvasInfo={canvasInfo}
              highestInfo={highestInfo}
              type={type}
              prinId={canvasPrinId}
              allMember={allMember}
              detailExpand={true}
              hideLine={true}
            />
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
    </MarketDetailWrapper>
  )
}

export default memo(MarketDetail)
