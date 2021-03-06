import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const CrowdUndoneCoverAvailableWrapper = styled.div(
  ...pxToRem`
  .title1 {
    width: 140px;
    height: 30px;
    background: #4337C9;
    border-radius: 8px 30px 0px 0px;
    font-size: 16px;
    font-weight: 400;
    line-height: 30px;
    color: #FFFFFF;
    margin-bottom: 0px;
    text-align: start;
    padding-left: 10px;
  }
  
  &:hover {
    cursor: pointer;
  }
`
)
export const CrowdUndoneContentAvailableWrapper = styled.div(
  ...pxToRem`
  max-width: 707px;
  height: 308px;
  background: #fff;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.08);
  border-radius: 0px 8px 8px 8px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  column-gap: 16px;

  .pixel-wrapper {
    width: 308px;
    height: 308px;
    position: relative;
    border-radius: 0px 0px 0px 8px;
    overflow-x: clip;
    overflow-y: clip;
  }

  
  .info-right {
    flex: 1;
    width: 400px;
    max-width: 98%;
    padding: 9px;
    display: flex;
    flex-direction: column;
    .canvas-index {
      display: flex;
      justify-content: space-between;
      align-items: center;

      span {
         &:nth-child(1) {
          font-size: 30px;
          font-weight: 600;
          color: #000000;
          line-height: 42px;
          margin-right: 40px;
        }
        &:nth-child(2) {
          font-size: 16px;
          font-weight: 500;
          color: #999999;
          line-height: 22px;
        }
      }
    }
    ul {
      margin: 10px 0;
      padding: 0px;
      flex: 1;
      h4 {
        font-size: 16px;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
        label {
          display: inline-block;
          padding-right: 10px;
        }
      }
    }
    .canvas-edit {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .price {
        height: 100%;
        font-size: 48px;
        font-weight: 600;
        color: #4338ca;
        line-height: 60px;
        display: flex;
        align-items: center;
        column-gap: 10px;
      }
      
    }
  }

  @media screen and (max-width: 1152px) {
    width: 96%;
    height: fit-content;
    margin: 0;
    .pixel-wrapper {
      width: 100%;
      height: 0;
      padding: 100% 0 0;
      border-radius: 0px;
    }
    .info-right {
      flex: 1;
      padding-left: 2%;
      padding-right: 2%;
      ul {
        min-height: 20px;
        margin: 5px 0;
        li {
          label {
            font-size: 18px;
          }
        }
      }
      .canvas-index {
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          &:nth-child(1) {
            font-size: 24px;
          }
          &:nth-child(2) {
            width: 70px;
            text-align: center;
            height: 26px;
            line-height: 26px;
            color: #fff;
            font-size: 16px;
            background: #4338CA;
            border-radius: 6px;
          }
        }
      }
      .canvas-edit {
        .price {
          color: #333;
          font-size: 24px;
          font-weight: 400;
          display: flex;
          align-items: center;
       }
     }
    }
    
  }
`
)
