import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const AirdropClaimWrapper = styled.div(
  ...pxToRem`
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 662px;
  height: 820px;

  .close {
    position: absolute;
    top: 50px;
    right: 10px;
    svg {
      width: 30px;
      height: 30px;
      color: #ffffff;
    }
  }

  .base-bg{
    width: 558px;
    height: 770px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
  }

  .carousel {
    width: 240px;
    height: 240px;
    position: absolute;
    left: 48%;
    top: 49%;
    transform: translate(-50%, -50%);
  }
  .cover {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      image-rendering: pixelated;
    }
  }
  .claim {
    position: absolute;
    left: 48%;
    top: 66.5%;
    font-size: 20px;
    font-weight: 600;
    -webkit-transform: translateX(-50%);
    -ms-transform: translateX(-50%);
    transform: translateX(-50%);
    cursor: pointer;
  }
  .ant-btn.ant-btn-loading::before {
    display: none !important;
  }
`
)
