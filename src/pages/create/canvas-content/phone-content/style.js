import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const MultiDrawWrapper = styled.div(
  ...pxToRem`
  width:100%;
  padding-top: 70px;
  padding-bottom: 30px;
  min-height: 100vh;
  background-color: #ffffff;
  .line {
    width: 100%;
    height: 1px;
    margin-top: 10px;
    background: #EDEDED;
  }

  
`
)
export const MultiTitleWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  height: 48px;
  background-color: #eae0fd;
  display: flex;
  gap: 15px;
  color: #000000;
  align-items: center;
  justify-content: center;
`
)

export const MultiSubTitleWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  height: 48px;
  position: relative;
  background-color: #ffffff;
  border-top: 1px solid #ccc;
  color: #333333;
  padding: 0 10px;

  .left {
    height: 100%;
    position: absolute;
    left: 5%;
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }
  .right {
    height: 100%;
    position: absolute;
    right: 5%;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      margin-left: 10px;
    }
    svg{
      width: 20px;
      height: 20px;
    }
  }

  .switch {
    display: flex;
    gap: 10px;
  }
`
)

export const MultiContentWrapper = styled.div`
  margin: 20px 2%;
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

export const PixelContent = styled.div(
  ...pxToRem`
  width: 100%;
  padding: 100% 0 0;
  position: relative;
  .canvasPixel {
    width: 100%;
    height: 100%;
    border: 1px solid #555;
    left: 0px;
    top: 0px;
    overflow: auto;
    position: absolute;
    touch-action: none;
  }
  .thumb {
    position: absolute;
    left: 1px;
    bottom: 1px;
    touch-action: none;
  }
  .selectFrame {
    position: absolute;
    bottom: 0;
    height: 150px;
  }
  .colorPicker {
    position: absolute;
    width: 80%;
    min-width: 310px;
    height: 100%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`
)

export const BlockAreaWrapper = styled.div(
  ...pxToRem`
    width: 100%;
    min-height: ${(props) => props.height};
    background: #FFFFFF;
    border: 1px solid #EDEDED;
    // border-radius: 25px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.08);
    margin: 10px 0;
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
      display: flex;
      justify-content: space-between;
      margin-top:15px;
      color:#333333;
      .confirm {
        width: auto;
        height: auto;
      }
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
      width: 100%;     
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
    .tool {
      width: 100%;
      display: flex;
      padding: 15px 5px;
      justify-content: space-between;
      align-items: center;
    }
    
`
)

export const BlockTitleWrapper = styled.div(
  ...pxToRem`
    display: flex;
    height: 50px;
    border-bottom: 1px solid rgba(237,237,237,1);
    padding-left: 28px;
    padding-right: 28px;
    align-items:center;
    gap: 10px;
    .curColor {
      width: 20px;
      height: 20px;
    }
    .close {
      flex: 1;
      display: flex;
      justify-content: flex-end;
    }
`
)
