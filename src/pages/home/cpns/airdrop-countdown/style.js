import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const CountDownWrapper = styled.div`

    display: flex;
    align-items: flex-end;
    column-gap: 10px;
    justify-content: center;
  }

  .day {
    font-size: 70px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 525;
    color: #ffffff;
    line-height: 98px;
    letter-spacing: 4px;
    text-shadow: 0px 4px 8px #4339ca;
  }

  .time {
    font-size: 52px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 525;
    color: #ffffff;
    line-height: 73px;
    letter-spacing: 4px;
    text-shadow: 0px 4px 8px #4339ca;
  }

  @media screen and (max-width: 1024px) {
    .countdown {
      display: flex;
      align-items: flex-end;
      column-gap: 5px;
    }

    .day {
      font-size: 44px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 62px;
      letter-spacing: 2px;
      text-shadow: 0px 4px 10px #4339CA;
    }

    .time {
      font-size: 34px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 48px;
      letter-spacing: 2px;
      text-shadow: 0px 4px 10px #4339CA;
    }
  }
`
