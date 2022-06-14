import React, { memo, useState, useEffect, useRef } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { message } from 'antd'
import { requestCanister } from '@/api/handler'
import { getParticipate } from '@/api/nftHandler'
import { AloneCreate, CrowdCreate, ThemeCreate, M1155Create, Theme1155Create } from '@/constants'
import NFTList from '@/pages/wallet/cpns/nft-list'

function Drew(props) {
  let mount = true
  const typeList = [CrowdCreate, M1155Create, AloneCreate, ThemeCreate, Theme1155Create]
  const [nfts, setNFTsData] = useState({})
  const nftsRef = useRef()
  nftsRef.current = nfts

  const { isAuth, authToken } = useSelector((state) => {
    return {
      isAuth: state.auth && state.auth.get('isAuth'),
      authToken: state.auth.getIn(['authToken']) || ''
    }
  }, shallowEqual)

  const params = props.match.params
  const account = params.account
  const user = account === 'wallet' ? authToken : params.user

  // get drew data
  const fetchDrewData = async (type) => {
    let data = {
      type: type,
      prinId: user,
      success: async (res) => {
        console.debug('fetchDrewData res:', res)
        if (mount && res) {
          let newData = {}
          for (let key in nftsRef.current) {
            if (key !== type) newData[key] = nftsRef.current[key]
          }
          newData[type] = res
          setNFTsData(newData)
        }
      },
      fail: (error) => {
        console.error('fetchDrewData fail:', error)
        message.error(error)
      }
    }
    await requestCanister(getParticipate, data, false)
  }

  useEffect(() => {
    if (user) {
      for (let type of typeList) {
        fetchDrewData(type)
      }
    }
  }, [user])

  useEffect(() => {
    return () => {
      mount = false
    }
  }, [])

  const getNFTListData = () => {
    let data = {}
    for (let key of typeList) {
      data[key] = nfts[key] || []
    }
    return data
  }

  const getLoadingData = () => {
    let data = {}
    for (let key in nfts) {
      data[key] = true
    }
    return data
  }

  return <NFTList nfts={getNFTListData()} thumbType={'drew'} nftType={'drew'} user={user} loading={getLoadingData()} />
}
export default memo(Drew)
