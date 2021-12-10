import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const NFTContentWrapper = styled.div(
  ...pxToRem`
  width:100%;
  .title {
    height: 35px;
    display: flex;
    justify-content: space-between;
    h1 {
      font-size: 25px;
    }
    h2 {
      font-size: 25px;
      color: #4338ca;
    }
  }
  @media screen and (min-width: 1152px) {
    .title {
      display: none;
    }
  }
`
)

export const NFTListWrapper = styled.div(
  ...pxToRem`
  margin-top: 6px;
  width:100%;
  .nft-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, 380px);
    justify-content: center;
    gap: 6px;
    margin-top: 10px;
  }

  @media screen and (max-width: 1152px) {
    .nft-list {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 0px;
    }
  }
`
)
