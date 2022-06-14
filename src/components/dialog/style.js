import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const DialogWrapper = styled.div(
  ...pxToRem`
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 900;
    display: flex;
    background: rgba(0, 0, 0, 0.8);

`
)
