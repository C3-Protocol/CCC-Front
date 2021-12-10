import styled from 'styled-components'

export const WalletLabel = styled.div`
  color: ${(props) => props.fontColor || '#000000'};
  font-size: ${(props) => props.fontSize};
`

export const ModalContenWrapper = styled.div`
  .tips {
    font-size: 20px;
    margin-bottom: 10px;
  }
`
export const WalletLineWrapper = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  display: flex;
  background-color: ${(props) => props.backgroundColor};
  border-radius: ${(props) => props.radius || 0};
  justify-content: center;
  align-items: center;
  gap: ${(props) => props.gap || 0};
`
