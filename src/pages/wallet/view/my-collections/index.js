import React, { memo, useEffect, useState } from 'react'
import { Spin } from 'antd'
import { shallowEqual, useSelector } from 'react-redux'
import NftTypeCard from '@/pages/marketPlace/cpns/nfts-type-card'
import GridList from '@/components/grid-list'
import AddCollections from './add-collection'
import './style.less'

export default memo(function MyCollections(props) {
  const user = props.user
  const { authToken, userCollections } = useSelector((state) => {
    let authToken = state.auth.getIn(['authToken']) || ''
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      authToken,
      userCollections: state.allcavans.getIn([`createCollection-${user}`]) || null
    }
  }, shallowEqual)

  const [loading, setLoading] = useState(true)
  const [collections, setCollections] = useState()
  const isSelf = user === authToken
  useEffect(() => {
    if (userCollections !== null) {
      setLoading(false)
      let collections = [...userCollections]
      if (isSelf) collections.push({ type: 'addCollection' })
      setCollections(collections)
    }
  }, [userCollections])

  return (
    <div className="collections-wrapper">
      <div className="collection-list">
        {loading ? (
          <Spin style={{ marginTop: '50px' }} />
        ) : (
          <GridList
            content={
              collections &&
              collections.map((item, index) => {
                if (item.type === 'addCollection') return <AddCollections key={index} />
                else return <NftTypeCard key={index} item={item} owner={user} />
              })
            }
          ></GridList>
        )}
      </div>
    </div>
  )
})
