import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const LoginContent = styled.div(
  ...pxToRem`
    align-items:center;
    justify-content:center;
    display:flex;
    gap: 10px;
    width: 190px;
    height: 44px;
`
)

export const LoginButtonBg = styled.div(
  ...pxToRem`
    align-items:center;
    justify-content:center;
    display:flex;
    width: 143px;
    height: 44px;
    border-radius:10px;
    background: #000000;
`
)

export const LoginImg = styled.img(
  ...pxToRem`
  width: auto;
  height: 35px;
`
)

export const LoginOutBg = styled.div(
  ...pxToRem`
  align-items:center;
  justify-content:center;
  display:flex;
  padding: 7px;
  border-radius:50%;
  background-color:#f9ce0d;
`
)
