import { CommonNFTWrapper } from './style'
import React, { memo, useRef, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { getNFTDetailInfoByIndex, getNFTListingInfoByType } from '@/pages/home/store/actions'
import { Button, message, Skeleton, Tooltip, Image, Spin } from 'antd'
import { ListingUpdate, OwnedNFTUpdate, PlayVideo } from '@/message'
import PubSub from 'pubsub-js'
import WICPPrice from '../wicp-price'
import { useHistory } from 'react-router-dom'
import { TurtlesCreate, ZombieNFTCreate, BlindBoxStatus, ArtCollection } from '@/constants'
import RarityNameConfig from '@/assets/scripts/rarityNameConfig'
import Dialog from '@/components/dialog'
import BuyContent from '@/pages/marketPlace/nft-detail/nft-buy'
import VideoPlayer from '@/components/video-player'
import { Play, Pause, NFTTransfer } from '@/icons'
import { find } from 'lodash-es'
import { openBlindBox, isBlindBoxOpen } from '@/api/nftHandler'
import Toast from '@/components/toast'
import { requestCanister } from '@/api/handler'
import { getIPFSLink } from '@/utils/utils'
import Operation from '../operation-nft'

// turtles的nft
function CommonNFTCover(props) {
  const history = useHistory()
  const zombiePart = ['hat', 'head', 'arm', 'leg', 'background']
  const { baseInfo, marketInfo } = props
  const [imgUrl, setImgUrl] = useState(baseInfo.imgUrl)
  const [detailUrl, setDetailUrl] = useState(baseInfo.detailUrl)
  const { tokenIndex, prinId, type } = baseInfo
  const isArtCollection = type.startsWith(ArtCollection)
  const tokenIndexRef = useRef()
  tokenIndexRef.current = tokenIndex
  const typeRef = useRef()
  typeRef.current = type
  const dispatch = useDispatch()
  const [isBlindBox, setBlindBox] = useState(false)
  const { listingInfo, authToken, nftInfo, collectionsConfig, blindBoxStatus } = useSelector((state) => {
    let key1 = `noCanvasNFTInfo-${type}-${tokenIndex}`
    let nftInfo = (state.allcavans && state.allcavans.getIn([key1])) || {}
    let key2 = `nftInfo-${type}-${tokenIndex}`
    let listingInfo = (state.allcavans && state.allcavans.getIn([key2])) || {}
    return {
      nftInfo,
      listingInfo: listingInfo,
      authToken: state.auth.getIn(['authToken']) || '',
      collectionsConfig: state.auth.getIn(['collection']) || [],
      blindBoxStatus: state.allcavans.getIn([`blindbox-${type}`])
    }
  }, shallowEqual)

  const itemInfo = find(collectionsConfig, { key: type })
  const rarityItem = find(RarityNameConfig, { key: type })
  const [playing, setPlaying] = useState(false)
  const playingRef = useRef()
  playingRef.current = playing

  useEffect(() => {
    //获取画布的相关信息：name、desc等
    !marketInfo && dispatch(getNFTListingInfoByType(type, tokenIndex))
    //事件信息绑定
  }, [dispatch])

  useEffect(() => {
    if (imgUrl !== baseInfo.imgUrl) {
      setImgUrl(baseInfo.imgUrl)
    }
    if (detailUrl !== baseInfo.detailUrl) {
      setDetailUrl(baseInfo.detailUrl)
    }
  }, [baseInfo])

  useEffect(() => {
    if ((!marketInfo && nftInfo.tokenIndex === undefined) || type === 'car')
      dispatch(getNFTDetailInfoByIndex(type, tokenIndex))
    if (playing) setPlaying(false)
  }, [tokenIndex])

  useEffect(() => {
    if (blindBoxStatus === BlindBoxStatus.CanOpen) {
      requestCanister(
        isBlindBoxOpen,
        {
          type,
          tokenIndex,
          success: (res) => {
            setBlindBox(!res)
          }
        },
        false
      )
    }
  }, [blindBoxStatus])

  useEffect(() => {
    const listUpdate = PubSub.subscribe(ListingUpdate, listingUpdateFunc)
    const playUpdate = PubSub.subscribe(PlayVideo, playVideoUpdateFunc)
    const tokenInfoUpdate = PubSub.subscribe(OwnedNFTUpdate, tokenInfoUpdateFunc)
    return () => {
      setPlaying(false)
      PubSub.unsubscribe(listUpdate)
      PubSub.unsubscribe(playUpdate)
      PubSub.unsubscribe(tokenInfoUpdate)
    }
  }, [])

  const listingUpdateFunc = (topic, info) => {
    if (info.type === typeRef.current && info.tokenIndex === tokenIndexRef.current) {
      dispatch(getNFTListingInfoByType(typeRef.current, tokenIndex))
    }
  }

  const playVideoUpdateFunc = (topic, info) => {
    if (info.type === typeRef.current && info.tokenIndex !== tokenIndexRef.current) {
      if (playingRef.current) setPlaying(false)
    }
  }

  const tokenInfoUpdateFunc = (topic, info) => {
    if (info.type === typeRef.current && typeRef.current === 'car' && info.tokenIndex !== tokenIndexRef.current) {
      dispatch(getNFTDetailInfoByIndex(typeRef.current, tokenIndexRef.current))
    }
  }
  const getNFTRarityScore = () => {
    if (marketInfo) {
      return Math.round(marketInfo.rarityScore * 100) / 100
    } else if (nftInfo.rarityScore) {
      return Math.round(nftInfo.rarityScore * 100) / 100
    }
    return 0
  }

  const getZombieCe = () => {
    if (marketInfo) {
      return `${marketInfo.CE}`
    } else if (nftInfo) {
      let attack = 0,
        defense = 0,
        agile = 0
      for (let i = 0; i < zombiePart.length; i++) {
        let info = nftInfo[zombiePart[i]]
        attack += info ? parseInt(info.attack) : 0
        defense += info ? parseInt(info.defense) : 0
        agile += info ? parseInt(info.agile) : 0
      }
      return attack + defense + agile
    }
    return 0
  }

  const handlerOnButtonClick = (e, operation) => {
    e.stopPropagation()
    props.onButtonClick && props.onButtonClick({ tokenIndex, prinId, listingInfo, baseInfo }, type, operation)
  }

  const handlerOnTransferClick = (e) => {
    e.stopPropagation()
    props.onButton1Click && props.onButton1Click({ tokenIndex, prinId }, type)
  }

  const handlerOpenBlindboxClick = (e) => {
    e.stopPropagation()
    let notice = Toast.loading('Opening', 0)
    let data = {
      type,
      tokenIndex,
      success: (res) => {
        if (res) {
          setBlindBox(false)
          if (res?.ok?.videoLink) setDetailUrl(getIPFSLink(res.ok.videoLink[0]))
          if (res?.ok?.photoLink) setImgUrl(getIPFSLink(res.ok.photoLink[0]))
          dispatch(getNFTDetailInfoByIndex(type, tokenIndex))
        }
      },
      fail: (error) => {
        if (error) message.error(error)
      },
      error: (error) => {},
      notice: notice
    }
    requestCanister(openBlindBox, data)
  }

  const handlerOnItemClick = () => {
    history.push(
      `/third/${type}/${tokenIndex}/${prinId || 'ipfs'}/${encodeURIComponent(imgUrl)}/${encodeURIComponent(detailUrl)}`
    )
    props.onItemClick && props.onItemClick({ tokenIndex, prinId }, type)
  }

  const handlerOnPlayClick = (e) => {
    e.stopPropagation()
    setPlaying(!playing)
    PubSub.publish(PlayVideo, { type, tokenIndex })
  }

  const handlerBuyClick = (e) => {
    e.stopPropagation()
    let temp = marketInfo || listingInfo
    if (temp.seller.toText() === authToken) {
      message.error('Not allow buy self')
      return
    }
    Dialog.createAndShowDialog(
      <BuyContent
        listingInfo={marketInfo || listingInfo}
        tokenIndex={tokenIndex}
        prinId={prinId}
        imgUrl={imgUrl}
        type={type}
        onBuyUpdate={() => {
          PubSub.publish(OwnedNFTUpdate, { type })
          PubSub.publish(ListingUpdate, { type })
        }}
      />,
      0
    )
  }

  const isVideo = () => {
    if (itemInfo && itemInfo.nftType === 'video') return true
    else if (itemInfo && itemInfo.nftType === 'blindbox') {
      if (blindBoxStatus === BlindBoxStatus.NotOpen) {
        if (type === 'kverso') return true
      } else if (blindBoxStatus === BlindBoxStatus.CanOpen) {
        if (isBlindBox && type === 'kverso') return true
      }
    }
    const audio = ['.mp4', '.mp3', '.mpeg', '.mov', '.rmvb', '.flv', '.aac', '.m3u', '.wav']
    let filter = audio.filter((item) => {
      if (detailUrl.endsWith(item)) return true
      return false
    })
    if (filter.length > 0) {
      return true
    }
    return false
  }

  const getNFTContent = () => {
    let content
    if (isVideo()) {
      !playing
        ? (content = (
            <div className="image-wrapper">
              <Image src={imgUrl} placeholder={<Skeleton.Image />} preview={false} />
            </div>
          ))
        : (content = (
            <div className="image-wrapper">
              <VideoPlayer src={detailUrl} controls={false} />
            </div>
          ))
    } else if (type === TurtlesCreate) content = <embed className="image-wrapper" src={imgUrl} />
    else
      content = (
        <div className={type === ZombieNFTCreate ? 'zombie-image-wrapper' : 'image-wrapper'}>
          <Image src={imgUrl} placeholder={<Skeleton.Image />} fallback={detailUrl} preview={false} />
        </div>
      )
    return content
  }

  const getNFTTitle = () => {
    if (isArtCollection) {
      return baseInfo?.name ? `${baseInfo?.name}` : `${type.split(':')[3]}#${tokenIndex}`
    }
    return `${itemInfo?.title}#${tokenIndex}`
  }

  const propsData = {
    canOperation: baseInfo.canOperation,
    listingInfo: marketInfo || listingInfo,
    handlerOnButtonClick,
    handlerOpenBlindboxClick,
    blindBoxStatus,
    isBlindBox,
    handlerBuyClick,
    handlerOnTransferClick
  }
  return (
    <CommonNFTWrapper onClick={handlerOnItemClick}>
      <div className="image-content">
        {/* <LazyLoad throttle={200} height={200}> */}
        {/* <Skeleton.Image /> */}
        {getNFTContent()}
        {/* </LazyLoad> */}
        <div className="transparent" />
        {isVideo() && detailUrl && (
          <div className="control-icon">
            <div className="icon" onClick={handlerOnPlayClick}>
              {playing ? Pause : Play}
            </div>
          </div>
        )}
      </div>

      <div className="detail">
        <div className="nft-index">{getNFTTitle()}</div>
      </div>
      {getNFTRarityScore() > 0 && (
        <div className="detail">
          <div className="nft-rare">
            {`${rarityItem ? rarityItem.valueName : 'Rarity'}: `}
            <span>{getNFTRarityScore() + (rarityItem ? rarityItem.valueAdd : '')}</span>
          </div>
          {type === ZombieNFTCreate && (
            <div className="nft-rare">
              CE: <span>{getZombieCe()}</span>
            </div>
          )}
        </div>
      )}
      <div className="detail nft-operation">
        {baseInfo.canOperation ? <Operation {...propsData} /> : <div></div>}
        <div>
          {marketInfo && marketInfo.price ? (
            <WICPPrice iconSize={20} value={marketInfo.price} valueStyle={'value-20'} ellipsis={18} />
          ) : listingInfo?.seller ? (
            <WICPPrice iconSize={20} value={listingInfo?.price} valueStyle={'value-20'} ellipsis={18} />
          ) : (
            <WICPPrice iconSize={20} value={0} valueStyle={'value-20'} wrapperStyle={'hidden'} />
          )}
        </div>
      </div>
      <div className="operation">
        {!baseInfo.canOperation && ((marketInfo && marketInfo.seller) || (listingInfo && listingInfo.seller)) && (
          <Button className="btn-mini-fixed" type="violet" onClick={handlerBuyClick}>
            Buy
          </Button>
        )}
      </div>
    </CommonNFTWrapper>
  )
}

export default memo(CommonNFTCover)
