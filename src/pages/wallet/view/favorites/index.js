import React, { memo, useState, useEffect, useRef } from 'react'
import { useSelector, shallowEqual, useDispatch } from 'react-redux'
import { requestCanister } from '@/api/handler'
import { getAllFavoriteByType } from '@/api/nftHandler'
import { getBlindBoxStatus } from '@/pages/home/store/actions'
import { AloneCreate, CrowdCreate, ThemeCreate, M1155Create, Theme1155Create } from '@/constants'
import NFTList from '@/pages/wallet/cpns/nft-list'

function Favorites(props) {
  let mount = true
  const dispatch = useDispatch()
  const typeList = [CrowdCreate, M1155Create, AloneCreate, ThemeCreate, Theme1155Create]
  const { isAuth, authToken, collectionsConfig } = useSelector((state) => {
    return {
      isAuth: state.auth && state.auth.get('isAuth'),
      authToken: state.auth.getIn(['authToken']) || '',
      collectionsConfig: state.auth.getIn(['collection']) || []
    }
  }, shallowEqual)
  const [nfts, setNFTsData] = useState({})
  const nftsRef = useRef()
  nftsRef.current = nfts

  const params = props.match.params
  const account = params.account
  const user = account === 'wallet' ? authToken : params.user

  const requestData = (type) => {
    requestCanister(
      getAllFavoriteByType,
      {
        type: type,
        prinId: user,
        success: (res) => {
          if (mount) {
            let newData = {}
            for (let key in nftsRef.current) {
              if (key !== type) newData[key] = nftsRef.current[key]
            }
            newData[type] = res
            setNFTsData(newData)
          }
        }
      },
      false
    )
  }

  useEffect(() => {
    if (user) {
      for (let type of typeList) {
        requestData(type)
        let item = find(collectionsConfig, { key: type })
        if (item?.nftType === 'blindbox') {
          dispatch(getBlindBoxStatus(item))
        }
      }
    }
  }, [user])

  useEffect(() => {
    for (let item of collectionsConfig) {
      requestData(item.key)
      if (item?.nftType === 'blindbox') {
        dispatch(getBlindBoxStatus(item))
      }
    }
  }, [collectionsConfig])

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
    for (let item of collectionsConfig) {
      data[item.key] = nfts[item.key] || []
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

  return (
    <NFTList nfts={getNFTListData()} thumbType={'drew'} nftType={'favorite'} user={user} loading={getLoadingData()} />
  )
}
export default memo(Favorites)
