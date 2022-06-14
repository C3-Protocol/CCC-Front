import React, { memo, useEffect, useState } from 'react'
import NftTypeCard from '../cpns/nfts-type-card'
import GridList from '@/components/grid-list'
import { saveLastMarketInfo } from '@/pages/home/store/actions'
import { useDispatch } from 'react-redux'
import { handleAllCollectionVolumn } from '@/api/httpRequest'
import { Spin, Empty } from 'antd'
import { find } from 'lodash'
import { plusBigNumber, getValueDivide8 } from '@/utils/utils'
import EmptyImage from '@/assets/images/wallet/empty.png'

function CollectionList(props) {
  const dispatch = useDispatch()
  const { collectionsConfig } = props
  const [sorting, setSorting] = useState(true)
  useEffect(() => {
    dispatch(saveLastMarketInfo(null))
  }, [])

  useEffect(() => {
    if (collectionsConfig?.length > 0) {
      let prinIds = []
      for (let item of collectionsConfig) {
        if (item.pricinpalId) prinIds.push(item.pricinpalId)
      }
      handleAllCollectionVolumn({
        prinIds,
        success: (res) => {
          let result = res.results
          for (let item of collectionsConfig) {
            let volume = find(result, { caller_principal: item.pricinpalId })
            item.volume = volume?.sum || 0
            if (item.key === 'kverso') item.volume = plusBigNumber(item.volume, 236000000000n)
            dispatch({
              type: `collectionInfo-${item.key}-volume`,
              value: item.volume,
              nameSpace: 'nfts'
            })
          }
          collectionsConfig.sort((left, right) => {
            if (left.key === 'zombie') {
              return -1
            } else if (right.key === 'zombie') {
              return 1
            } else if (parseFloat(getValueDivide8(left.volume)) > parseFloat(getValueDivide8(right.volume))) {
              return -1
            } else {
              return 1
            }
          })
          setSorting(false)
        }
      })
    } else if (collectionsConfig?.length === 0) {
      setSorting(false)
    }
  }, [collectionsConfig])

  return (
    <div>
      <div className="divider"></div>
      <div className="collection-list">
        {sorting ? (
          <Spin style={{ margin: '100px auto', width: '100%' }} />
        ) : collectionsConfig?.length === 0 ? (
          <Empty
            image={<img src={EmptyImage} />}
            imageStyle={{
              marginTop: '50px',
              height: 100
            }}
            style={{ margin: '0 auto' }}
            description={
              <span style={{ color: '#4338CA' }}>
                {'No collection...'}
                <a href={'/#/create/collection'}>{'Go to create collection'}</a>
              </span>
            }
          ></Empty>
        ) : (
          <GridList
            content={
              collectionsConfig &&
              collectionsConfig.map((item, index) => {
                return <NftTypeCard key={index} item={item} />
              })
            }
          ></GridList>
        )}
      </div>
    </div>
  )
}
export default memo(CollectionList)
