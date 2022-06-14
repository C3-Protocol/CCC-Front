import React, { memo, useState, useEffect } from 'react'
import { AirdropClaimWrapper } from './style'
import { Button, message } from 'antd'
import { requestCanister } from '@/api/handler'
import { cliamAirdrop } from '@/api/mintHandler'
import PubSub from 'pubsub-js'
import { CloseOutlined } from '@ant-design/icons'
import DropBg from '@/assets/images/gang/gangs_bg.webp'
import { CloseDialog, DropComplete, OwnedNFTUpdate } from '@/message'
import PictureCarousel from '../cpns/picture-carousel'
import Cover from '@/assets/images/gang/airdrop_cover.png'

export default memo(function AirDrop(props) {
  let mount = true
  const type = props.type
  const [firstIndex] = useState(Math.floor(Math.random() * 300) + 9000)
  const [carousel, setCarousel] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgUrl, setImgUrl] = useState(null)
  const picture = []

  for (let i = firstIndex; i < firstIndex + 50; i++) {
    let index = i > 9299 ? i - 9299 + 9000 : i
    let pic = require(`@/assets/images/${type}/${index}.png`).default
    picture.push(pic)
  }

  const handlerGetAirdrop = () => {
    setLoading(true)
    let data = {
      type,
      success: (res) => {
        if (mount) {
          setLoading(false)
          setImgUrl(res.imgUrl)
        }
      },
      fail: (error) => {
        if (mount) {
          setLoading(false)
          message.error(error)
          PubSub.publish(CloseDialog, {})
          PubSub.publish(DropComplete, { type })
        }
      }
    }
    requestCanister(cliamAirdrop, data, true)
  }

  const handleGo = () => {
    if (imgUrl) {
      PubSub.publish(CloseDialog, {})
      PubSub.publish(OwnedNFTUpdate, { type })
      PubSub.publish(DropComplete, { type })
      return
    }
    if (!carousel) {
      setCarousel(true)
      return
    }
    if (carousel && !loading) {
      handlerGetAirdrop()
    }
  }

  useEffect(() => {
    return () => {
      mount = false
    }
  }, [])

  return (
    <AirdropClaimWrapper>
      <div className="base-bg" style={{ backgroundImage: `url(${DropBg})` }}>
        <div className="carousel">
          {carousel ? (
            <PictureCarousel type={type} pictures={picture} imgUrl={imgUrl} isScroll={carousel} step={2} />
          ) : (
            <div className="cover">
              <img src={Cover} onClick={handleGo}></img>
            </div>
          )}
        </div>
        <Button className="claim" type="transparent" onClick={handleGo} loading={loading}>
          {imgUrl ? 'Close' : carousel ? 'Stop' : 'Go'}
        </Button>
      </div>

      {imgUrl && (
        <CloseOutlined
          className="close"
          onClick={() => {
            PubSub.publish(CloseDialog, {})
            PubSub.publish(OwnedNFTUpdate, { type })
            PubSub.publish(DropComplete, { type })
          }}
        />
      )}
    </AirdropClaimWrapper>
  )
})
