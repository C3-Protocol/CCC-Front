import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const ZombieWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  height: fit-content;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: ${(props) => (props.isSelected ? '#4338ca' : '#fff')};
  padding-bottom: 10px;
  flex: 0 0 290px;

  .image-content {
    position: relative;
    width: 100%;
    height: 0;
  }

  .image-wrapper {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    margin-bottom: 15px;
    border-radius: 10px 10px 0 0;
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

  .detail {
    font-size: 16px;
    font-family: Poppins-Medium, Poppins;
    font-weight: 500;
    color:${(props) => (props.isSelected ? '#fff' : '#000')};
    line-height: 26px;
    width: 100%;
    padding: 0 4%;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .nft-rare{
      background: ${(props) => (props.isSelected ? '' : 'linear-gradient(249deg, #4338CA 0%, #000000 100%)')};
      -webkit-background-clip: text;
      -webkit-text-fill-color: ${(props) => (props.isSelected ? '' : 'transparent')};;
    }
  }

  .nft-index {
    font-size: 16px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 500;
    color:${(props) => (props.isSelected ? '#ffffff' : '#00000')};
    line-height: 24px;
  }
  
  .reward {
    width: 100%;
    padding: 0 4%;
    display: flex;
    font-size: 12px;
font-family: Poppins-Medium, Poppins;
font-weight: 500;
    color:${(props) => (props.isSelected ? '#ffffff' : '#A6AEB7')};
    line-height: 17px;
    column-gap: 10px;
  }

  @media screen and (max-width: 1152px) {
    flex: 0 0 50%;
  }
`
)
