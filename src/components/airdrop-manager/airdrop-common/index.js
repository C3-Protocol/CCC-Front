import React, { memo, useState, useEffect, useRef } from 'react'
import { AirdropClaimWrapper } from './style'
import { Button, message } from 'antd'
import { requestCanister } from '@/api/handler'
import { cliamAirdrop } from '@/api/mintHandler'
import PubSub from 'pubsub-js'
import BlindBg from '@/assets/images/airdrop/blind_bg.webp'
import BlindBox from '@/assets/images/airdrop/blind_box.webp'
import { CloseDialog, OwnedNFTUpdate, DropComplete } from '@/message'
import { Motion, spring } from 'react-motion'
import SuccessTip from '@/assets/images/mint/success.svg'
import CircleClose from '@/assets/images/mint/circle_close.png'
import RightOutline from '@/assets/images/mint/right_outline.svg'
import { shallowEqual, useSelector } from 'react-redux'

export default memo(function AirDropCommon(props) {
  let mount = true
  const type = props.type
  const [url, setUrl] = useState(null)
  const urlRef = useRef()
  urlRef.current = url
  const [loading, setLoading] = useState(false)
  const [boxBottom, setBoxBottom] = useState(50)
  const [boxScale, setBoxScale] = useState(1)
  const finalBottom = 20 // 13.7%
  const finalScale = 0.5
  const boxHeight = 19.22 //19.22vw
  const [nftScale, setNFTScale] = useState(0)
  const [nftBottom, setNFTBottom] = useState(
    (window.innerHeight * finalBottom) / 100 + (window.innerWidth * boxHeight * finalScale) / 2 / 100
  )
  const [closeButton, setCloseButton] = useState(false)
  const { isAuth, authToken } = useSelector((state) => {
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      authToken: state.auth.getIn(['authToken']) || ''
    }
  }, shallowEqual)

  const handlerGetAirdrop = () => {
    setLoading(true)
    let data = {
      type,
      success: (res) => {
        if (mount) {
          let url = res.imgUrl
          let img = new Image()
          img.onload = () => {
            setLoading(false)
            setBoxBottom(finalBottom)
            setBoxScale(finalScale)
            setUrl(url)
            img.onload = null
          }
          img.onerror = () => {
            setLoading(false)
            setBoxBottom(finalBottom)
            setBoxScale(finalScale)
            setUrl(res.detailUrl)
            img.onload = null
          }
          img.src = url
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

  const handlerClose = () => {
    PubSub.publish(CloseDialog, {})
    PubSub.publish(OwnedNFTUpdate, { type })
    PubSub.publish(DropComplete, { type })
  }
  const onBoxRest = () => {
    if (url) {
      setNFTScale(1)
      setNFTBottom(window.innerHeight * 0.5)
    }
  }

  const onNFTRest = () => {
    setCloseButton(true)
  }

  useEffect(() => {
    return () => {
      mount = false
    }
  }, [])

  return (
    <AirdropClaimWrapper>
      {!url && <img className="blind-bg " src={BlindBg}></img>}
      <Motion style={{ bottom: spring(boxBottom), scale: spring(boxScale) }} onRest={onBoxRest}>
        {({ bottom, scale }) => {
          return (
            <div
              className={`blind-box`}
              style={{ transform: `translate(-50%, 50%) scale(${scale})`, bottom: `${bottom}%` }}
            >
              <img className={`${loading ? 'vibration' : ''}`} src={BlindBox}></img>
            </div>
          )
        }}
      </Motion>
      {url && (
        <Motion style={{ bottom: spring(nftBottom), scale: spring(nftScale) }} onRest={onNFTRest}>
          {({ bottom, scale }) => {
            // debugger
            return (
              <img
                className="nft"
                src={url}
                style={{ transform: `translateX(-50%) scale(${scale})`, bottom: `${bottom}px` }}
              ></img>
            )
          }}
        </Motion>
      )}
      {!url && (
        <Button type="violet" className="claim btn-normal" loading={loading} onClick={handlerGetAirdrop}>
          Open
        </Button>
      )}
      {url && closeButton && (
        <Button type="violet" className="drop-close btn-normal" onClick={handlerClose}>
          Close
        </Button>
      )}
      {url && closeButton && (
        <div className="success-tip">
          <img className="tip" src={SuccessTip} />
          <div>
            {'Successfully claim  '}
            <a
              href={`#/assets/wallet/myarts/${authToken}/${type}`}
              onClick={() => {
                PubSub.publish(CloseDialog, {})
              }}
            >
              Go check the collected
            </a>
          </div>
          <img className="right" src={RightOutline} />
        </div>
      )}
      {!loading && !url && (
        <img
          className="close"
          src={CircleClose}
          onClick={() => {
            PubSub.publish(CloseDialog, {})
          }}
        ></img>
      )}
    </AirdropClaimWrapper>
  )
})
