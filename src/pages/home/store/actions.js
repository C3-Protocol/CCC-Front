import * as constants from './constants'
import {
  getCanisterCanvasInfoById,
  getNFTListingInfo,
  getHighestPosition,
  getNFTOwner,
  getFinshedTime,
  isNFTFavoriteByTypeAndId,
  requestCanister
} from '@/api/handler'
import { AloneCreate } from '@/constants'

const isAlone = (type) => {
  return type === AloneCreate
}

// 获取画布某个id信息
export const changeInfoAction = (data) => {
  let { type, prinId, res } = data
  return isAlone(type)
    ? {
        type: `${constants.CHANGE_ALONE_INFO}-${prinId}`,
        value: res
      }
    : {
        type: `${constants.CHANGE_MULTI_INFO}-${prinId}`,
        value: res
      }
}

// 获取某个NFT的List信息
export const changeNFTInfoAction = (data) => {
  let { type, tokenIndex, res } = data
  return isAlone(type)
    ? {
        type: `${constants.CHANGE_ALONE_NFT_INFO}-${tokenIndex}`,
        value: res
      }
    : {
        type: `${constants.CHANGE_MULTI_NFT_INFO}-${tokenIndex}`,
        value: res
      }
}

// 获取画布price最高的点
export const changePriceHighestInfoAction = (data) => {
  let { prinId, res } = data
  return {
    type: `${constants.CHANGE_MULTI_PRICE_HIGHEST_INFO}-${prinId}`,
    value: res
  }
}
export const changeNFTOwnerAction = (data) => {
  let { type, tokenIndex, res } = data
  return isAlone(type)
    ? {
        type: `${constants.CHANGE_ALONE_NFT_OWNER}-${tokenIndex}`,
        value: res
      }
    : {
        type: `${constants.CHANGE_MULTI_NFT_OWNER}-${tokenIndex}`,
        value: res
      }
}

export const changeNFTFavoriteAction = (data) => {
  let { type, tokenIndex, res } = data
  return isAlone(type)
    ? {
        type: `${constants.CHANGE_ALONE_NFT_FAVORITE}-${tokenIndex}`,
        value: res
      }
    : {
        type: `${constants.CHANGE_MULTI_NFT_FAVORITE}-${tokenIndex}`,
        value: res
      }
}

export const getCanvasInfoById = (type, prinId) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      type: type,
      prinId: prinId,
      success: (res) => {
        dispatch(changeInfoAction({ type: type, prinId: prinId, res: res }))
      }
    }
    requestCanister(getCanisterCanvasInfoById, data, false)
  }
}

export const getNFTListingInfoByType = (type, tokenIndex) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      type: type,
      tokenIndex: tokenIndex,
      success: (res) => {
        dispatch(changeNFTInfoAction({ type: type, tokenIndex: tokenIndex, res: res[0] || {} }))
      }
    }
    requestCanister(getNFTListingInfo, data, false)
  }
}

export const getHighestInfoById = (prinId) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      prinId: prinId,
      success: (res) => {
        dispatch(changePriceHighestInfoAction({ prinId: prinId, res: res }))
      }
    }
    requestCanister(getHighestPosition, data, false)
  }
}
export const getNFTOwnerByIndex = (type, tokenIndex) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      type: type,
      tokenIndex: tokenIndex,
      success: (res) => {
        dispatch(changeNFTOwnerAction({ type: type, tokenIndex: tokenIndex, res: res }))
      }
    }
    requestCanister(getNFTOwner, data, false)
  }
}

export const isNFTFavorite = (type, prinId, tokenIndex) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      type: type,
      prinId: prinId,
      tokenIndex: tokenIndex,
      success: (res) => {
        dispatch(changeNFTFavoriteAction({ type: type, tokenIndex: tokenIndex, res: res }))
      }
    }
    requestCanister(isNFTFavoriteByTypeAndId, data)
  }
}
