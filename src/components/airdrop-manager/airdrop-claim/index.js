import React, { memo, useState, useEffect } from 'react'
import { AirdropClaimWrapper } from './style'
import { Button, message } from 'antd'
import { requestCanister } from '@/api/handler'
import { cliamAirdrop } from '@/api/mintHandler'
import PubSub from 'pubsub-js'
import AirdropImage from '@/assets/images/market/zombie/airdrop_bg.svg'
import AirdropColor from '@/assets/images/market/zombie/airdrop_color.svg'
import { CloseOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import { CloseDialog, OwnedNFTUpdate, DropComplete } from '@/message'

export default memo(function AirDrop(props) {
  let mount = true
  const type = props.type
  const [url, setUrl] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlerGetAirdrop = () => {
    setLoading(true)
    let data = {
      type,
      success: (res) => {
        if (mount) {
          setLoading(false)
          setUrl(res.imgUrl)
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

  useEffect(() => {
    return () => {
      mount = false
    }
  }, [])

  return (
    <AirdropClaimWrapper>
      <img className="base-bg" src={AirdropColor}></img>
      <img className="image-bg " src={AirdropImage}></img>
      {!url && (
        <Button type="violet" className="claim" onClick={handlerGetAirdrop}>
          Claim
        </Button>
      )}
      {loading && <Spin className="spin" />}
      {url && <img className="zombie" src={url} />}
      {url && (
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
