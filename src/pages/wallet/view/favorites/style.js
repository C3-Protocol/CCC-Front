import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

const DrewWrapper = styled.div`
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
`
const DrewHeader = styled.div`
  width: 100%;
  text-align: right;
`
const DrewList = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  @media screen and (max-width: 1152px) {
    gap: 0px;
  }
`

export { DrewWrapper, DrewHeader, DrewList }
