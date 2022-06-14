import React from 'react'
import GridList from '@/components/grid-list'
import LaunchpadItem from '../cpn/launchpad-item'

interface configType {
  mintTime: string
}

interface propsType {
  data: configType[]
  title?: string
}

export default (props: propsType) => {
  const { data, title } = props
  return (
    <div className="launchpad-list">
      <h3>{title}</h3>
      <GridList
        content={data.map((item, index) => {
          return <LaunchpadItem item={item} key={index} mintTime={item.mintTime} />
        })}
      ></GridList>
    </div>
  )
}
