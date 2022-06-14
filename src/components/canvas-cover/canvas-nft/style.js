import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const NFTCoverWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  padding-bottom: 10px;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #fff;
  flex: 0 0 360px;

  .pixel-content {
    position: relative;
    width: 100%;
  }

  .transfer {
    position: absolute;
    bottom: -21px;
    right: 4%;
    width: 42px;
    height: 42px;
    background: #fff;
    box-shadow: 0px 0px 30px 0px rgb(0 0 0 / 12%);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .pixel-wrapper {
    width: 100%;
    padding: 100% 0 0;
    position: relative;
    margin-bottom: 5px;
    border-radius: 10px 10px 0 0;
    overflow-x: clip;
    overflow-y: clip;
  }

  &:hover {
    cursor: pointer;
    transform: translateY(-4px);
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.2);
  }
  @media screen and (max-width: 1152px) {
    flex: 0 0 ${(props) => props.width};
  }
  .ant-skeleton-element {
    width: 100%;
  }
`
)

export const WalletNFTDetailWrapper = styled.div(
  ...pxToRem`
    margin: 10px 2%;

    .info-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nft-index {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000000;
      line-height: 24px;
    }
  
    .right-info {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      text-align: right;
      line-height: 20px;
    }

    .nft-manage {
      width: 80px;
      height: 45px;
    }

    .operation {
      width: fit-content;
      margin: 10px auto 0;
    }
  `
)

export const MarketNFTDetailWrapper = styled.div(
  ...pxToRem`
    margin: 0px 4%;
    .detail {
      width: 100%;
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  
    .nft-index {
      font-size: 18px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #000000;
      line-height: 24px;
    }

    .canvas-worth {
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }
  
    .canvas-price {
      display: flex;
      justify-content: flex-end;
    }
  `
)

export const WalletDrawWrapper = styled.div(
  ...pxToRem`
  margin: 0px 2%;
  .text {
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .worth {
      color: #999999;
      display: flex;
      align-items: center;
    }
  }
  .btn {
    text-align: center;
    width: 100%;
    margin-top: 10px;
  }
`
)

export const MultiCanvasDoneWrapper = styled.div(
  ...pxToRem`
  flex: 1;
  margin: 0px 2%;
  .canvas-index {
    span {
      display: inline-block;
      &:nth-child(1) {
        font-size: 18px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #000000;
        line-height: 24px;
      }
    }
  }
  .content {
    margin: 5px 0;
    span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 14px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      label {
        display: inline-block;
      }
    }
  }
  .invested {
    text-align: end;
    font-size: 14px;
    color: #999999;
  }
  .canvas-edit {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`
)
