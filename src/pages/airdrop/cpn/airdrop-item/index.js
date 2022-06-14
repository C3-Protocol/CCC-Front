import React, { memo } from 'react'
import { Button } from 'antd'
import './style.less'
import { useHistory } from 'react-router-dom'
import AirDropButton from '@/components/airdrop-manager/airdrop-button'
import { C3ProtocolUrl } from '@/constants'

function AirDropItem(props) {
  const history = useHistory()
  const item = props.item
  const type = item.key
  const index = props.index
  const goToMarket = () => {
    history.push(`/collection/${type}/items`)
  }

  return (
    <div className="airdrop-banner-wrapper">
      <div className="blur-bg">
        <img src={`${C3ProtocolUrl}/resource/${item.key}/airdrop_banner.png`}></img>
      </div>
      <div className="drop-content" style={{ flexDirection: `${index % 2 === 1 ? 'row-reverse' : 'row'}` }}>
        <div
          className="info-content"
          style={{
            alignItems: `${index % 2 === 1 ? 'end' : 'start'}`,
            textAlign: `${index % 2 === 1 ? 'right' : 'left'}`
          }}
        >
          <h3>{item.title}</h3>
          <h4>{item.subTitle}</h4>
          <div
            className="airdrop-button-layout"
            style={{
              justifyContent: `${index % 2 === 1 ? 'end' : 'start'}`
            }}
          >
            <Button type="white-border" className="btn-normal" onClick={goToMarket}>
              Explore
            </Button>
            <AirDropButton type={type} />
          </div>
        </div>
        <div className="thumb-content">
          <img src={`${C3ProtocolUrl}/resource/${item.key}/airdrop_banner.png`}></img>
        </div>
      </div>
    </div>
  )
}

export default memo(AirDropItem)
