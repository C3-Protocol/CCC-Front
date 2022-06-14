import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const AirdropClaimWrapper = styled.div(
  ...pxToRem`
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100%;

  .close {
    position: absolute;
    top: calc(50% - 16vw);
    right: 10px;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }

  .success-tip {
    display: flex;
    width: fit-content;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 30px;
    margin-top: 40px;
    column-gap: 15px;
    justify-content: center;
    align-items: center;
    background: #FFFFFF;
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    font-size: 16px;
    font-weight: 400;
    line-height: 28px;
    color: #666666;
    .tip {
      height: 22px;
    }
    .right {
      height: 14px;
    }
    a {
      color: #4338CA;
      font-weight: 600;
    }
  }
  .blind-bg{
    width: 100vw;
    height: 28.54vw;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .blind-box {
    width: 27.97vw;
    height: 19.22vw;
    position: absolute;
    left: 50%;
    img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
  }
  .claim {
    position: absolute;
    left: 50%;
    top: calc(50% - 13vw);
    transform: translate(-50%, -50%);
  }

  .nft {
    width: 300px;
    height: 300px;
    position: absolute;
    left: 50%;
    image-rendering: pixelated;
    object-fit: cover;
    transform-origin: bottom;
  }
  .drop-close {
    position: absolute;
    left: 50%;
    top: 60%;
    transform: translate(-50%, -50%);
  }
  .spin {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .ant-spin-dot-item {
    background-color: #fff !important;
  }

  .vibration {
    animation: turn 0.5s ease infinite;
    transform-orgin: center;
  }

  @keyframes turn {
    0% {
      transform: rotate(0deg);
      left: 0;
    }
    25% {
      transform: rotate(10deg) ;
      left: 20px;
    }
    50% {
      transform: rotate(0deg);
      left: 0;
    }
    75% {
      transform: rotate(-10deg);
      left: -20px;
    }
    100% {
      transform: rotate(0deg);
      left: 0;
    }
  }
  @media screen and (max-width: 1024px) {
    .close {
      top: calc(50% - 16vh);
    }
    .claim {
      top: calc(50% - 13vh);
    }
  }
`
)
