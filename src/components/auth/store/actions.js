import * as constants from './constants'
import { authLogin, authLoginOut, initLoginStates } from '@/api/handler'

export const setAuthStatus = (value) => ({
  type: constants.SET_AUTH_STATUS,
  value
})

export const setAuthToken = (text) => ({
  type: constants.SET_AUTH_TOKEN,
  value: text
})

const dealWithResult = (dispatch, res, error) => {
  if (res.ok) {
    dispatch(setAuthStatus(res.ok.status))
    dispatch(setAuthToken(res.ok.prinId))
  } else {
    error && error()
  }
}

export const requestLogin = (type, error) => {
  return (dispatch) => {
    //发送网络请求
    authLogin(type, (res) => {
      dealWithResult(dispatch, res, error)
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
