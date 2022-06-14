import React, { memo, useState, useEffect, useRef } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { requestCanister, promiseFuncAllType } from '@/api/handler'
import { getCreateNFTByType } from '@/api/createHandler'
import { OwnedNFTUpdate } from '@/message'
import PubSub from 'pubsub-js'
import MyItemsList from './items-list'
import { filter } from 'lodash-es'
export default memo(function MyItems(props) {
  let mount = true
  const dispatch = useDispatch()
  const user = props.user
  const { authToken, userCollections } = useSelector((state) => {
    let authToken = state.auth.getIn(['authToken']) || ''
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      authToken,
      userCollections: state.allcavans.getIn([`createCollection-${user}`]) || null
    }
  }, shallowEqual)
  const isSelf = user === authToken
  const [loading, setLoading] = useState(true)
  const [myItems, setMyItems] = useState([])
  const myItemsRef = useRef()
  myItemsRef.current = myItems

  const requestData = (type) => {
    requestCanister(
      getCreateNFTByType,
      {
        prinId: user,
        type,
        success: (res) => {
          if (mount) {
            console.log('type, res', type, res)
            let oldData = filter(myItemsRef.current, (item) => {
              if (item.type !== type) return true
            })
            let items = [...oldData, ...res]
            setMyItems(items)
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
    if (user) {
      if (userCollections) {
        let allTypes = []
        for (let item of userCollections) {
          allTypes.push(item.key)
        }
        promiseFuncAllType(getCreateNFTByType, allTypes, {
          prinId: user,
          success: (res) => {
            if (mount) {
              let items = []
              for (let it of res) {
                items = [...items, ...it]
              }
              setMyItems(items)
              setLoading(false)
            }
          }
        })
      }
    }
  }, [user, userCollections])

  useEffect(() => {
    const nftUpdate = PubSub.subscribe(OwnedNFTUpdate, nftUpdateFunc)
    return () => {
      mount = false
      PubSub.unsubscribe(nftUpdate)
    }
  }, [])

  return (
    <div style={{ padding: '1% 1% 0' }}>
      <MyItemsList myItems={myItems} collectionConfig={userCollections} loading={loading} isSelf={isSelf} user={user} />
    </div>
  )
})
