import React, { memo, useEffect, useRef, useState } from 'react'
import './style.less'
import { HashRouter, useHistory } from 'react-router-dom'
import ListingsItems from '../../cpns/listings-item'
import { Menu } from 'antd'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import NFTActivity from '../../cpns/nft-activity'
import { Activity, Items } from '@/icons'
import { ArtCollection, gangNFTCreate } from '@/constants'
import { getCollectionInfo, getCreateCollectionDetailInfo, getStakeInfo } from '@/pages/home/store/actions'
import { useScrollToTop } from '@/components/hooks/useScrollToHooks'
import { find } from 'lodash-es'
import CollectionListingInfo from '../../cpns/collection-info'
import ArtCollectionItems from '../../cpns/art-collection-item'

function CollectionItemListings(props) {
  const params = props.match.params
  const key = params.type
  const tab = params.tab
  const owner = params.owner
  const isArtCollection = key.startsWith(ArtCollection)
  const history = useHistory()
  const dispatch = useDispatch()
  const curListings = useRef()
  const nftMenuConfig = [
    {
      title: 'Items',
      key: 'items',
      icon: Items
    },
    {
      title: 'Activity',
      key: 'activity',
      icon: Activity
    }
  ]

  const [selectTab, setSelectTab] = useState(tab || nftMenuConfig[0].key)

  const handlerItemSelect = (curTabKey) => {
    setSelectTab(curTabKey)
    history.replace(`/collection/${key}/${curTabKey}`)
  }

  const { volume, listing, owners, circultaion, itemConfig, totalSupply, stakeInfo } = useSelector((state) => {
    let key1 = `collectionInfo-${key}-volume`
    let key2 = `collectionInfo-${key}-listing`
    let key3 = `collectionInfo-${key}-owners`
    let key4 = `collectionInfo-${key}-circulation`
    let key5 = `collectionInfo-${key}-supply`
    let key6 = `stake-${key}`
    let volume = state.allcavans && state.allcavans.getIn([key1])
    let listing = (state.allcavans && state.allcavans.getIn([key2])) || null
    let owners = state.allcavans && state.allcavans.getIn([key3])
    let circultaion = state.allcavans && state.allcavans.getIn([key4])
    let totalSupply = state.allcavans && state.allcavans.getIn([key5])
    let itemConfig
    if (isArtCollection) {
      itemConfig = state.allcavans && state.allcavans.getIn([key])
    } else {
      let collectionsConfig = state.auth.getIn(['collection'])
      if (collectionsConfig) itemConfig = find(collectionsConfig, { key })
    }
    let stakeInfo = state.allcavans && state.allcavans.getIn([key6])
    return {
      volume,
      listing,
      owners,
      circultaion,
      itemConfig,
      totalSupply,
      stakeInfo
    }
  }, shallowEqual)

  useScrollToTop()
  useEffect(() => {
    if (isArtCollection) {
      dispatch(getCreateCollectionDetailInfo(key))
    }
  }, [])

  useEffect(() => {
    if ((itemConfig && selectTab !== 'items') || (selectTab === 'items' && isArtCollection && owner && itemConfig))
      dispatch(getCollectionInfo(itemConfig?.pricinpalId, key))
    key === gangNFTCreate && dispatch(getStakeInfo(key))
  }, [dispatch, itemConfig])

  const nftMenu = (
    <Menu
      mode={'horizontal'}
      style={{ backgroundColor: 'transparent', justifyContent: 'center' }}
      defaultOpenKeys={[selectTab]}
      defaultSelectedKeys={selectTab}
      selectedKeys={[selectTab]}
    >
      {nftMenuConfig.map((item) => {
        return (
          <Menu.Item key={item.key} icon={item.icon} onClick={(item) => handlerItemSelect(item.key)}>
            {item.title}
          </Menu.Item>
        )
      })}
    </Menu>
  )

  const getContent = () => {
    if (selectTab === 'items') {
      if (isArtCollection && owner) return <ArtCollectionItems type={key} owner={owner} itemConfig={itemConfig} />
      return <ListingsItems nftTypes={[key]} cRef={curListings} owner={owner} />
    } else if (selectTab === 'activity')
      return (
        <div className="transaction">
          <NFTActivity type={key} />
        </div>
      )
  }

  return (
    <HashRouter>
      <div className="collection-detail-wrapper">
        {itemConfig && (
          <CollectionListingInfo
            item={itemConfig}
            listingInfos={{ volume, listing, owners, circultaion, totalSupply, stakeInfo }}
          />
        )}

        <div className="content-wrapper">
          {nftMenu}
          {getContent()}
        </div>
      </div>
    </HashRouter>
  )
}

export default memo(CollectionItemListings)
