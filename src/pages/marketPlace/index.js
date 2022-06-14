import React, { memo, useEffect, useState } from 'react'
import MarketMenu from '@/components/menu'
import { Dropdown, Button, Menu } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import './style.less'
import { Storage, isCollapsed } from '@/utils/utils'
import { HashRouter, useHistory } from 'react-router-dom'
import ListingsItems from './cpns/listings-item'
import { AloneCreate, CrowdCreate, M1155Create, Theme1155Create, ThemeCreate } from '@/constants'
import CollectionList from './collections'
import { getAllCreateCollection } from '@/pages/home/store/actions'
import { find } from 'lodash-es'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import MarketBanner from '@/assets/images/market/market_banner.webp'

function MarketPlace(props) {
  const history = useHistory()
  const dispatch = useDispatch()
  const marketMenuConfig = [
    {
      title: 'NFTs',
      key: '/nfts',
      types: []
    },
    {
      title: 'Co-Create',
      key: '/art',
      types: []
    },
    {
      title: 'Canvas',
      key: '/crowd',
      types: [CrowdCreate, M1155Create, AloneCreate, ThemeCreate, Theme1155Create]
    }
  ]

  const params = props.match.params
  const routeType = params.type
  const initSelect = routeType ? `/${routeType}` : Storage.get('marketSelected') || `${marketMenuConfig[0].key}`
  const [selectTab, setSelectTab] = useState(find(marketMenuConfig, { key: initSelect }))
  const { collectionsConfig, allCreateCollection } = useSelector((state) => {
    return {
      collectionsConfig: state.auth.getIn(['collection']),
      allCreateCollection: state.auth.getIn(['allCreateCollection'])
    }
  }, shallowEqual)

  useEffect(() => {
    dispatch(getAllCreateCollection())
  }, [])

  const getCurrentMenu = () => {
    return marketMenuConfig
  }

  const handlerItemSelect = (key) => {
    setSelectTab(find(marketMenuConfig, { key }))
    if (routeType) {
      history.replace('/marketplace')
    }
  }

  const getNFTContent = () => {
    let content
    if (selectTab.key === '/nfts') content = <CollectionList collectionsConfig={collectionsConfig} />
    else if (selectTab.key === '/art') content = <CollectionList collectionsConfig={allCreateCollection} />
    else content = <ListingsItems nftTypes={selectTab.types} />
    return content
  }

  const radioMenu = (
    <Menu
      onClick={(e) => {
        let key = e.key
        Storage.set(props.currentItemKey, key)
        setSelectTab(find(marketMenuConfig, { key }))
      }}
      defaultOpenKeys={[selectTab.key]}
      defaultSelectedKeys={selectTab.key}
      selectedKeys={[selectTab.key]}
    >
      {marketMenuConfig.map((item) => {
        return <Menu.Item key={item.key}>{item.title}</Menu.Item>
      })}
    </Menu>
  )
  const marketMenu = (
    <MarketMenu
      MenuConfig={getCurrentMenu()}
      currKey={selectTab.key}
      currentItemKey={'marketSelected'}
      mode={'horizontal'}
      handlerItemSelect={handlerItemSelect}
    />
  )

  return (
    <HashRouter>
      <div className="market-wrapper">
        <div className="top-wrapper">
          <div className="top-banner">
            <img src={MarketBanner} />
            <div className="title big-headline">Explore Collections</div>
          </div>

          {isCollapsed() ? (
            <Dropdown className="radio-group" overlay={radioMenu} trigger="click">
              <Button className="radioButton">
                {selectTab.title} <DownOutlined />
              </Button>
            </Dropdown>
          ) : (
            <div className="menu-wrapper">{marketMenu}</div>
          )}
        </div>

        <div className="market-content-wrapper">{getNFTContent()}</div>
      </div>
    </HashRouter>
  )
}

export default memo(MarketPlace)
