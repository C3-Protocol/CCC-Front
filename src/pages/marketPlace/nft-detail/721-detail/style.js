import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'
import { PhoneContentWidth } from '@/constants'

export const MarketDetailLeft = styled.div(
  ...pxToRem`
  width: 710px;
  max-width: ${PhoneContentWidth};
  margin: auto;

  .title {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .favorite {
    width: 40px;
    margin: auto 10px;
    filter: grayscale(${(props) => props.gray}%);
  }
`
)
