import React, { memo, useEffect } from 'react'
import PubSub from 'pubsub-js'
import { CloseDialog } from '@/message'
import './style.less'
import SuccessTip from '@/assets/images/mint/success.svg'
import RightOutline from '@/assets/images/mint/right_outline.svg'
import CircleClose from '@/assets/images/mint/circle_close.png'
import { useHistory } from 'react-router-dom'
import { shallowEqual, useSelector } from 'react-redux'

export default memo(function MintSuccess(props) {
  const history = useHistory()
  const mintList = props.mintList
  const type = props.type
  const backgrounds = [
    'linear-gradient(180deg, #6DD400 0%, #F7B500 100%)',
    'linear-gradient(180deg, #F2FF04 0%, #F7B500 100%)',
    'linear-gradient(180deg, #D46400 0%, #F7B500 100%)',
    'linear-gradient(180deg, #D40000 0%, #F7B500 100%)',
    'linear-gradient(180deg, #8D00D4 0%, #F7B500 100%)',
    'linear-gradient(180deg, #3300D4 0%, #F7B500 100%)',
    'linear-gradient(180deg, #043DFF 0%, #F7B500 100%)',
    'linear-gradient(180deg, #0090D4 0%, #F7B500 100%)',
    'linear-gradient(180deg, #00C7D4 0%, #F7B500 100%)',
    'linear-gradient(180deg, #00D4B3 0%, #F7B500 100%)'
  ]
  const { authToken } = useSelector((state) => {
    return {
      authToken: state.auth.getIn(['authToken']) || ''
    }
  }, shallowEqual)

  useEffect(() => {
    return () => {}
  }, [])

  const getMintItem = () => {
    let start = 0
    if (mintList.length === 1) {
      //ui 要求只有1个时，用第5个颜色
      start = 4
    } else if (mintList.length === 3) {
      //ui 要求只有3个时，用3、4、5的颜色
      start = 2
    }
    return mintList.map((item, index) => {
      return (
        <div style={{ background: backgrounds[(index + start) % 10] }} key={index}>
          <img
            className="image"
            src={item.imgUrl}
            onError={(e) => {
              e.target.src = item.detailUrl
            }}
          ></img>
        </div>
      )
    })
  }

  return (
    <div className="mint-success-wrapper">
      <div className="content">
        <div className="success-tip">
          <img className="tip" src={SuccessTip} />
          <div>
            {'Successfully Minted  '}
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
        <div className="zombie-list">{getMintItem()}</div>
        <div className="close">
          <img
            src={CircleClose}
            onClick={() => {
              PubSub.publish(CloseDialog, {})
            }}
          ></img>
        </div>
      </div>
    </div>
  )
})
