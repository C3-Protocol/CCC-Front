import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const CanvasPixelWrapper = styled.div(
  ...pxToRem`
    position: relative;
    width: ${(props) => props.width}px;
    height:${(props) => props.height}px;
    .canvas {
        position: absolute;
        left: 0;
        right: 0
    }
`
)

export const PixelDetailWrapper = styled.div(
  ...pxToRem`
    position: absolute;
    padding: 10px;
    justify-content:center;
    align-items:center;
    gap: 10px;
    visibility: ${(props) => props.visibility};
    left: ${(props) => props.left}px;
    top:  ${(props) => props.top}px;
    right: ${(props) => props.right}px;
    bottom: ${(props) => props.bottom}px;
    display: flex;
    background-color: #ffffff;
    border-radius: 5px;
    .color {
        width:20px;
        height: 20px;
    }
    .price {
        color: #333333;
    }
`
)
