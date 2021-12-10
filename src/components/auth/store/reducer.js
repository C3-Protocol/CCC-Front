import { fromJS } from 'immutable'
import * as constants from './constants'

const initState = fromJS({
  isAuth: false,
  authToken: ''
})
const reducer = (state = initState, action) => {
  switch (action.type) {
    case constants.SET_AUTH_STATUS:
      return state.set('isAuth', action.value)
    case constants.SET_AUTH_TOKEN:
      return state.set('authToken', action.value)
    default:
      return state
  }
}

export default reducer
