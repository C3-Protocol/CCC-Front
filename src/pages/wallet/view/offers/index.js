import React, { memo } from 'react'
import ComingSoon from '@/assets/images/coming_soon.png'
import { transformPxToRem } from '../../../../utils/utils'

function Offers(props) {
  return (
    <div
      style={{
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex'
      }}
    >
      <img style={{ width: '100%' }} src={ComingSoon}></img>
    </div>
  )
}
export default memo(Offers)
