import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const WalletWrapper = styled.div(
  ...pxToRem`
    padding-top: 120px;
    width: 100%;
    height: 100%;
    background-image: ${(props) => 'url(' + props.bg + ')'};
    background-repeat:no-repeat;
    background-size: cover;
    overflow: hidden;
    @media screen and (max-width: 1152px) {
      padding-top: 70px;
    }
`
)

export const FlexWrapper = styled.div`
  display: flex;
  height: 100%;
`
export const ScrollWrapper = styled.div(
  ...pxToRem`
    width: 100%;
`
)

export const LeftMenuWrapper = styled.div`
  width: 299px;
  height: 100%;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 0;
  padding: ${(props) => props.padding};
  box-sizing: border-box;
  display: ${(props) => props.display};
  ::before {
    content: '';
    position: absolute;
    width: 299px;
    height: 100%;
    top: 0;
    left: 0;
    -webkit-filter: blur(20px);
    -moz-filter: blur(20px);
    -ms-filter: blur(20px);
    -o-filter: blur(20px);
    filter: blur(20px) saturate(180%);
    z-index: -3;
    margin: -30px;
    background-image: ${(props) => 'url(' + props.bg + ')'};
    background-position: center top;
    background-size: cover;
    background-attachment: fixed;
  }
`

export const RightContentWrapper = styled.div(
  ...pxToRem`
    padding: 1% 1% 0;
    flex: 1;
    height:100%;
    overflow: scroll;
`
)
