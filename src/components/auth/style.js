import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const LoginContent = styled.div(
  ...pxToRem`
    align-items:center;
    justify-content:flex-end;
    display:flex;
    margin-left: 10px;
    column-gap: 20px;
    height: 44px;
    
    .picture {
      width: 36px;
      height: 36px;
      margin-right: 10px;
      background: #fff;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
    }
`
)
