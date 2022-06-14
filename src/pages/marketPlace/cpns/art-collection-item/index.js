import React, { memo, useState, useEffect } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { requestCanister } from '@/api/handler'
import { getCreateNFTByType } from '@/api/createHandler'
import { OwnedNFTUpdate } from '@/message'
import PubSub from 'pubsub-js'
import MyItemsList from '@/pages/wallet/view/my-items/items-list'
import './style.less'

export default memo(function ArtCollectionItems(props) {
  let mount = true
  const { type, owner, itemConfig } = props
  const { authToken } = useSelector((state) => {
    let authToken = state.auth.getIn(['authToken']) || ''
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      authToken
    }
  }, shallowEqual)
  const user = owner || authToken
  const [loading, setLoading] = useState(true)
  const [myItems, setMyItems] = useState([])
  const isSelf = owner === authToken

  const requestData = (type) => {
    requestCanister(
      getCreateNFTByType,
      {
        prinId: user,
        type,
        success: (res) => {
          if (mount) {
            setMyItems(res)
            setLoading(false)
          }
        }
      },
      false
    )
  }

  const nftUpdateFunc = (topic, info) => {
    if (info) requestData(info.type)
  }

  useEffect(() => {
    requestData(type)
    return () => {
      mount = false
    }
  }, [])

  useEffect(() => {
    const nftUpdate = PubSub.subscribe(OwnedNFTUpdate, nftUpdateFunc)
    return () => {
      mount = false
      PubSub.unsubscribe(nftUpdate)
    }
  }, [])

  return (
    <div className="art-collection-wrapper">
      <div className="divider" />
      <div className="list">
        <MyItemsList myItems={myItems} collectionConfig={[itemConfig]} loading={loading} isSelf={isSelf} user={user} />
      </div>
    </div>
  )
})
