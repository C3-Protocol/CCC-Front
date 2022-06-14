import { canisterManager } from './canisterManager'
import { ArtCreate, ArtCollection } from '@/constants'
import { lessBalanceApproveWICPNat } from './handler'
import { Principal } from '@dfinity/principal'
import { Web3Storage, File } from 'web3.storage'
import ErrorMessage from '@/assets/scripts/errorCode'

const nftStorageKey = process.env.NFT_STORAGE_API_KEY
const storage = new Web3Storage({ token: nftStorageKey })

export const createCollection = async (data) => {
  let _pid = canisterManager.getNFTFacotryIdByType(ArtCreate)
  await lessBalanceApproveWICPNat(_pid)
  let fetch = await canisterManager.getNftFactoryByType(ArtCreate, true)
  let res = await fetch?.createNewCollection(data.param)
  return res
}

export const createNewNFT = async (data) => {
  let { success, fail, notice } = data
  let key = data.key
  let prinId = key.split(':')[1]
  await lessBalanceApproveWICPNat(prinId)
  let fetch = await canisterManager.getNftFactoryByType(key, true)

  let { orignData, thumbnailData, nftType, thumbType, desc, name, attrArr, earnings, royaltyFeeTo, parentToken } =
    data.param
  let type = nftType.split('/')[1]
  let nftThumbType = thumbnailData && thumbType.split('/')[1]
  let uploadedFile = []

  uploadedFile.push(new File([orignData], `orign.${type}`))
  thumbnailData && uploadedFile.push(new File([thumbnailData], `thumb.${nftThumbType}`))
  const cid = await storage.put(uploadedFile, {
    onRootCidReady: async (localCid) => {
      let paramData = { desc, name, attrArr, earnings, royaltyFeeTo, parentToken }
      paramData.photoLink = thumbnailData
        ? [`https://${localCid}.ipfs.dweb.link/thumb.${nftThumbType}`]
        : [`https://${localCid}.ipfs.dweb.link/orign.${type}`]
      paramData.videoLink = [`https://${localCid}.ipfs.dweb.link/orign.${type}`]
      let res = await fetch?.uploadIPFSItem(paramData)
      console.log('create nft', res)
      notice && notice()
      if (res.err) {
        console.error('response error:', res.err)
        for (let key in res.err) {
          fail && fail(ErrorMessage[key], key)
        }
      } else {
        success && success(res)
      }
      return res
    },
    onStoredChunk: (bytes) => console.log(`> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`)
  })
  return { ok: cid }
}

export const getCreateCollectionInfo = async ({ type }) => {
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let item = await fetch.getCollectionInfo()
  let settings = await fetch.getSettings()
  let temp = type.split(':')
  let cid = temp[1]
  if (item) {
    let tmp = {
      key: type,
      type,
      pricinpalId: cid,
      title: item.name,
      cid: cid,
      owner: item.owner,
      category: item.category,
      forkRoyaltyRatio: settings.forkRoyaltyRatio[0] || 0,
      avatar: `https://${cid}.raw.ic0.app/token/logo`,
      thumb: `https://${cid}.raw.ic0.app/token/featured`,
      banner: `https://${cid}.raw.ic0.app/token/banner`
    }
    tmp.commission = 1
    tmp.links = []
    if (item.twitter[0]) tmp.links.push({ link: item.twitter[0], name: 'Twitter' })
    if (item.discord[0]) tmp.links.push({ link: item.discord[0], name: 'Discord' })
    if (item.webLink[0]) tmp.links.push({ link: item.webLink[0], name: 'Website' })
    if (item.medium[0]) tmp.links.push({ link: item.medium[0], name: 'Medium' })
    return tmp
  }
  return {}
}

export const getMyCollection = async ({ prinId }) => {
  if (!prinId) return []
  let fetch = await canisterManager.getNftFactoryByType(ArtCreate, false)
  let res = await fetch?.getCollInfoByUser(Principal.fromText(prinId))
  if (res) {
    let formatRes = []
    for (let item of res) {
      let tmp = {
        key: `${ArtCollection}${item.cid}:${item.owner}:${item.name}`,
        pricinpalId: item.cid.toText(),
        title: item.name,
        brief: item.desc,
        blurb: item.desc,
        cid: item.cid,
        owner: item.owner,
        category: item.category,
        forkRoyaltyRatio: item.forkRoyaltyRatio[0] || 0,
        avatar: `https://${item.cid}.raw.ic0.app/token/logo`,
        thumb: `https://${item.cid}.raw.ic0.app/token/featured`,
        banner: `https://${item.cid}.raw.ic0.app/token/banner`
      }
      formatRes.push(tmp)
    }
    return formatRes
  }
  return []
}

export async function getPubCollection() {
  let fetch = await canisterManager.getNftFactoryByType(ArtCreate, false)
  let res = await fetch?.getPublicCollInfo()
  if (res) {
    let formatRes = []
    for (let item of res) {
      let tmp = {
        key: `${ArtCollection}${item.cid}:${item.owner}:${item.name}`,
        pricinpalId: item.cid.toText(),
        title: item.name,
        brief: item.desc,
        blurb: item.desc,
        cid: item.cid,
        owner: item.owner,
        category: item.category,
        forkRoyaltyRatio: item.forkRoyaltyRatio[0] || 0,
        avatar: `https://${item.cid}.raw.ic0.app/token/logo`,
        thumb: `https://${item.cid}.raw.ic0.app/token/featured`,
        banner: `https://${item.cid}.raw.ic0.app/token/banner`,
        pub: true
      }
      formatRes.push(tmp)
    }
    return formatRes
  }
  return []
}

export async function getCreateNFTByType(data) {
  let { type, prinId } = data
  let principal = prinId ? Principal.fromText(prinId) : await canisterManager.getCurrentPrinId()
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let cid = type.split(':')[1]
  let res = fetch && (await fetch.getAllNFT(principal))
  let res1 = []
  for (let item of res) {
    res1.push({
      tokenIndex: item.index,
      name: item.name,
      desc: item.desc,
      type,
      royaltyRatio: item.royaltyRatio,
      attrIds: item.attrIds,
      imgUrl: item.photoLink[0],
      detailUrl: item.videoLink[0],
      canOperation: true
    })
  }
  return res1
}

export const getMarketCollection = async () => {
  let fetch = await canisterManager.getNftFactoryByType(ArtCreate, false)
  let res = await fetch?.getAllCollInfo()
  if (res) {
    let formatRes = []
    for (let resItem of res) {
      let item = resItem[1]
      let tmp = {
        key: `${ArtCollection}${item.cid}:${item.owner}:${item.name}`,
        pricinpalId: item.cid.toText(),
        title: item.name,
        brief: item.desc,
        blurb: item.desc,
        cid: item.cid,
        owner: item.owner,
        category: item.category,
        forkRoyaltyRatio: item.forkRoyaltyRatio[0] || 0,
        avatar: `https://${item.cid}.raw.ic0.app/token/logo`,
        thumb: `https://${item.cid}.raw.ic0.app/token/featured`,
        banner: `https://${item.cid}.raw.ic0.app/token/banner`,
        earnings: item.earnings
      }
      formatRes.push(tmp)
    }
    return formatRes
  }
  return []
}

export const checkProjectName = async ({ name }) => {
  let fetch = await canisterManager.getNftFactoryByType(ArtCreate, false)
  let res = await fetch?.checkProjectName(name)
  return res
}

export const getCreateFactorySettingConfig = async () => {
  let fetch = await canisterManager.getNftFactoryByType(ArtCreate, false)
  let res = await fetch?.getSettings()
  return res
}

export const getCollectionConfigParam = async ({ type }) => {
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res = await fetch?.getSettings()
  return res
}

export const isCollectionPublic = async ({ type }) => {
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res = await fetch?.isPublic()
  return res
}

export const getNFTMetaDataByIndex = async ({ type, tokenIndex }) => {
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res = await fetch?.getNFTMetaDataByIndex(tokenIndex)
  if (res && res.length > 0) {
    return res[0]
  }
  return {}
}

export const getCollectionSettings = async ({ type }) => {
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res = await fetch?.getSettings()
  return res
}

//get all list
export async function factoryGetAllNFTByType(data) {
  let { type } = data
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  if (fetch) {
    let res = await fetch.getAllToken()
    if (res) {
      let nftInfoArray = []
      for (const _nft of res) {
        var { 0: base, 1: sellInfo } = _nft
        let baseInfo = {
          type,
          name: base.name,
          desc: base.desc,
          tokenIndex: base.index,
          prinId: 'video',
          imgUrl: base.photoLink[0],
          detailUrl: base.videoLink[0],
          canOperation: false
        }
        nftInfoArray.push({
          baseInfo,
          nftType: type,
          sellInfo: sellInfo[0] || {},
          time: sellInfo[0]?.time,
          sellPrice: sellInfo[0]?.price
        })
      }
      return nftInfoArray
    }
  }
  return
}
