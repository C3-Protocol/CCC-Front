import { canisterManager } from './canisterManager'
import { Principal } from '@dfinity/principal'
import { getItemImageUrl, is1155Canvas, Storage, getIPFSLink } from '../utils/utils'
import { AloneCreate, ZombieNFTCreate, M1155Create, TurtlesCreate, Theme1155Create, isCanvas } from '@/constants'
import { getAllUserName } from './userHandler'
import { lessBalanceApproveWICPNat, approveWICPNat } from './handler'
import { isTestNet, BlindBoxStatus, ArtCollection } from '../constants'
import { filter, find, findIndex } from 'lodash-es'
import BigNumber from 'bignumber.js'
//get all my nft
export async function getAllNFTByType(data) {
  let { type, prinId } = data
  if (!prinId) return []
  let principal = Principal.fromText(prinId)
  let current = await canisterManager.getCurrentPrinId()
  let canOperation = prinId === current.toText()
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res
  if (fetch && fetch.getAllUserNFT) res = fetch && fetch.getAllUserNFT && (await fetch.getAllUserNFT(principal))
  else res = fetch && (await fetch.getAllNFT(principal))
  let res1 = []
  for (let item of res) {
    if (is1155Canvas(type))
      res1.push({ tokenIndex: item[0].index, prinId: item[0].canisterId, type, rights: item[1], canOperation })
    else if (item.index !== undefined)
      res1.push({
        tokenIndex: item.index,
        prinId: 'video',
        type,
        imgUrl: getIPFSLink(item.photoLink && item.photoLink[0]),
        detailUrl: getIPFSLink(item.videoLink && item.videoLink[0]),
        canOperation
      })
    else
      res1.push({
        tokenIndex: item[0],
        prinId: item[1],
        type,
        imgUrl: getItemImageUrl(type, item[1], item[0]),
        detailUrl: `https://${item[1]}.raw.ic0.app/token/${item[0]}`,
        canOperation
      })
  }
  return res1
}

//get drew canvas
export async function getParticipate(data) {
  let { type, prinId } = data
  let principal = prinId ? Principal.fromText(prinId) : await canisterManager.getCurrentPrinId()
  let fetch = await canisterManager.getFactoryStorageByType(type)
  let res = await fetch.getParticipate(principal)
  let formatRes = []
  if (res) {
    for (let item of res) {
      let index = findIndex(formatRes, (it) => {
        return it[0] == item.index
      })
      if (index === -1) formatRes.push({ tokenIndex: item.index, prinId: item.canisterId, type })
    }
  }
  return formatRes
}

//get all self setfavorite
export async function getAllFavoriteByType(data) {
  let { type, prinId } = data
  let principal = prinId ? Principal.fromText(prinId) : await canisterManager.getCurrentPrinId()
  let fetch = await canisterManager.getFactoryStorageByType(type)
  let res = fetch && (await fetch.getFavorite(principal))
  let formatRes = []
  if (res) {
    for (let item of res) {
      formatRes.push({
        tokenIndex: item.index,
        prinId: item.canisterId || 'video',
        type,
        imgUrl: getIPFSLink(item.photoLink && item.photoLink[0]) || getItemImageUrl(type, item.canisterId, item.index),
        detailUrl:
          getIPFSLink(item.videoLink && item.videoLink[0]) ||
          `https://${item.canisterId}.raw.ic0.app/token/${item.index}`,
        canOperation: false
      })
    }
  }
  return formatRes
}

//set favorite
export async function setFavorite(data) {
  let { type, tokenIndex, prinId } = data
  let fetch = await canisterManager.getNftFactoryByType(type, true)
  let ret = isCanvas(type)
    ? await fetch.setFavorite({ index: tokenIndex, canisterId: Principal.fromText(prinId) })
    : await fetch.setFavorite(tokenIndex)
  return ret
}

//cancel favorite
export async function cancelFavorite(data) {
  let { type, tokenIndex, prinId } = data
  let fetch = await canisterManager.getNftFactoryByType(type, true)
  let ret = isCanvas(type)
    ? await fetch.cancelFavorite({ index: tokenIndex, canisterId: Principal.fromText(prinId) })
    : await fetch.cancelFavorite(tokenIndex)

  return ret
}

//get all list
export async function factoryGetListingsByType(data) {
  let { type } = data
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let isArt = type.startsWith(ArtCollection)
  let canisterId
  if (isArt) {
    canisterId = type.split(':')[1]
  }
  if (fetch) {
    let res = await fetch.getListings()
    if (res) {
      let nftInfoArray = []
      for (const _nft of res) {
        var { 0: base, 1: sellInfo } = _nft
        var { price, time } = sellInfo.listings || sellInfo
        let info = {}
        for (let key in sellInfo) {
          if (key === 'listings') {
            for (let key1 in sellInfo.listings) {
              info[key1] = sellInfo.listings[key1]
            }
            continue
          }
          info[key] = sellInfo[key]
        }
        let baseInfo = {
          type,
          name: base.name,
          desc: base.desc,
          tokenIndex: base.index,
          prinId: base.canisterId || 'video',
          imgUrl:
            getIPFSLink(base.photoLink && base.photoLink[0]) || getItemImageUrl(type, base.canisterId, base.index),
          detailUrl:
            getIPFSLink(base.videoLink && (Array.isArray(base.videoLink) ? base.videoLink[0] : base.videoLink)) ||
            `https://${base.canisterId}.raw.ic0.app/token/${base.index}`,
          canOperation: false
        }
        nftInfoArray.push({
          baseInfo,
          nftType: type,
          sellInfo: info,
          time: time,
          sellPrice: price
        })
      }
      return nftInfoArray
    }
  }
  return
}

//get sold list
export async function factorySoldListingsByType(data) {
  let { type } = data
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let isArt = type.startsWith(ArtCollection)
  let canisterId
  if (isArt) {
    canisterId = type.split(':')[1]
  }
  if (fetch) {
    let res = await fetch.getSoldListings()
    if (res) {
      let nftInfoArray = []
      for (const _nft of res) {
        var { 0: base, 1: sellInfo } = _nft
        var { lastPrice, time } = sellInfo.listings || sellInfo
        let info = {}
        for (let key in sellInfo) {
          if (key === 'listings') {
            for (let key1 in sellInfo.listings) {
              info[key1] = sellInfo.listings[key1]
            }
            continue
          }
          info[key] = sellInfo[key]
        }
        info.price = lastPrice
        let baseInfo = {
          type,
          name: base.name,
          desc: base.desc,
          tokenIndex: base.index,
          prinId: base.canisterId || 'video',
          imgUrl:
            getIPFSLink(base.photoLink && base.photoLink[0]) || getItemImageUrl(type, base.canisterId, base.index),
          detailUrl:
            getIPFSLink(base.videoLink && (Array.isArray(base.videoLink) ? base.videoLink[0] : base.videoLink)) ||
            `https://${base.canisterId}.raw.ic0.app/token/${base.index}`,
          canOperation: false
        }

        nftInfoArray.push({
          baseInfo,
          nftType: type,
          sellInfo: info,
          time: time,
          sellPrice: lastPrice
        })
      }
      return nftInfoArray
    }
  }
  return
}

// query prinid
export async function factoryGetNFTByIndex(data) {
  let { type, index } = data
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  if (fetch) {
    let res = await fetch.getNFTByIndex(index)
    if (res) {
      return res
    }
  }
  return
}

// new a oder list
// args = {tokenIndex : 0, price : 10000}
//list
export async function addFactoryList(data) {
  let { tokenIndex, price, type } = data
  let noAuthFetch = await canisterManager.getNftFactoryByType(type, false)
  if (noAuthFetch.getbOpenMarket) {
    try {
      let res = await noAuthFetch.getbOpenMarket()
      if (!res) {
        return { err: { MarketNotOpen: null } }
      }
    } catch (e) {}
  }
  let args = { tokenIndex: tokenIndex, price: price }
  let fetch = await canisterManager.getNftFactoryByType(type, true)
  if (is1155Canvas(type)) {
    args.unitPrice = price
    args.quantity = data.quantity
  }
  if (fetch) {
    let res = await fetch.list(args)
    if (res) {
      return res
    }
  }
  return null
}
//update
export async function updateFactoryList(data) {
  let { tokenIndex, price, type } = data
  let noAuthFetch = await canisterManager.getNftFactoryByType(type, false)
  if (noAuthFetch.getbOpenMarket) {
    try {
      let res = await noAuthFetch.getbOpenMarket()
      if (!res) {
        return { err: { MarketNotOpen: null } }
      }
    } catch (e) {}
  }
  let args = { tokenIndex: tokenIndex, price: price }
  let fetch = await canisterManager.getNftFactoryByType(type, true)
  if (is1155Canvas(type)) {
    args.unitPrice = price
    args.quantity = data.quantity
  }
  if (fetch) {
    let res = await fetch.updateList(args)
    if (res) {
      return res
    }
  }
  return null
}

export const getMarketFeePrinID = (type) => {
  if (isTestNet) return 'nzxit-rkvki-565fj-4bjfz-p3qf5-2tw2y-bm7iz-xdubo-ndrms-2xmgc-vqe'
  let isArt = type.startsWith(ArtCollection)
  if (isArt) return ''
  if (type === Theme1155Create) {
    return 'ad7im-wslxf-ymon6-7injs-72btk-ynbju-3qh74-5j2go-k6vcs-56sw3-zqe'
  } else if (type === AloneCreate) {
    return 'nrmoa-frza4-mzhtk-fj2jy-5ehgi-wzw2t-pblcp-zjw7n-cqsmq-ygvxy-7qe'
  }
  let collectionConfig = canisterManager.getColletcionConfig()
  let item = find(collectionConfig, { key: type })
  if (item) {
    return item.feePrinId
  }
}

export const getMarketFeeRatio = (type) => {
  let isArt = type.startsWith(ArtCollection)
  if (isArt) {
    return 1n
  }
  let collectionConfig = canisterManager.getColletcionConfig()
  let item = find(collectionConfig, { key: type })
  if (item) {
    return item.commission
  }
  return 2n
}
//buy
export async function factoryBuyNow(data) {
  let { type, tokenIndex, price } = data
  let _pid = canisterManager.getNFTFacotryIdByType(type)
  await lessBalanceApproveWICPNat(_pid)
  let fetch = await canisterManager.getNftFactoryByType(type, true)
  if (fetch) {
    let param
    if (is1155Canvas(type)) {
      param = {
        tokenIndex: tokenIndex,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        orderIndex: data.orderIndex
      }
    }
    let isArt = type.startsWith(ArtCollection)
    let collectionsConfig = canisterManager.getColletcionConfig()
    let item = find(collectionsConfig, { key: type })
    if (type === Theme1155Create || type === AloneCreate || item || isArt) {
      !param && (param = {})
      param.tokenIndex = tokenIndex
      param.marketFeeRatio = getMarketFeeRatio(type)
      param.feeTo = Principal.fromText(getMarketFeePrinID(type))
    } else if (type !== M1155Create) {
      param = tokenIndex
    }
    if ((item && type !== TurtlesCreate) || isArt) {
      param.price = price
    } else {
      if (!is1155Canvas(type)) {
        let res = await getNFTListingInfo({ type, tokenIndex })
        if (res && res.length && res[0].price) {
          if (price < res[0].price) {
            return { err: { ListingInfoUpdated: null } }
          }
        }
      }
    }
    console.log('[factoryBuyNow] buyNow param:', param, type)
    let res = await fetch.buyNow(param)
    if (res) {
      if (res.err) {
        for (let key in res.err) {
          if (key === 'AllowedInsufficientBalance') {
            await approveWICPNat(_pid)
          }
        }
      }
      return res
    }
  }
  return null
}

//get list info
export async function getNFTListingInfo(data) {
  let { type, tokenIndex } = data
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res = fetch && (await fetch.isList(tokenIndex))
  return res || {}
}

//cancel list
export async function cancelNFTList(data) {
  let { type, tokenIndex } = data
  let fetch = await canisterManager.getNftFactoryByType(type, true)
  let param
  if (is1155Canvas(type)) {
    param = { tokenIndex: tokenIndex, unitPrice: data.unitPrice, orderIndex: data.orderIndex }
  } else {
    param = tokenIndex
  }
  let res = fetch && (await fetch.cancelList(param))
  return res || {}
}

//query nft owner
export async function getNFTOwner(data) {
  let { type, tokenIndex } = data
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res = fetch && (await fetch.ownerOf(tokenIndex))
  return res || {}
}

//query nft favorites
export async function getNFTFavoritesNum(data) {
  let { type, tokenIndex } = data
  let fetch = await canisterManager.getFactoryStorageByType(type, false)
  let res = fetch?.getNftFavoriteNum && (await fetch.getNftFavoriteNum(tokenIndex))
  return res || 0
}

//query isfavorite
export async function isNFTFavoriteByTypeAndId(data) {
  let { type, prinId, tokenIndex } = data
  let fetch = await canisterManager.getFactoryStorageByType(type)
  let principal = await canisterManager.getCurrentPrinId()
  let collectionsConfig = canisterManager.getColletcionConfig()
  let collectionItem = find(collectionsConfig, { key: type })
  let res
  if (
    collectionItem &&
    (collectionItem.nftType === 'video' || collectionItem.nftType === 'blindbox' || collectionItem.nftType === 'ipfs')
  )
    res =
      fetch &&
      fetch.isFavorite &&
      (await fetch.isFavorite(principal, { index: tokenIndex, photoLink: [], videoLink: [] }))
  else
    res =
      fetch &&
      fetch.isFavorite &&
      (await fetch.isFavorite(principal, { index: tokenIndex, canisterId: Principal.fromText(prinId) }))
  return res || {}
}

//query trade history
export async function getTradeHistoryByIndex(data) {
  let { type, tokenIndex } = data
  let fetch = await canisterManager.getFactoryStorageByType(type)
  let res = fetch && fetch.getHistory && (await fetch.getHistory(tokenIndex))
  if (res) {
    let set = new Set()
    for (let item of res) {
      item.from && item.from.length && set.add(item.from[0].toText())
      item.to && item.to.length && set.add(item.to[0].toText())
    }
    await getAllUserName([...set])
    return res
  }
  return []
}

//nft transfer
export async function nftTransferFrom(data) {
  let { type, to, tokenIndex } = data
  let fetch = await canisterManager.getNftFactoryByType(type, true)
  let principal = await canisterManager.getCurrentPrinId()
  if (principal) {
    let res
    if (is1155Canvas(type)) {
      res = fetch && (await fetch.transferFrom(principal, Principal.fromText(to), tokenIndex, data.quantity))
    } else {
      res = fetch && (await fetch.transferFrom(principal, Principal.fromText(to), tokenIndex))
    }
    return res
  }
}

export async function getRecentFinishedCanvas(data) {
  let { type } = data
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res
  if (is1155Canvas(type)) {
    res = await fetch.getAllFinshNFT()
  } else {
    res = await fetch.getRecentFinshed()
  }
  return res || []
}

export async function getNFTDetailInfo(data) {
  let { tokenIndex, type } = data
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  if (type === TurtlesCreate) {
    let res = await fetch.getNftStats(`${tokenIndex}`)
    return res
  }
  let res = await fetch.getTokenById(tokenIndex)
  return res
}

export async function getAll1155ListingByIndex(data) {
  let { type, tokenIndex } = data
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res = fetch && (await fetch.getListings(tokenIndex))
  let set = new Set()
  for (let item of res) {
    item[1] && item[1].seller && set.add(item[1].seller.toText())
  }
  await getAllUserName([...set])
  return res
}

export async function get1155CopiesByIndex(data) {
  let { type, tokenIndex } = data
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res = fetch && (await fetch.getTokenInfoByIndex(tokenIndex))
  return res
}

export async function balance1155PixelByIndex(data) {
  let { type, tokenIndex } = data
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let principal = await canisterManager.getCurrentPrinId()
  let res = fetch && (await fetch.balanceOfByIndex(principal, tokenIndex))
  return res
}

export async function getAllM1155FinshNFT({ type }) {
  if (type !== Theme1155Create && type !== M1155Create) {
    return []
  }
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res = fetch && (await fetch.getAllFinshNFT())
  let res1 = []
  for (let item of res) {
    res1.push({ baseInfo: { tokenIndex: item.index, prinId: item.canisterId }, nftType: type })
  }
  return res1
}

export async function getMetaDataByIndex({ type, tokenIndex }) {
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  if (type === TurtlesCreate) {
    let res = fetch && (await fetch.tokenMetadataByIndex(`${tokenIndex}`, true))
    if (res.ok.properties) {
      let item = find(res.ok.properties, { name: 'rank' })
      if (item) return item.value.Text
    }
  }
  return ''
}

export async function getNFTOwnersSize({ type }) {
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res = fetch && fetch.getOwnerSize && (await fetch.getOwnerSize())
  return res !== undefined ? res : 'N/A'
}

export async function getNTFCirculation({ type }) {
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res = fetch && fetch.getCirculation && (await fetch.getCirculation())
  return res !== undefined ? res : 'N/A'
}

export async function getNFTTotalSupply({ type }) {
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let isArt = type.startsWith(ArtCollection)
  let res
  if (isArt) {
    res = fetch?.getSettings && (await fetch.getSettings())
    return res?.totalSupply || 0
  } else res = fetch?.getSuppy && (await fetch.getSuppy())
  return res || 0
}

export async function getNTFTransitionByAccount({ type, prinId }) {
  try {
    let fetch = await canisterManager.getFactoryStorageByType(type)
    let key = process.env.BLIND_BOX_KEY
    let collectionsConfig = canisterManager.getColletcionConfig()
    let collectionItem = find(collectionsConfig, { key: type })
    let res =
      fetch &&
      fetch.getSaleRecordByAccount &&
      (collectionItem?.nftType === 'blindbox'
        ? await fetch.getSaleRecordByAccount(Principal.fromText(prinId), key)
        : await fetch.getSaleRecordByAccount(Principal.fromText(prinId)))
    let set = new Set()
    let indexs = []
    for (let item of res) {
      item.from && item.from.length && set.add(item.from[0].toText())
      item.to && item.to.length && set.add(item.to[0].toText())
      indexs.push(item.tokenIndex)
    }
    if (indexs.length > 0) {
      let factory = await canisterManager.getNftFactoryByType(type, false)
      if (factory?.getLinkInfoByIndexArr) {
        let linkInfo = await factory.getLinkInfoByIndexArr(indexs)
        if (linkInfo?.length === res?.length) {
          res.map((item, index) => {
            item.photoLink = linkInfo[index][0]
            item.videoLink = linkInfo[index][1]
          })
        }
      }
    }
    await getAllUserName([...set])
    return res || []
  } catch (e) {
    return []
  }
}

export async function getAllNTFTransition({ type }) {
  try {
    let fetch = await canisterManager.getFactoryStorageByType(type)
    let key = process.env.BLIND_BOX_KEY
    let collectionsConfig = canisterManager.getColletcionConfig()
    let collectionItem = find(collectionsConfig, { key: type })
    let res =
      fetch &&
      fetch.getAllSaleRecord &&
      (collectionItem?.nftType === 'blindbox' ? await fetch.getAllSaleRecord(key) : await fetch.getAllSaleRecord())
    let set = new Set()
    let indexs = []
    for (let item of res) {
      item.from && item.from.length && set.add(item.from[0].toText())
      item.to && item.to.length && set.add(item.to[0].toText())
      indexs.push(item.tokenIndex)
    }
    if (indexs.length > 0) {
      let factory = await canisterManager.getNftFactoryByType(type, false)
      if (factory?.getLinkInfoByIndexArr) {
        let linkInfo = await factory.getLinkInfoByIndexArr(indexs)
        if (linkInfo?.length === res?.length) {
          res.map((item, index) => {
            item.photoLink = linkInfo[index][0]
            item.videoLink = linkInfo[index][1]
          })
        }
      }
    }

    await getAllUserName([...set])
    return res || []
  } catch (e) {
    return []
  }
}

export async function getRoyaltyFeeRatio({ type }) {
  if (type === AloneCreate) {
    return 2
  }
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res
  if (fetch) {
    if (type === ZombieNFTCreate) res = fetch.getMarketFeeRatio && (await fetch.getMarketFeeRatio())
    else res = fetch.getRoyaltyFeeRatio && (await fetch.getRoyaltyFeeRatio())
  }
  if (res) {
    let royalty = parseFloat(res)
    if (royalty > 10) royalty = royalty / 10
    return royalty
  }
  return 0
}

export async function getBlindTime({ type }) {
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  if (fetch?.getBlindTime) {
    let time
    if (!time) {
      let res = await fetch.getBlindTime()
      if (res.length === 2) {
        let time1 = parseInt(new BigNumber(parseInt(res[0] || 0)).dividedBy(Math.pow(10, 6)))
        let time2 = parseInt(new BigNumber(parseInt(res[1] || 0)).dividedBy(Math.pow(10, 6)))
        time = [time1, time2]
      }
    }
    let now = new Date().getTime()
    if (now < time[0]) {
      //can't open blind box
      return { status: BlindBoxStatus.NotOpen }
    } else if (now > time[1]) {
      //blind box auto open
      return { status: BlindBoxStatus.AutoOpen }
    } else {
      //can open blind box
      return { status: BlindBoxStatus.CanOpen }
    }
  }
  return { status: BlindBoxStatus.AutoOpen }
}

export async function isBlindBoxOpen({ type, tokenIndex }) {
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  if (fetch?.bBlindBoxOpen) {
    let res = await fetch.bBlindBoxOpen(tokenIndex)
    return res
  }
  return true
}

export async function openBlindBox({ type, tokenIndex }) {
  let fetch = await canisterManager.getNftFactoryByType(type, true)
  if (fetch?.openBlindBox) {
    let res = await fetch.openBlindBox(tokenIndex)
    return res
  }
  return true
}

export async function getLinkInfoByIndex({ type, tokenIndex }) {
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  if (fetch?.getLinkInfoByIndex) {
    let res = await fetch.getLinkInfoByIndex(tokenIndex)
    return res
  }
  return {}
}
