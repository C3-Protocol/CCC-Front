import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const HomePage = styled.div(
  ...pxToRem`
  width:100%;
  background: #fff;
`
)

export const FirstPage = styled.div`
  width: 100%;
  margin-top: 120px;
  margin-bottom: 50px;
  position: relative;

  .description {
    position: absolute;
    border-radius: 4px;
    width: 26.5%;
    height: 62%;
    right: 10%;
    bottom: 15%;
    z-index: 1;
    background: rgba(0, 0, 0, 0.3);
    .content {
      width: 100%;
      height: 100%;
      padding-top: 25px;
      transform: scale(${(props) => props.scale});
      transform-origin: top center;
    }
  }
  .center {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .know-more {
    width: 220px;
    height: 60px;
    font-size: 24px;
    margin: 20px auto;
    border-radius: 6px !important;
  }
  @media screen and (max-width: 1024px) {
    margin-top: 60px;
    margin-bottom: 0px;
    .description {
      width: 58%;
      height: 63%;
      right: 21%;
      bottom: 18.5%;
      background: rgba(0, 0, 0, 0.8);
      .content {
      }
    }

    .know-more {
      width: 179px;
      height: 52px;
      font-size: 16px;
      border-radius: 4px !important;
      padding: 0;
      margin: 10px auto;
    }
  }
`

export const MultiCanvasPage = styled.div(
  ...pxToRem`
  width:100%;
  @media screen and (max-width: 1152px) {
    padding-top: 40px;
  }
`
)
export const RoadMapWrapper = styled.div(
  ...pxToRem`
  width:100%;
  padding: 100px 0;
  text-align: center;
  .title{
    color:#000000;
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    margin-bottom: 100px;
  }
  .ant-carousel {
    .slick-dots {
      bottom: -60px;
      li {
        button {
          background: #D8D8D8;
        }
      }
      .slick-active {
        button {
          background: #4338CA;
        }
      }
    }
    .slick-dots-bottom{
      // .ant-carousel .slick-dots li button
    }
  }
`
)
