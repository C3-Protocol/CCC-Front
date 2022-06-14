import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const FirstPage = styled.div(
  ...pxToRem`
  width: 100%;
  margin-bottom: 7%;

  .content-bg{
    position: relative;
  }

  .canvas-bg {
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
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

`
)

export const BannerContentAvailableWrapper = styled.div(
  ...pxToRem`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 860px;
  height: ${(props) => props.height};
  margin: 0 auto;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  column-gap: 0px;

  .pixel-wrapper {
    width: 400px;
    height: 400px;
    position: relative;
    margin: auto;
    border-radius: 8px;
    overflow-x: clip;
    overflow-y: clip;
  }

  
  .info-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    .canvas-index {
      display: flex;
      flex-direction: column;
      row-gap: 10px;

      span {
         &:nth-child(1) {
          font-size: 36px;
          font-weight: 600;
          color: #000000;
          line-height: 42px;
          margin-right: 40px;
        }
        &:nth-child(2) {
          font-size: 20px;
          font-weight: 500;
          color: #666666;
          line-height: 22px;
        }
      }
    }
    .ui-content {
      flex: 1;
      display: flex;
      align-items: center
    }
    ul {
      padding: 0px;
      h4 {
        font-size: 20px;
        font-weight: 400;
        color: #333333;
        line-height: 25px;
        label {
          display: inline-block;
          padding-right: 10px;
        }
      }
    }
    
  }
  @media screen and (max-width: 1152px) {
    width: 100%;
    .pixel-wrapper {
      display: none;
    }
    .info-right {
      align-items: center;
    }
  }
 
  
`
)
