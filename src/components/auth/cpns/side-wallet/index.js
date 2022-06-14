import React, { useState, useEffect } from 'react'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { InputNumber, Button, Form, Input, message, Image, Typography, Slider, Modal } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import BigNumber from 'bignumber.js'

import { transferIcp2WIcp, transferWIcp2WIcp, transferIcp2Icp, transferWIcp2Icp, requestCanister } from '@/api/handler'
import { requestICPBalance, requestWICPBalance, refreshICPAndWICPBalance } from '@/components/auth/store/actions'
import './style.less'
import { RefreshIcon, TransferIcon } from '@/icons'
import ExchangeIcon from '@/assets/images/icon/exchange.svg'
import WicpIconImg from '@/assets/images/wicp_logo.svg'
import DfinityLogo from '@/assets/images/dfinity.png'
import { principalToAccountId, isAuthTokenEffect, getValueDivide8 } from '@/utils/utils'
import { Principal } from '@dfinity/principal'
import Toast from '@/components/toast'
import Dialog from '@/components/dialog'
import WrappProcess from './wrap-process'
const { Paragraph } = Typography
import PubSub from 'pubsub-js'
import { WrapStateChange } from '@/message'

const { Item } = Form
const TRANS_TYPE_ICP_ICP = 1
const TRANS_TYPE_WICP_WICP = 2
const TRANS_TYPE_ICP_WICP = 3
const TRANS_TYPE_WICP_ICP = 4

const SideWallet = (props) => {
  const { isAuth, authToken, accountId, wicpBalance, icpBalance } = useSelector((state) => {
    let isAuth = state.auth.getIn(['isAuth']) || false
    let authToken = state.auth.getIn(['authToken']) || ''
    let accountId = isAuthTokenEffect(isAuth, authToken) ? principalToAccountId(Principal.fromText(authToken)) : ''
    return {
      isAuth,
      authToken,
      accountId,
      wicpBalance: (state.auth && state.auth.getIn(['wicpBalance'])) || 0,
      icpBalance: (state.auth && state.auth.getIn(['icpBalance'])) || 0
    }
  }, shallowEqual)
  const dispatch = useDispatch()
  const [isRefresh, setRefresh] = useState(false)
  const [transAddress, setTransAddress] = useState('')
  const [transAmount, setTransAmount] = useState(0)
  const [transHandleFee, setTransHandleFee] = useState('')
  const [transType, setTransType] = useState(-1) //1:icp2icp,2、wicp2wicp,3、icp2wicp,4、wicp2icp
  const [sendVisible, setSendVisible] = useState(false)
  const [transferLoading, setTransferLoading] = useState(false)
  const [wrap, setWrap] = useState(1) //1 wrap, -1unwrap
  const [wrapInputValue, setWrapInputValue] = useState(0)
  const [sliderWrap, setSliderWrap] = useState(0)
  const formRef = React.useRef()
  const modelFormRef = React.useRef()
  const marks = {
    0: '',
    25: '',
    50: '',
    75: '',
    100: ''
  }

  const handlerClose = () => {
    setTransType(-1)
    setTransAmount(0)
    setTransAddress('')
    modelFormRef.current &&
      modelFormRef.current.setFieldsValue({
        address: null
      })
    modelFormRef.current &&
      modelFormRef.current.setFieldsValue({
        'transfer-amount': null
      })
    formRef.current.setFieldsValue({
      'icp-wrap': null
    })
    formRef.current.setFieldsValue({
      'wicp-wrap': null
    })
    formRef.current.setFieldsValue({
      slider: 0
    })
  }
  const handleCancleSendModal = () => {
    if (transferLoading) {
      return
    }
    setSendVisible(false)
    handlerClose()
  }

  const showTransferModal = (type) => {
    console.log('showTransferModal:', type)
    setSendVisible(true)
    setTransType(type)
  }
  const handleSetToAddress = (e) => {
    setTransAddress(e.target.value)
  }
  const handleSetTransferAmount = (e) => {
    setTransAmount(e - 0)
    let actuallyAmount = new BigNumber(e - 0).minus(transHandleFee)
    if (actuallyAmount.lt(0)) {
      actuallyAmount = new BigNumber(0)
    }
  }

  const checkAmount = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please input to Amount'))
    } else if (
      new BigNumber(transAmount).multipliedBy(Math.pow(10, 8)) > icpBalance &&
      (transType === TRANS_TYPE_ICP_ICP || transType === TRANS_TYPE_ICP_WICP)
    ) {
      return Promise.reject(new Error('Insufficient ICP'))
    } else if (
      new BigNumber(transAmount).multipliedBy(Math.pow(10, 8)) > wicpBalance &&
      (transType === TRANS_TYPE_WICP_WICP || transType === TRANS_TYPE_WICP_ICP)
    ) {
      return Promise.reject(new Error('Insufficient WICP'))
    } else if (transAmount <= 0.0001 && (transType === TRANS_TYPE_ICP_ICP || transType === TRANS_TYPE_ICP_WICP)) {
      return Promise.reject(new Error('At least 0.0001 ICP is required in this transation'))
    } else if (transAmount < 0.1 && transType === TRANS_TYPE_WICP_ICP) {
      return Promise.reject(new Error('At least 0.1 WICP is required in this transation'))
    } else if (transAmount <= 0 && transType === TRANS_TYPE_WICP_WICP) {
      return Promise.reject(new Error('WICP must be greater than 0'))
    } else {
      return Promise.resolve()
    }
  }
  const checkAccount = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Please input to Account'))
    } else if (transType === TRANS_TYPE_ICP_ICP) {
      if (value.indexOf('-') >= 0) return Promise.reject(new Error('Illegal Account ID'))
      else if (value === accountId) return Promise.reject(new Error('Can not transfer to yourself'))
      return Promise.resolve()
    } else if (transType === TRANS_TYPE_WICP_WICP) {
      if (value.indexOf('-') === -1) return Promise.reject(new Error('Illegal Principal ID'))
      else if (value === authToken) return Promise.reject(new Error('Can not transfer to yourself'))
      return Promise.resolve()
    } else {
      return Promise.resolve()
    }
  }

  const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

  const requetTransfer = async (transAddress, transAmount, transType) => {
    setTransferLoading(true)
    let txt
    transType === TRANS_TYPE_ICP_ICP && (txt = 'Transfering')
    transType === TRANS_TYPE_WICP_WICP && (txt = 'Transfering')
    transType === TRANS_TYPE_ICP_WICP && (txt = 'Wrapping')
    transType === TRANS_TYPE_WICP_ICP && (txt = 'Unwrapping')
    let notice = Toast.loading(txt, 0)
    let address = transAddress.replace(/\s+/g, '')
    let data = {
      amount: parseFloat(transAmount),
      address: address,
      success: async (res) => {
        console.log('trans res:', res)
        if (res) {
          setTransferLoading(false)
          handleCancleSendModal()
          message.success(
            transType === TRANS_TYPE_WICP_ICP
              ? `The ICP will be deposited to your account in a few minutes`
              : 'successful',
            transType === TRANS_TYPE_WICP_ICP ? 5 : 3
          )

          if (isAuth && authToken) {
            dispatch(requestWICPBalance(authToken))
            const maxTryTime = 10
            let times = 1
            while (times < maxTryTime) {
              await sleep(1500)
              dispatch(requestICPBalance(authToken))
              times++
            }
          }
        }
      },
      fail: (err) => {
        setTransferLoading(false)
        message.error('error:', err.toString())
      },
      error: (err) => {
        setTransferLoading(false)
        message.error('error:', err.toString())
      },
      notice,
      close: () => {
        setTransferLoading(false)
      }
    }
    transType === TRANS_TYPE_ICP_ICP && requestCanister(transferIcp2Icp, data)
    transType === TRANS_TYPE_WICP_WICP && requestCanister(transferWIcp2WIcp, data)
    transType === TRANS_TYPE_ICP_WICP && requestCanister(transferIcp2WIcp, data)
    transType === TRANS_TYPE_WICP_ICP && requestCanister(transferWIcp2Icp, data)
  }

  const wrapIcp2WIcp = (transAmount) => {
    setTransferLoading(true)
    Dialog.createAndShowDialog(<WrappProcess />, 0)
    let data = {
      amount: parseFloat(transAmount),
      onChange: async (state) => {
        PubSub.publish(WrapStateChange, { state })
        if (state === 3) {
          setTransferLoading(false)
          handleCancleSendModal()
          message.success('successful')
          if (isAuth && authToken) {
            dispatch(requestWICPBalance(authToken))
            dispatch(requestICPBalance(authToken))
          }
        }
      }
    }
    requestCanister(transferIcp2WIcp, data)
  }

  const handlerWrapOrUnwrap = () => {
    if (wrap === 1) wrapIcp2WIcp(wrapInputValue)
    else requetTransfer('', wrapInputValue, wrap === 1 ? TRANS_TYPE_ICP_WICP : TRANS_TYPE_WICP_ICP)
  }

  const handlerTransfer = () => {
    requetTransfer(transAddress, transAmount, transType)
  }

  const handleWrapInput = (value) => {
    setWrapInputValue(value)
    let res = 0
    if (wrap === 1) {
      if (icpBalance > 0 && value)
        res = parseFloat(new BigNumber(value).multipliedBy(Math.pow(10, 8)).dividedBy(icpBalance).multipliedBy(100))
      setSliderWrap(res)
    } else if (wrap === -1) {
      if (wicpBalance > 0 && value)
        res = parseFloat(new BigNumber(value).multipliedBy(Math.pow(10, 8)).dividedBy(wicpBalance).multipliedBy(100))
      setSliderWrap(res)
    }
    let actuallyAmount = new BigNumber(value).minus(0.0001)
    if (actuallyAmount.lt(0)) {
      actuallyAmount = new BigNumber(0)
    }
    if (wrap === 1) {
      formRef.current.setFieldsValue({
        'wicp-wrap': parseFloat(actuallyAmount)
      })
      formRef.current.setFieldsValue({
        'icp-wrap': value
      })
    } else if (wrap === -1) {
      formRef.current.setFieldsValue({
        'icp-wrap': parseFloat(actuallyAmount)
      })
      formRef.current.setFieldsValue({
        'wicp-wrap': value
      })
    }
    formRef.current.setFieldsValue({
      slider: res
    })
  }
  const checkWrapAmount = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Empty'))
    } else if (wrap === 1 && new BigNumber(value).multipliedBy(Math.pow(10, 8)) > icpBalance) {
      return Promise.reject(new Error('Insufficient ICP'))
    } else if (wrap === 1 && value <= 0.0001) {
      return Promise.reject(new Error('At least 0.0001 ICP '))
    } else if (wrap === -1 && new BigNumber(value).multipliedBy(Math.pow(10, 8)) > wicpBalance) {
      return Promise.reject(new Error('Insufficient WICP'))
    } else if (wrap === -1 && value <= 0.1) {
      return Promise.reject(new Error('At least 0.1 WICP '))
    } else {
      return Promise.resolve()
    }
  }

  const onChangeWrapValue = (val) => {
    setSliderWrap(val)
    let res = null
    if (wrap === 1) {
      res = parseFloat(new BigNumber(icpBalance).multipliedBy(val).dividedBy(100).dividedBy(Math.pow(10, 8)).toFixed(8))
      setWrapInputValue(parseFloat(res))
    } else if (wrap === -1) {
      res = parseFloat(
        new BigNumber(wicpBalance).multipliedBy(val).dividedBy(100).dividedBy(Math.pow(10, 8)).toFixed(8)
      )
      setWrapInputValue(parseFloat(res))
    }
    if (res !== null) {
      let actuallyAmount = new BigNumber(res).minus(0.0001)
      if (actuallyAmount.lt(0)) {
        actuallyAmount = new BigNumber(0)
      }
      if (wrap === 1) {
        formRef.current.setFieldsValue({
          'wicp-wrap': parseFloat(actuallyAmount)
        })
        formRef.current.setFieldsValue({
          'icp-wrap': res
        })
      } else if (wrap === -1) {
        formRef.current.setFieldsValue({
          'icp-wrap': parseFloat(actuallyAmount)
        })
        formRef.current.setFieldsValue({
          'wicp-wrap': res
        })
      }
    }
  }

  useEffect(() => {
    let didCancel = true
    if (isAuthTokenEffect(isAuth, authToken)) {
      didCancel && dispatch(requestICPBalance(authToken))
      didCancel && dispatch(requestWICPBalance(authToken))
    }
    return () => {
      didCancel = false
    }
  }, [isAuth, authToken])

  const handleRefresh = () => {
    if (isAuthTokenEffect(isAuth, authToken)) {
      setRefresh(true)
      dispatch(
        refreshICPAndWICPBalance(authToken, () => {
          setRefresh(false)
        })
      )
    }
  }

  const icpLayout = (
    <div className="balance-item">
      <div className="sub-item">
        <div className="balance">
          <Image src={DfinityLogo} width={30} preview={false} />
          <span>ICP</span>
        </div>
        <div
          className="hover-violet"
          onClick={(e) => {
            e.stopPropagation()
            if (!transferLoading) showTransferModal(TRANS_TYPE_ICP_ICP)
          }}
        >
          {TransferIcon}
        </div>
      </div>
      <div className="sub-item2">
        <Form.Item name="icp-wrap" rules={[{ validator: checkWrapAmount }]}>
          <InputNumber
            min={0}
            keyboard={false}
            stringMode={true}
            step={1}
            placeholder={'0.00'}
            value={wrapInputValue}
            onChange={(e) => handleWrapInput(e)}
          />
        </Form.Item>
        <p>{`Balance: ${getValueDivide8(icpBalance)}`}</p>
      </div>
      {wrap === 1 && (
        <div className="slider-layout">
          <Form.Item name="slider">
            <Slider
              disabled={icpBalance == 0}
              tipFormatter={(value) => `${value}%`}
              marks={marks}
              step={0.01}
              value={sliderWrap}
              initialValues={0}
              onChange={(val) => onChangeWrapValue(val)}
            />
          </Form.Item>
        </div>
      )}
    </div>
  )

  const wicpLayout = (
    <div className="balance-item">
      <div className="sub-item">
        <div className="balance">
          <Image src={WicpIconImg} width={30} preview={false} />
          <span>WICP</span>
        </div>
        <div
          className="hover-violet"
          onClick={(e) => {
            e.stopPropagation()
            if (!transferLoading) showTransferModal(TRANS_TYPE_WICP_WICP)
          }}
        >
          {TransferIcon}
        </div>
      </div>
      <div className="sub-item2">
        <Form.Item name="wicp-wrap" rules={[{ validator: checkWrapAmount }]}>
          <InputNumber
            min={0}
            keyboard={false}
            stringMode={true}
            step={1}
            placeholder={'0.00'}
            value={wrapInputValue}
            onChange={(e) => handleWrapInput(e)}
          />
        </Form.Item>
        <p>{`Balance: ${getValueDivide8(wicpBalance)}`}</p>
      </div>
      {wrap === -1 && (
        <div className="slider-layout">
          <Form.Item name="slider">
            <Slider
              disabled={wicpBalance == 0}
              tipFormatter={(value) => `${value}%`}
              marks={marks}
              step={0.01}
              value={sliderWrap}
              initialValues={0}
              onChange={(val) => onChangeWrapValue(val)}
            />
          </Form.Item>
        </div>
      )}
    </div>
  )

  return (
    <div className="side-wallet-wrapper">
      <div className="flex-space-between">
        <h4>{wrap === 1 ? 'Wrap' : 'Unwrap'}</h4>
        <div className={`hover-violet refresh ${isRefresh ? 'turn' : ''}`} onClick={handleRefresh}>
          {RefreshIcon}
        </div>
      </div>
      <Form ref={formRef} onFinish={handlerWrapOrUnwrap}>
        {wrap === 1 ? icpLayout : wicpLayout}
        <div
          className="balance-transfer"
          onClick={() => {
            setWrap(wrap * -1)
            setWrapInputValue(null)
            setSliderWrap(0)
            formRef.current.setFieldsValue({
              'icp-wrap': null
            })
            formRef.current.setFieldsValue({
              'wicp-wrap': null
            })
            formRef.current.setFieldsValue({
              slider: 0
            })
          }}
        >
          <img src={ExchangeIcon} />
        </div>
        {wrap === -1 ? icpLayout : wicpLayout}
        <div className="margin-top-20">
          {isAuth ? (
            <Form.Item>
              <Button
                type="violet"
                htmlType="submit"
                className="wrapp_button btn-normal"
                loading={transferLoading && transType === -1}
              >
                {wrap === 1 ? 'Wrap' : 'Unwrap'}
              </Button>
            </Form.Item>
          ) : (
            <></>
          )}
        </div>
      </Form>

      <Modal
        visible={sendVisible}
        width={428}
        centered
        footer={null}
        closable={false}
        title={
          transType === TRANS_TYPE_ICP_ICP || transType === TRANS_TYPE_WICP_WICP
            ? 'Transfer'
            : transType === TRANS_TYPE_ICP_WICP
            ? 'Wrapped'
            : 'De-Wrapped'
        }
        bodyStyle={{ padding: '5px 24px 24px' }}
      >
        <Form size="large" autoComplete="off" preserve={false} onFinish={handlerTransfer} ref={modelFormRef}>
          <div className="title" style={{ marginBottom: '10px' }}>
            {transType === TRANS_TYPE_ICP_WICP && 'Wrap ICP to WICP'}
            {transType === TRANS_TYPE_WICP_ICP && 'Unwrap WICP to ICP'}
            {transType === TRANS_TYPE_ICP_ICP && 'Transfer ICP to Account ID'}
            {transType === TRANS_TYPE_WICP_WICP && 'Transfer WICP to Principal ID'}
          </div>

          {(transType === TRANS_TYPE_ICP_ICP || transType === TRANS_TYPE_WICP_WICP) && (
            <Item name="address" rules={[{ validator: checkAccount }]}>
              <Input
                type="text"
                placeholder={transType === TRANS_TYPE_ICP_ICP ? 'To Account ID' : 'To Principal ID'}
                value={transAddress}
                className="ant-input-violet input-radius4"
                onChange={(e) => handleSetToAddress(e)}
              />
            </Item>
          )}

          <Item name="transfer-amount" rules={[{ validator: checkAmount }]}>
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              keyboard={false}
              stringMode={true}
              step={1}
              placeholder={'Amount'}
              value={transAmount}
              className="ant-input-violet input-radius4"
              onChange={(e) => handleSetTransferAmount(e)}
            />
          </Item>

          {transType === TRANS_TYPE_WICP_WICP && (
            <div style={{ marginTop: '15px', color: '#f00', fontSize: '14px', lineHeight: '18px' }}>
              <WarningOutlined />
              ：Attention: WICP transfer only applies to Principal IDs on CCC & Ceto. Transfer to other wallets may
              cause lost of your assets due to different standards adopted.
            </div>
          )}
          <Form.Item>
            <div className="flex-40" style={{ margin: '10px auto', width: 'fit-content' }}>
              <Button onClick={handleCancleSendModal} className="ccc-cancel-btn">
                Cancel
              </Button>
              <Button htmlType="submit" className="ccc-confirm-btn">
                Confirm
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default SideWallet
