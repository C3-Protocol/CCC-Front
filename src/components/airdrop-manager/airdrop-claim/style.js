import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const AirdropClaimWrapper = styled.div(
  ...pxToRem`
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 662px;
  height: 669px;

  .close {
    position: absolute;
    top: 50px;
    right: 50px;
    svg {
      width: 30px;
      height: 30px;
      color: #ffffff;
    }
  }

  .base-bg{
    width: 662px;
    height: 669px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .image-bg {
    width: 321px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .zombie {
    width: 298px;
    height: 534px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .claim {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 180px;
    height: 50px;
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
`
)
