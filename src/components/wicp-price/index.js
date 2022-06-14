import React, { memo } from 'react'
import { getValueDivide8 } from '@/utils/utils'
import WicpLogo from '@/assets/images/wicp_logo.svg'
import { Avatar } from 'antd'
import BigNumber from 'bignumber.js'
import './style.css'

// wicp
function WICPPrice(props) {
  const value = props.value
  const iconSize = props.iconSize
  const valueStyle = props.valueStyle
  const ellipsis = props.ellipsis
  const unit = props.unit
  const fixed = props.fixed
  const wrapperStyle = props.wrapperStyle || ''

  const getShowValue = () => {
    if (unit && value) {
      let res = new BigNumber(value).dividedBy(Math.pow(10, 8)).dividedBy(unit)
      if (res >= 1) {
        return res.toFixed(1) + (unit === 1000 ? 'k' : '')
      }
    }
    if (fixed > 0) {
      let res = new BigNumber(value).dividedBy(Math.pow(10, 8))
      return res.toFixed(fixed)
    }
    let res = value !== undefined ? getValueDivide8(value) : 'N/A'
    if (ellipsis && res.length > ellipsis) {
      res = res.slice(0, ellipsis - 1) + '...'
    }
    return res
  }

  return (
    <div
      className={`wicp-wrapper ${wrapperStyle}`}
      onClick={() => {
        props.onClick && props.onClick()
      }}
    >
      <Avatar src={WicpLogo} size={iconSize} />
      <div className={valueStyle}>{`${getShowValue()}`}</div>
    </div>
  )
}

export default memo(WICPPrice)
