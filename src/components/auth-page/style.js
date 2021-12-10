import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const MenuContentWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  height: 100%;
  overflow: scroll;
  @media screen and (max-width: 1152px) {
    .ant-menu-sub {
      .ant-menu-item {
        font-size: 20px;
        font-weight: normal;
        .ant-menu-item-icon {
          width: 20px;
        }
      }
    }
  }
`
)

export const LoginAuthWrapper = styled.div(
  ...pxToRem`
    width: 100%;
    display: flex;
    align-items:center;
    justify-content:center;
    

    .button-yellow {
      flex: 1;
      height: 60px;
      margin: 10px;
      border-radius: 10px !important;
      background-color: #f9ce0d !important;
      border: 1px solid #f9ce0d !important;
    }

    .button-black {
      flex: 1;
      height: 60px;
      border-radius: 10px !important;
      background-color: #000000 !important;
      border: 1px solid #000000 !important;
      display: flex;
      align-items:center;
      justify-content:center;

      img {
        max-height: 50px;
      }
    }
  `
)

export const BottomLinkWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  margin-top: 20px;
  display: flex;
  align-items:center;
  justify-content: space-evenly;

  a {
    display: inline-block;
    // flex: 1;
    // padding: 0 5px;
    width: 44px;
    height: 44px;
  }
  img { 
    width: 100%;
  }
`
)
