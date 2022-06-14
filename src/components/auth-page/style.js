import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const MenuContentWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  height: 100%;
  overflow: scroll;
  .ant-menu {
    padding: 6px;
    &-submenu {
      font-size: 20px;
      font-weight: bolder;
      .ant-menu-item {
        font-size: 20px;
        font-weight: normal;
      }
    }
    &-inline {
      background-color: #00000000 !important;
      border-right: 1px solid #00000000 !important;
    }
    &-item {
      font-size: 20px;
      font-weight: bolder;
      &::after {
        display: none;
      }
      &-active {
        color: #4338ca !important;
      }
      &-selected {
        color: #4338ca !important;
        a {
          color: #4338ca !important;
          &:active {
            color: #4338ca !important;
          }
        }
      }
    }
  }
  @media screen and (max-width: 1152px) {
    
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
      margin: 0 5px;
      position: relative;
      border-radius: 10px !important;
      background-color: #000000 !important;
      border: 1px solid #000000 !important;

      img {
        max-height: 50px;
      }

      .child {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
      .ant-spin-dot-item {
        background-color: #fff !important;
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
