import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const CrowdUndoneCoverAvailableWrapper = styled.div(
  ...pxToRem`
  max-width: 1115px;
  min-height: 485px;
  background: #fff;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  margin: 0 auto;
  padding: 14px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  .pixel-wrapper {
    width: 450px;
    height: 450px;
    position: relative;
    margin: auto;
    border-radius: 20px;
    border: 1px dotted #ccc;
  }

  
  .info-right {
    flex: 1;
    padding-left: 46px;
    .canvas-index {
      span {
        display: inline-block;
        &:nth-child(1) {
          height: 60px;
          font-size: 48px;
          font-family: PingFangTC-Semibold, PingFangTC;
          font-weight: 600;
          color: #000;
          line-height: 60px;
          margin-right: 40px;
        }
        &:nth-child(2) {
          height: 40px;
          font-size: 30px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #6d7278;
          line-height: 42px;
        }
      }
    }
    ul {
      min-height: 245px;
      margin: 30px 0;
      li {
        font-size: 20px;
        color: #939393;
        list-style: none;
        line-height: 35px;
        margin-left: -40px;
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
        font-family: PingFangTC-Semibold, PingFangTC;
        font-weight: 600;
        color: #4338ca;
        line-height: 60px;
        display: flex;
        align-items: center;
        column-gap: 10px;
      }
      .btn-edit {
        img {
          width: 115px;
          height: 115px;
        }
        &:hover {
          cursor: pointer;
        }
      }
    }
  }

  @media screen and (max-width: 1152px) {
    width: 96%;
    .pixel-wrapper {
      width: 96%;
      height: 0;
      padding: 96% 0 0;
      border: none;
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
       .btn-edit {
         img {
           width: 80px;
           height: 80px;
         }
       }
     }
    }
    
  }
`
)
