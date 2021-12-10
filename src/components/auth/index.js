import React, { useEffect } from 'react'
import { Popover, Button, Typography } from 'antd'
import { principalToAccountId } from '@/utils/utils'
import Dfinity from '@/assets/images/dfinity.png'
import Plug from '@/assets/images/plug.svg'
import LoginOut from '@/assets/images/login_out.png'
import { LoginContent, LoginButtonBg, LoginImg, LoginOutBg } from './style'
import { DFINITY_TYPE, PLUG_TYPE } from '../../constants'
import { Principal } from '@dfinity/principal'
import { isPhone } from '@/utils/utils'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { requestInitLoginStates, requestLogin, requestLoginOut } from './store/actions'
import { memo } from 'react'

const { Paragraph } = Typography

const Auth = React.memo((props) => {
  const dispatch = useDispatch()

  const { isAuth, authToken } = useSelector((state) => {
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      authToken: state.auth.getIn(['authToken']) || ''
    }
  }, shallowEqual)

  const handleLogout = async () => {
    dispatch(requestLoginOut())
  }

  const handleLogin = async (type) => {
    dispatch(requestLogin(type))
  }

  return (
    <>
      {isAuth && authToken && authToken !== '2vxsx-fae' ? (
        <LoginContent>
          <Popover
            placement="bottomRight"
            content={
              <div>
                Principal: <Paragraph copyable>{authToken}</Paragraph>
                Account ID: <Paragraph copyable>{principalToAccountId(Principal.fromText(authToken))}</Paragraph>
              </div>
            }
            trigger="click"
          >
            <Button type="yellow15">{authToken.slice(0, 10)}...</Button>
          </Popover>
          <LoginOutBg onClick={handleLogout}>
            <img src={LoginOut}></img>
          </LoginOutBg>
        </LoginContent>
      ) : (
        <LoginContent>
          <LoginButtonBg
            onClick={() => {
              handleLogin(DFINITY_TYPE)
            }}
          >
            <LoginImg src={Dfinity}></LoginImg>
          </LoginButtonBg>
          {!isPhone() && (
            <LoginButtonBg
              onClick={() => {
                handleLogin(PLUG_TYPE)
              }}
            >
              <LoginImg src={Plug}></LoginImg>
            </LoginButtonBg>
          )}
        </LoginContent>
      )}
    </>
  )
})

export default memo(Auth)
