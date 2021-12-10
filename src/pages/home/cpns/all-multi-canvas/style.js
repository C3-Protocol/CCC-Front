import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const MultiContentWrapper = styled.div(
  ...pxToRem`
  width:100%;
  background-image: linear-gradient(to top, #fff, rgba(208, 234, 255, 1), rgba(252, 240, 255, 1), #fff);

`
)

export const MultiListWrapper = styled.div(
  ...pxToRem`
  margin-top: 6px;
  width:100%;
  padding-left: 2%;
  padding-right:2%;
  .aloneBg {
    padding: 100px 0;
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
  }

  .multi-done-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, 780px);
    justify-content: center;
    gap: 100px;
    margin-top: 20px;
  }

  .market-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, 680px);
    justify-content: center;
    gap: 100px;
    margin-top: 20px;
  }
  .more {
    float: right;
    margin-right: 40px;

    a {
      font-size: 22px;
      color: #F9CE0D !important;
    }
  }

  @media screen and (max-width: 1152px) {
    .title {
      margin-bottom: 40px;
    }
    .aloneBg {
      padding: 50px 0 0;
    }
    .multi-done-list {
      min-width: 100%;
      display: -webkit-box;
      overflow-x: scroll;
      gap: 0px;
    }
    .market-list {
      min-width: 100%;
      display: -webkit-box;
      overflow-x: scroll;
      gap: 0px;
    }
    
  }
`
)
