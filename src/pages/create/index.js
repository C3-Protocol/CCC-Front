import React, { memo } from 'react'

import CreateCollection from './view/create-collection'
import CreateNFT from './view/create-nft'
import CreateAll from './view/create-all'

function Create(props) {
  const params = props.match.params
  const { type, prinId } = params
  const getCreateContent = () => {
    if (type === 'collection') {
      return <CreateCollection prinId={prinId} />
    } else if (type === 'nft') {
      return <CreateNFT prinId={prinId} />
    } else {
      return <CreateAll />
    }
  }

  return <div>{getCreateContent()}</div>
}
export default memo(Create)
