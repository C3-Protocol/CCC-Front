import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const DialogBoxWrapper = styled.div(
  ...pxToRem`
    position: relative;
    left: 50%;
    top: 50%;
    width: 760px;
    height: fit-content;
    background: #FFFFFF;
    border-radius: 10px;
    transform: translate(-50%, -50%);
    justify-content:center;
    align-items:center;
    
    .close {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 10px;
      right: 10px;
    }
    @media screen and (max-width: 700px){
      width: 90%;
    }
`
)

export const M1155BuyContentWrapper = styled.div(
  ...pxToRem`
  padding: 20px;
  width: 100%;
  column-gap: 10px;
  .title-000 {
    margin: 0px auto 10px;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    color: #000000;
    text-align: center;
  }

  .content {
    width:100%;
    display: flex;
    margin: auto auto;
    display:flex;
    column-gap: 20px;
    overflow: hidden;
  
    .canvas-thumb {
      width: 225px;
      height: 225px;
    }
    .zombie-info {
      flex: 1;
    }
    .title {
      margin-top: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 24px;
        font-weight: 600;
        color: #000000;
        line-height: 20px;
      }
    }
    
    .owner {
      margin-top:5px;
      display:flex;
      column-gap: 15px;
      margin-bottom: 25px;
      align-items: center;
    }
    .picture {
      width: 24px;
      height: 24px;
      background: #fff;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    }
    .seller {
      color:#4338CA;
    }
    .flex1 {
      flex: 1;
    }
  }
  .button-layout {
    margin: 0 auto;
    width:90%;
    height: 50px;
    display: flex;
    column-gap: 35px;
    justify-content: center;
  }

  .tip {
    margin-top: 15px;
    font-size: 10px;
    color: #939393;
    line-height: 14px;
  }

  .line {
    margin-top: 10px;
    width: 100%;
    height: 1px;
    border: 1px dashed #CDD2D9;
  }
  
  .charge {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    row-gap: 10px;
    .icpValue {
      font-size: 32px;
      font-weight: 600;
      color: #333333;
      line-height: 45px;

    }
  }
`
)
