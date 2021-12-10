import React, { memo } from 'react'
import { BlockAreaWrapper, BlockTitleWrapper } from '../style'
import { Button } from 'antd'

import { getValueDivide8 } from '@/utils/utils'

function PersonInfo(props) {
  const consumeBalance = props.consumeBalance

  return (
    <div>
      <div className="textDetail">
        Total Invested:
        <span>{` ${getValueDivide8(consumeBalance ? consumeBalance.consume : 0)} WICP`}</span>
      </div>

      <div className="textDetail">
        Total Income :
        <span>{` ${getValueDivide8(
          parseInt(consumeBalance ? consumeBalance.income : 0) +
            parseInt(consumeBalance ? consumeBalance.withDrawed : 0)
        )} WICP`}</span>
      </div>
      <div className="textSubDetail">
        Withdrawed:
        <span>{` ${getValueDivide8(consumeBalance ? consumeBalance.withDrawed : 0)} WICP`}</span>
      </div>
      <div className="textSubDetail">
        Remaining :<span>{` ${getValueDivide8(consumeBalance ? consumeBalance.income : 0)} WICP`}</span>
        <Button type="violet" className="withdraw" onClick={props.showWithdrawModal}>
          Withdraw
        </Button>
      </div>

      <div className="textDetail">
        Estimated Bonus:
        <span>{` ${getValueDivide8(consumeBalance ? consumeBalance.userBonus : 0)} WICP`}</span>
      </div>
      <div className="textDetail">
        Asset (Number of Owned Pixels):
        <span>{` ${consumeBalance ? consumeBalance.pixelNum : 0} `}</span>
      </div>
    </div>
  )
}
export default memo(PersonInfo)
