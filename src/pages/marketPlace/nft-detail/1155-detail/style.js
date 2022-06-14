import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'
import { PhoneContentWidth } from '@/constants'

export const MarketDetailLeft = styled.div(
  ...pxToRem`
  width: 504px;
  max-width: ${PhoneContentWidth};
  margin: auto;
  
`
)

export const PixelContent = styled.div(
  ...pxToRem`
  width: 98%;
  margin: 0 1%;
  position: relative;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #CDD2D9;
  padding-bottom: ${(props) => (props.isAlone ? '0px' : '5px')};
  
  .canvas-pixel {
    width: 100%;
    padding: 100% 0 0;
    margin: 0px auto;
    border-radius:  ${(props) => (props.isAlone ? '4px' : '4px 4px 0 0')};
    overflow-x: clip;
    overflow-y: clip;
    position: relative;
  }

  .heatmap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(${(props) => props.scale});
    width: ${(props) => props.width}px;
    height:${(props) => props.width}px;
    overflow-x: clip;
    overflow-y: clip;
  }
  
`
)

export const ThumbsList = styled.div(
  ...pxToRem`
  width: 100%;
  height: 88px;
  display:flex;
  margin-top: 10px;
  column-gap: 8px;
  
  .canvas-parent {
    width: 88px;
    heigth: 88px;
    position: relative;
    border: 1px solid #333;
    img {
      left: 50%;
      top: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
    }
  }

  .heatmap-thumb {
    width: 88px;
    height: 88px;
    border: 1px solid #333;
    .thumb {
      width: fit-content;
      height: fit-content;
      transform: scale(${(props) => props.thumbScale});
      transform-origin: left top;
    }    
  }
`
)
