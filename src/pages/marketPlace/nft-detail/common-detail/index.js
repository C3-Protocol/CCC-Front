import React, { memo, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import History from '@/assets/images/market/history.png'
import { getNFTDetailInfoByIndex, getNFTListingInfoByType, getBlindBoxStatus } from '@/pages/home/store/actions'
import { getNFTOwnerByIndex } from '@/pages/home/store/request'
import { DetailLeft, AttrBoxWrapper, ZombieDetailLeft, ZombieAttrWrapper } from './style'
import { MarketDetailTopWrapper, MarketDetailWrapper, MarketDetailBlock, MarketDetailRight } from '../style'
import { transformPxToRem, isBlindBoxUrl, getIPFSLink } from '@/utils/utils'
import NFTTradeHistory from '../../cpns/nft-history/index'
import { ListingUpdate } from '@/message'
import PubSub from 'pubsub-js'
import FavoriteIcon from '../../cpns/favorite-icon'
import Owner from '@/pages/marketPlace/cpns/owner'
import BuyNowContent from '@/pages/marketPlace/cpns/buyNow-content'
import { Tooltip, Image, Button } from 'antd'
import { requestCanister } from '@/api/handler'
import { getMetaDataByIndex, getLinkInfoByIndex } from '@/api/nftHandler'
import { TurtlesCreate, ZombieNFTCreate, BlindBoxStatus, ArtCollection } from '@/constants'
import { getCreateCollectionDetailInfo, getCreateNFTMetaDataByIndex } from '@/pages/home/store/actions'
import { Warning } from '@/icons'
import VideoPlayer from '@/components/video-player'
import RarityNameConfig from '@/assets/scripts/rarityNameConfig'
import { find } from 'lodash-es'
import Detail from '@/assets/images/market/detail.png'

function CommonNFTDetail(props) {
  let mount = true
  const params = props.match.params
  // canvas index
  const tokenIndex = parseInt(params.index)
  const prinId = params.prinId
  const type = params.type
  const isArtCollection = type.startsWith(ArtCollection)
  const [imgUrl, setImgUrl] = useState(decodeURIComponent(params.imgUrl))
  const [detailUrl, setDetailUrl] = useState(decodeURIComponent(params.detailUrl))
  const [isCheckUrl, setCheckUrl] = useState(false)
  const [owner, setNFTOwner] = useState('')
  const [rankName, setRankName] = useState(null)
  const dispatch = useDispatch()
  const zombiePart = ['hat', 'head', 'arm', 'leg', 'background']
  const zombiePartName = ['Hat', 'Head', 'Upper body', 'Lower body', 'Background']
  const [isBlindBox, setBlindBox] = useState(isBlindBoxUrl(type, imgUrl, detailUrl))
  const { isAuth, nftInfo, itemConfig, blindBoxStatus, createNFTInfo } = useSelector((state) => {
    let isAuth = state.auth.getIn(['isAuth']) || false
    let key1 = `noCanvasNFTInfo-${type}-${tokenIndex}`
    let nftInfo = (state.allcavans && state.allcavans.getIn([key1])) || null
    let itemConfig
    let createNFTInfo
    if (isArtCollection) {
      itemConfig = state.allcavans && state.allcavans.getIn([type])
      createNFTInfo = state.allcavans && state.allcavans.getIn([`createNFT-${type}-${tokenIndex}`])
    } else {
      let collectionsConfig = state.auth.getIn(['collection'])
      if (collectionsConfig) itemConfig = find(collectionsConfig, { key: type })
    }
    return {
      isAuth: isAuth,
      nftInfo: nftInfo,
      blindBoxStatus: state.allcavans.getIn([`blindbox-${type}`]),
      itemConfig,
      createNFTInfo
    }
  }, shallowEqual)

  const rarityItem = find(RarityNameConfig, { key: type })
  const checkContentUrl = () => {
    if (isBlindBox) {
      requestCanister(
        getLinkInfoByIndex,
        {
          type,
          tokenIndex,
          success: (res) => {
            setImgUrl(getIPFSLink(res[0][0]))
            setDetailUrl(getIPFSLink(res[1][0]))
            setBlindBox(isBlindBoxUrl(type, getIPFSLink(res[0][0]), getIPFSLink(res[1][0])))
            setCheckUrl(true)
          }
        },
        false
      )
    } else {
      setCheckUrl(true)
    }
  }
  // other hooks
  useEffect(() => {
    if (!itemConfig) return
    if (nftInfo === null || type === 'car') dispatch(getNFTDetailInfoByIndex(type, tokenIndex))
    dispatch(getNFTListingInfoByType(type, tokenIndex))
    if (itemConfig.nftType === 'blindbox') dispatch(getBlindBoxStatus(itemConfig))
    checkContentUrl()
    getNFTOwnerByIndex(type, tokenIndex, (res) => {
      mount && setNFTOwner(res)
    })
    requestCanister(
      getMetaDataByIndex,
      {
        type,
        tokenIndex,
        success: (res) => {
          mount && setRankName(res)
        }
      },
      false
    )
    if (document?.documentElement || document?.body) {
      document.documentElement.scrollTop = document.body.scrollTop = 0
    }
    //事件信息绑定
  }, [itemConfig])

  useEffect(() => {
    if (isArtCollection) {
      if (!itemConfig) dispatch(getCreateCollectionDetailInfo(type))
      if (!createNFTInfo) dispatch(getCreateNFTMetaDataByIndex(type, tokenIndex))
    }
  }, [])

  const listingUpdateFunc = (topic, info) => {
    if (info.type === type && info.tokenIndex === tokenIndex) {
      dispatch(getNFTListingInfoByType(type, tokenIndex))
    }
  }

  useEffect(() => {
    const listUpdate = PubSub.subscribe(ListingUpdate, listingUpdateFunc)
    return () => {
      PubSub.unsubscribe(listUpdate)
      mount = false
    }
  }, [])

  const onSuccessBuy = () => {
    dispatch(getNFTListingInfoByType(type, tokenIndex))
    getNFTOwnerByIndex(type, tokenIndex, (res) => {
      setNFTOwner(res)
    })
  }

  const getZombieTotalAttrValue = () => {
    if (!nftInfo) return <></>
    let attack = 0
    let defense = 0
    let agile = 0
    for (let i = 0; i < zombiePart.length; i++) {
      let info = nftInfo[zombiePart[i]]
      attack += info ? parseInt(info.attack) : 0
      defense += info ? parseInt(info.defense) : 0
      agile += info ? parseInt(info.agile) : 0
    }
    return (
      <ZombieAttrWrapper>
        <div className="title">
          <div className="attr-name">Attack</div>
          <div className="attr-name">Defense</div>
          <div className="attr-name">Agility</div>
        </div>
        <div className="attr-sub-title">
          <div className="attr-value">{attack}</div>
          <div className="attr-value">{defense}</div>
          <div className="attr-value">{agile}</div>
        </div>
      </ZombieAttrWrapper>
    )
  }
  const getZombieAttrBox = () => {
    if (!nftInfo) return <></>
    let comp = []
    for (let i = 0; i < zombiePart.length; i++) {
      let info = nftInfo[zombiePart[i]]
      let level
      if (info)
        for (let key in info.level) {
          if (key) {
            level = key
            break
          }
        }
      comp.push(
        <div className="box" key={zombiePartName[i]}>
          <h1>{zombiePartName[i]}</h1>
          {info && <h5>{`Name: ${info.name}`}</h5>}
          {info && <h5>{`Level: ${level}`}</h5>}
          {info && <h5>{`RarityScore: ${info.rarityScore}`}</h5>}
        </div>
      )
    }
    return comp
  }

  const getTurtlesAttrBox = () => {
    let name = {
      attack: 'Attack',
      defense: 'Defense',
      special_attack: 'Special attack',
      special_defense: 'Special defense',
      intelligence: 'Intelligence',
      agility: 'Agility'
    }
    if (nftInfo && nftInfo.length > 1) {
      let comp = []
      for (let i = 0; i < nftInfo[1].length; i++) {
        comp.push(
          <div className="box" key={i}>
            <h1>{name[nftInfo[1][i][0]]}</h1>
            <h5>value: {parseInt(nftInfo[1][i][1])}</h5>
          </div>
        )
      }
      return comp
    }
  }

  const getCommonAttrBox = () => {
    let comp = []
    if (nftInfo) {
      if (nftInfo.attrArr) {
        nftInfo.attrArr.map((attr, index) => {
          comp.push(
            <div className="box" key={index}>
              <h1>{attr.traitType}</h1>
              {itemConfig && <h5>{attr.rarity ? `Name: ${attr.name}` : attr.name}</h5>}
              {itemConfig && attr.rarity && (
                <h5>{`${itemConfig.attrName || 'RarityScore'}: ${attr.rarity}${itemConfig.attrValueAdd || ''}`}</h5>
              )}
            </div>
          )
        })
      } else {
        for (let key in nftInfo) {
          if (nftInfo[key] && nftInfo[key].name) {
            let title = key.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
            comp.push(
              <div className="box" key={key}>
                <h1>{title}</h1>
                {itemConfig && <h5>{nftInfo[key].rarity ? `Name: ${nftInfo[key].name}` : nftInfo[key].name}</h5>}
                {itemConfig && nftInfo[key].rarity && (
                  <h5>{`${itemConfig.attrName || 'RarityScore'}: ${nftInfo[key].rarity}${
                    itemConfig.attrValueAdd || ''
                  }`}</h5>
                )}
              </div>
            )
          }
        }
      }
    }
    return comp
  }

  const getAttrBox = () => {
    if (type === TurtlesCreate) {
      return getTurtlesAttrBox()
    } else if (type === ZombieNFTCreate) {
      return getZombieAttrBox()
    } else {
      return getCommonAttrBox()
    }
  }

  const isVideo = () => {
    if (itemConfig && itemConfig.nftType === 'video') return true
    else if (itemConfig && itemConfig.nftType === 'blindbox') {
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
    if (!isCheckUrl) return <></>
    let content
    if (isVideo())
      content = (
        <div className="video-wrapper">
          <VideoPlayer src={detailUrl} controls={true} />
        </div>
      )
    else if (type === TurtlesCreate) content = <embed src={detailUrl} />
    else if (detailUrl.endsWith('.html')) content = <embed src={detailUrl} width="100%" height="100%" />
    else if (type !== TurtlesCreate) content = <Image src={detailUrl} />
    return content || <></>
  }

  const getNFTTitle = () => {
    if (isArtCollection) {
      return createNFTInfo?.name || `${type.split(':')[3]}#${tokenIndex}`
    }
    return `${itemConfig && itemConfig.title}#${tokenIndex}`
  }

  const isCanFork = () => {
    if (isArtCollection && itemConfig?.forkable) {
      if (!isVideo() && !detailUrl.endsWith('.html')) {
        return true
      }
    }
    return false
  }

  return (
    <MarketDetailWrapper>
      <MarketDetailTopWrapper>
        {type === ZombieNFTCreate ? (
          <ZombieDetailLeft>
            <Image src={detailUrl} />
          </ZombieDetailLeft>
        ) : (
          <DetailLeft>{getNFTContent()}</DetailLeft>
        )}
        <MarketDetailRight>
          {itemConfig && (
            <div className="title">
              <div className="index">
                <span>{getNFTTitle()}</span>
                {rankName && <div className="rarity tip tip-000">{rankName}</div>}
                {nftInfo && nftInfo.rarityScore > 0 && (
                  <div className="rarity tip tip-000">{`${rarityItem ? rarityItem.valueName : 'Rarity'}: ${
                    Math.round(nftInfo.rarityScore * 100) / 100 + (rarityItem ? rarityItem.valueAdd : '')
                  }`}</div>
                )}
              </div>
            </div>
          )}
          <div className="owner">
            <Owner prinId={owner ? owner[0].toText() : ''} />
            <div className="flex-20">
              {isCanFork() && (
                <a href={`/#/canvas/fork/${type}/${tokenIndex}/${encodeURIComponent(detailUrl)}`}>
                  <Button className="fork-btn">Fork</Button>
                </a>
              )}
              {!isArtCollection && itemConfig && <FavoriteIcon index={tokenIndex} prinId={prinId} type={type} />}
              <Tooltip
                color={'#000000dd'}
                placement="bottomLeft"
                overlayInnerStyle={{ width: '350px' }}
                title={
                  'Disclaimer: NFT trading has a high level of market risk. Please trade carefully. Please note that CCC is not responsible for your trading losses.The CCC Marketplace API and integration are open source, and any Dfinity project can use them. CCC thoroughly evaluates all projects that request for a listing; however, CCC cannot be held liable if a third-party project ceases to exist, disappears with assets, or pulls the rug out from under its community. Always do your research before investing any money. Thank you for your cooperation.'
                }
              >
                {type !== ZombieNFTCreate && !isArtCollection && Warning}
              </Tooltip>
            </div>
          </div>
          <MarketDetailBlock height={transformPxToRem('220px')} marginTop={transformPxToRem('20px')}>
            {/* {nftInfo && nftInfo.dna && <div className="tip tip-000">{`DNA: ${nftInfo.dna}`}</div>} */}
            {type === ZombieNFTCreate && getZombieTotalAttrValue()}
            <AttrBoxWrapper>{getAttrBox()}</AttrBoxWrapper>
            {itemConfig && (
              <BuyNowContent
                className={'content-between'}
                index={tokenIndex}
                prinId={prinId}
                type={type}
                owner={owner}
                imgUrl={imgUrl}
                onSuccessBuy={onSuccessBuy}
              />
            )}
          </MarketDetailBlock>
          {(type === ZombieNFTCreate || (isArtCollection && itemConfig)) && (
            <MarketDetailBlock
              height={transformPxToRem(isArtCollection ? '100px' : '200px')}
              marginTop={transformPxToRem('7px')}
            >
              <div className="titleLayout">
                <img src={Detail}></img>
                <div className="titleValue">Description</div>
              </div>
              <div className="contentValue">
                {isArtCollection ? (
                  <li>{createNFTInfo?.desc || ''}</li>
                ) : (
                  <li>
                    CCC’s Crazy Zombie is the only collection of zombies on the IC network. Zombies have the attack,
                    defense and agility (ADA) attributes, but also get a share from the crowd-creation bonus pool. Hold
                    a zombie and benefit from each CCC's crowd canvas. More details:
                    <a href="https://shortest.link/1OnT">https://shortest.link/1OnT</a>
                  </li>
                )}
              </div>
            </MarketDetailBlock>
          )}
        </MarketDetailRight>
      </MarketDetailTopWrapper>
      <MarketDetailBlock height={transformPxToRem('250px')} marginTop={transformPxToRem('48px')}>
        <div className="titleLayout">
          <img src={History}></img>
          <div className="titleValue">Trading History</div>
        </div>
        {itemConfig && <NFTTradeHistory type={type} tokenIndex={tokenIndex} />}
      </MarketDetailBlock>
    </MarketDetailWrapper>
  )
}

export default memo(CommonNFTDetail)
