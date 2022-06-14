import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const PixelThumbWrapper = styled.div(
  ...pxToRem`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(${(props) => props.scale});
    width: ${(props) => props.width}px;
    height:${(props) => props.height}px;
    .canvas-thumb {
        position: absolute;
        left: 0;
        right: 0
    }
    .ant-skeleton-element {
      position: absolute;
      width: fit-content !important;
      left: 50%;
      top: 50%;
      z-index: -1;
      transform: translate(-50%, -50%);
    }
`
)
