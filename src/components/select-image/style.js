import styled from 'styled-components'

export const PixelSelectFrameBgWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
`

export const PixelSelectFrame = styled.div`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  position: absolute;
  border: 1px solid #333333;
  .cancel {
    position: absolute;
    width: 20px;
    height: 20px;
    right: 0px;
    top: 0px;
    border-radius: 50%;
    background-color: #f9ce0d;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ok {
    position: absolute;
    width: 20px;
    height: 20px;
    right: 30px;
    top: 0px;
    border-radius: 50%;
    background-color: #f9ce0d;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`
