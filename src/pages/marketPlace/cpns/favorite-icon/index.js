import React, { memo, useEffect, useState } from 'react'
import { message } from 'antd'
import { shallowEqual, useSelector } from 'react-redux'
import Toast from '@/components/toast'
import Favorite from '@/assets/images/market/favorite.svg'
import { isNFTFavorite } from '@/pages/home/store/request'
import { requestCanister } from '@/api/handler'
import { setFavorite, cancelFavorite } from '@/api/nftHandler'
import { getFavoriteNum } from '@/pages/home/store/request'

// favorite icon
function FavoriteIcon(props) {
  // canvas index
  const tokenIndex = parseInt(props.index)
  const type = props.type
  // id,cansiterid
  const prinId = props.prinId

  let [isFavorite, setNFTFavorite] = useState(false)
  let [favoriteNum, setFavoriteNum] = useState(0)

  const { isAuth } = useSelector((state) => {
    let isAuth = state.auth.getIn(['isAuth']) || false

    return {
      isAuth: isAuth
    }
  }, shallowEqual)

  useEffect(() => {
    if (isAuth) {
      isNFTFavorite(type, prinId, tokenIndex, (res) => {
        setNFTFavorite(res)
      })
    } else {
      setNFTFavorite(false)
    }
  }, [isAuth])

  useEffect(() => {
    getFavoriteNum(type, tokenIndex, (res) => {
      setFavoriteNum(res)
    })
    return () => {
      setFavoriteNum = () => false
      setNFTFavorite = () => false
    }
  }, [])

  const onFavoriteClick = () => {
    if (!isAuth) {
      message.error('Please sign in first')
      return
    }
    let func
    if (isFavorite) {
      func = cancelFavorite
    } else {
      func = setFavorite
    }
    let notice = Toast.loading(isFavorite ? 'cancel favoriting' : 'set favoriting', 0)
    let data = {
      type: type,
      tokenIndex: tokenIndex,
      prinId: prinId,
      success: (res) => {
        setNFTFavorite(!isFavorite)
        if (!isFavorite) {
          setFavoriteNum(favoriteNum + 1)
        } else {
          setFavoriteNum(favoriteNum - 1)
        }
        setTimeout(() => {
          //delay 5000,because backend store async
          getFavoriteNum(type, tokenIndex, (res) => {
            setFavoriteNum(parseInt(res))
          })
        }, 5000)
      },
      fail: (error) => {
        message.error(error)
      },
      notice: notice
    }
    requestCanister(func, data)
  }

  return (
    <div className="flex-5">
      <img
        className="favorite"
        src={Favorite}
        style={{ filter: `grayscale(${isFavorite ? 0 : 100}%)`, cursor: 'pointer' }}
        onClick={onFavoriteClick}
      ></img>
      <div className="value value-ae">{favoriteNum}</div>
    </div>
  )
}

export default memo(FavoriteIcon)
