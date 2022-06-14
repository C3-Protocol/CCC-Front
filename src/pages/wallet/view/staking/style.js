import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'
import { PhoneContentWidth } from '@/constants'

export const StakingWrapper = styled.div(
  ...pxToRem`
  width: ${PhoneContentWidth};
  max-width: 1480px;
  margin: 1% auto;
`
)

export const StakingTitleWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  padding: 10px 80px;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  .box {
    display: flex;
    align-items: center;
    flex-direction: column;
    row-gap: 5px;  
  }
  .flex {
    display: flex; 
    align-items: center;
    column-gap: 10px;
  }

  .minus {
    width: 54px;
    height: 54px;
    background: #FFFFFF;
    border-radius: 4px;
    border: 1px solid #4338CA;
    line-height: 3rem;
    text-align: center;
  }
  .subs {
    display: flex;
  }
  @media screen and (max-width: 1152px) {
    padding: 0px;
  }
`
)

export const StakingContentWrapper = styled.div(
  ...pxToRem`

    width: 100%;
    .right {
        padding: 10px 0;
        display: flex;
        float: right;
        column-gap: 10px;
        align-items: center;
    }
    .page-right {
        padding: 10px 0;
        text-align: right;
    }
`
)
