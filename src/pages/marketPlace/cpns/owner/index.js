import React, { memo, useEffect } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import DefaultAvatar from '@/assets/images/wallet/avator.png'
import { Avatar } from 'antd'
import { requestUserProfile, requestUserAvatar } from '@/components/auth/store/actions'
import PubSub from 'pubsub-js'
import { CloseDialog } from '@/message'
import { createHashHistory } from 'history'

function Owner(props) {
  const { prinId } = props
  const history = useHistory()
  const dispatch = useDispatch()
  const { profile, avatar } = useSelector((state) => {
    return {
      profile: state.auth.getIn([`profile-${prinId}`]) || [],
      avatar: state.auth.getIn([`avatar-${prinId}`]) || null
    }
  }, shallowEqual)

  useEffect(() => {
    prinId && dispatch(requestUserProfile(prinId))
    if (!avatar && profile.avatorCID) {
      dispatch(requestUserAvatar(profile.avatorCID, prinId))
    }
  }, [prinId])

  const getOwnerContent = () => {
    let owner = prinId ? profile?.textInfo?.name || prinId : ''
    return owner.length > 40 ? owner.slice(0, 30) + '...' : owner
  }
  return (
    <div className="flex-10">
      <div>{`Owned by `}</div>
      <div
        className="flex-10"
        onClick={() => {
          if (prinId) {
            if (history) history.push('/assets/account/myarts/' + prinId)
            else {
              PubSub.publish(CloseDialog, {})
              let history = createHashHistory()
              history.push('/assets/account/myarts/' + prinId)
            }
          }
        }}
        style={{ cursor: 'pointer', flex: 1 }}
      >
        <Avatar src={avatar || DefaultAvatar} className="picture" />
        <div className="limit-lines seller" style={{ '--lines': 1 }}>
          {getOwnerContent()}
        </div>
      </div>
    </div>
  )
}

export default memo(Owner)
