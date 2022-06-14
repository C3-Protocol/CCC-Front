import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const HomePage = styled.div(
  ...pxToRem`
  width:100%;
  height: 100%;
  background: #fff;
`
)

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
          background: #CDD2D9;
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
