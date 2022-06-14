import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const SettingWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  height: 100%;
  background: #ffffff;
  `
)

export const SettingContentWrapper = styled.div(
  ...pxToRem`
  width:100%;
  height: 100%;
  display:flex;
  flex-wrap: nowrap;
  overflow: hidden;

  .margin-40 {
    margin-top: 40px;
  }
  .margin-20 {
    margin-top: 20px;
  }
  .margin-15 {
    margin-top: 15px;
  } 
  .margin-10 {
    margin-top: 10px;
  } 
  .margin-2 {
    margin-top: 2px;
  }
  
  .left-menu {
    width: 290px;
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
    .ant-menu-item {
      height: 60px;
      font-size: 16px !important;
      font-weight: 600 !important;
      color: #FFFFFF !important;
      line-height: 60px;
      text-align: center;
      margin: 0px;
      background: #4338CA !important;
    }
  }
  .right-content{
    flex: 1;
    height: 100%;
    padding: 30px;

    .input-width {
      width: 50%;
      min-width: 428px;
    }
    .input-height {
      height: 165px;
    }
    .ant-input {
      background-color: #fff0 !important;
    }
    .prefix-star {
      &::after {
        content: ' *' !important;
        color: red !important;
      }
    }
    .textarea {
      display: flex;
      align-items: flex-start;
      span {
        padding: 6px 0px 6px 11px;
        color: #666 !important;
        margin-right: 6px !important;
      }
    }
    
    .picture {
      width: 100px;
      height: 100px;
      position: relative;
      .ant-avatar  {
        img{
          image-rendering: pixelated;
        }
      }
      &:hover .mask-inner {
        top: 0;
        opacity: 1;
        background: rgba(0,0,0,.5);
      }
    }
    .avatar {
      width: 100px;
      height: 100px;
      background: #fff;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    }
    .mask-inner {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      border-radius: 50px;
      img{
        position: absolute;
        height: 16px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
`
)
