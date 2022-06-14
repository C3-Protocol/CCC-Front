import { fromJS } from 'immutable'

const initState = fromJS({
  isAuth: false,
  authToken: ''
})

const reducer = (state = initState, action) => {
  if (action.type) {
    if (action.nameSpace === 'auth') return state.set(action.type, action.value)
  }
  return state
}

export default reducer
