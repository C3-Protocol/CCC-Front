import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const MarketDetailWrapper = styled.div(
  ...pxToRem`
    width: 100%;
    min-height: 100%;
    background: #fff;
    padding-bottom: 50px;
    `
)

export const MarketDetailTopWrapper = styled.div(
  ...pxToRem`
  width:100%;
  max-width: 1680px;
  margin: auto auto;
  display:flex;
  flex-wrap: nowrap;
  gap: 40px;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;

  @media screen and (max-width: 1152px) {
    flex-wrap: wrap;
  }
`
)

export const MarketDetailBlock = styled.div(
  ...pxToRem`
      width: 100%;
      max-width: 1680px;
      margin: auto auto;
      padding: 25px 20px;
      min-height: ${(props) => props.height};
      margin-top: ${(props) => props.marginTop};
      background: #FFFFFF;
      border-radius: 4px;
      border: 1px solid #CDD2D9;
      display: flex;
      flex-direction: column;
      row-gap: 7px;
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
        width: 220px;
        max-width: 95%;
        height: 60px;
        font-size: 24px;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 33px;
        border-radius: 10px;
      }
      .titleLayout {
        display: flex;
        gap: 15px;
        margin: 0 -20px;
        padding-left:20px;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 1px solid #CDD2D9;
      }
      .titleValue{
        font-size: 24px;
        font-weight: 600;
        color: #000000;
        line-height: 33px;
        
      }
      .contentValue {
        font-size: 18px;
        font-weight: 400;
        color: #000000;
        margin-top: 25px;
        margin-bottom: 10px;
        line-height: 28px;
        span {
          color: #4338ca;
        }
      }
      
      .textDetail {
        font-size: 16px;
        font-weight: 400;
        color: #000000;
        line-height: 28px;
        span {
          color: #4338ca;
        }
      }
      .content-between {
        display: flex;
        flex-wrap: wrap;
        column-gap: 40px;
        justify-content: space-between;
      }

      .borderBottom {
        padding-bottom: 20px;
        margin: 0 -20px;
        padding-left: 20px;
        padding-right: 20px;
        border-bottom: 1px solid #CDD2D9;
      }
      .history {
        overflow: scroll;
      }
  `
)

export const MarketDetailRight = styled.div(
  ...pxToRem`
    flex: 1;
    max-width: 100%;
    .title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      .index {
        display: flex;
        align-items: center;
        column-gap: 10px;
      }
      span {
        font-size: 48px;
        font-weight: 600;
        color: #000000;
        line-height: 67px;
      }
      .favorite {
        width: 40px;
        margin: auto 10px;
      }
      .rarity{
        padding: 3px 10px;
        background: linear-gradient(270deg, #F9CE0D 0%, #F7A100 100%);
        border-radius: 4px;
        font-weight: 600;
      }
    }
    .owner {
      width: 98%;
      margin: 0 auto;
      margin-top:18px;
      display:flex;
      justify-content: space-between;
      :hover{
        path {
          fill: #4338ca;
        } 
      }
    }
    .fork-btn{
      font-size: 14px;
      font-family: Poppins-SemiBold, Poppins;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 23px;
      width: 114px;
      height: 40px;
      background: linear-gradient(232deg, #4338CA 0%, #000000 100%);
      border-radius: 20px;
      :hover{
        color: #fff;
      }
    }
    .picture {
      width: 24px;
      height: 24px;
      background: #fff;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    }
  
    .seller {
      color:#4338CA;
      margin-right: 20px;
    }
  
    .content-between {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
    }
  
    .content-flex {
      display: flex;
      column-gap: 10px;
      justify-content: space-between;
      align-items: center;
    }
  
    @media screen and (max-width: 1152px) {
      .title {
        .index {
          flex-wrap: wrap;
        }
        span {
          font-size: 30px;
          line-height: 45px;
        }
      }
    }
  `
)
