import React, { useEffect, useState } from 'react'
import TopMenu from '../menu'
import Auth from '../auth'
import MenuConfig from '@/assets/scripts/menu'
import Logo from '@/assets/images/logo-beta.png'
import Menu from '@/assets/images/menu.png'
import Close from '@/assets/images/close.png'
import { useHistory, withRouter } from 'react-router-dom'
import { Storage, isCollapsed } from '@/utils/utils'
import { useRef } from 'react'
import { TopHeaderWrapper } from './style'
import { useDispatch } from 'react-redux'
import { requestInitLoginStates } from '../auth/store/actions'
import AuthPage from '@/components/auth-page'
import WalletMenuConfig from '@/assets/scripts/walletMenu'

const TopHeader = React.memo((props) => {
  const history = useHistory()
  const [mlist] = useState(MenuConfig)
  let pathName = props.history.location.pathname
  if (pathName.startsWith('/wallet/')) pathName = '/wallet'
  const currKey = pathName || (Storage.get('currentItemKey') ? Storage.get('currentItemKey') : `${mlist[0].key}`)
  const menuRef = useRef()
  const [windowWidth, setWindowSize] = useState(0)
  const dispatch = useDispatch()
  const [authPageShow, setAuthPageShow] = useState(false)
  const addListener = () => {
    document.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', onWindowResize)
    onWindowResize()
  }
  const removeListener = () => {
    document.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', onWindowResize)
  }

  const handleScroll = () => {
    if (window.pageYOffset >= 10) {
      //if语句判断window页面Y方向的位移是否大于或者等于导航栏的height像素值
      header.classList.add('header_bg') //当Y方向位移大于80px时，定义的变量增加一个新的样式'header_bg'
    } else {
      header.classList.remove('header_bg') //否则就移除'header_bg'样式
    }
  }

  const onWindowResize = () => {
    setWindowSize(window.innerWidth)
  }

  useEffect(() => {
    addListener()
    onWindowResize()
    dispatch(requestInitLoginStates())
    return () => {
      removeListener()
    }
  }, [])

  return (
    <TopHeaderWrapper>
      <div className="header-content">
        <div id="header" className="header">
          <div className="logo_auth">
            <div
              className="logo"
              onClick={() => {
                history.push('/all')
                window.scrollTo(0, 0)
              }}
            >
              <img src={Logo} />
              {/* <div className="test"> Testnets </div> */}
            </div>

            <div className="auth">
              {!isCollapsed() && <Auth />}
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
            </div>
          </div>
          {!isCollapsed() && (
            <div className="menu" ref={menuRef}>
              <TopMenu
                MenuConfig={mlist}
                currKey={currKey}
                currentItemKey={'currentItemKey'}
                mode={'horizontal'}
                width={'100%'}
                handlerItemSelect={(key) => {
                  if (key === '/wallet') {
                    let initKey = Storage.get('walletItemKey')
                      ? Storage.get('walletItemKey')
                      : `${WalletMenuConfig[0].key}`
                    if (!initKey.startsWith('/wallet/')) initKey = '/wallet/' + initKey
                    history.push(initKey)
                    return
                  }
                  history.push(key)
                }}
              />
            </div>
          )}
        </div>
      </div>
      {authPageShow && (
        <div className="authPage">
          <AuthPage
            onMenuItemSelect={() => {
              setAuthPageShow(false)
              props.updateContent(false)
            }}
          />
        </div>
      )}
    </TopHeaderWrapper>
  )
})
export default withRouter(TopHeader)
