import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'
import { PhoneContentWidth } from '@/constants'

export const SellDetailWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  position: fixed;
  top: 0;
  min-height: 100%;
  background: #fff;
  padding-bottom: 50px;

  `
)

export const SellTopTitleWrapper = styled.div(
  ...pxToRem`
    width:100%;
    height: 70px;
    border-bottom: 1px solid #C1C1C1;
    display:flex;
    
    .go-back {
        width:100%;
        display:flex;
        max-width: 1080px;
        margin: auto auto;
        column-gap: 10px;
        align-items: center;
    }
    
  `
)
export const SellContentWrapper = styled.div(
  ...pxToRem`
  width:100%;
  max-width: 1140px;
  margin: 30px auto;
  display:flex;
  flex-wrap: nowrap;
  column-gap: 20px;
  justify-content: space-between;
  padding: 30px;
  overflow: hidden;

  .margin-20 {
    margin-top: 20px;
  }
  .margin-10 {
    margin-top: 10px;
  } 
  .margin-5 {
    margin-top: 5px;
  }
  .float-right {
    display:flex;
    column-gap: 10px;
    flex-direction: row-reverse;
  }
`
)

export const SellDetailRight = styled.div(
  ...pxToRem`
  width: 484px;
  max-width: ${PhoneContentWidth};
  margin: auto;

  @media screen and (max-width: 1152px) {
    display: none;
  }
`
)

export const PixelContent = styled.div(
  ...pxToRem`
  width: 98%;
  margin-top: 12px;
  padding-bottom: 5px;
  position: relative;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.08);

  .canvas-pixel {
    width: 100%;
    padding: 100% 0 0;
    margin: 0px auto;
    border-radius: 10px 10px 0 0;
    overflow-x: clip;
    overflow-y: clip;
    position: relative;
  }
  .info {
    margin: 5px 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`
)

export const SellDetailLeft = styled.div`
  flex: 1;
  width: 98%;

  .white-bg {
    width: 120px;
    display: flex;
    column-gap: 10px;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border: 1px solid #cdd2d9;
    border-radius: 4px;
  }

  .line {
    width: 100%;
    margin: 20px 0;
    height: 1px;
    border-bottom: 1px solid #c1c1c1;
  }
`
