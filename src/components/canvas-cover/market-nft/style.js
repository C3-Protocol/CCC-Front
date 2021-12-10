import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const NFTMarketCoverWrapper = styled.div(
  ...pxToRem`
  width: 338px;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  background-color: #fff;
  padding: 14px;
  margin: 10px;

  .pixel-wrapper {
    width: 96%;
    padding: 96% 0 0;
    position: relative;
    margin: auto;
    border-radius: 20px;
    border: 1px dotted #ccc;
  }
  .detail {
    height: 64px;
    width: 100%;
    display: flex;
    margin: 0 0px;
    justify-content: space-between;
    align-items: center;
    border-radius: 0 0 20px 20px;
    background-color: #fff;
  }
  .nft-index {
    color: #6d7278;
  }
  .canvas-worth {
    color: #4338ca;
  }
  .canvas-price {
    display: flex;
    justify-content: flex-end;
    column-gap: 10px;
    .price {
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
      color: #333;
    }
  }
  @media screen and (max-width: 1152px){
    width: ${(props) => props.width};
    margin: 1%;
  }
`
)
