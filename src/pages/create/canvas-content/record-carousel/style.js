import styled from 'styled-components'

export const RecordListItem = styled.div`
  margin: 0px 10px;

  span {
    text-align: start;
    font-size: 14px;
    font-family: Source Han Sans CN;
    font-weight: 500;
  }

  h1 {
    font-size: 14px;
    white-space: normal;
    word-break: break-all;
    word-wrap: break-word;
  }
  .item {
    color: #4338ca;
  }

  .color {
    color: #ff6060;
  }
  .color1 {
    color: #f9ce0d;
  }
  .color2 {
    color: #23ca87;
  }
`

export const RecordListWrapper = styled.div`
  width: 100%;
  height: 280px;
  margin-top: 10px;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  ::-webkit-scrollbar {
    display: none;
  }

  .child {
    min-height: 100%;
    padding: 0px 15px;
  }

  .child li {
    height: 36px;
    display: flex;
    justify-content: space-between;
    list-style-type: none;
    font-weight: 300;
    font-size: 10px;
  }
`
