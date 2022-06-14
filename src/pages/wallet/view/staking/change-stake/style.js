import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const ChangeStakeWrapper = styled.div(
  ...pxToRem`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 1240px;
  height: 703px;
  background: #FFFFFF;
  border-radius: 10px;   
  padding: 15px;  
  display: flex;
  flex-direction: column;
  align-items: center;

  .content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 14px 18px;
  }
  .title{
    font-size: 20px;
    font-family: Poppins-SemiBold, Poppins;
    font-weight: 600;
    color: #000000;
  }
 
  .subTitle {
    font-family: Poppins-Medium, Poppins;
    width: 100%;
    display: flex;
    margin-top: 15px;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    .about{
      font-size: 16px;
      color: #4338CA;
      font-weight: 500;
    }

    .subs {
        display: flex;
        column-gap: 10px;
        align-items: center;
        .available{
          margin-Right:40px
        }
    }
  }


  .nft-list {
    margin: 0px 0;
    height: 400px;
    width: 100%;
    padding: 30px 0px;
    display: flex;
    flex-wrap: wrap;
    column-gap: 10px;
    row-gap:10px;
    overflow-Y: scroll;
    overflow-x:hidden;
  }
  .footer-stake{
    margin-top:20px;
    width:100%;
    display:flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 16px;
font-family: Poppins-Medium, Poppins;
font-weight: 500;
color: #6D7278;
  }
  
  .button-layout {
      height: 60px;
      display: flex;
      column-gap: 40px;
      align-items: center;
  }

`
)
