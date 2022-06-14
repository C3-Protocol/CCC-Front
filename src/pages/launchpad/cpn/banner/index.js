import React, { memo, useEffect, useState } from 'react'
import CountDown from '@/components/count-down'
import { Button } from 'antd'
import { useHistory } from 'react-router-dom'
import './style.less'
import { shallowEqual, useSelector } from 'react-redux'
import { find } from 'lodash-es'
import { C3ProtocolUrl } from '../../../../constants'

function LaunchpadBanner(props) {
  const history = useHistory()
  const { bannerHeight, item } = props
  const [mintNow, setMintNow] = useState(new Date().getTime() >= item.mintTime)
  const { collectionsConfig } = useSelector((state) => {
    return {
      collectionsConfig: state.auth.getIn(['collection']) || []
    }
  }, shallowEqual)
  const collectionItem = find(collectionsConfig, { key: item.key })
  const handlerOnItemClick = () => {
    history.push(`/mint/${item.key}`)
  }
  const getStatesText = () => {
    let now = new Date().getTime()
    if (now < item.mintTime) {
      return (
        <CountDown
          endTime={item.mintTime}
          endTimeFun={() => {
            setMintNow(true)
            props.endFunc && props.endFunc()
          }}
        />
      )
    } else {
      return 'Mint'
    }
  }
  useEffect(() => {
    let now = new Date().getTime()
    if (now < item.mintTime) setMintNow(false)
    else setMintNow(true)
  }, [item.mintTime])

  return (
    <div className="launchpad-banner-wrapper" style={{ height: `${bannerHeight}px` }}>
      <div className="blur-bg" style={{ height: `${bannerHeight}px` }}>
        <img
          src={`${C3ProtocolUrl}/resource/${item.key}/figure.png`}
          style={{
            height: '80%',
            filter: 'blur(20px)',
            marginLeft: '6%'
          }}
        ></img>
        <img
          src={`${C3ProtocolUrl}/resource/${item.key}/figure.png`}
          style={{
            height: '80%',
            filter: 'blur(10px)',
            marginRight: '12%'
          }}
        ></img>
      </div>
      <div className="blur-bg" style={{ backgroundColor: '#ffffff80', height: `${bannerHeight}px` }} />
      <div className="mint-content">
        <div className="left">
          <img src={`${C3ProtocolUrl}/resource/${item.key}/planet.png`}></img>
        </div>
        <div className="right">
          <h3 className="title">{collectionItem?.title}</h3>
          <div
            className="tip description limit-lines"
            style={{ '--lines': 4 }}
            dangerouslySetInnerHTML={{ __html: collectionItem?.blurb }}
          ></div>

          <div className="mint-button-layout">
            <Button type="violet" className="btn-normal banner-btn" onClick={handlerOnItemClick} disabled={!mintNow}>
              {getStatesText()}
            </Button>
            {/* <a href={droplistUrl} target="_blank" rel="noopener noreferrer">
              <Button type="black" className="btn-normal">
                Mint Rules
              </Button>
            </a> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(LaunchpadBanner)
