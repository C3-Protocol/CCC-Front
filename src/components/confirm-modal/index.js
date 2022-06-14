import React, { useEffect } from 'react'
import { Button, Modal } from 'antd'
import './style.less'

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
    <Modal
      title={props.title}
      visible={props.modalVisible}
      width={Math.max(props.width, 400)}
      centered
      footer={null}
      closable={false}
      {...props}
    >
      <div className="modal-content-wrapper ">{props.children}</div>

      <div className="modal-button-layout">
        <Button onClick={handlerClose} className={`${props.btnClass ? props.btnClass[0] : 'ccc-cancel-btn'} btn-small`}>
          Cancel
        </Button>
        <Button
          onClick={handlerConfirm}
          className={`${props.btnClass ? props.btnClass[1] : 'ccc-confirm-btn'} btn-small`}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  )
}

export default ConfirmModal
