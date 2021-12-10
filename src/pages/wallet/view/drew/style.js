import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

const DrewWrapper = styled.div`
  width: 100%;
`
const DrewHeader = styled.div`
  width: 100%;
  text-align: right;
  .ant-radio-group-solid .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
    background: #4338ca;
    border-color: #4338ca;
  }
`
const DrewList = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  @media screen and (max-width: 1152px) {
    gap: 0px;
  }
`

export { DrewWrapper, DrewHeader, DrewList }
