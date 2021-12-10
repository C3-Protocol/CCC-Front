import CanisterManager from './canisterManager'
import { Principal } from '@dfinity/principal'
import ErrorMessage from '@/assets/scripts/errorCode'
import RosettaApi from '../ic/RosettaApi'
import {
  principalToAccountId,
  getSubAccountArray,
  bignumberToBigInt,
  getValueDivide8,
  getValueMultiplied8
} from '../utils/utils'
import BigNumber from 'bignumber.js'
import { NFT_ALONE_FACTORY_ID, NFT_MULTI_FACTORY_ID } from 'canister/local/id.js'
import { AloneCreate, CrowdCreate } from '@/constants'
import { DFINITY_TYPE, PLUG_TYPE } from '../constants'

const canisterManager = new CanisterManager()
const rosettaApi = new RosettaApi()

////代码需要整理
////代码需要整理

const isAlone = (type) => {
  return type === AloneCreate
}

const getCanisterByType = async (type, prinId, needIdentity) => {
  let fetch = await canisterManager.getCanvasCanister(type, prinId, needIdentity)
  return fetch
}

async function approveWICPNat(prinId) {
  let fetch = await canisterManager.getWICPMotoko(true)
  let principal = await canisterManager.getCurrentPrinId()
  if (principal) {
    console.log('principal = ', principal.toText())
    let args1 = Principal.fromText(prinId)
    let args2 = await fetch.balanceOf(principal)
    console.log('balance = ', args2)
    let res = await fetch.approve(args1, args2)
    return res
  }
}

async function getAllowance(prinId) {
  let fetch = await canisterManager.getWICPMotoko(false)
  let principal = await canisterManager.getCurrentPrinId()
  if (principal) {
    console.log('principal = ', principal.toText())
    let spender = Principal.fromText(prinId)
    let amount = await fetch.allowance(principal, spender)
    console.log('getAllowance amount = ', amount)
    return amount
  }
  return 0
}

// factor canister
const getNftFactoryByType = async (type, isAuth) => {
  let fetch = isAlone(type)
    ? await canisterManager.getAloneNFTFactory(isAuth)
    : await canisterManager.getMultiNFTFactory(isAuth)
  return fetch
}

const getFactoryStorageByType = async (type) => {
  let fetch = isAlone(type) ? await canisterManager.getNFTAloneStroage() : await canisterManager.getNFTMultiStroage()
  return fetch
}
export async function initLoginStates(callback) {
  return await canisterManager.initLoginStates(callback)
}

export async function isLogin() {
  return await canisterManager.isLogin()
}

export async function authLoginOut(callback) {
  await canisterManager.loginOut(callback)
}

export async function authLogin(type, callback) {
  console.log('type = ', type, DFINITY_TYPE)
  if (type === DFINITY_TYPE) {
    await canisterManager.authLogin(callback)
  } else if (type === PLUG_TYPE) {
    await canisterManager.plugLogin(callback)
  }
}

export async function requestCanister(reqFunc, data, mustLogin = true) {
  let { success, fail, notice, error } = data
  Promise.resolve()
    .then(async () => {
      if (mustLogin && !(await isLogin())) {
        return { err: { NotLogin: 1 } }
      }
      return await reqFunc(data)
    })
    .then((res) => {
      notice && notice()
      if (res.err) {
        console.warn('response error:', res.err)
        for (let key in res.err) {
          fail && fail(ErrorMessage[key], key)
        }
      } else {
        success && success(res)
      }
    })
    .catch((err) => {
      notice && notice()
      error && error(err)
      console.error('error :' + err)
    })
}

export async function mintPixelCanvas(data) {
  let { type, description, name } = data
  let fetch = await getNftFactoryByType(type, true)
  if (!fetch) {
    return { err: { NotCanister: 1 } }
  }
  /** auth temp begin **/
  let _pid = isAlone(type) ? NFT_ALONE_FACTORY_ID : NFT_MULTI_FACTORY_ID
  let amount = await getAllowance(_pid)
  if (amount == 0) {
    await approveWICPNat(_pid)
  }
  let param = { desc: description, name: name }
  if (isAlone(type)) {
    param.backGround = data.background
  }
  let res = isAlone(type) ? await fetch.mintAloneCanvas(param) : await fetch.mintMultiCanvas(param)
  if (res) {
    if (res.err) {
      for (let key in res.err) {
        if (key === 'AllowedInsufficientBalance') {
          await approveWICPNat(_pid)
        }
      }
    }
  }
  return res
}

export async function getMintFee(data) {
  let { type } = data
  let fetch = await getNftFactoryByType(type, false)
  let fee = isAlone(type) ? await fetch.getAloneFee() : await fetch.getMultiFee()
  return fee
}

export async function drawPixel(data) {
  let { type, prinId, colors } = data
  let amount = await getAllowance(prinId)
  if (amount == 0) {
    await approveWICPNat(prinId)
  }
  let fetch = await getCanisterByType(type, prinId, true)
  if (fetch) {
    const res = isAlone(type) ? await fetch.drawPixel(colors) : await fetch.drawPixel(colors, [data.memo])
    if (res.err) {
      for (let key in res.err) {
        if (key === 'AllowedInsufficientBalance') {
          await approveWICPNat(prinId)
        }
      }
    }
    return res
  } else {
    return { err: { NotCanister: 1 } }
  }
}

export async function getAllUndoneCanvas(data) {
  let { type } = data
  let fetch = await getNftFactoryByType(type, false)
  if (fetch) {
    let res
    if (isAlone(type)) {
      let principal = await canisterManager.getCurrentPrinId()
      res = await fetch.getAllAloneCanvas(principal)
    } else {
      res = await fetch.getAllMultipCanvas()
    }
    return res || []
  } else {
    return []
  }
}

export async function getCanisterCanvasInfoById(data) {
  let { type, prinId } = data
  let fetch = await getCanisterByType(type, prinId, false)
  if (fetch) {
    let res = await fetch.getNftDesInfo()
    return res
  }
}

export async function getCanisterPixelInfoById(data) {
  let { type, prinId } = data
  let fetch = await getCanisterByType(type, prinId, false)
  if (fetch) {
    let res = await fetch.getAllPixel()
    return res
  }
}

export async function aloneCanvasDrawOver(data) {
  let { prinId } = data
  let fetch = await getCanisterByType(AloneCreate, prinId, true)
  if (fetch) {
    let res = await fetch.drawOver()
    if (res) {
      return res
    }
  }
  return null
}

//获取名下所有NFT
export async function getAllNFT() {
  let principal = await canisterManager.getCurrentPrinId()
  let fetch = await getNftFactoryByType(AloneCreate, false)
  let res1 = fetch && (await fetch.getAllNFT(principal))
  fetch = await getNftFactoryByType(CrowdCreate, false)
  let res2 = await fetch.getAllNFT(principal)
  return { alone: res1 || [], crowd: res2 || [] }
}

//获取自己参与的众创画布
export async function getParticipate() {
  let principal = await canisterManager.getCurrentPrinId()
  let fetch = await getFactoryStorageByType(CrowdCreate)
  let res = await fetch.getParticipate(principal)
  console.log('getParticipate res', res)
  return res
}

export async function getMultiCanvasBouns(prinId) {
  let fetch = await getCanisterByType(CrowdCreate, prinId, false)
  let res = await fetch.getBonus()
  return res
}

//获取自己收藏的
export async function getAllFavorite() {
  let principal = await canisterManager.getCurrentPrinId()
  let fetch = await getFactoryStorageByType(AloneCreate)
  let res1 = fetch && (await fetch.getFavorite(principal))

  fetch = await getFactoryStorageByType(CrowdCreate)
  let res2 = fetch && (await fetch.getFavorite(principal))
  return { alone: res1 || [], crowd: res2 || [] }
}

//自己收藏
export async function setFavorite(data) {
  let { type, tokenIndex, prinId } = data
  let fetch = await getNftFactoryByType(type, true)
  let ret = await fetch.setFavorite({ index: tokenIndex, canisterId: Principal.fromText(prinId) })
  return ret
}

//取消收藏
export async function cancelFavorite(data) {
  let { type, tokenIndex, prinId } = data
  let fetch = await getNftFactoryByType(type, true)
  let ret = await fetch.cancelFavorite({ index: tokenIndex, canisterId: Principal.fromText(prinId) })
  return ret
}

export async function balanceWICP(data) {
  let { curPrinId } = data
  let fetch = await canisterManager.getWICPMotoko(false)
  let count = await fetch.balanceOf(Principal.fromText(curPrinId))
  return count || 0
}

export async function balanceICP(data) {
  let { curPrinId } = data
  let account = principalToAccountId(Principal.fromText(curPrinId))
  let ledgercanister = await canisterManager.getLedgerCanister(false)
  let icpBalance = await ledgercanister.account_balance_dfx({ account: account })
  return icpBalance ? getValueDivide8(icpBalance.e8s) : 0 // 接口拿
}

export async function transferIcp2Icp(data) {
  let { amount, address } = data
  let transAmount = new BigNumber(amount).multipliedBy(Math.pow(10, 8)).minus(10000)
  let subaccount = [getSubAccountArray(0)]
  let toAddr = address
  let args = {
    from_subaccount: subaccount,
    to: toAddr,
    amount: { e8s: bignumberToBigInt(transAmount) },
    fee: { e8s: 10000 },
    memo: 0,
    created_at_time: []
  }
  let ledgercanister = await canisterManager.getLedgerCanister(true)
  let blockHeight = await ledgercanister.send_dfx(args)
  return blockHeight
}

export async function transferWIcp2WIcp(data) {
  let { amount, address } = data
  let fetch = await canisterManager.getWICPMotoko(true)
  let res = await fetch.transfer(Principal.fromText(address), parseInt(getValueMultiplied8(amount)))
  return res
}

export async function transferWIcp2Icp(data) {
  let { amount } = data
  let fetch = await canisterManager.getWICPMotoko(true)
  let res = await fetch.burn(parseInt(getValueMultiplied8(amount)))
  return res
}

export async function transferIcp2WIcp(data) {
  let fetch = await canisterManager.getWICPMotoko(true)
  let toAddr = await fetch.getReceiveICPAcc()
  data['address'] = toAddr[0]
  let blockHeight = await transferIcp2Icp(data)
  if (blockHeight) {
    console.log('blockHeight =' + blockHeight)
    let subaccount = [getSubAccountArray(0)]
    let result = await fetch.mint({ from_subaccount: subaccount, blockHeight: blockHeight })
    approveWICPNat(NFT_ALONE_FACTORY_ID)
    approveWICPNat(NFT_MULTI_FACTORY_ID)
    return result
  } else {
    return null
  }
}

// get oder listings
export async function factoryGetListings() {
  let res1 = (await factoryGetListingsByType(AloneCreate)) || []
  let res2 = (await factoryGetListingsByType(CrowdCreate)) || []
  return { alone: res1, crowd: res2 }
}

//获取所有挂单
export async function factoryGetListingsByType(type) {
  let fetch = await getNftFactoryByType(type, false)
  if (fetch) {
    let res = await fetch.getListings()
    if (res) {
      let nftInfoArray = []
      for (const _nft of res) {
        var { 0: base, 1: sellInfo } = _nft
        var { price } = sellInfo
        nftInfoArray.push({
          baseInfo: [base.index, base.canisterId],
          nftType: type,
          sellInfo: sellInfo,
          sellPrice: new BigNumber(price).dividedBy(Math.pow(10, 8)).toFixed()
        })
      }

      return nftInfoArray
    }
  }
  return
}

// 根据index查询prinid
export async function factoryGetNFTByIndex(data) {
  let { type, index } = data
  let fetch = await getNftFactoryByType(type, false)
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
//挂单
export async function addFactoryList(data) {
  let { tokenIndex, price, type } = data
  let args = { tokenIndex: tokenIndex, price: price }
  let fetch = await getNftFactoryByType(type, true)
  if (fetch) {
    let res = await fetch.list(args)
    if (res) {
      return res
    }
  }
  return null
}

//买卖
export async function factoryBuyNow(data) {
  console.log('factoryBuyNow data = ', data)
  let { type, tokenIndex } = data
  let _pid = isAlone(type) ? NFT_ALONE_FACTORY_ID : NFT_MULTI_FACTORY_ID
  let amount = await getAllowance(_pid)
  if (amount == 0) {
    await approveWICPNat(_pid)
  }
  let fetch = await getNftFactoryByType(type, true)
  if (fetch) {
    let res = await fetch.buyNow(tokenIndex)
    console.debug('[factoryBuyNow] buyNow res:', res)
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

export async function getICPTransaction(data) {
  let { accountAddress } = data
  let res = await rosettaApi.getTransactionsByAccount(accountAddress)
  return res
}

export async function getWICPTransaction(data) {
  let { prinId } = data
  let principal = Principal.fromText(prinId)
  console.log('transaction prinid', prinId)
  let fetch = await canisterManager.getWICPStorage()
  let res = await fetch.getHistoryByAccount(principal)
  //console.log('transaction res', res)
  return res
}

//获取挂单信息
export async function getNFTListingInfo(data) {
  let { type, tokenIndex } = data
  let fetch = await getNftFactoryByType(type, false)
  let res = fetch && (await fetch.isList(tokenIndex))
  return res || {}
}

//取消挂单
export async function cancelNFTList(data) {
  let { type, tokenIndex } = data
  let fetch = await getNftFactoryByType(type, true)
  let res = fetch && (await fetch.cancelList(tokenIndex))
  return res || {}
}

//查询nft owner
export async function getNFTOwner(data) {
  let { type, tokenIndex } = data
  let fetch = await getNftFactoryByType(type, false)
  let res = fetch && (await fetch.ownerOf(tokenIndex))
  return res || {}
}

export async function getHighestPosition(data) {
  let { prinId } = data
  let fetch = await getCanisterByType(CrowdCreate, prinId, false)
  let highest = fetch && (await fetch.getHighestPosition())
  return highest || {}
}

// Subscribe to email

export async function subEmail(email) {
  let fetch = await canisterManager.getStorageMotoko()
  let res = await fetch.addCccMailSub(email)
  return res
}

export async function getConsumeAndBalance(data) {
  let { prinId } = data
  let fetch = await getCanisterByType(CrowdCreate, prinId, true)
  let res = fetch && (await fetch.getAccInfo())
  return res || {}
}

export async function isCanvasOver(data) {
  let { type, prinId } = data
  let fetch = await getCanisterByType(type, prinId, false)
  let res = fetch && (await fetch.isOver())
  return res
}

export async function getFinshedTime(data) {
  let { prinId } = data
  let fetch = await getCanisterByType(CrowdCreate, prinId, false)
  let res = fetch && (await fetch.getFinshedTime())
  return res
}

export async function requestWithdrawIncome(data) {
  let { type, prinId } = data
  let fetch = await getCanisterByType(type, prinId, true)
  let res = fetch && (await fetch.withDrawIncome())
  approveWICPNat(prinId)
  return res
}

//查询自己收否收藏该nft
export async function isNFTFavoriteByTypeAndId(data) {
  let { type, prinId, tokenIndex } = data
  let fetch = await getFactoryStorageByType(type)
  let principal = await canisterManager.getCurrentPrinId()
  let res = fetch && (await fetch.isFavorite(principal, { index: tokenIndex, canisterId: Principal.fromText(prinId) }))
  console.log('fetch ,', fetch, 'res = ', res)
  return res
}

//查询历史交易记录
export async function getTradeHistoryByIndex(data) {
  let { type, tokenIndex } = data
  let fetch = await getFactoryStorageByType(type)
  let res = fetch && (await fetch.getHistory(tokenIndex))
  return res
}

//nft 转移
export async function nftTransferFrom(data) {
  let { type, to, tokenIndex } = data
  let fetch = await getNftFactoryByType(type, true)
  let principal = await canisterManager.getCurrentPrinId()
  if (principal) {
    let res = fetch && (await fetch.transferFrom(principal, Principal.fromText(to), tokenIndex))
    return res
  }
}

export async function getMultiDrawRecord(data) {
  let { prinId } = data
  let fetch = await getCanisterByType(CrowdCreate, prinId, false)
  let res = fetch && (await fetch.getDrawRecord())
  return res
}

export async function addWhiteList(type, prinId) {
  await canisterManager.getCanvasCanister(type, prinId, true)
}

export async function getRecentFinishedCanvas() {
  let fetch = await getNftFactoryByType(CrowdCreate)
  let res = fetch.getRecentFinshed()
  return res || []
}

export async function queryAlias(start, end) {
  let fetch = await canisterManager.getInternetIdentity()
  console.log('fetch =', fetch)
  if (fetch) {
    for (let i = start; i <= end; i++) {
      let res = await fetch.lookup(i)
      if (res[0] && res[0].alias) {
        console.log('index =', i, ' res[0].alias', res[0].alias)
        if (res[0].alias === 'qwerty') {
          console.error('index =', i, ' res.alias', res[0].alias)
          break
        }
      }
    }
  }
}

export function getCurrentLoginType() {
  return canisterManager.getCurrentLoginType()
}
