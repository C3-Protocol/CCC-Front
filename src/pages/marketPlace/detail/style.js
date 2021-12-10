import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const MarketDetailWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  min-height: 100%;
  background: linear-gradient(270deg, #d0eaff 0%, #fcf0ff 100%);
  padding-top: 120px;
  padding-bottom: 50px;
  `
)

export const MarketDetailTopWrapper = styled.div(
  ...pxToRem`
  width:100%;
  max-width: 1680px;
  margin: auto auto;
  display:flex;
  flex-wrap: wrap;
  gap: 40px;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`
)
export const MarketDetailLeft = styled.div(
  ...pxToRem`
  width: 700px;
  max-width: 98%;
  margin: auto;
  background: #ffffff;
  border-radius: 4px;

  .title {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .favorite {
    margin: auto 10px;
    filter: grayscale(${(props) => props.gray}%);
  }
`
)

export const PixelContent = styled.div(
  ...pxToRem`
  width: 98%;
  height: 100%;
  position: relative;
  
  .canvas-pixel {
    width: 96%;
    padding: 96% 0 0;
    margin: 25px auto;
    border-radius: 20px;
    border: 1px dotted #ccc;
  }
  .heatmap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(${(props) => props.scale});
    width: ${(props) => props.width}px;
    height:${(props) => props.width}px;
  }
`
)

export const MarketDetailRight = styled.div(
  ...pxToRem`
  flex: 1;
  max-width: 100%;
  padding-left: 1%;
  .title {
    font-size: 48px;
    font-weight: 600;
    color: #000000;
    line-height: 67px;
  }
  .owner {
    margin-top:24px;
    display:flex;
    gap: 15px;
  }
  .seller {
    color:#4338CA;
  }

  
`
)

export const MarketDetailBlock = styled.div(
  ...pxToRem`
    width: 98%;
    max-width: 1680px;
    margin: auto auto;
    padding: 20px;
    min-height: ${(props) => props.height};
    background-color: #ffffff;
    margin-top: ${(props) => props.marginTop};
    background: #FFFFFF;
    border-radius: 4px;
    .priceTip {
      font-size: 20px;
      font-weight: 400;
      color: #939393;
      line-height: 28px;
      margin-top: 10px;
    }
    .priceValue {
      font-size: 48px;
      font-weight: 600;
      color: #000000;
      line-height: 67px;
      margin-top: 10px;
    }
    .buy {
      width: 468px;
      max-width: 95%;
      height: 67px;
      margin-top: 10px;
      font-size: 24px;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 33px;
    }
    .titleLayout {
      display: flex;
      height: 100%;
      gap: 15px;
      padding-left:0px;
      align-items: center;
    }
    .titleValue{
      font-size: 24px;
      font-weight: 600;
      color: #000000;
      line-height: 33px;
      
    }
    .contentValue {
      font-size: 20px;
      font-weight: 400;
      color: #000000;
      margin-bottom: 10px;
      line-height: 28px;
      span {
        color: #4338ca;
      }
    }
    .history {
      overflow: scroll;
    }
`
)
