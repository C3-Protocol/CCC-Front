import React, { useState, memo } from 'react'
import { Input, message, Radio } from 'antd'
import { shallowEqual, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { CreateWrapper, CreateContentWrapper, CreateItemWrapper, CreateBgWrapper } from './style'
import createBg from '@/assets/images/create_bg.png'
import alone from '@/assets/images/create/alone.png'
import multi from '@/assets/images/create/multi.png'

import ConfirmModal from '@/components/confirm-modal'
import { mintPixelCanvas, requestCanister, getAllUndoneCanvas, getCurrentLoginType } from '@/api/handler'
import { AloneCreate, CrowdCreate } from '@/constants'
import Toast from '@/components/toast'
import BackgroundColor from '@/assets/scripts/backgroundColor'
import { PLUG_TYPE } from '../../constants'
import { useCallback } from 'react'

function Create(props) {
  const [selectBackground, setSelectBackground] = useState(0)
  const [createType, setCreateType] = useState('')
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [canvasName, setCanvasName] = useState('')
  const [canvasDescrible, setCanvasDescrible] = useState('')
  const [confrimVisible, setConfirmVisible] = useState(false)

  const history = useHistory()
  const isAlone = () => {
    return createType === AloneCreate
  }
  const { isAuth } = useSelector(
    (state) => ({
      isAuth: state.auth.getIn(['isAuth']) || false
    }),
    shallowEqual
  )

  const createCancel = () => {
    setCreateModalVisible(false)
  }

  const showConfirmModal = () => {
    if (!canvasName || !canvasDescrible) {
      message.error('empty')
      return
    }
    setConfirmVisible(true)
  }

  const createConfirm = async () => {
    setConfirmVisible(false)
    setCreateModalVisible(false)
    let notice = Toast.loading('creating...', 0)
    let data = {
      type: createType,
      description: canvasDescrible,
      name: canvasName,
      success: (response) => {
        if (response && response.ok) {
          let canvasView = response.ok
          let txtId = canvasView.canisterId.toText()
          createCancel()
          history.push(`/canvas/${createType}/${txtId}`)
        }
      },
      fail: (error) => {
        message.error(error)
      },
      notice: notice
    }
    if (isAlone()) {
      data.background = parseInt(BackgroundColor[selectBackground.toString()].replace('#', '0x'))
    }
    requestCanister(mintPixelCanvas, data)
  }

  const handleChangeInput = (e, type) => {
    type === 1 && setCanvasName(e.target.value)
    type === 2 && setCanvasDescrible(e.target.value)
  }

  const createCanvas = (type) => {
    if (!isAuth) {
      message.error('Please sign in first')
      return
    }
    if (type === AloneCreate) {
      message.error('Sorry, you are not invited, not in the whitelist')
      return
    }
    // let notice = getCurrentLoginType() === PLUG_TYPE ? Toast.loading('quering...', 0) : null
    let data = {
      type: type,
      success: (res) => {
        if (res && res.length && ((type === AloneCreate && res.length >= 3) || type === CrowdCreate)) {
          if (type === AloneCreate) {
            message.error(
              'You have 3 unfinished personal canvases, Please go to Wallet > Drew > to find the unfinished canvases and click Finish'
            )
          } else {
            let txtId = res[0][1].toText()
            history.push(`/canvas/${type}/${txtId}`)
          }
        } else {
          setCanvasName('')
          setCanvasDescrible('')
          setCreateType(type)
          setCreateModalVisible(true)
        }
      },
      fail: (error) => {
        message.error(error)
      }
      // notice: notice
    }
    requestCanister(getAllUndoneCanvas, data)
  }

  const getBackgroundColorRadio = () => {
    let radios = []
    for (let key in BackgroundColor) {
      radios.push(
        <Radio.Button
          key={key}
          value={key}
          style={{ backgroundColor: BackgroundColor[key], marginLeft: '12px', marginTop: '5px' }}
        ></Radio.Button>
      )
    }
    return radios
  }

  const onChangeBackgroundColor = (e) => {
    setSelectBackground(parseInt(e.target.value))
  }
  return (
    <CreateWrapper bg={createBg}>
      {/* 主体内容 */}
      <CreateContentWrapper>
        <CreateItemWrapper
          itemBg={multi}
          onClick={() => {
            createCanvas(CrowdCreate)
          }}
        >
          <div className="title">Crowd</div>
        </CreateItemWrapper>
        <CreateItemWrapper
          itemBg={alone}
          onClick={() => {
            createCanvas(AloneCreate)
          }}
        >
          <div className="title">Personal</div>
        </CreateItemWrapper>
      </CreateContentWrapper>
      <ConfirmModal
        title={isAlone() ? 'Alone Create' : 'Crowd Create'}
        width={400}
        onModalClose={createCancel}
        onModalConfirm={showConfirmModal}
        modalVisible={createModalVisible}
      >
        <div>Please fill in the name and description of the canvas carefully, cannot modify after confirm.</div>
        <Input
          placeholder="Name"
          value={canvasName}
          style={{ marginTop: '20px' }}
          className="ant-input-violet"
          maxLength={50}
          onChange={(e) => handleChangeInput(e, 1)}
        />
        <Input
          placeholder="Describle"
          value={canvasDescrible}
          style={{ marginTop: '20px' }}
          className="ant-input-violet"
          maxLength={100}
          onChange={(e) => handleChangeInput(e, 2)}
        />
        {isAlone() && (
          <div>
            <div style={{ marginTop: '20px' }}>Choose a background:</div>
            <Radio.Group defaultValue="0" style={{ marginTop: '5px' }} onChange={onChangeBackgroundColor}>
              {getBackgroundColorRadio()}
            </Radio.Group>
          </div>
        )}
      </ConfirmModal>

      <ConfirmModal
        title={'Create'}
        width={340}
        onModalClose={() => {
          setConfirmVisible(false)
        }}
        onModalConfirm={createConfirm}
        modalVisible={confrimVisible}
      >
        <div className="tips">{`Are you sure to spend ${isAlone() ? 0.05 : 0.1}WICP to create a new canvas?`}</div>
      </ConfirmModal>
    </CreateWrapper>
  )
}
export default memo(Create)
