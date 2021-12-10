import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const MultiDrawWrapper = styled.div(
  ...pxToRem`
  width:100%;
  min-height: 100vh;
  background-color: #ffffff;
  .line {
    width: 100%;
    height: 1px;
    margin-top: 10px;
    background: #EDEDED;
  }

  .more {
    display:flex;
    align-items:center; 
    justify-content:center;
    width: 50px;
    span {
      position: absolute;
      font-size: 20px;
      color:#000;
      animation: opacity 1s infinite;
    }
  }
  @keyframes opacity{
    0%{opacity: 0}
　　  50%{opacity: 1}
    100%{opacity: 0}
  }
`
)

export const MultiTitleWrapper = styled.div`
  width: 100%;
  min-width: 1550px;
  height: 48px;
  background-color: #eae0fd;
  display: flex;
  gap: 15px;
  color: #000000;
  align-items: center;
  justify-content: center;
`

export const MultiSubTitleWrapper = styled.div`
  width: 100%;
  min-width: 1550px;
  height: 48px;
  position: relative;
  background-color: #ffffff;
  color: #333333;
  .home {
    top: 10px;
    left: 40px;
    width: 30px;
    height: 30px;
    position: absolute;
    border-radius: 50%;
    background-color: #f9ce0d;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content {
    width: 800px;
    height: 100%;
    position: absolute;
    left: 50%;
    margin-left: -400px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
  }

  .hideLineInfo {
    width: 900px;
    height: 100%;
    position: absolute;
    left: 50%;
    display: flex;
    gap: 10px;
    margin-left: -900px;
    padding-right: 480px;
    justify-content: flex-end;
    align-items: center;
  }

  .rightInfo {
    min-width: 450px;
    height: 100%;
    display: flex;
    position: absolute;
    right: 20px;
    gap: 10px;
    justify-content: flex-end;
    align-items: center;
  }

  .wicp {
    height: 100%;
    width: 250px;
    color: #4338ca;
    text-align: right;
    line-height: 48px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .auth {
    width: 170px;
  }
`

export const MultiContentWrapper = styled.div`
  width: 100%;
  min-width: 1550px;
  display: flex;
  gap: 15px;
  justify-content: center;
`

export const MultiDrawLeft = styled.div`
  width: 344px;
  position: relative;

  .content: {
    width: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
  }

  .thumb {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 204px;
    height: 204px;
    margin: 5px auto 0px auto;
    border: 1px solid rgba(0, 0, 0);
  }

  .canvas {
    position: relative;
    width: 200px;
    height: 200px;
  }

  .tool {
    width: 100%;
    display: flex;
    padding: 15px 5px;
    justify-content: space-between;
    align-items: center;
  }
`

export const CustomRadioWrapper = styled.div(
  ...pxToRem`
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  display: flex;
  margin: 0 auto;
  border: ${(props) => (props.isChecked ? '1px solid #4338ca' : '1px solid rgba(150,150,150,0)')} ;
`
)

export const MultiDrawRight = styled.div`
  width: 376px;
  position: relative;

  .content: {
    width: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
  }

  .textDetail {
    padding-left: 28px;
    padding-right: 28px;
    margin-top: 10px;
    color: #333333;
    span {
      color: #4338ca;
    }
  }

  .expandRecord {
    width: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 20px;
    background: #ffffff;
    border: 1px solid #ededed;
    border-radius: 25px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);
    overflow: scroll;
  }
`

export const MultiDrawMiddle = styled.div`
  width: ${(props) => props.width + 'px'};
  .sliderParent {
    width: 780px;
    height: 20px;
    margin: 5px auto;
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .slider {
    width: 700px;
    height: 100%;
    padding: 0px 0px !important;
  }
  .canvasPixel {
    width: ${(props) => props.width + 'px'};
    height: ${(props) => props.width + 'px'};
    border: 1px solid #555;
    overflow: auto;
    position: relative;
  }
`

export const ColorPicker = styled.div(
  ...pxToRem`


`
)

export const BlockAreaWrapper = styled.div(
  ...pxToRem`
    width: ${(props) => props.width}px;
    min-height: ${(props) => props.height}px;
    background: #FFFFFF;
    border: 1px solid #EDEDED;
    border-radius: 25px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);
    margin-bottom: ${(props) => props.marginBottom || 20}px;
    padding-bottom: 5px;
    
    .textContent{
        padding-left: 28px;
        padding-right: 28px;
        color:#B7B7B7;
    }
    .textDetail{
        padding-left: 28px;
        padding-right: 28px;
        margin-top: 10px;
        color:#333333;
        span {
          color: #4338ca;
        }
    }
    .textSubDetail{
      padding-left: 48px;
      padding-right: 8px;
      color:#666666;
      margin-top: 6px;
    }
    .textTitle{
      padding-left: 28px;
      padding-right: 28px;
      margin-top: 15px;
      color:#000000;
    }
    .textPriceContent{
      padding-left: 28px;
      padding-right: 28px;
      min-height: 70px;
      display: flex;
      flex-direction: column;
      width:100%;
    }
    .totalPrice{
        margin-top:20px;
        color:#333333;
    }
    .totalNum{
        margin-top:15px;
        color:#333333;
    }
    .tips {
      color:#888888;
      font-size: 16px;
      margin-top: 70px;
      margin-bottom: 30px;
    }
    .buttonLayout{
      margin-top: 10px;
      display:flex;
      gap: 15px;
      align-items:center; 
      justify-content:center;
      width: 380px;     
    }
    .confirm{
        width: 184px;
        height: 54px;
    }
    .withdraw {
      margin-left: 15px;
      width: 100px;
      height: 40px;
    }

    
`
)

export const BlockTitleWrapper = styled.div(
  ...pxToRem`
    display: flex;
    height: 50px;
    border-bottom: 1px solid rgba(237,237,237,1);
    padding-left: 10px;
    align-items:center;
    padding-left: 28px;
    gap: 10px;
    .curColor {
      width: 20px;
      height: 20px;
    }
`
)
