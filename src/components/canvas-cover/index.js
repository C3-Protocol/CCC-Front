import React, { memo, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { AloneCreate, CrowdCreate } from '@/constants'
import { getCanvasInfoById, getNFTListingInfoByType } from '@/pages/home/store/actions'
import { getHighestInfoById, getFinshedTimeById } from '@/pages/home/store/request'
import CrowdDone from './crowd-done'
import CrowdUndone from './crowd-undone'
import WalletNFT from './wallet-nft'
import MarketNFT from './market-nft'
import WalletDrew from './wallet-drew'
import HomeNFT from './home-nft'
import { ListingUpdate } from '@/message'
import PubSub from 'pubsub-js'

// canvas缩略图组件
function CavansCover(props) {
  let mount = true
  const { info, type, itemIndex } = props
  // canvas index
  const tokenIndex = (info && info[0]) || 0

  // id,cansiterid
  const canvasPrinId = (info && info[1].toText()) || ''
  const [highestInfo, setHighestInfo] = useState([])
  const [finishTime, setFinishTime] = useState(0)

  const dispatch = useDispatch()
  const isAlone = () => {
    return props.type === AloneCreate
  }
  const { canvasInfo, listingInfo } = useSelector((state) => {
    let key1 = isAlone() ? `aloneInfo-${canvasPrinId}` : `multiInfo-${canvasPrinId}`
    let canvasInfo = (state.allcavans && state.allcavans.getIn([key1])) || {}
    let key3 = isAlone() ? `aloneNFTInfo-${tokenIndex}` : `multiNFTInfo-${tokenIndex}`
    let listingInfo = props.thumbType != 'crowdUndone' ? (state.allcavans && state.allcavans.getIn([key3])) || {} : {}
    if (isAlone() && tokenIndex === 0) {
      console.log('canvasInfo.backGround = ', canvasInfo.backGround)
    }
    return {
      canvasInfo: canvasInfo,
      listingInfo: listingInfo
    }
  }, shallowEqual)

  const [windowWidth, setWindowSize] = useState(0)

  const addListener = () => {
    window.addEventListener('resize', onWindowResize)
    onWindowResize()
  }
  const removeListener = () => {
    window.removeEventListener('resize', onWindowResize)
  }

  const onWindowResize = () => {
    setWindowSize(window.innerWidth)
  }

  useEffect(() => {
    addListener()
    return () => {
      removeListener()
    }
  }, [])
  // other hooks
  useEffect(() => {
    //获取画布的相关信息：name、desc等
    dispatch(getCanvasInfoById(props.type, canvasPrinId))
    //获取nft是否挂单的信息
    if (props.thumbType != 'crowdUndone') {
      dispatch(getNFTListingInfoByType(props.type, tokenIndex))
    } else {
      getFinshedTimeById(canvasPrinId, (res) => {
        mount && setFinishTime(res)
      })
    }
    //获取最高价格的像素点
    if ((props.thumbType === 'crowdUndone' || props.thumbType === 'crowdDone') && props.type === CrowdCreate) {
      getHighestInfoById(canvasPrinId, (res) => {
        mount && setHighestInfo(res)
      })
    }
    //事件信息绑定
  }, [dispatch])

  useEffect(() => {
    const listUpdate = PubSub.subscribe(ListingUpdate, listingUpdateFunc)
    return () => {
      PubSub.unsubscribe(listUpdate)
      mount = false
    }
  }, [])

  const listingUpdateFunc = (topic, info) => {
    if (info.type === props.type && info.tokenIndex === tokenIndex) {
      if (props.thumbType != 'crowdUndone') {
        dispatch(getNFTListingInfoByType(props.type, tokenIndex))
      }
    }
  }

  const handlerOnItemClick = () => {
    props.onItemClick &&
      props.onItemClick({ prinId: canvasPrinId, canvasInfo: canvasInfo }, props.type, props.thumbType)
  }

  const handlerOnButtonClick = (e) => {
    props.onButtonClick &&
      props.onButtonClick(
        { prinId: canvasPrinId, canvasInfo: canvasInfo, tokenIndex: tokenIndex, listingInfo: listingInfo },
        props.type
      )
  }
  const handlerOnButton1Click = (e) => {
    props.onButton1Click &&
      props.onButton1Click(
        { prinId: canvasPrinId, canvasInfo: canvasInfo, tokenIndex: tokenIndex, listingInfo: listingInfo },
        props.type
      )
  }

  const getContentItem = (thumbType) => {
    const { isNFTOver } = canvasInfo
    let content
    thumbType === 'crowdDone' &&
      (content = (
        <CrowdDone
          canvasPrinId={canvasPrinId}
          canvasInfo={canvasInfo}
          highestInfo={highestInfo}
          listingInfo={listingInfo}
          finishTime={finishTime}
          type={type}
          windowWidth={windowWidth}
          thumbType={thumbType}
          colCount={props.colCount}
          onItemClick={handlerOnItemClick}
        />
      ))
    thumbType === 'crowdUndone' &&
      (content = (
        <CrowdUndone
          canvasPrinId={canvasPrinId}
          canvasInfo={canvasInfo}
          highestInfo={highestInfo}
          listingInfo={listingInfo}
          finishTime={finishTime}
          type={type}
          windowWidth={windowWidth}
          thumbType={thumbType}
          onItemClick={handlerOnItemClick}
        />
      ))
    thumbType === 'wallet-nft' &&
      (content = (
        <WalletNFT
          canvasPrinId={canvasPrinId}
          canvasInfo={canvasInfo}
          highestInfo={highestInfo}
          listingInfo={listingInfo}
          type={type}
          windowWidth={windowWidth}
          thumbType={thumbType}
          onItemClick={handlerOnItemClick}
          onButton1Click={handlerOnButton1Click}
          onButtonClick={handlerOnButtonClick}
        />
      ))
    thumbType === 'home-nft' &&
      (content = (
        <HomeNFT
          canvasPrinId={canvasPrinId}
          canvasInfo={canvasInfo}
          highestInfo={highestInfo}
          listingInfo={listingInfo}
          type={type}
          windowWidth={windowWidth}
          thumbType={thumbType}
          onItemClick={handlerOnItemClick}
        />
      ))
    thumbType === 'market-nft' &&
      (content = (
        <MarketNFT
          canvasPrinId={canvasPrinId}
          canvasInfo={canvasInfo}
          highestInfo={highestInfo}
          listingInfo={listingInfo}
          type={type}
          windowWidth={windowWidth}
          thumbType={thumbType}
          colCount={props.colCount}
          onItemClick={handlerOnItemClick}
        />
      ))
    thumbType === 'drew' &&
      (content = (
        <WalletDrew
          canvasPrinId={canvasPrinId}
          canvasInfo={canvasInfo}
          highestInfo={highestInfo}
          listingInfo={listingInfo}
          type={type}
          windowWidth={windowWidth}
          thumbType={thumbType}
          onItemClick={handlerOnItemClick}
        />
      ))
    return content || <div />
  }
  return getContentItem(props.thumbType)
}

export default memo(CavansCover)
