import { Map } from 'immutable'

// 使用Immutable管理redux中的state (修改的`state`不会修改原有数据结构, 而是返回修改后新的数据结构)
const defaultState = Map({})

function reducer(state = defaultState, action) {
  if (action.type) {
    return state.set(action.type, action.value)
  }
}

export default reducer
