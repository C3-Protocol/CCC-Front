import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const MarketContentWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  min-height: 100px;
  .header {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  button {
    width: 100% !important;
    height: 45px;
    flex: 1;
    display: flex;
    color: #4338ca !important;
    justify-content: space-between !important;
    align-items: center;
  }
`
)

export const MarketTabbarLeftContent = styled.div(
  ...pxToRem`
  width: 100%;
  display: flex;
  align-items: center;
  img {
    width: 24px;
    margin-left: 10px;
  }
`
)

export const MarketTabbarRightContent = styled.div(
  ...pxToRem`
  width: 434px;
  
  .search-input-content {
    width: 434px;
    height: 48px;
    background: #FFFFFF;
    border-radius: 6px;
    align-items:center;
    justify-content:center;
    display:flex;
    gap: 20px;
  }
  .input-style {
    background: #0000;
    width: 350px;
    border: none;
  }
  .radio-group {
    width: 434px;
    justify-content: flex-end;
    align-items: center;
    float: right;
    margin-top: 10px;
    color: #4338ca !important;
    text-align: right !important;
  }
  
  img {
    width: 27px;
    height: 27px;
  }
  @media screen and (max-width: 1152px) {
    width: 100%;
    .search-input-content {
      display: none;
    }
  }

`
)

export const MarketListingWrapper = styled.div(
  ...pxToRem`
  margin-top: 2%;
  .nft-list {
    display: flex;
    flex-wrap: wrap;
    gap: 11px;
    margin-top: 10px;
    gap: 0px;
  }
`
)
