import * as constants from './constants'
import { requestCanister, promiseAllFunc, handleGetHomeProtocolData, handleGetTopCollectiblesList } from '@/api/handler'
import {
  getNFTListingInfo,
  getRecentFinishedCanvas,
  getNFTDetailInfo,
  factoryGetListingsByType,
  getNFTOwnersSize,
  getNTFCirculation,
  getNFTTotalSupply,
  getBlindTime
} from '@/api/nftHandler'
import { getValueDivide8, plusBigNumber } from '@/utils/utils'
import { getAllUndoneCanvas, getCanisterCanvasInfoById, getHighestPosition } from '@/api/canvasHandler'
import {
  getMyCollection,
  getCreateCollectionInfo,
  getMarketCollection,
  getPubCollection,
  isCollectionPublic,
  getNFTMetaDataByIndex,
  getCollectionSettings
} from '@/api/createHandler'
import { getAllCanvasStakingZombie } from '@/api/zombieHandler'
import { handleCollectionVolumn } from '@/api/httpRequest'
// 获取画布某个id信息
const nameSpace = 'nfts'
export const changeInfoAction = (data) => {
  let { type, prinId, res } = data
  return {
    type: `${constants.CHANGE_CANVAS_INFO}-${type}-${prinId}`,
    value: res,
    nameSpace
  }
}

// 获取某个NFT的List信息
export const changeNFTInfoAction = (data) => {
  let { type, tokenIndex, res } = data
  return {
    type: `${constants.CHANGE_CANVAS_NFT_INFO}-${type}-${tokenIndex}`,
    value: res,
    nameSpace
  }
}

// 获取画布price最高的点
export const changePriceHighestInfoAction = (data) => {
  let { prinId, res } = data
  return {
    type: `${constants.CHANGE_PRICE_HIGHEST_INFO}-${prinId}`,
    value: res,
    nameSpace
  }
}

// 获取zombie某个id信息
export const changeNoCanvasNFTInfoAction = (data) => {
  let { type, tokenIndex, res } = data
  return {
    type: `${constants.CHANGE_NO_CANVAS_NFT_INFO}-${type}-${tokenIndex}`,
    value: res,
    nameSpace
  }
}

export const changeUndoneCanvasAction = (data) => {
  let { type, res } = data
  return {
    type: `${constants.CHANGE_UNDONE_CANVAS}-${type}`,
    value: res,
    nameSpace
  }
}

export const changeDoneCanvasAction = (data) => {
  let { type, res } = data
  return {
    type: `${constants.CHANGE_DONE_CANVAS}-${type}`,
    value: res,
    nameSpace
  }
}

export const saveLastMarketInfo = (data) => {
  return {
    type: constants.CHANGE_MARKET_LAST_INFO,
    value: data,
    nameSpace
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

export const getHighestInfoById = (type, prinId) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      type: type,
      prinId: prinId,
      success: (res) => {
        dispatch(changePriceHighestInfoAction({ prinId: prinId, res: res }))
      }
    }
    requestCanister(getHighestPosition, data, false)
  }
}

export const getNFTDetailInfoByIndex = (type, tokenIndex) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      type,
      tokenIndex,
      success: (res) => {
        dispatch(changeNoCanvasNFTInfoAction({ type, tokenIndex, res: res.ok }))
      }
    }
    requestCanister(getNFTDetailInfo, data, false)
  }
}

export const getAllUndoneCanvasByType = (type) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      type,
      success: (res) => {
        res.sort((left, right) => {
          let value = parseInt(right.tokenIndex) - parseInt(left.tokenIndex)
          return value
        })
        dispatch(changeUndoneCanvasAction({ type, res }))
      }
    }
    requestCanister(getAllUndoneCanvas, data, false)
  }
}

export const getRecentFinishedCanvasByType = (type) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      type,
      success: (res) => {
        res.sort((left, right) => {
          let value = parseInt(right.index) - parseInt(left.index)
          return value
        })
        dispatch(changeDoneCanvasAction({ type, res }))
      }
    }
    requestCanister(getRecentFinishedCanvas, data, false)
  }
}

export const getCollectionVolumeAndListings = (type) => {
  return (dispatch) => {
    requestCanister(
      factoryGetListingsByType,
      {
        type,
        success: (res) => {
          res &&
            res.sort((left, right) => {
              let value = getValueDivide8(left.sellPrice) - getValueDivide8(right.sellPrice)
              return value
            })
          dispatch({
            type: `${constants.CHANGE_COLLECTION_INFO}-${type}-listing`,
            value: [res.length, res[0]?.sellPrice || 0],
            nameSpace
          })
        }
      },
      false
    )
  }
}

export const getCollectionInfo = (pricinpalId, type, callback) => {
  return (dispatch) => {
    handleCollectionVolumn({
      prinId: pricinpalId,
      success: (res) => {
        let value = res.sum
        if (type === 'kverso') value = plusBigNumber(value, 236000000000n)
        dispatch({
          type: `${constants.CHANGE_COLLECTION_INFO}-${type}-volume`,
          value,
          nameSpace
        })
      }
    })
    promiseAllFunc([factoryGetListingsByType, getNFTOwnersSize, getNTFCirculation, getNFTTotalSupply], {
      type,
      success: (res) => {
        if (res.length === 4) {
          res[0] &&
            res[0].sort((left, right) => {
              let value = getValueDivide8(left.sellPrice) - getValueDivide8(right.sellPrice)
              return value
            })
          dispatch({
            type: `${constants.CHANGE_COLLECTION_INFO}-${type}-listing`,
            value: [res[0].length, res[0][0]?.sellPrice || 0],
            nameSpace
          })
          dispatch({
            type: `${constants.CHANGE_COLLECTION_INFO}-${type}-owners`,
            value: res[1],
            nameSpace
          })
          dispatch({
            type: `${constants.CHANGE_COLLECTION_INFO}-${type}-circulation`,
            value: res[2],
            nameSpace
          })
          dispatch({
            type: `${constants.CHANGE_COLLECTION_INFO}-${type}-supply`,
            value: res[3],
            nameSpace
          })
          callback && callback(res[0])
        }
      }
    })
  }
}

export const getBlindBoxStatus = (config) => {
  return (dispatch) => {
    if (config.nftType === 'blindbox') {
      requestCanister(
        getBlindTime,
        {
          type: config.key,
          success: (res) => {
            dispatch({
              type: `${constants.CHANGE_BLIND_BOX_INFO}-${config.key}`,
              value: res.status,
              nameSpace
            })
          }
        },
        false
      )
    }
  }
}

//Popular imglist
export const listHomeData = (url) => {
  return (dispatch) => {
    //发送网络请求
    handleGetHomeProtocolData(url, (value) => {
      dispatch({ type: url, value, nameSpace })
    })
  }
}

//listTopCollections
export const listTopCollections = (payload) => {
  return (dispatch) => {
    //发送网络请求
    handleGetTopCollectiblesList((value) => {
      dispatch({ type: constants.POPULAR_TOP_COLLECTIBLES, value, payload, nameSpace })
    })
  }
}

export const getAllCreateCollection = (callback) => {
  return (dispatch) => {
    //发送网络请求
    requestCanister(
      getMarketCollection,
      {
        success: (value) => {
          dispatch({ type: `allCreateCollection`, value, nameSpace: 'auth' })
          callback && callback(value)
        }
      },
      false
    )
  }
}
export const getCreateCollectionByUser = (prinId, callback) => {
  return (dispatch) => {
    //发送网络请求
    requestCanister(
      getMyCollection,
      {
        prinId,
        success: (value) => {
          dispatch({ type: `createCollection-${prinId}`, value, nameSpace })
          callback && callback(value)
        }
      },
      false
    )
  }
}
export const getCreatePubCollection = (callback) => {
  return (dispatch) => {
    //发送网络请求
    requestCanister(
      getPubCollection,
      {
        success: (value) => {
          dispatch({ type: `pubCollection`, value, nameSpace })
          callback && callback(value)
        }
      },
      false
    )
  }
}
export const getCreateCollectionDetailInfo = (type) => {
  return (dispatch) => {
    //发送网络请求
    promiseAllFunc(
      [getCreateCollectionInfo, isCollectionPublic, getCollectionSettings],
      {
        type,
        success: (res) => {
          let value = res[0]
          value.isPublic = res[1]
          value.forkable = res[2]?.forkRoyaltyRatio?.length > 0 && res[2]?.newItemForkFee?.length > 0
          dispatch({ type, value, nameSpace })
        }
      },
      false
    )
  }
}
export const getStakeInfo = (type) => {
  return (dispatch) => {
    //发送网络请求
    requestCanister(
      getAllCanvasStakingZombie,
      {
        type,
        success: (res) => {
          console.log('getStakeInfo ', res)
          dispatch({
            type: `${constants.CHANGE_STAKE_INFO}-${type}`,
            value: res,
            nameSpace
          })
        }
      },
      false
    )
  }
}

export const getCreateNFTMetaDataByIndex = (type, tokenIndex) => {
  return (dispatch) => {
    //发送网络请求
    requestCanister(
      getNFTMetaDataByIndex,
      {
        type,
        tokenIndex,
        success: (res) => {
          dispatch({
            type: `createNFT-${type}-${tokenIndex}`,
            value: res,
            nameSpace
          })
        }
      },
      false
    )
  }
}
