import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const CommonNFTWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: #fff;
  padding-bottom: 10px;
  flex: 0 0 360px;

  .image-content {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    height: 0;
  }

  .transfer {
    position: absolute;
    bottom: -21px;
    right: 4%;
    width: 42px;
    height: 42px;
    background: #fff;
    box-shadow: 0px 0px 30px 0px rgb(0 0 0 / 12%);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .transparent {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: #0000;
  }
  .control-icon {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover .icon{
      opacity: 1;
    }
    .icon{
      width: 45px;
      height: 45px;
      opacity: 0;
    }
  }
  
  .zombie-image-wrapper,
  .image-wrapper {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    margin-bottom: 5px;
    border-radius: 10px 10px 0 0;    
    overflow: hidden;

    
    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      background: transparent;
    }

    .ant-image {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      &-img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        image-rendering: pixelated;
      }
      &-placeholder {
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
      }
    }
  }

  .zombie-image-wrapper {
    .ant-image-img {
      position: absolute;
      left: 0;
      top: 68%;
      width: 100%;
      height: fit-content;
      transform: translateY(-50%);
      object-fit: cover;
      image-rendering: pixelated;
    }
  }
  .detail {
    width: 100%;
    padding: 0 4%;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .operation {
    width: fit-content;
    margin: 10px auto 0;
  }

  .nft-index {
    font-size: 18px;
    font-weight: 600;
    color: #000000;
    line-height: 24px;
  }
  .nft-rare {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    line-height: 22px;
    span {
      color: #4338ca;
      font-weight: 600;
    }
  }

  .canvas-price {
    margin-top: 10px;
    padding: 0 4%;
    display: flex;
    justify-content: flex-end;
  }


  .nft-manage {
    width: 80px;
    height: 45px;
  }

  &:hover {
    cursor: pointer;
    transform: translateY(-4px);
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.2);
  }
  
  .ant-skeleton-element {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  @media screen and (max-width: 1152px) {
    flex: 0 0 50%;
  }
`
)
