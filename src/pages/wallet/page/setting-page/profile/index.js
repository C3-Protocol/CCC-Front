import React, { useState, useEffect } from 'react'
import { Input, message, Button, Avatar } from 'antd'
import ImageCrop from '@/components/image-crop'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { requestCanister } from '@/api/handler'
import { uploadUserProfile, userNameIsExist } from '@/api/userHandler'
import { requestUserProfile, requestUserAvatar } from '@/components/auth/store/actions'
import { base64toBuff, isAuthTokenEffect } from '@/utils/utils'
import Toast from '@/components/toast'
import { useHistory } from 'react-router-dom'

const { TextArea } = Input

function ProfileSetting(props) {
  const history = useHistory()
  const { isAuth, authToken, profile, avatar } = useSelector((state) => {
    let authToken = state.auth.getIn(['authToken']) || ''
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      authToken: authToken,
      profile: (authToken && state.auth.getIn([`profile-${authToken}`])) || {},
      avatar: (authToken && state.auth.getIn([`avatar-${authToken}`])) || null
    }
  }, shallowEqual)
  const dispatch = useDispatch()
  const [username, setUsername] = useState(profile?.textInfo?.name)
  const [bio, setBIO] = useState(profile?.textInfo?.bio)
  const [twitter, setTwittleLink] = useState(profile?.textInfo?.link)
  const [leftCount, setLeftCount] = useState(profile?.remainTimes)
  const [nameExist, setNameExist] = useState(false)
  const [changeState, setChangeState] = useState(0)
  const [newAvatar, setAvatarData] = useState()

  useEffect(() => {
    !profile.textInfo && isAuthTokenEffect(isAuth, authToken) && dispatch(requestUserProfile(authToken))
    if (profile.textInfo) {
      setUsername(profile?.textInfo?.name)
      setBIO(profile?.textInfo?.bio)
      setTwittleLink(profile?.textInfo?.link)
      setLeftCount(profile?.remainTimes)
      if (!avatar && profile.avatorCID && isAuthTokenEffect(isAuth, authToken)) {
        dispatch(requestUserAvatar(profile.avatorCID, authToken))
      }
    }
    if (!isAuthTokenEffect(isAuth, authToken)) {
      setUsername(null)
      setBIO(null)
      setTwittleLink(null)
      setLeftCount(0)
      setAvatarData(null)
    }
  }, [isAuth, authToken, profile.textInfo])

  const handlerUsernameChange = (e) => {
    if (nameExist) setNameExist(false)
    setUsername(e.target.value)
    if (profile?.textInfo?.name === e.target.value) {
      setChangeState(changeState & 0b1110)
    } else setChangeState(changeState | 0b0001)
  }

  const handlerBIOChange = (e) => {
    setBIO(e.target.value)
    if (profile?.textInfo?.bio === e.target.value) {
      setChangeState(changeState & 0b1101)
    } else {
      setChangeState(changeState | 0b0010)
    }
  }

  const handlerTwitterChange = (e) => {
    setTwittleLink(e.target.value)
    if (profile?.textInfo?.link === e.target.value) {
      setChangeState(changeState & 0b1011)
    } else {
      setChangeState(changeState | 0b0100)
    }
  }

  const handlerSave = () => {
    if (!isAuth) {
      message.error('Please sign in first')
      return
    }
    if (!username) {
      message.error('Name  empty')
      return
    }
    if (nameExist) {
      message.error('Name  exist')
      return
    }
    let notice = Toast.loading('saving', 0)
    let data = {
      bio: bio || '',
      link: twitter || '',
      name: username,
      avatar: newAvatar && newAvatar.length > 0 ? [base64toBuff(newAvatar)] : [],
      success: () => {
        isAuthTokenEffect(isAuth, authToken) && dispatch(requestUserProfile(authToken))
        profile.avatorCID &&
          isAuthTokenEffect(isAuth, authToken) &&
          dispatch(requestUserAvatar(profile.avatorCID, authToken))
        history.replace('/assets/wallet/myarts')
      },
      fail: (error) => {
        message.error(error)
      },
      notice
    }
    requestCanister(uploadUserProfile, data)
  }

  const handlerChangeAvatar = (res) => {
    setAvatarData(res)
    setChangeState(changeState | 0b1000)
  }

  const handlerNameInputDone = () => {
    if (profile?.textInfo?.name === username) {
      setChangeState(changeState & 0b1110)
      if (nameExist) setNameExist(false)
      return
    }
    setChangeState(changeState | 0b0001)
    requestCanister(
      userNameIsExist,
      {
        name: username,
        success: (res) => {
          if (res) {
            setNameExist(true)
          }
        }
      },
      false
    )
  }

  return (
    <div>
      <ImageCrop width={100} onSuccess={handlerChangeAvatar} original={newAvatar || avatar} />
      <div className="flex-10 margin-15">
        <div className="title title-000 ">Profile Image</div>
      </div>

      <div className="small-tip  small-tip-666 margin-5">
        {`* Each person’s information can only be modified 6 times, you still have ${
          leftCount !== undefined ? leftCount : 6
        } chances`}
      </div>

      <Input
        prefix={<span className="prefix-star">UserName</span>}
        maxLength={20}
        className="ant-input-white-shadow  input-radius6 margin-40 input-width"
        value={username}
        placeholder="UserName"
        onBlur={handlerNameInputDone}
        onChange={handlerUsernameChange}
      />
      {!nameExist ? (
        <div className="small-tip small-tip-666 margin-2">{`${username ? username.length : 0}/20`}</div>
      ) : (
        <div className="small-tip small-tip-e22 margin-2">This name already exists, please re-enter the name</div>
      )}

      <div className="ant-input-white-shadow input-radius6 input-width input-height textarea margin-40">
        <span className="ant-input-prefix">Bio</span>
        <TextArea
          prefix="Bio"
          maxLength={200}
          className="ant-input-transparent "
          placeholder="Tell the world your story!"
          value={bio}
          autoSize={{ minRows: 2, maxRows: 6 }}
          onChange={handlerBIOChange}
        />
      </div>

      <div className="small-tip  small-tip-666 margin-20 margin-2">{`${bio ? bio.length : 0}/200`}</div>

      <Input
        prefix={'TwitterHandle'}
        maxLength={15}
        className="ant-input-white-shadow input-radius6 input-width margin-40"
        placeholder="Your TwitterHandle"
        value={twitter}
        onChange={handlerTwitterChange}
      />
      <div className="small-tip  small-tip-666 margin-2">{`${twitter ? twitter.length : 0}/15`}</div>

      <Button
        type="violet margin-40"
        onClick={handlerSave}
        className="btn-small"
        disabled={changeState === 0 || leftCount === 0}
      >
        Save
      </Button>
    </div>
  )
}

export default ProfileSetting
