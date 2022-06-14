import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const FirstPage = styled.div(
  ...pxToRem`
  width: 100vw;

  .content-bg {
    position: relative;
    width: 100%;
  }

  .ant-carousel {
    height: 100%;
    .slick-dots {
      &-bottom {
        bottom: 35px;
      }
      li {
        width: 10px;
        button {
          background: #eeeeee;
          height: 10px;
          border-radius: 50%;
          opacity: 0.5;
        }
      }
      .slick-active {
        width: 32px;
        button {
          background: #ffffff;
          height: 10px;
          border-radius: 8px;
          opacity: 1;
        }
      }
    }
  }
  

  .button-layout {
    margin-top: 20%;
    display: flex;
    column-gap: 40px;
  }
 
  .button {
    width: 185px;
    height: 48px;
    span {
      font-size: 18px !important;
      font-weight: 600 !important;
      line-height: 25px !important;
    }
  }

  .list {
    position: absolute;
    right: 1%;
    top: 7%;
    display: flex;
    flex-direction: column;
    align-items: end;
    row-gap: 10px;
    img {
      width: 40px;
    }
  }

  @media screen and (max-width: 1024px) {
    margin-bottom: 0px;
    .content {
      width: 100%;
    }
    .button {
      width: 130px;
      height: 36px;
      span {
        font-size: 14px !important;
        font-weight: 500 !important;
        line-height: 21px !important;
      }
    }
    .list {
      right: 1%;
      top: 5%;
      row-gap: 5px;
      img {
        width: 30px;
      }
    }
  }
`
)
