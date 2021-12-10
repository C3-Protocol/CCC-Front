import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const HomeNFTCoverWrapper = styled.div(
  ...pxToRem`
  width: 600px;
  height: 338px;
  position: relative;

  .pixel-bg {
    position: absolute;
    bottom: 0px;
    width: 338px;
    height: 338px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px 20px 0 20px;
    background-color: #fff;
  }
  .pixel-wrapper {
    width: 320px;
    height: 320px;
    background: #fff;
    position: relative;
    margin: auto;
    border: 1px dotted #ccc;
    border-radius: 20px;
  }
  .info-right {
    position: absolute;
    bottom: 0px;
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.08);
    border-radius: 0 20px 20px 20px;
    width: 100%;
    padding-left: 338px;
    background-color: #fff;
    height: 256px;
    text-align: center;
    display: flex;
    padding-top: 10px;
    padding-bottom: 10px;
    flex-direction: column;
    justify-content: space-between;
    .canvas-index {
      span {
        &:nth-child(1) {
          display: block;
          height: 42px;
          font-size: 30px;
          font-family: PingFangTC-Semibold, PingFangTC;
          font-weight: 600;
          color: #000000;
          line-height: 42px;
          margin-bottom: 10px;
        }
        &:nth-child(2) {
          display: block;
          height: 30px;
          font-size: 24px;
          font-family: PingFangTC-Semibold, PingFangTC;
          color: #000000;
          line-height: 30px;
        }
      }
    }
    .price {
      max-height: 100px;
      font-size: 32px;
      font-family: PingFangTC-Semibold, PingFangTC;
      font-weight: 300;
      color: #1d1d1d;
      line-height: 40px;
    }
    .nft-buy {
      width: 116px;
      height: 39px;
      margin-top: 10px;
    }
  }
`
)
