import React, { memo, useState, useEffect } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { message } from 'antd'
import { requestCanister, getAllFavorite } from '@/api/handler'
import { DrewWrapper, DrewList } from './style'

import CavansCover from '@/components/canvas-cover'
import { AloneCreate, CrowdCreate } from '@/constants'

function Favorites() {
  let mount = true
  const history = useHistory()
  const dispatch = useDispatch()
  const [favorites, setFavorite] = useState({})
  const { isAuth } = useSelector((state) => {
    return {
      isAuth: state.auth && state.auth.get('isAuth')
    }
  }, shallowEqual)

  // jump detail
  const onItemClick = (info, type) => {
    if (info.canvasInfo.isNFTOver) {
      history.push(`/detail/${type}/${info.canvasInfo.tokenIndex}/${info.prinId}`)
    } else {
      history.push(`/canvas/${type}/${info.prinId}`)
    }
  }

  useEffect(() => {
    if (isAuth) {
      let data = {
        success: (res) => {
          mount && setFavorite(res)
        }
      }
      requestCanister(getAllFavorite, data)
    }
  }, [isAuth])

  useEffect(() => {
    return () => {
      mount = false
    }
  }, [])

  return (
    <DrewWrapper>
      <DrewList>
        {favorites.crowd &&
          favorites.crowd.map((item, idx) => {
            const { index, canisterId } = item
            return (
              <CavansCover
                itemIndex={idx}
                info={[index, canisterId]}
                type={CrowdCreate}
                thumbType={'drew'}
                key={item.index}
                onItemClick={onItemClick}
              />
            )
          })}
        {favorites.alone &&
          favorites.alone.map((item, idx) => {
            const { index, canisterId } = item
            return (
              <CavansCover
                itemIndex={idx}
                info={[index, canisterId]}
                type={AloneCreate}
                thumbType={'drew'}
                key={item.index}
                onItemClick={onItemClick}
              />
            )
          })}
      </DrewList>
    </DrewWrapper>
  )
}
export default memo(Favorites)
