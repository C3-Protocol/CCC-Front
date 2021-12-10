import React, { useState, memo } from 'react'
import { Layout } from 'antd'
import BaseMenu from '../menu'
import { Popover, Button, Typography } from 'antd'
import PhoneMenuConfig from '@/assets/scripts/phoneMenu'
import { useHistory } from 'react-router-dom'
import { Storage, transformPxToRem, isCollapsed } from '@/utils/utils'
import { MenuContentWrapper, LoginAuthWrapper, BottomLinkWrapper } from './style'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { requestLogin, requestLoginOut } from '../auth/store/actions'
import { DFINITY_TYPE, PLUG_TYPE } from '@/constants'
import { isPhone, principalToAccountId } from '@/utils/utils'
import { Principal } from '@dfinity/principal'

import Dfinity from '@/assets/images/dfinity.png'
import Plug from '@/assets/images/plug.svg'
import Link01 from '@/assets/images/footer/app_ico_01_dark.png'
import Link02 from '@/assets/images/footer/app_ico_02_dark.png'
import Link03 from '@/assets/images/footer/app_ico_03_dark.png'
import Link04 from '@/assets/images/footer/app_ico_04_dark.png'
import Link05 from '@/assets/images/footer/app_ico_05_dark.png'

const { Content, Footer } = Layout
const { Paragraph } = Typography

const AuthPage = React.memo((props) => {
  const link = [
    { icon: Link01, url: 'https://t.me/joinchat/sfq9yoY39NUwMmZl' },
    { icon: Link02, url: 'https://twitter.com/CCCProtocol' },
    { icon: Link03, url: 'https://medium.com/@CCCProtocol' },
    { icon: Link04, url: 'https://github.com/C3-Protocol' },
    { icon: Link05, url: 'https://discord.gg/jgyp6prPuj' }
  ]
  const history = useHistory()
  const [mlist] = useState(PhoneMenuConfig)
  const currKey = Storage.get('currentItemKey') ? Storage.get('currentItemKey') : `${mlist[0].key}`
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
    <Layout
      style={{
        height: '100%',
        paddingTop: isCollapsed() ? transformPxToRem('70px') : transformPxToRem('120px'),
        background: 'linear-gradient(270deg, #d0eaff 0%, #fcf0ff 100%)'
      }}
    >
      <Content style={{ margin: `0 ${transformPxToRem('10px')}`, overflow: 'hidden' }}>
        <MenuContentWrapper>
          <BaseMenu
            MenuConfig={mlist}
            currKey={currKey}
            currentItemKey={'currentItemKey'}
            mode={'inline'}
            width={'100%'}
            handlerItemSelect={(key) => {
              props.onMenuItemSelect()
              history.push(key)
            }}
          />
        </MenuContentWrapper>
      </Content>
      <Footer style={{ background: '#0000', padding: '24px 20px' }}>
        {isAuth && authToken && authToken !== '2vxsx-fae' ? (
          <LoginAuthWrapper>
            <Popover
              style={{ width: '80%' }}
              placement="bottomRight"
              content={
                <div>
                  Principal: <Paragraph copyable>{authToken}</Paragraph>
                  Account ID: <Paragraph copyable>{principalToAccountId(Principal.fromText(authToken))}</Paragraph>
                </div>
              }
              trigger="click"
            >
              <Button className="button-yellow">{authToken.slice(0, 10)}...</Button>
            </Popover>
            <Button className="button-yellow" onClick={handleLogout}>
              Logout
            </Button>
          </LoginAuthWrapper>
        ) : (
          <LoginAuthWrapper>
            <Button
              className="button-black"
              onClick={() => {
                handleLogin(DFINITY_TYPE)
              }}
            >
              <img src={Dfinity}></img>
            </Button>
            {!isPhone() && (
              <Button
                className="button-black"
                onClick={() => {
                  handleLogin(PLUG_TYPE)
                }}
              >
                <img src={Plug}></img>
              </Button>
            )}
          </LoginAuthWrapper>
        )}
        <BottomLinkWrapper>
          {link.map((item, index) => {
            return (
              <a href={item.url} target="_blank" rel="noopener noreferrer" key={index}>
                <img src={item.icon} />
              </a>
            )
          })}
        </BottomLinkWrapper>
      </Footer>
    </Layout>
  )
})
export default memo(AuthPage)
