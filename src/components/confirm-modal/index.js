import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'antd'
import { WalletLineWrapper, ModalContenWrapper } from './style'
function ConfirmModal(props) {
  useEffect(async () => {}, [])

  const handlerClose = () => {
    props.onModalClose && props.onModalClose()
  }

  const handlerConfirm = () => {
    props.onModalConfirm && props.onModalConfirm()
  }

  //适配问题啊

  return (
    <Modal title={props.title} visible={props.modalVisible} width={props.width} centered footer={null} closable={false}>
      <ModalContenWrapper>{props.children}</ModalContenWrapper>

      <WalletLineWrapper height={'80px'} gap={'50px'}>
        <Button type="violet" onClick={handlerClose} size={'large'}>
          Cancel
        </Button>
        <Button type="violet" onClick={handlerConfirm} size={'large'}>
          Confirm
        </Button>
      </WalletLineWrapper>
    </Modal>
  )
}

export default ConfirmModal
