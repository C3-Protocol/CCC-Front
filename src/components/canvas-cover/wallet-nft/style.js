import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const NFTCoverWrapper = styled.div(
  ...pxToRem`
  width: 330px;
  margin-bottom: 5px;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  background-color: #fff;

  .pixel-content {
    position: relative;
    width: 100%;
  }

  .transfer {
    position: absolute;
    top: 5px;
    right: 5px;
    height: 25px;
  }

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
    padding-left: 10px;
    padding-right: 10px;
    justify-content: space-between;
    align-items: center;
    border-radius: 20px;
    background-color: #fff;
  }

  .info_content {
    width: 200px;
    align-items: center;
  }

  .nft-index {
    width: 100%;
    color: #6d7278;
    text-align: left;
  }

  .nft-price {
    width: 100%;
    color: #4338ca;
    text-align: left;
  }

  .nft-manage {
    width: 80px;
    height: 45px;
  }

  @media screen and (max-width: 1152px){
    width: 48%;
    margin: 1%;
  }
`
)
