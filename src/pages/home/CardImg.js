import React from 'react'
import GridList from '@/components/grid-list'
import Img from './Img'

export default ({ title, data = [], type }) => {
  return (
    <div className="img-card">
      <div className="title">{title}</div>
      <div className="GridList">
        {/* {data.map((item) => {
          return <Img item={item} type={type} />
        })} */}
        <GridList
          //itemWidth={335}
          showCol={4}
          content={
            data &&
            data.map((item, index) => {
              return <Img item={item} index={index} type={type} />
            })
          }
        ></GridList>
      </div>
    </div>
  )
}
