import React, { memo, useEffect } from 'react'
import MyCollections from '../my-collections'
import MyItems from '../my-items'
import { getCreateCollectionByUser } from '@/pages/home/store/actions'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

function MyCreate(props) {
  const dispatch = useDispatch()
  const params = props.match.params
  const account = params.account
  const url = props.match.url
  const type = url.split('/')[3]
  const { isAuth, authToken, userCollections } = useSelector((state) => {
    let authToken = state.auth.getIn(['authToken']) || ''
    let user = account === 'wallet' ? authToken : params.user
    return {
      authToken,
      userCollections: state.allcavans.getIn([`createCollection-${user}`]) || null
    }
  }, shallowEqual)

  const user = account === 'wallet' ? authToken : params.user

  useEffect(() => {
    if (user && userCollections === null) dispatch(getCreateCollectionByUser(user))
  }, [user])

  const getContent = () => {
    if (type === 'createCollections') return <MyCollections user={user} />
    else if (type === 'createItems') return <MyItems user={user} />
    else return <></>
  }
  return getContent()
}

export default memo(MyCreate)
