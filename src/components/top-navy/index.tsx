import React, { useEffect, useState, useRef, Suspense, lazy } from 'react'
import { useHistory } from 'react-router-dom'
import Auth from '../auth'
//import TopMenu from '../menu'
import TopMenu from '../navMenu'
import { isCollapsed } from '@/utils/utils'
import { isTestNet } from '@/constants'
import { requestInitLoginStates } from '../auth/store/actions'
import Logo from '@/assets/images/logo.svg'
import LogoC from '@/assets/images/logo-ccc.png'
import Menu from '@/assets/images/menu.svg'
import Close from '@/assets/images/close.svg'
import { useDispatch } from 'react-redux'
import './style.less'

const AuthPage = lazy(() => import('@/components/auth-page'))

export default React.memo((props: any) => {
  const history = useHistory()
  const [authPageShow, setAuthPageShow] = useState(false)
  const menuRef = useRef()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(requestInitLoginStates())
  }, [])

  return (
    <div className="top-header-wrapper">
      <div className="header-content">
        <div
          className="logo"
          onClick={() => {
            history.push('/all')
          }}
        >
          <div className="logo-detail">
            <img src={Logo} className="one" />
            <img src={LogoC} className="two" />
            <div className="three">Beta</div>
          </div>
          {isTestNet && <div className="test"> Testnets </div>}
        </div>
        <div className="menu-auth">
          <div className="auth">
            {isCollapsed() && (
              <div
                onClick={() => {
                  setAuthPageShow(!authPageShow)
                  props.updateContent(!authPageShow)
                }}
              >
                {authPageShow ? <img src={Close} /> : <img src={Menu} />}
              </div>
            )}
            <Auth />
          </div>
          {!isCollapsed() && (
            <div className="menu" ref={menuRef}>
              <TopMenu />
            </div>
          )}
        </div>
      </div>
      {authPageShow && (
        <div className="authPage">
          <Suspense fallback={<div />}>
            <AuthPage
              onMenuItemSelect={() => {
                setAuthPageShow(false)
                props.updateContent(false)
              }}
            />
          </Suspense>
        </div>
      )}
    </div>
  )
})
