import * as constants from './constants'
import { getCanisterPixelInfoById, requestCanister } from '@/api/handler'
import { AloneCreate, CrowdCreate } from '@/constants'

const isAlone = (type) => {
  return type === AloneCreate
}

//像素的数据抽离出来，后续好管理
// 获取某个画布的像素信息
export const changePixelInfoAction = (data) => {
  let { type, prinId, res } = data
  return isAlone(type)
    ? {
        type: `${constants.CHANGE_ALONE_PIXEL_INFO}-${prinId}`,
        value: res
      }
    : {
        type: `${constants.CHANGE_MULTI_PIXEL_INFO}-${prinId}`,
        value: res
      }
}

export const changeNewPixelInfoAction = (res) => {
  return {
    type: constants.CHANGE_NEW_PIXEL_INFO,
    value: res
  }
}

export const changeImagePixelInfoAction = (res) => {
  return {
    type: constants.CHANGE_IMAGE_PIXEL_INFO,
    value: res
  }
}

export const getPixelInfoById = (type, prinId) => {
  return (dispatch) => {
    //发送网络请求
    let data = {
      type: type,
      prinId: prinId,
      success: (res) => {
        dispatch(changePixelInfoAction({ type: type, prinId: prinId, res: res }))
      }
    }
    requestCanister(getCanisterPixelInfoById, data, false)
  }
}
