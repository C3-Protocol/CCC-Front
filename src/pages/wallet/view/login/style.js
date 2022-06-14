import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const LoginSelectContent = styled.div(
  ...pxToRem`
  width:540px;
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  margin: 30px auto 0px;
  @media screen and (max-width: 600px) {
    width: 400px;
  }
`
)
