import { combineReducers } from 'redux'

import { reducer as authReducer } from '@/components/auth/store'
import { reducer as allCavansReducer } from '@/pages/home/store'
import { reducer as pixelReducer } from '@/components/canvas-pixel/store'

export default combineReducers({
  auth: authReducer,
  allcavans: allCavansReducer,
  piexls: pixelReducer
})
