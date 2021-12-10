import {
  factoryGetListings,
  getConsumeAndBalance,
  getHighestPosition,
  getFinshedTime,
  requestCanister
} from '@/api/handler'

import { CrowdCreate } from '@/constants'

export const getMarketListNFT = (successFunc) => {
  //发送网络请求
  let data = {
    success: (res) => {
      successFunc && successFunc(res)
    }
  }
  requestCanister(factoryGetListings, data, false)
}

export const getCrowdCanvasConsumeAndBalance = (prinId, successFunc) => {
  let data = {
    prinId: prinId,
    success: (res) => {
      successFunc && successFunc(res)
    }
  }
  requestCanister(getConsumeAndBalance, data)
}

export const getHighestInfoById = (prinId, successFunc) => {
  let data = {
    prinId: prinId,
    success: (res) => {
      successFunc && successFunc(res)
    }
  }
  requestCanister(getHighestPosition, data, false)
}

export const getFinshedTimeById = (prinId, successFunc) => {
  let data = {
    prinId: prinId,
    success: (res) => {
      successFunc && successFunc(res)
    }
  }
  requestCanister(getFinshedTime, data, false)
}
