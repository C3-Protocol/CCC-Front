import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const DetailLeft = styled.div(
  ...pxToRem`
  width: 480px;
  height: 480px;
  margin: auto;
  background: #ffffff;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  border: 1px solid #CDD2D9;
  
  .ant-image {
    width: 100%;
    object-fit: cover;
    image-rendering: pixelated;
  }
  .ant-image-mask {
    display: none !important;
  }
  .video-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #00000099;
      img{
        width: 50px;
        height: 50px;
      }
    }
  }
`
)

export const ZombieDetailLeft = styled.div(
  ...pxToRem`
  width: 420px;
  max-width: 98%;
  min-height: 420px;
  margin: auto;
  background: #ffffff;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #CDD2D9;
  display: flex;

  .ant-image-mask {
    display: none !important;
  }
`
)

export const ZombieAttrWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  height: 60px;
  background: #F9F8FF;
  border-radius: 2px;
  border: 1px solid #4338CA;
  align-items: center;

  .title {
    width: 100%;
    height: 50%;
    align-items: center;
    background: rgba(67, 56, 202, 0.15);
    border-radius: 2px 2px 0px 0px;
    display: flex;

    .attr-name{
      flex: 1;
      text-align: center;
      font-size: 18px;
      font-weight: 500;
      color: #000000;
    }
  }
  
  .attr-sub-title {
    width: 100%;
    height: 50%;
    align-items: center;
    border-radius: 2px 2px 0px 0px;
    display: flex;
    .attr-value{
      flex: 1;
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      color: #666;
    }
  }
`
)

export const DialogBoxWrapper = styled.div(
  ...pxToRem`
    position: relative;
    left: 50%;
    top: 50%;
    width: 542px;
    transform: translate(-50%, -50%);
    background: #FFFFFF;
    border-radius: 10px;
    color: #000;
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

export const AttrBoxWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 10px;
  column-gap: 10px;
  row-gap: 10px;
  flex-wrap: wrap;

  .box {
    width: calc(20% - 8px);
    background: #f9f8ff;
    border-radius: 2px;
    border: 1px solid #4338ca;
    padding: 5px 0px;

    h1 {
      text-align: center;
      font-size: 18px;
      font-weight: 500;
      color: #000000;
      line-height: 24px;
      margin-bottom: 10px;
    }

    h5 {
      text-align: center;
      font-size: 16px;
      font-weight: 400;
      color: #666;
      line-height: 21px;
    }
  }

  @media screen and (max-width: 700px) {
    column-gap: 3px;
    row-gap: 3px;
    .box {
      width: calc(33% - 2px);
    }
  }
`
