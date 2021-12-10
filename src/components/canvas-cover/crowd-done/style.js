import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const CrowdDoneCoverAvailableWrapper = styled.div(
  ...pxToRem`
  max-width: 720px;
  min-height: 338px;
  background: #fff;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  margin: 0 auto;
  padding: 14px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  
  .pixel-wrapper {
    width: 300px;
    height: 300px;
    position: relative;
    margin: auto;
    border-radius: 20px;
    border: 1px dotted #ccc;
  }

  
  .info-right {
    flex: 1;
    padding: 0 2% ;
    .canvas-index {
      span {
        display: inline-block;
        &:nth-child(1) {
          height: 50px;
          font-size: 38px;
          font-family: PingFangTC-Semibold, PingFangTC;
          font-weight: 400;
          color: #000;
          line-height: 50px;
          margin-right: 20px;
        }
      }
    }
    ul {
      min-height: 245px;
      margin: 20px 0;
      li {
        font-size: 20px;
        color: #939393;
        list-style: none;
        line-height: 35px;
        margin-left: -40px;
        label {
          display: inline-block;
        }
      }
    }
    .canvas-edit {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      column-gap: 10px;
      .price {
        height: 100%;
        font-size: 48px;
        font-family: PingFangTC-Semibold, PingFangTC;
        font-weight: 600;
        color: #4338ca;
        line-height: 60px;
      }
    }
  } 
  @media screen and (max-width: 1152px) {
    width: ${(props) => props.width};
    margin: 1%;
    display: block;
    padding: 0;
    .pixel-wrapper {
      width: 96%;
      height: 0;
      padding: 96% 0 0;
      border: none;
    }
    .info-right {
      flex: 1;
      padding: 10px;
      .canvas-index {
        span {
          &:nth-child(1) {
            height: 30px;
            font-size: 24px;
            font-family: PingFangTC-Semibold, PingFangTC;
            font-weight: 400;
            color: #000;
            line-height: 30px;
            margin-right: 20px;
          }
        }
      }
      ul {
        min-height: 20px;
        margin: 5px 0;
        li {
          font-size: 14px;
          line-height: 26px;
        }
      }
     
      .canvas-edit {
        display: flex;
        justify-content: flex-end;
        column-gap: 10px;
        .price {
         font-size: 20px;
         font-weight: 400;
         line-height: 28px;
         color: #333;
        }
      }
      .invested {
        text-align: end;
        font-size: 14px;
        color: #888;
      }
    }
    
  }
`
)
