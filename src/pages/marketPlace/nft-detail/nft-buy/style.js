import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const DialogBoxWrapper = styled.div(
  ...pxToRem`
    position: relative;
    left: 50%;
    top: 50%;
    width: 542px;
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

export const ZombieBuyContentWrapper = styled.div(
  ...pxToRem`
  padding: 20px;
  width: 100%;
  column-gap: 10px;
 
  .content {
    width:100%;
    display: flex;
    margin: auto auto;
    display:flex;
    column-gap: 20px;
    align-items: center;
    overflow: hidden;

    .nftImage {
      width: 150px;
      object-fit: cover;
      image-rendering: pixelated;
    }
    .adjustment {
      margin-top: -30px;
    }
    .nft-info {
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
      margin-top:18px;
      display:flex;
      gap: 15px;
      margin-bottom: 25px;
    }
    .seller {
      color:#4338CA;
    }
    .picture {
      width: 24px;
      height: 24px;
      background: #fff;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    }
    
    
    .button-layout {
      margin: 25px 10px 10px;
      width:90%;
      height: 50px;
      display: flex;
      column-gap: 35px;
      justify-content: center;
    }
  }
  .tip {
    margin-top: 20px;
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
  @media screen and (max-width: 1152px) {
    .content {
      .nftImage {
        display: none;
      }
      
      .button-layout {
        height: fit-content;
        flex-wrap: wrap;
        row-gap: 10px;
      }
    }
    
  }
`
)
