import React, { useEffect, useState } from 'react'
import { Button, Modal, Input, message, Avatar, Popover, Tooltip } from 'antd'
import { shallowEqual, useSelector } from 'react-redux'
import { WalletWrapper, WalletBlockWrapper, WalletLineWrapper, WalletLabel, WalletEllipsisLabel } from './style'
import { principalToAccountId, getValueDivide8, transformPxToRem, isCollapsed } from '@/utils/utils'
import { Principal } from '@dfinity/principal'
import { OwnedNFTUpdate } from '@/message'
import PubSub from 'pubsub-js'
import ConfirmModal from '@/components/confirm-modal'
import background from '@/assets/images/wallet_bg.png'
import avator from '@/assets/images/wallet/avator.png'
import copy from '@/assets/images/wallet/copy.png'
import send from '@/assets/images/wallet/send.png'
import icp2wicp from '@/assets/images/wallet/icp2wicp.png'
import wicpLogo from '@/assets/images/wicp-logo.png'
import dfinityLogo from '@/assets/images/dfinity.png'

import {
  balanceICP,
  balanceWICP,
  transferIcp2WIcp,
  transferWIcp2WIcp,
  transferIcp2Icp,
  transferWIcp2Icp,
  getAllNFT,
  requestCanister
} from '@/api/handler'
import { AloneCreate, CrowdCreate } from '@/constants'
import Toast from '@/components/toast'
import MyNFT from './my-nft'
import ICPTransaction from './icp-transaction'
import WICPTransaction from './wicp-transaction'
import { CalculatorFilled } from '@ant-design/icons'
const jrQrcode = require('jr-qrcode')

function Wallet(props) {
  let mount = true
  const [icp, setIcp] = useState(0)
  const [wicp, setWICP] = useState(0)
  const [nft, setNFT] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [transFerVisible, setTransFerVisible] = useState(false)
  const [transType, setTransType] = useState(-1) //1:icp2icp,2、wicp2wicp,3、icp2wicp,4、wicp2icp
  const [transAmount, setTransAmount] = useState(null)
  const [trans2Address, setTrans2Address] = useState('')
  const [transfering, setTransfering] = useState(false)
  const [nftInfo, setNFTInfo] = useState(null)
  const [currentKey, setCurrentKey] = useState('nft')

  const { isAuth, authToken } = useSelector((state) => {
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      authToken: state.auth.getIn(['authToken']) || ''
    }
  }, shallowEqual)

  useEffect(() => {
    const nftUpdate = PubSub.subscribe(OwnedNFTUpdate, nftUpdateFunc)
    return () => {
      mount = false
      PubSub.unsubscribe(nftUpdate)
    }
  }, [])

  useEffect(async () => {
    if (isAuth && authToken && authToken !== '2vxsx-fae') {
      requestCanister(balanceWICP, {
        curPrinId: authToken,
        success: (res) => {
          mount && setWICP(res)
        }
      })
      requestCanister(balanceICP, {
        curPrinId: authToken,
        success: (res) => {
          mount && setIcp(res)
        }
      })
      requestCanister(getAllNFT, {
        success: (res) => {
          if (mount) {
            let nft = res[AloneCreate].length + res[CrowdCreate].length
            setNFT(nft)
            setNFTInfo(res)
          }
        }
      })
    } else {
      mount && setWICP(0)
      mount && setIcp(0)
      mount && setNFT(0)
      mount && setNFTInfo({ AloneCreate: [], CrowdCreate: [] })
    }
    setRefresh(false)
  }, [authToken, refresh])

  const nftUpdateFunc = () => {
    requestCanister(getAllNFT, {
      success: (res) => {
        if (mount) {
          let nft = res[AloneCreate].length + res[CrowdCreate].length
          setNFT(nft)
          setNFTInfo(res)
        }
      }
    })
  }
  const handlerClose = () => {
    setTransFerVisible(false)
    setTransType(-1)
    setTransAmount(null)
    setTrans2Address('')
  }

  const handleSetTransferAmount = (e) => {
    if (e.target.value) {
      let value = parseFloat(e.target.value)
      if (value < 0) value = 0
      let index = String(e.target.value).indexOf('.')
      if (index !== -1) {
        let x = index + 1 //小数点的位置
        let count = String(e.target.value).length - x
        if (count > 8) {
          return
        }
      }
      setTransAmount(value)
    } else {
      setTransAmount(null)
    }
  }

  const handleSetTransfer2Address = (e) => {
    setTrans2Address(e.target.value)
  }

  const updateCurrentItem = (key) => {
    setCurrentKey(key)
    if (isAuth) {
      key === 'wicp' &&
        requestCanister(balanceWICP, {
          curPrinId: authToken,
          success: (res) => {
            mount && setWICP(res)
          }
        })
      key === 'icp' &&
        requestCanister(balanceICP, {
          curPrinId: authToken,
          success: (res) => {
            mount && setIcp(res)
          }
        })
      key === 'nft' &&
        requestCanister(getAllNFT, {
          success: (res) => {
            if (mount) {
              let nft = res[AloneCreate].length + res[CrowdCreate].length
              setNFT(nft)
              setNFTInfo(res)
            }
          }
        })
    }
  }

  const handlerTransfer = async () => {
    if (transfering) {
      message.error('The previous transaction is still in progress, please wait a moment and resubmit')
      return
    }
    if (transAmount > icp && (transType === 1 || transType === 3)) {
      message.error('Insufficient ICP')
      return
    }
    if (transAmount > wicp && (transType === 2 || transType === 4)) {
      message.error('Insufficient WICP')
      return
    }
    if (transAmount <= 0.0001 && (transType === 1 || transType === 3)) {
      message.error('At least 0.0001 ICP is required in this transation')
      return
    }
    if (transAmount < 0.1 && transType === 4) {
      message.error('At least 0.1 WICP is required in this transation')
      return
    }
    setTransfering(true)
    let txt
    transType === 1 && (txt = 'Transfering...')
    transType === 2 && (txt = 'Transfering...')
    transType === 3 && (txt = 'Wrapping...')
    transType === 4 && (txt = 'De-Wrapping...')
    let notice = Toast.loading(txt, 0)
    let address = trans2Address.replace(/\s+/g, '')
    let data = {
      amount: parseFloat(transAmount),
      address: address,
      success: (res) => {
        if (res) {
          setTransfering(false)
          setRefresh(true)
          handlerClose()
        }
      },
      fail: (error) => {
        setTransfering(false)
        if (error) message.error(error)
      },
      error: (error) => {
        setTransfering(false)
      },
      notice: notice
    }
    transType === 1 && requestCanister(transferIcp2Icp, data)
    transType === 2 && requestCanister(transferWIcp2WIcp, data)
    transType === 3 && requestCanister(transferIcp2WIcp, data)
    transType === 4 && requestCanister(transferWIcp2Icp, data)
  }

  const getContent = () => {
    let content

    currentKey === 'nft' && (content = <MyNFT nft={nftInfo || { alone: [], crowd: [] }} />)
    currentKey === 'icp' &&
      (content = (
        <ICPTransaction isAuth={isAuth} authToken={authToken} refresh={refresh} height={window.innerHeight - 350} />
      ))
    currentKey === 'wicp' &&
      (content = (
        <WICPTransaction isAuth={isAuth} authToken={authToken} refresh={refresh} height={window.innerHeight - 350} />
      ))
    return content
  }

  const showTransferModal = (type) => {
    setTransType(type)
    setTransFerVisible(true)
  }

  const childTab = (width, height, top, padding, marginLeft, key, title, value, type) => {
    return (
      <WalletBlockWrapper
        key={type}
        width={width}
        height={height}
        top={top}
        marginLeft={marginLeft}
        bg={background}
        display="flex"
        padding={transformPxToRem(padding)}
        bgColor={currentKey === key ? '#4338CACC' : '##FFFFFF26'}
        onClick={() => {
          updateCurrentItem(key)
        }}
      >
        <div>
          <WalletLabel fontSize={'16px'} fontColor={currentKey === key ? '#FFFFFF' : '#000000'}>
            {title}
          </WalletLabel>
          <WalletLineWrapper width={'100%'} radius={0} justify={'left'} gap={'10px'}>
            {type !== 3 && <img src={type === 1 ? dfinityLogo : wicpLogo} style={{ height: '25px' }}></img>}
            <WalletLabel fontSize={transformPxToRem('32px')} fontColor={currentKey === key ? '#F9CE0D' : '#4338CA'}>
              {value}
            </WalletLabel>
          </WalletLineWrapper>
        </div>
        {type !== 3 && (
          <img
            src={send}
            style={{
              position: 'absolute',
              right: '8%',
              top: '4%',
              width: transformPxToRem(isCollapsed() ? '40px' : '55px'),
              height: transformPxToRem(isCollapsed() ? '40px' : '55px')
            }}
            onClick={async (e) => {
              e.stopPropagation()
              showTransferModal(type)
            }}
          ></img>
        )}
      </WalletBlockWrapper>
    )
  }
  //这边之所以用这个absoulte布局，是因为fliter的blurl,高斯模糊，如果有好的方案，请指出，感谢
  return (
    <WalletWrapper>
      {/* 主体内容 */}
      {(!isCollapsed() || !(currentKey === 'icp' || currentKey === 'wicp')) && (
        <div>
          <WalletBlockWrapper
            id="topTitle"
            width={'100%'}
            height={'200px'}
            top={'0px'}
            marginLeft={'-50%'}
            bg={background}
            padding={'0px'}
          >
            <WalletLineWrapper
              width={'100%'}
              height={'200px'}
              radius={0}
              justify={'left'}
              gap={isCollapsed() ? '0px' : '50px'}
            >
              <img src={avator} className="picture"></img>
              <div className="textarea">
                <WalletLineWrapper justify={'left'} gap={'10px'} height={'50px'}>
                  <Tooltip
                    placement="top"
                    title={'Receive ICP'}
                    getPopupContainer={() => document.getElementById('topTitle')}
                  >
                    <WalletEllipsisLabel fontSize={'16px'}>{`Account ID:${
                      isAuth && authToken && authToken !== '2vxsx-fae'
                        ? principalToAccountId(Principal.fromText(authToken))
                        : 'Please Login'
                    }`}</WalletEllipsisLabel>
                  </Tooltip>

                  {isAuth && authToken && authToken !== '2vxsx-fae' && (
                    <Popover
                      placement="rightTop"
                      title={'Account ID'}
                      content={
                        <Avatar
                          shape="square"
                          src={jrQrcode.getQrBase64(principalToAccountId(Principal.fromText(authToken)))}
                          size={140}
                        />
                      }
                      getPopupContainer={() => document.getElementById('topTitle')}
                      trigger="click"
                    >
                      <img
                        src={copy}
                        style={{ width: transformPxToRem('27px'), height: transformPxToRem('27px') }}
                      ></img>
                    </Popover>
                  )}
                </WalletLineWrapper>
                <WalletLineWrapper justify={'left'} gap={'10px'} height={'50px'}>
                  <Tooltip
                    placement="top"
                    title={'Receive WICP'}
                    getPopupContainer={() => document.getElementById('topTitle')}
                  >
                    <WalletEllipsisLabel fontSize={'16px'}>{`Principal ID:${
                      isAuth && authToken && authToken !== '2vxsx-fae' ? authToken : 'Please Login'
                    }`}</WalletEllipsisLabel>
                  </Tooltip>
                  {isAuth && authToken && authToken !== '2vxsx-fae' && (
                    <Popover
                      placement="rightTop"
                      title={'Principal ID'}
                      content={<Avatar shape="square" src={jrQrcode.getQrBase64(`${authToken}`)} size={140} />}
                      trigger="click"
                      getPopupContainer={() => document.getElementById('topTitle')}
                    >
                      <img
                        src={copy}
                        style={{ width: transformPxToRem('27px'), height: transformPxToRem('27px') }}
                      ></img>
                    </Popover>
                  )}
                </WalletLineWrapper>
              </div>
            </WalletLineWrapper>
          </WalletBlockWrapper>

          {isCollapsed() && childTab('46%', '120px', '205px', '25px 10px', '-50%', 'icp', 'Dfinity', icp, 1)}
          {isCollapsed() &&
            childTab('46%', '120px', '205px', '25px 10px', '4%', 'wicp', 'Wrapped ICP', getValueDivide8(wicp), 2)}
          {/* {isCollapsed() && childTab('100%', '60px', '335px', '10px', '-50%', 'nft', 'Non-fungible tokens', nft + ' NFT', 3)} */}

          {!isCollapsed() && childTab('33%', '170px', '210px', '50px', '-50%', 'icp', 'Dfinity', icp, 1)}
          {!isCollapsed() &&
            childTab('33%', '170px', '210px', '50px', '-16.5%', 'wicp', 'Wrapped ICP', getValueDivide8(wicp), 2)}
          {!isCollapsed() &&
            childTab('33%', '170px', '210px', '50px', '17%', 'nft', 'Non-fungible tokens', nft + ' NFT', 3)}

          {isCollapsed() && (
            <img
              src={icp2wicp}
              style={{
                position: 'absolute',
                top: '230px',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 4,
                width: transformPxToRem('36px'),
                height: transformPxToRem('36px')
              }}
              onClick={async () => {
                showTransferModal(3)
              }}
            ></img>
          )}

          {isCollapsed() && (
            <img
              src={icp2wicp}
              style={{
                position: 'absolute',
                top: '290px',
                left: '50%',
                transform: 'translate(-50%, -50%) rotate(180deg)',
                zIndex: 4,
                width: transformPxToRem('36px'),
                height: transformPxToRem('36px')
              }}
              onClick={async () => {
                showTransferModal(4)
              }}
            ></img>
          )}
          {!isCollapsed() && (
            <img
              src={icp2wicp}
              style={{
                position: 'absolute',
                top: '250px',
                left: '50%',
                marginLeft: '-18%',
                zIndex: 4,
                width: transformPxToRem('36px'),
                height: transformPxToRem('36px')
              }}
              onClick={async () => {
                showTransferModal(3)
              }}
            ></img>
          )}

          {!isCollapsed() && (
            <img
              src={icp2wicp}
              style={{
                position: 'absolute',
                top: '310px',
                left: '50%',
                marginLeft: '-18%',
                zIndex: 4,
                transform: 'rotate(180deg)',
                width: transformPxToRem('36px'),
                height: transformPxToRem('36px')
              }}
              onClick={async () => {
                showTransferModal(4)
              }}
            ></img>
          )}
          <WalletBlockWrapper
            style={{ minHeight: '300px' }}
            width={'100%'}
            top={isCollapsed() ? '335px' : '400px'}
            marginLeft={'-50%'}
            bg={background}
            padding={transformPxToRem('11px')}
          >
            {getContent()}
          </WalletBlockWrapper>
        </div>
      )}
      {isCollapsed() && (currentKey === 'icp' || currentKey === 'wicp') && (
        <WalletBlockWrapper
          style={{ height: '100%', zIndex: 5 }}
          width={'100%'}
          top={'0px'}
          marginLeft={'-50%'}
          bg={background}
          padding={transformPxToRem('11px')}
        >
          {getContent()}
          <Button type="violet" className="back" onClick={setCurrentKey.bind(this, 'nft')}>
            Back
          </Button>
        </WalletBlockWrapper>
      )}
      <ConfirmModal
        title={transType === 1 || transType === 2 ? 'Transfer' : transType === 3 ? 'Wrapped' : 'De-Wrapped'}
        width={328}
        onModalClose={handlerClose}
        onModalConfirm={handlerTransfer}
        modalVisible={transFerVisible}
      >
        <div className="tips">
          {transType === 3 && 'ICP->WICP:'}
          {transType === 4 && 'WICP->ICP:'}
        </div>
        <Input
          type="number"
          placeholder="Amount"
          value={transAmount}
          className="ant-input-violet"
          onChange={(e) => handleSetTransferAmount(e)}
        />

        {(transType === 1 || transType === 2) && (
          <Input
            type="text"
            placeholder={transType === 1 ? 'To Account ID' : 'To Principal ID'}
            style={{ marginTop: '15px' }}
            value={trans2Address}
            className="ant-input-violet"
            onChange={(e) => handleSetTransfer2Address(e)}
          />
        )}
      </ConfirmModal>
    </WalletWrapper>
  )
}

export default Wallet
