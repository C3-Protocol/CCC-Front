import * as constants from './constants'
import {
  authLogin,
  authLoginOut,
  initLoginStates,
  balanceWICP,
  balanceICP,
  requestCanister,
  handleCollectionConfig,
  promiseAllFunc
} from '@/api/handler'
import { getUserProfileByPrinId, getUserRewardsPoints, getUserAvatar } from '@/api/userHandler'
const nameSpace = 'auth'

export const setAuthStatus = (value) => ({
  type: constants.SET_AUTH_STATUS,
  value,
  nameSpace
})

export const setAuthToken = (text) => ({
  type: constants.SET_AUTH_TOKEN,
  value: text,
  nameSpace
})

export const setICPBalance = (text) => ({
  type: constants.SET_AUTH_ICP_BALANCE,
  value: text,
  nameSpace
})

export const setWICPBalance = (text) => ({
  type: constants.SET_AUTH_WICP_BALANCE,
  value: text,
  nameSpace
})

export const setUserPrifile = (prinId, res) => ({
  type: `${constants.SET_AUTH_PROFILE}-${prinId}`,
  value: res,
  nameSpace
})

export const setUserScore = (prinId, res) => ({
  type: `${constants.SET_AUTH_SCROE}-${prinId}`,
  value: res,
  nameSpace
})

export const setUserAvatar = (prinId, res) => ({
  type: `${constants.SET_AUTH_AVATAR}-${prinId}`,
  value: res,
  nameSpace
})

const dealWithResult = (dispatch, res, callback) => {
  if (res.ok) {
    dispatch(setAuthStatus(res.ok.status))
    dispatch(setAuthToken(res.ok.prinId))
    if (!res.ok.status) {
      dispatch(setICPBalance(0))
      dispatch(setWICPBalance(0))
    }
  }
  callback && callback(res)
}

export const requestLogin = (type, callback) => {
  return (dispatch) => {
    //发送网络请求
    authLogin(type, (res) => {
      dealWithResult(dispatch, res, callback)
    })
  }
}

export const requestLoginOut = (error) => {
  return (dispatch) => {
    //发送网络请求
    authLoginOut((res) => {
      dealWithResult(dispatch, res, error)
    })
  }
}

export const requestInitLoginStates = (error) => {
  return (dispatch) => {
    //发送网络请求
    initLoginStates((res) => {
      dealWithResult(dispatch, res, error)
    })
  }
}

export const requestICPBalance = (curPrinId) => {
  if (!curPrinId || curPrinId === '2vxsx-fae')
    return (dispatch) => {
      dispatch(setICPBalance(0))
    }
  return (dispatch) => {
    //发送网络请求
    requestCanister(balanceICP, {
      curPrinId,
      success: (res) => {
        dispatch(setICPBalance(res))
      }
    })
  }
}

export const requestWICPBalance = (curPrinId) => {
  if (!curPrinId || curPrinId === '2vxsx-fae') {
    return (dispatch) => {
      dispatch(setWICPBalance(0))
    }
  }
  return (dispatch) => {
    //发送网络请求
    requestCanister(balanceWICP, {
      curPrinId,
      success: (res) => {
        dispatch(setWICPBalance(res))
      }
    })
  }
}

export const refreshICPAndWICPBalance = (curPrinId, callback) => {
  return (dispatch) => {
    promiseAllFunc([balanceICP, balanceWICP], {
      curPrinId,
      success: (res) => {
        if (res && res.length === 2) {
          dispatch(setICPBalance(res[0]))
          dispatch(setWICPBalance(res[1]))
        }
        callback && callback()
      },
      fail: () => {
        callback && callback()
      }
    })
  }
}

export const requestUserProfile = (prinId) => {
  return (dispatch) => {
    //发送网络请求
    requestCanister(
      getUserProfileByPrinId,
      {
        prinId,
        success: (res) => {
          dispatch(setUserPrifile(prinId, res))
        }
      },
      false
    )
  }
}

export const requestUserAvatar = (canisterId, prinId) => {
  return (dispatch) => {
    //发送网络请求
    requestCanister(
      getUserAvatar,
      {
        canisterId,
        prinId,
        success: (res) => {
          dispatch(setUserAvatar(prinId, res))
        }
      },
      false
    )
  }
}

export const requestUserRewardsPoints = (prinId) => {
  return (dispatch) => {
    //发送网络请求
    requestCanister(
      getUserRewardsPoints,
      {
        prinId,
        success: (res) => {
          dispatch(setUserScore(prinId, res))
        }
      },
      false
    )
  }
}

export const requestCollectionConfig = () => {
  return (dispatch) => {
    //发送网络请求
    handleCollectionConfig((value) => {
      dispatch({ type: constants.SET_COLLECTION_CONFIG, value, nameSpace })
    })
  }
}
