import React, { useEffect, useState } from 'react'
import Dfinity from '@/assets/images/dfinity.png'
import Stoic from '@/assets/images/stoic.png'
import Plug from '@/assets/images/plug.svg'
import Infinity from '@/assets/images/infinitywallet.png'
import { Button, Image } from 'antd'
import { DFINITY_TYPE, PLUG_TYPE, STOIC_TYPE, INFINITY_TYPE } from '@/constants'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { requestLogin } from '@/components/auth/store/actions'
import { withRouter } from 'react-router-dom'
import { LoginSelect } from './style'
import { isPhone } from '@/utils/utils'

const AuthSelect = React.memo((props) => {
  const dispatch = useDispatch()
  const [loginType, setLoginType] = useState(null)

  const { isAuth, authToken } = useSelector((state) => {
    let authToken = state.auth.getIn(['authToken']) || ''
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      authToken: authToken
    }
  }, shallowEqual)

  const handleLogin = async (type) => {
    if (loginType === type) {
      return
    }
    setLoginType(type)
    dispatch(
      requestLogin(type, (res) => {
        if (res.error === 'noplug') {
          window.open('https://plugwallet.ooo/', '_blank')
        } else if (res.error === 'noinfinity') {
          window.open('https://app.infinityswap.one/', '_blank')
        }
      })
    )
  }

  useEffect(() => {
    if (isAuth) {
      setLoginType(null)
    }
  }, [isAuth, authToken])

  return (
    <LoginSelect>
      <Button size="large" block className="ant-btn-auth" onClick={() => handleLogin(DFINITY_TYPE)}>
        <span>Internet Identity</span>
        <Image src={Dfinity} width={30} preview={false} />
      </Button>

      <Button size="large" block className="ant-btn-auth" onClick={() => handleLogin(STOIC_TYPE)}>
        <span>Stoic Wallet</span>
        <Image src={Stoic} width={30} preview={false} />
      </Button>

      {!isPhone() && (
        <Button size="large" block className="ant-btn-auth" onClick={() => handleLogin(PLUG_TYPE)}>
          <span>Plug Wallet</span>
          <Image src={Plug} width={40} height={30} preview={false} />
        </Button>
      )}

      {!isPhone() && (
        <Button size="large" block className="ant-btn-auth" onClick={() => handleLogin(INFINITY_TYPE)}>
          <span>InfinitySwap Wallet</span>
          <Image src={Infinity} width={25} height={25} preview={false} />
        </Button>
      )}
    </LoginSelect>
  )
})

export default withRouter(AuthSelect)
