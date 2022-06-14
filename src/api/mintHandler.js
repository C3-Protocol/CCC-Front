import { canisterManager } from './canisterManager'
import { Storage, getValueDivide8, multiBigNumber, getItemImageUrl, getIPFSLink } from '@/utils/utils'
import BigNumber from 'bignumber.js'
import { lessBalanceApproveWICPNat } from './handler'
import { isTestNet } from '../constants'

export async function queryAirDropRemain({ type }) {
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let principal = await canisterManager.getCurrentPrinId()
  let remain = await fetch.getAirDropRemain(principal)
  console.log('remain times', type, remain)
  return remain
}

export async function cliamAirdrop({ type }) {
  let fetch = await canisterManager.getNftFactoryByType(type, true)
  // return { ok: { index: 20, canisterId: Principal.fromText('v4oyv-zaaaa-aaaah-qctya-cai') } }
  console.log('cliamAirdrop type', type)
  let res = await fetch.cliamAirdrop()
  console.log('cliamAirdrop res', res)
  if (res.ok) {
    return {
      tokenIndex: res.ok.index,
      prinId: res.ok.canisterId || 'video',
      type,
      imgUrl:
        getIPFSLink(res.ok.photoLink && res.ok.photoLink[0]) || getItemImageUrl(type, res.ok.canisterId, res.ok.index),
      detailUrl:
        getIPFSLink(res.ok.videoLink && res.ok.videoLink[0]) ||
        `https://${res.ok.canisterId}.raw.ic0.app/token/${res.ok.index}`
    }
  }
  return res
}

export async function getMintSaleInfo({ type, supply }) {
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res
  if (fetch.getSaleInfo) {
    try {
      res = await fetch.getSaleInfo()
    } catch (e) {}
  }
  return res || [supply, supply]
}

export async function getMintOpentime({ type }) {
  // 获取开启时间
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let openTime,
    preMint = false
  if (fetch.getOpenTime) {
    let time = isTestNet ? null : Storage.get(`openTime-${type}`)
    if (!time) {
      let res = await fetch.getOpenTime()
      if (res.length === 2) {
        let time1 = parseInt(new BigNumber(parseInt(res[0] || 0)).dividedBy(Math.pow(10, 6)))
        let time2 = parseInt(new BigNumber(parseInt(res[1] || 0)).dividedBy(Math.pow(10, 6)))
        time = [time1, time2]
        Storage.set(`openTime-${type}`, time)
      } else {
        time = parseInt(new BigNumber(parseInt(res || 0)).dividedBy(Math.pow(10, 6)))
        Storage.set(`openTime-${type}`, time)
      }
    }
    let now = new Date().getTime()
    if (time.length === 2) {
      let time1 = time[0]
      let time2 = time[1]
      if (now < time2) {
        let principal = await canisterManager.getCurrentPrinId()
        let isWhite = false
        if (principal && fetch.checkIfWhiteList) {
          isWhite = await fetch.checkIfWhiteList(principal)
        }
        if (isWhite) {
          openTime = time1
          preMint = true
        } else {
          openTime = time2
        }
      } else {
        openTime = time2
      }
    } else {
      openTime = time
    }
  }
  return { openTime, preMint }
}

export async function getMintPrice({ type }) {
  let { openTime, preMint } = await getMintOpentime({ type })
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  if (preMint && fetch.getWhiteListPrice) {
    let principal = await canisterManager.getCurrentPrinId()
    let res = type === 'kverso' ? await fetch.getWhiteListPrice(principal) : await fetch.getWhiteListPrice()
    res.sort((left, right) => {
      if (parseFloat(left[0]) > parseFloat(right[0])) {
        return 1
      } else {
        return -1
      }
    })
    return res
  } else {
    let now = new Date().getTime()
    if (now < openTime) {
      return []
    }
    let res = await fetch.getMintPrice()
    res.sort((left, right) => {
      if (parseFloat(left[0]) > parseFloat(right[0])) {
        return 1
      } else {
        return -1
      }
    })
    return res
  }
}

export async function getDisCountByUser({ type }) {
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let principal = await canisterManager.getCurrentPrinId()
  let discount = principal && fetch.getDisCountByUser && (await fetch.getDisCountByUser(principal))
  return discount || 100
}

export async function mintNFT({ type, num }) {
  let { openTime, preMint } = await getMintOpentime({ type })
  let now = new Date().getTime()
  if (now > openTime) {
    let _pid = canisterManager.getNFTFacotryIdByType(type)
    await lessBalanceApproveWICPNat(_pid)
    let authFetch = await canisterManager.getNftFactoryByType(type, true)
    let mintRes
    if (preMint) mintRes = await authFetch.whiteListMint(num)
    else mintRes = await authFetch.mint(num)
    if (mintRes.ok) {
      let result = []
      for (let item of mintRes.ok) {
        result.push({
          tokenIndex: item.index,
          prinId: item.canisterId || 'video',
          type,
          imgUrl:
            getIPFSLink(item.photoLink && item.photoLink[0]) || getItemImageUrl(type, item.canisterId, item.index),
          detailUrl:
            getIPFSLink(item.videoLink && item.videoLink[0]) ||
            `https://${item.canisterId}.raw.ic0.app/token/${item.index}`
        })
      }
      return result
    }
    return mintRes
  } else {
    return { err: { NotOpen: null } }
  }
}
