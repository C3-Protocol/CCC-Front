import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const MultiContentWrapper = styled.div(
  ...pxToRem`
  width:100%;
  background: #ffffff;

`
)

export const MultiListWrapper = styled.div(
  ...pxToRem`
  margin-top: 6px;
  max-width: 1530px;
  margin: 0 auto;
  
  .aloneBg {
    padding: 100px 0 0 ;
  }
  .title{
    color:#000000;
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    margin-bottom: 100px;
  }

  .multi-list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    justify-content: center;
    column-gap: 10px;
    row-gap: 10px;
  }

  .market-list {
    width: 100%;
    display: flex;
    flex: 1 1 360px;
    column-gap: 10px;
    overflow-x: scroll;
    padding: 30px;
  }

  .market-list::-webkit-scrollbar {
    display: none;
  }

  .more {
    float: right;
    margin-right: 40px;
    a {
      font-size: 22px;
      color: #4338ca !important;
    }
  }

  @media screen and (max-width: 1152px) {
    padding-left: 2%;
    padding-right:2%;
    .title {
      margin-bottom: 40px;
    }
    .aloneBg {
      padding: 50px 0 0;
    }
    .market-list {
      padding: 0px;
    }
  }
`
)
