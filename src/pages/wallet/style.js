import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'
export const WalletWrapper = styled.div(
  ...pxToRem`
    width: 100%;
    height: 100%;
    min-height: 100%;
    background: #fff;
    font-family: Poppins-Medium, Poppins;
`
)

export const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
`

// background-image: ${(props) => 'url(' + props.bg + ')'};
export const TopWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  .bg{
    width:100%;
    height: 220px;
    background: linear-gradient(180deg, #4338CA 0%, #000000 100%);

  }
  .user-content{
    width:100%;
  }
  .profile {
    width:100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top:-64px;
    .title{
      margin-top:20px;
      font-size: 24px;
      font-family: Poppins-SemiBold, Poppins;
      font-weight: 600;
    }
  }
  .picture {
    margin:auto,
    width: 120px;
    height: 120px;
    position: relative;
    .ant-avatar  {
      border:4px solid #fff;
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
    width: 120px;
    height: 120px;
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
    border-radius: 60px;
    border:4px solid #fff;
    img{
      position: absolute;
      height: 16px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .score {
    display: flex;
    height: 24px;
    align-items: center;
    column-gap: 10px;
    background: #F9CE0D;
    border-radius: 12px;
    padding-right: 10px;
    margin-top: 2px;
    .score-bg{
      background: #eca63a;
      width: 24px;
      height: 24px;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .margin-40 {
    margin-top: 155px;
  }
  .margin-10 {
    margin-top: 10px;
  }
  .margin-5 {
    margin-top: 5px;
  }
  .textarea {
    max-width: 500px;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; 
    overflow: hidden;
    font-size: 14px;
    font-family: Poppins-Medium, Poppins;
    font-weight: 500;
    color: #A6AEB7;
  }
  .bottom {
    height: 106px;
    width: 100%;
    position: relative;
    .icp-wicp-value{
      display: flex;
      align-items: center; 
           height: 76px;
      width: 100%;
      border-radius: 9px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .price {
        flex: 1;
        justify-content: center;
        display: flex;
        align-items: center;
        column-gap: 10px;
        .title{
          font-size: 16px;
          font-weight: 500;
          color: #6D7278;
          line-height: 26px;
        }
        .number {
          font-size: 30px;
          font-family: Poppins-SemiBold, Poppins;
          font-weight: 600;
          line-height: 36px;
          span{
            margin-left:10
          }
        }
      }
    }    
  }

  .bottom-no-balance {
    display: flex;
    height: 40px;
    width: 100%;
    position: relative;  
  }
  .right-icon {
    display: flex;
    column-gap: 20px;
    margin-left:20px;
    bottom: 20%;
    color: #A6AEB7;
    svg {
      width: 22px;
      height: 22px;
      &:hover{
        color:rgb(50,50,50)
      }
    }
  }

  @media screen and (max-width: 1152px) {
    .textarea {
      width: 90%;
    }
    .bottom {
      height: 126px;
      width: 100%;
      position: relative;
      .icp-wicp-value{
        display: flex;
        width: 96%;
        min-width: 96%;
        height: 70px;
        top: 35%;
        transform: translate(-50%, -50%);
        .price {
          flex: 1;
          padding: 0 20px;
          display: flex;
          align-items: center;
          column-gap: 10px;
          .title{
            font-size: 16px;
            font-weight: 500;
            color: #6D7278;
            line-height: 26px;
          }
          .number {
            font-size: 30px;
            font-family: Poppins-SemiBold, Poppins;
            font-weight: 600;
            line-height: 36px;
            span{
              margin-left:10
            }
          }
        }
      }    
    }
    .right-icon {
      bottom: 10px;
    }
  }
`
)

export const MenuWrapper = styled.div`
  overflow: hidden;
  margin: 20px auto 0;
  box-sizing: border-box;
  width: 100%;
}
`

export const WalletContentWrapper = styled.div(
  ...pxToRem`
    flex: 1;
    height:100%;
    border-top: 1px solid #c1c1c1;
`
)
