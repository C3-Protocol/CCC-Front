import React from 'react'
import Image from '@/components/image'
import { getIndexPrefix } from '@/utils/utils'

interface propsType {
  type?: string
  data: any
}

export default (props: propsType) => {
  const { type, data } = props

  const getChildrenRender = () => {
    let content = null
    switch (type) {
      case 'avatar':
        return (
          <div className="showHeader">
            <Image src={data.owner_avatar_url} />
            <div className="name">
              <div
                className="tip-bold tip-bold-000"
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {data.name}
              </div>
              <div
                className="tip tip-voilet"
                style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {data.owner_name || data.owner_pid}
              </div>
            </div>
          </div>
        )
      case 'info':
        const name = `${getIndexPrefix(data.type, data.index)} ${data.name}`
        content = <div className="info"> {name}</div>
        break
    }

    return content
  }

  return <>{getChildrenRender()}</>
}
