import { Carousel } from 'antd'
import React from 'react'
import Banner from '../cpn/banner'
import ItemCard from './ItemCard'
import ItemTable from './ItemTable'

interface propsType {
  bannerConfig?: []
  inprogressConfig?: []
  upcommingConfig?: []
  endConfig?: []
  onChange: (key: string) => void
}

export default (props: propsType) => {
  const { bannerConfig, onChange, inprogressConfig, upcommingConfig, endConfig } = props
  return (
    <div className="launchpad-wrapper">
      {bannerConfig && bannerConfig.length > 0 && (
        <Carousel autoplay effect="fade">
          {bannerConfig.map((item, index) => (
            <Banner key={index} item={item} bannerHeight={525} endFunc={() => onChange('banner')} />
          ))}
        </Carousel>
      )}
      <div className="launchpad-empty"></div>
      {inprogressConfig && inprogressConfig.length > 0 && <ItemCard title="In progress" data={inprogressConfig} />}
      {upcommingConfig && upcommingConfig.length > 0 && <ItemCard title="Upcoming" data={upcommingConfig} />}
      {endConfig && endConfig.length > 0 && <ItemTable title="Ended" data={endConfig} />}
    </div>
  )
}
