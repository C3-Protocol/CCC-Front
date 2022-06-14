import React, { memo, useState } from 'react'
import { Button, Modal } from 'antd'
import PubSub from 'pubsub-js'
import { ShowAuthDrawer } from '@/message'
import CompleteForm from './complete-form'
import { shallowEqual, useSelector } from 'react-redux'

function CanvasFinish(props) {
  const [finishVisible, setFinishVisible] = useState(false)
  const { isAuth } = useSelector((state) => {
    return {
      isAuth: state['auth'].getIn(['isAuth']) || false
    }
  }, shallowEqual)
 
  const showFinishModal = () => {
    if (!isAuth)
      PubSub.publish(ShowAuthDrawer, {})
    else
      setFinishVisible(true)
  }

  const cancelFinishModal = () => {
    setFinishVisible(false)
  }

  const getFinishContent = () => {
    return  (
        <div>
          <div className="buttonLayout">
            <Button
              className="ccc-confirm-btn"
              onClick={showFinishModal}
            >
              Finish
            </Button>
          </div>
          <Modal
            visible={finishVisible}
            width={800}
            centered
            footer={null}
            closable={false}
            title={'The creation is complete'}
          >
            <div style={{height: '75vh', overflow: 'scroll'}}>
              <CompleteForm modalClose={cancelFinishModal} {...props} />
            </div>
            
          </Modal>
          
        </div>
      )
    
  }
  return getFinishContent()
}
export default memo(CanvasFinish)
