import * as constants from './constants'
import { requestCanister } from '@/api/handler'
import { getCanisterPixelInfoById, getPinPosition, checkImage } from '@/api/canvasHandler'

//像素的数据抽离出来，后续好管理
// 获取某个画布的像素信息
const nameSpace = 'pixel'
export const changePixelInfoAction = (data) => {
  let { type, prinId, res } = data
  return {
    type: `${constants.CHANGE_PIXEL_INFO}-${type}-${prinId}`,
    value: res,
    nameSpace
  }
}

export const changeNewPixelInfoAction = (res) => {
  return {
    type: constants.CHANGE_NEW_PIXEL_INFO,
    value: res,
    nameSpace
  }
}

export const changeImagePixelInfoAction = (res) => {
  return {
    type: constants.CHANGE_IMAGE_PIXEL_INFO,
    value: res,
    nameSpace
  }
}

export const changeImageSelectPosition = (res) => {
  return {
    type: constants.CHANGE_IMAGE_POSITION_INFO,
    value: res,
    nameSpace
  }
}

export const changePinPixelInfo = (res) => {
  return {
    type: constants.CHANGE_PIN_PIXEL_INFO,
    value: res,
    nameSpace
  }
}

export const changeExistImageInfo = (data) => {
  let { type, prinId, res } = data
  return {
    type: `${constants.CHANGE_EXIST_IMAGE_INFO}-${type}-${prinId}`,
    value: res,
    nameSpace
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

export const getPinPositionByType = (type, prinId) => {
  return (dispatch) => {
    let data = {
      type: type,
      prinId: prinId,
      success: (res) => {
        let pinMap = {}
        for (let item of res) {
          pinMap[`${item.x}-${item.y}`] = 1
        }
        dispatch(changePinPixelInfo(pinMap))
      }
    }
    requestCanister(getPinPosition, data, false)
  }
}

export const checkImageByTypeAndId = (type, prinId) => {
  return (dispatch) => {
    let data = {
      type: type,
      prinId: prinId,
      success: (res) => {
        dispatch(changeExistImageInfo({ type, prinId, res }))
      }
    }
    requestCanister(checkImage, data, false)
  }
}
