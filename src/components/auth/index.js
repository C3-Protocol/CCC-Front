import React, { useEffect, useState } from 'react'
import { LoginContent } from './style'
import { isAuthTokenEffect, isCollapsed } from '@/utils/utils'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { requestLogin, requestLoginOut, requestUserProfile, requestUserAvatar } from './store/actions'
import DefaultAvator from '@/assets/images/wallet/avator.png'
import { useHistory, withRouter } from 'react-router-dom'
import { Avatar, Popover, List, Image } from 'antd'
import { WalletIcon, CollectedIcon, CreateIcon, StakeIcon, DrewIcon, FavoriteIcon, LogoutIcon } from '../../icons'
import AuthDrawer from './cpns/auth-drawer'

const Auth = React.memo((props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const pathName = props.history.location.pathname
  const [loginType, setLoginType] = useState(null)
  const [popoverVisible, setPopVisible] = useState(false)
  const { isAuth, authToken, profile, avatar } = useSelector((state) => {
    let authToken = state.auth.getIn(['authToken']) || ''
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      authToken: authToken,
      profile: (authToken && state.auth.getIn([`profile-${authToken}`])) || null,
      avatar: (authToken && state.auth.getIn([`avatar-${authToken}`])) || null
    }
  }, shallowEqual)

  const handleLogout = async () => {
    dispatch(requestLoginOut())
  }

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
        setLoginType(null)
      })
    )
  }

  useEffect(() => {
    if (!avatar && profile && profile.avatorCID) {
      dispatch(requestUserAvatar(profile.avatorCID, authToken))
    }
  }, [profile])

  useEffect(() => {
    if (!profile && isAuthTokenEffect(isAuth, authToken)) {
      dispatch(requestUserProfile(authToken))
    }
    if (isAuth) {
      setLoginType(null)
    }
  }, [isAuth, authToken, profile])

  const goToAssetByType = (key) => {
    if (!isAuth) {
      if (pathName !== key) history.push('/assets/auth')
    } else {
      if (pathName !== key) history.push(key)
    }
  }
  const menu = [
    { func: goToAssetByType, key: '/assets/wallet/myarts', title: 'Collected', icon: CollectedIcon },
    { func: goToAssetByType, key: '/assets/wallet/createCollections', title: 'Create', icon: CreateIcon },
    { func: goToAssetByType, key: '/assets/wallet/staking', title: 'Staking', icon: StakeIcon },
    { func: goToAssetByType, key: '/assets/wallet/drew', title: 'Drew', icon: DrewIcon },
    { func: goToAssetByType, key: '/assets/wallet/favorites', title: 'Favorites', icon: FavoriteIcon },
    { func: goToAssetByType, key: '/assets/wallet/transaction', title: 'Transaction record', icon: WalletIcon },
    { func: handleLogout, key: '', title: 'Logout', icon: LogoutIcon }
  ]

  const handleVisibleChange = (visible) => {
    setPopVisible(visible)
  }
  return (
    <>
      <LoginContent>
        {!isCollapsed() &&
          (isAuth ? (
            <Popover
              style={{ width: '200px' }}
              placement="bottomRight"
              visible={popoverVisible}
              onVisibleChange={handleVisibleChange}
              content={
                <List
                  bordered={false}
                  dataSource={menu}
                  renderItem={(item) => (
                    <List.Item
                      key={item.title}
                      onClick={() => {
                        item.func(item.key)
                        setPopVisible(false)
                      }}
                    >
                      <div className="flex-10 ">
                        {item.icon}
                        {item.title}
                      </div>
                    </List.Item>
                  )}
                />
              }
            >
              <Avatar
                src={avatar || DefaultAvator}
                className="picture"
                onClick={() => goToAssetByType('/assets/wallet/myarts')}
                style={{ cursor: 'pointer' }}
              />
            </Popover>
          ) : (
            <Avatar
              src={avatar || DefaultAvator}
              className="picture"
              onClick={() => goToAssetByType('/assets/auth')}
              style={{ cursor: 'pointer' }}
            />
          ))}
        <AuthDrawer zIndex={props.zIndex} />
      </LoginContent>
    </>
  )
})

export default withRouter(Auth)
