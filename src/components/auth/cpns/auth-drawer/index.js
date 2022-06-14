import React, { memo, useEffect, useState } from 'react'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { Drawer, Image } from 'antd'
import { UserOutlined, WalletOutlined } from '@ant-design/icons'
import { requestLoginOut } from '@/components/auth/store/actions'
import { ContentPaddingTop, PhoneContentPaddingTop } from '@/constants'
import { DFINITY_TYPE, PLUG_TYPE, STOIC_TYPE, INFINITY_TYPE } from '@/constants'

import DfinityLogo from '@/assets/images/dfinity.png'
import StoicLogo from '@/assets/images/stoic.png'
import PlugLogo from '@/assets/images/plug.svg'
import InfinityLogo from '@/assets/images/infinitywallet.png'
import WalletIcon from '@/assets/images/icon/wallet.png'
import { getCurrentLoginType } from '@/api/handler'
import SideWallet from '../side-wallet'
import LoginSelect from '../login-select'
import { principalToAccountId, isAuthTokenEffect, isCollapsed } from '@/utils/utils'
import './style.less'
import CSCopy from '@/components/cs-copy'
import { Principal } from '@dfinity/principal'
import { LogoutIcon } from '@/icons'
import PubSub from 'pubsub-js'
import { ShowAuthDrawer } from '@/message'

const AuthDrawer = memo((props) => {
  const [isShowDrawer, setShowDrawer] = useState(false)
  const { isAuth, authToken, loginType } = useSelector((state) => {
    let isAuth = state.auth.getIn(['isAuth']) || false
    let loginType = null
    if (isAuth) loginType = getCurrentLoginType()
    let authToken = state.auth.getIn(['authToken']) || ''
    return {
      isAuth,
      authToken,
      loginType
    }
  }, shallowEqual)

  const dispatch = useDispatch()

  const handleClose = () => {
    setShowDrawer(!isShowDrawer)
  }
  const logout = () => {
    dispatch(requestLoginOut())
  }

  useEffect(async () => {
    const showDrawer = PubSub.subscribe(ShowAuthDrawer, () => {
      setShowDrawer(true)
    })
    return () => {
      PubSub.unsubscribe(showDrawer)
    }
  }, [])

  const renderWalletIcon = () => {
    switch (loginType) {
      case DFINITY_TYPE:
        return <Image src={DfinityLogo} preview={false} width={40} />
      case PLUG_TYPE:
        return <Image src={PlugLogo} width={30} preview={false} />
      case STOIC_TYPE:
        return <Image src={StoicLogo} width={40} height={30} preview={false} />
      case INFINITY_TYPE:
        return <Image src={InfinityLogo} width={30} height={30} preview={false} />
      default:
        return
    }
  }
  const walletName = () => {
    switch (loginType) {
      case DFINITY_TYPE:
        return 'NNS Wallet'
      case PLUG_TYPE:
        return 'Plug Wallet'
      case STOIC_TYPE:
        return 'Stoic Wallet'
      case INFINITY_TYPE:
        return 'InfinitySwap Wallet'
      default:
        return ''
    }
  }

  const titleRender = () => {
    //let title = key.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
    return (
      <div className="wallet-header">
        {isAuth && isAuthTokenEffect(isAuth, authToken) ? (
          <div>
            <div className="flex-space-between">
              <div className="flex-10">
                {renderWalletIcon()}
                <span style={{ fontSize: '20px', color: '#000' }}>{walletName()}</span>
              </div>
              <div className="hover-violet" onClick={logout}>
                {LogoutIcon}
              </div>
            </div>
            <div className="flex-10 small-tip small-tip-6D7278 margin-top-10">
              <div>Principal ID: </div>
              <CSCopy value={authToken} suffixCount={10} className="small-tip small-tip-6D7278" />
            </div>
            <div className="flex-10 small-tip small-tip-6D7278 margin-top-5">
              <div>Account ID: </div>
              <CSCopy
                value={principalToAccountId(Principal.fromText(authToken))}
                suffixCount={10}
                className="small-tip small-tip-6D7278"
              />
            </div>
          </div>
        ) : (
          <>
            <UserOutlined style={{ fontSize: '24px', color: '#000' }} />
            <span style={{ fontSize: '20px', color: '#000', marginLeft: '10px' }}>My Wallet</span>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="draw-wrapper">
      <div className="wallet-icon" onClick={() => setShowDrawer(!isShowDrawer)}>
        {/* // <WalletOutlined /> */}
        <img src={WalletIcon} />
      </div>

      <Drawer
        title={titleRender()}
        width={Math.min(400, window.innerWidth)}
        zIndex={props.zIndex || 5}
        placement="right"
        closable={false}
        visible={isShowDrawer}
        style={{ paddingTop: props.zIndex ? 0 : isCollapsed() ? PhoneContentPaddingTop : ContentPaddingTop }}
        onClose={handleClose}
      >
        {isAuth ? <SideWallet /> : <LoginSelect />}
      </Drawer>
    </div>
  )
})

export default AuthDrawer
