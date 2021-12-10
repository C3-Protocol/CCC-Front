import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const WalletWrapper = styled.div(
  ...pxToRem`
    width: 100%;
    height:100%;
    position: relative;
    background-image: ${(props) => 'url(' + props.bg + ')'};
    background-repeat:no-repeat;
    background-size:100% 100%;

`
)

export const WalletBlockWrapper = styled.div(
  ...pxToRem`
    width: ${(props) => props.width};
    height: ${(props) => props.height};
    position: absolute;
	  left:50%;
    top: ${(props) => props.top};
    margin-left: ${(props) => props.marginLeft};
    box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    overflow: hidden;
    z-index: 0;
    padding: ${(props) => props.padding};
    box-sizing: border-box;
    display: ${(props) => props.display};
    ::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        -webkit-filter: blur(20px);
        -moz-filter: blur(20px);
        -ms-filter: blur(20px);
        -o-filter: blur(20px);
        filter: blur(20px) saturate(180%);
        z-index: -3;
        margin: -30px;
        background-image:  ${(props) => 'url(' + props.bg + ')'};
        background-position: center top;
        background-size: cover;
        background-attachment: fixed;
    }
    ::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color:${(props) => props.bgColor};
        z-index: -3;
    }
    .back {
      position: absolute;
      left: 2%;
      bottom: 20px;
      width: 200px;
      height: 45px;
    }
`
)

export const WalletLabel = styled.div`
  color: ${(props) => props.fontColor || '#000000'};
  font-size: ${(props) => props.fontSize};
  word-break: break-word;
  line-height: 30px;
`

export const WalletEllipsisLabel = styled.div`
  color: ${(props) => props.fontColor || '#000000'};
  font-size: ${(props) => props.fontSize};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const WalletLineWrapper = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  display: flex;
  background-color: ${(props) => props.backgroundColor};
  border-radius: ${(props) => props.radius || 0};
  justify-content: ${(props) => props.justify || 'center'};
  align-items: center;
  gap: ${(props) => props.gap || 0};

  .picture {
    width: 200px;
    height: 200px;
  }
  .textarea {
    width: 60%;
  }
  @media screen and (max-width: 1152px) {
    .picture {
      width: 120px;
      height: 120px;
    }
  }
`
