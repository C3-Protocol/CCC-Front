import React from 'react'
import DefaultAvator from '@/assets/images/wallet/avator.png'
import { getIndexPrefix, is1155Canvas } from '@/utils/utils'
import { useHistory } from 'react-router-dom'

export default ({ item, style, type, index, className }) => {
  const history = useHistory()
  const goToDetail = () => {
    if (is1155Canvas(item.type)) {
      history.push(`/1155/${item.type}/${item.index}/${item.cid}`)
    } else {
      history.push(`/detail/${item.type}/${item.index}/${item.cid}`)
    }
  }

  const changeRender = (type) => {
    let content = null
    let addClass = ''
    switch (type) {
      case 'showHeader':
        content = (
          <div className="showHeader" style={{ display: 'flex' }}>
            <img className="img" src={item.owner_avatar_url || DefaultAvator} />
            <div style={{ width: '60%', marginLeft: 10 }}>
              <div
                className="tip-bold tip-bold-000"
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {item.name}
                {/* {getIndexPrefix(item.type, item.index)} */}
              </div>
              <div
                className="tip tip-voilet"
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {item.owner_name || item.owner_pid}
              </div>
            </div>
          </div>
        )
        break
      case 'showInfo':
        const name = `${getIndexPrefix(item.type, item.index)} ${item.name}`
        content = <div style={{ display: 'inline-block', lineHeight: '43px', paddingLeft: 20 }}> {name}</div>
        break
      default:
        content = (
          <div className={addClass ? addClass : `img-detail`} style={{ display: 'flex' }}>
            <img className="img" src={item.owner_avatar_url || DefaultAvator} />
            <div style={{ width: '60%' }}>
              <div
                className="tip-bold tip-bold-000"
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {item.name}
                {/* {getIndexPrefix(item.type, item.index)} */}
              </div>
              <div
                className="tip tip-voilet"
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {item.owner_name || item.owner_pid}
              </div>
            </div>
          </div>
        )
        break
    }
    return content
  }
  return (
    <div key={index} className={`img-content ${type}-content`} onClick={goToDetail}>
      <img className={`main ${className || ''}`} style={{ ...style }} src={item.image_url} />
      {changeRender(type)}
    </div>
  )
}
