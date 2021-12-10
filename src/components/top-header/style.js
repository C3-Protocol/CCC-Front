import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const TopHeaderWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  
  .header-content {
    width: 100%;
    height: 120px;
    position: fixed;   
    z-index: 10;
  }

  .header {
    width: 100%;
    height: 100%;
    position: relative;  
  }
  
  .logo_auth {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
  }
  
  .header_bg {
    background: #ffffff;
  }
  
  .menu {
    width: calc(100vw - 560px);
    height: 100%;
    left: 280px;
    right: 280px;
    top: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
  }
  
  .logo {
    align-items: center;
    justify-content: center;
    margin-left: 30px;
    display: flex;
    img {
      height: 48px;
    }
  }
  
  .logo.hover {
    cursor: pointer;
  }
  .test {
    font-size: 32px;
    color: #f00;
    margin-left: 15px;
    align-items: center;
    justify-content: center;
  }
  .auth {
    width: 200px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 30px;
  }  
  
  .authPage {
    width: 100%;
    height: 100%;
  }

  @media screen and (max-width: 1152px) {
    .header-content {
      height: 50px;
      .logo {
        img {
          height: 38px;
        }
      }
    }
  }
`
)
