import React, { memo, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { AloneCreate } from '@/constants'
import { getCanvasInfoById, getNFTListingInfoByType } from '@/pages/home/store/actions'
import { getHighestInfoById, balance1155Info, getM1155Listing } from '@/pages/home/store/request'
import CrowdUndone from './crowd-undone'
import CanvasNFT from './canvas-nft'
import { ListingUpdate, OwnedNFTUpdate } from '@/message'
import PubSub from 'pubsub-js'
import { useHistory } from 'react-router-dom'
import { is1155Canvas } from '@/utils/utils'

// canvas缩略图组件
function CavansCover(props) {
  const history = useHistory()
  const { info, type, marketInfo } = props
  // canvas index
  const tokenIndex = (info && info.tokenIndex) || 0

  // id,cansiterid
  const canvasPrinId = (info && info.prinId.toText()) || ''

  let [highestInfo, setHighestInfo] = useState([])
  let [m1155Info, set1155Info] = useState(info.rights)
  let [m1155listPrice, set1155ListPrice] = useState(0)
  const dispatch = useDispatch()

  const { canvasInfo, listingInfo, isAuth } = useSelector((state) => {
    let key1 = `canvasInfo-${props.type}-${canvasPrinId}`
    let canvasInfo = (state.allcavans && state.allcavans.getIn([key1])) || {}
    let key3 = `nftInfo-${props.type}-${tokenIndex}`
    let listingInfo = props.thumbType != 'crowdUndone' ? (state.allcavans && state.allcavans.getIn([key3])) || {} : {}
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      canvasInfo: canvasInfo,
      listingInfo: listingInfo
    }
  }, shallowEqual)

  const [windowWidth, setWindowSize] = useState(0)
  const is1155 = is1155Canvas(type)

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
    if (props.thumbType != 'crowdUndone' && !is1155 && !marketInfo) {
      dispatch(getNFTListingInfoByType(props.type, tokenIndex))
    }
    //获取最高价格的像素点
    if (props.thumbType === 'crowdUndone' && props.type !== AloneCreate) {
      getHighestInfoById(type, canvasPrinId, (res) => {
        setHighestInfo(res)
      })
    }
    if (is1155 && props.thumbType === 'market-nft')
      getM1155Listing(type, tokenIndex, (res) => {
        set1155ListPrice(res.length > 0 ? res[0][1].unitPrice : 0)
      })

    //事件信息绑定
  }, [dispatch])

  useEffect(() => {
    addListener()
    const listUpdate = PubSub.subscribe(ListingUpdate, listingUpdateFunc)
    const nftUpdata = PubSub.subscribe(OwnedNFTUpdate, (topic, info) => {
      if (is1155Canvas(info.type) && props.thumbType === 'wallet-nft')
        balance1155Info(type, tokenIndex, (res) => {
          set1155Info(res)
        })
    })
    return () => {
      PubSub.unsubscribe(listUpdate)
      PubSub.unsubscribe(nftUpdata)
      setHighestInfo = () => false
      set1155Info = () => false
      set1155ListPrice = () => false
      removeListener()
    }
  }, [])

  const listingUpdateFunc = (topic, info) => {
    if (info.type === props.type && info.tokenIndex === tokenIndex) {
      if (props.thumbType != 'crowdUndone' && !is1155) {
        dispatch(getNFTListingInfoByType(props.type, tokenIndex))
      }
    }
  }

  const handlerOnItemClick = () => {
    if (canvasInfo.isNFTOver !== undefined) {
      if (canvasInfo.isNFTOver) {
        if (is1155) {
          history.push(`/1155/${type}/${tokenIndex}/${canvasPrinId}`)
        } else {
          history.push(`/detail/${type}/${tokenIndex}/${canvasPrinId}`)
        }
        props.onItemClick && props.onItemClick({ tokenIndex, prinId: canvasPrinId }, type)
      } else {
        history.push(`/canvas/${type}/${canvasPrinId}`)
      }
    }
  }

  const handlerOnButtonClick = (opreateType) => {
    props.onButtonClick &&
      props.onButtonClick(
        {
          prinId: canvasPrinId,
          canvasInfo: canvasInfo,
          tokenIndex: tokenIndex,
          listingInfo: marketInfo || listingInfo,
          m1155Info
        },
        props.type,
        opreateType
      )
  }
  const handlerOnButton1Click = (e) => {
    props.onButton1Click &&
      props.onButton1Click(
        {
          prinId: canvasPrinId,
          canvasInfo: canvasInfo,
          tokenIndex: tokenIndex,
          listingInfo: marketInfo || listingInfo,
          m1155Info
        },
        props.type
      )
  }

  const getContentItem = (thumbType) => {
    const { isNFTOver } = canvasInfo
    let content

    thumbType === 'crowdUndone' &&
      (content = (
        <CrowdUndone
          canvasPrinId={canvasPrinId}
          canvasInfo={canvasInfo}
          highestInfo={highestInfo}
          listingInfo={marketInfo || listingInfo}
          type={type}
          windowWidth={windowWidth}
          thumbType={thumbType}
          onItemClick={handlerOnItemClick}
        />
      ))
    thumbType !== 'crowdUndone' &&
      (content = (
        <CanvasNFT
          canvasPrinId={canvasPrinId}
          canvasInfo={canvasInfo}
          highestInfo={highestInfo}
          listingInfo={marketInfo || listingInfo}
          m1155Info={m1155Info}
          m1155List={m1155listPrice}
          type={type}
          windowWidth={windowWidth}
          thumbType={thumbType}
          colCount={props.colCount}
          user={props.user}
          onItemClick={handlerOnItemClick}
          onButton1Click={handlerOnButton1Click}
          onButtonClick={handlerOnButtonClick}
        />
      ))

    return content || <div />
  }
  return getContentItem(props.thumbType)
}

export default memo(CavansCover)
