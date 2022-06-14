import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const CreateWrapper = styled.div(
  ...pxToRem`
    width: 100%;
    height:100%;
    position: relative;
    background-image: ${(props) => 'url(' + props.bg + ')'};
`
)

export const CreateContentWrapper = styled.div(
  ...pxToRem`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    top: 180px;
    justify-content:center;
    align-items:center;
    gap: 20px;
    @media screen and (max-width: 1152px) {
      top: 70px;
    }
`
)

export const CreateItemWrapper = styled.div(
  ...pxToRem`
    width: 442px;
    height: 442px;
    position: relative;
    background-size: 100% 100%;
    background-image: ${(props) => 'url(' + props.itemBg + ')'};
    .title {
        width: 100%;
        display:flex;
        font-weight:bold;
        color: #000000;
        position: absolute;
        bottom: 45px;
        font-size: 30px;
        justify-content:center;
        align-items:center;
    }

    &:hover {
      cursor: pointer;
      transform: translateY(-4px);
      box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
    }

    @media screen and (max-width: 1152px) {
      width: 300px;
      height: 300px;
      .title {
        bottom: 35px;
      }
    }
`
)
