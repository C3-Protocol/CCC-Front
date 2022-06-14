import React, { memo, useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { principalToAccountId, isAuthTokenEffect, getValueDivide8 } from '@/utils/utils'
import { Principal } from '@dfinity/principal'
import { Avatar, Popover, Tooltip, Typography } from 'antd'
import DefaultAvator from '@/assets/images/wallet/avator.png'
import Camera from '@/assets/images/wallet/camera.png'
import ScoreIcon from '@/assets/images/wallet/score_icon.svg'
import Twitter from '@/assets/images/wallet/twitter.svg'
import {
  requestUserProfile,
  requestUserRewardsPoints,
  requestICPBalance,
  requestWICPBalance,
  requestUserAvatar
} from '@/components/auth/store/actions'
import { useHistory } from 'react-router-dom'
import WicpLogo from '@/assets/images/wicp_logo.svg'
import IcpLogo from '@/assets/images/dfinity.png'
import copy from '@/assets/images/wallet/copy.svg'
import jrCode from '@/assets/images/wallet/jrcode.svg'
import Discord from '@/assets/images/wallet/discord.svg'
import CSCopy from '@/components/cs-copy'
import { QrcodeOutlined, SettingOutlined, ShareAltOutlined } from '@ant-design/icons'
const jrQrcode = require('jr-qrcode')
const { Paragraph } = Typography

function UserProfile(props) {
  const history = useHistory()
  const dispatch = useDispatch()
  const user = props.user || ''
  const { isAuth, authToken, profile, score, avatar, wicp, icp } = useSelector((state) => {
    let authToken = state.auth.getIn(['authToken']) || ''
    let wicp = (state.auth && state.auth.getIn(['wicpBalance'])) || 0
    let icp = (state.auth && state.auth.getIn(['icpBalance'])) || 0
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      authToken: authToken,
      profile: state.auth.getIn([`profile-${user}`]) || [],
      score: state.auth.getIn([`score-${user}`]) || -1,
      avatar: state.auth.getIn([`avatar-${user}`]) || null,
      wicp,
      icp
    }
  }, shallowEqual)

  const isSelf = user === authToken
  const shareUrl = `https://${window.location.host}/%23/wallet/${user}`
  const shareTitle = 'Come on'
  const shareTwiter = `https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}&via=CCCProtocol`
  const discordUrl = 'https://discord.gg/jgyp6prPuj'
  useEffect(() => {
    !profile.textInfo && dispatch(requestUserProfile(user))
    score === -1 && dispatch(requestUserRewardsPoints(user))
    if (!avatar && profile.avatorCID) {
      dispatch(requestUserAvatar(profile.avatorCID, user))
    }
  }, [profile.textInfo, user])

  useEffect(() => {
    if (isAuthTokenEffect(isAuth, authToken)) {
      dispatch(requestWICPBalance(authToken))
      dispatch(requestICPBalance(authToken))
    }
  }, [isAuth, authToken])

  const handlerOnSettingClick = () => {
    if (isSelf && isAuthTokenEffect(isAuth, authToken)) history.push('/setting')
  }

  const rightIcon = (name, id) => {
    return (
      <div className={`right-icon ${name}`}>
        <Popover
          placement="bottomRight"
          content={
            <div style={{ width: '380px' }}>
              <div className="flex-10">
                Principal ID:
                <Tooltip placement="top" title={'Receive WICP'}>
                  <Paragraph
                    copyable={{
                      icon: <img src={copy} style={{ width: '14px', height: '14px' }}></img>
                    }}
                    ellipsis
                    style={{ width: '265px', marginBottom: '0px' }}
                  >
                    {isSelf ? authToken : id}
                  </Paragraph>
                </Tooltip>
                <Popover
                  placement="rightTop"
                  title={'Principal ID'}
                  content={<Avatar shape="square" src={jrQrcode.getQrBase64(authToken)} size={160} />}
                  trigger="click"
                >
                  <img src={jrCode} style={{ height: '14px' }} />
                </Popover>
              </div>
              <div style={{ height: '1px', border: '1px solid #EEEEEE', margin: '5px 0px' }} />
              <div className="flex-10">
                Account ID:
                <Tooltip placement="top" title={'Receive ICP'}>
                  <Paragraph
                    copyable={{
                      icon: <img src={copy} style={{ width: '14px', height: '14px' }}></img>
                    }}
                    ellipsis
                    style={{ width: '265px', marginBottom: '0px' }}
                  >
                    {isSelf
                      ? principalToAccountId(Principal.fromText(authToken))
                      : principalToAccountId(Principal.fromText(id))}
                  </Paragraph>
                </Tooltip>
                <Popover
                  title={'Account ID'}
                  content={
                    <Avatar
                      shape="square"
                      src={authToken && jrQrcode.getQrBase64(principalToAccountId(Principal.fromText(authToken)))}
                      size={140}
                    />
                  }
                  trigger="click"
                >
                  <img src={jrCode} style={{ height: '14px' }} />
                </Popover>
              </div>
            </div>
          }
          trigger="click"
        >
          <QrcodeOutlined className="stake-icon" />
        </Popover>

        {
          <Popover
            placement="bottomRight"
            content={
              <div
                className="popover-menu"
                style={{
                  width: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  rowGap: '5px'
                }}
              >
                <a href={shareTwiter} target="_blank" rel="noopener noreferrer" style={{ color: '#000000' }} key={0}>
                  <div className="flex-10">
                    <img src={Twitter} style={{ height: '20px' }} /> Twitter
                  </div>
                </a>
                <div style={{ height: '2px', border: '1px solid #F3F3F3', margin: '6px 0px', width: '100%' }} />
                <a href={discordUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#000000' }} key={1}>
                  <div className="flex-10">
                    <img src={Discord} style={{ height: '20px' }} /> Discord
                  </div>
                </a>
              </div>
            }
            trigger="click"
          >
            <ShareAltOutlined className="stake-icon" />
          </Popover>
        }
        {isSelf && <SettingOutlined onClick={handlerOnSettingClick} className="stake-icon" />}
      </div>
    )
  }
  return (
    <div className="user-content">
      <div className="profile">
        <div className="picture" onClick={handlerOnSettingClick}>
          <Avatar src={avatar || DefaultAvator} className="avatar show-avatar"></Avatar>
          {isSelf && (
            <div className="mask-inner">
              <img src={Camera} />
            </div>
          )}
        </div>

        <div className="title">{profile?.textInfo?.name || 'Unnamed'} </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0px' }}>
          <div className="score margin-10">
            <div className="score-bg">
              <img src={ScoreIcon} />
            </div>
            <div className="tip-10 tip-10-000">{`C-Points: ${score === -1 ? 0 : score}`}</div>
          </div>
          {rightIcon('margin-10', user)}
        </div>
        {/* <div className="flex-20 margin-10" style={{ color: '#000' }}>
          <div className="flex-5">
            <div className="small-tip ">Principal ID: </div>
            <CSCopy value={user} className={'small-tip '} />
          </div>
          <div className="flex-5">
            <div className="small-tip">Account ID:</div>
            <CSCopy value={principalToAccountId(Principal.fromText(user))} className={'small-tip'} />
          </div>
        </div> */}
        {profile?.textInfo?.link && (
          <a href={`https://twitter.com/${profile?.textInfo?.link}`} target="_blank" rel="noopener noreferrer" key={0}>
            <div className="flex-5 margin-10">
              <img src={Twitter} style={{ height: '12px' }} />
              <div className="value value-0bf">{profile?.textInfo?.link || ''} </div>
            </div>
          </a>
        )}
        <div className="small-tip textarea margin-10">{profile?.textInfo?.bio || ' '}</div>
      </div>
      {isSelf && (
        <div className="bottom">
          <div className="icp-wicp-value">
            <div className="price" style={{ justifyContent: 'flex-end', marginRight: 40 }}>
              <img src={IcpLogo} style={{ width: '42px', height: '20px' }} />
              <span className="number">
                {getValueDivide8(icp)}
                <span>ICP</span>
              </span>
            </div>
            <div className="price" style={{ justifyContent: 'flex-start' }}>
              <img src={WicpLogo} style={{ width: '25px', height: '25px' }} />
              <span className="number">
                {getValueDivide8(wicp)}
                <span>WICP</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default memo(UserProfile)
