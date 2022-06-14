import React, { useEffect, useState, useImperativeHandle, useRef } from 'react'
import MarKetNFTItem from '@/components/canvas-cover'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import {
  CrowdCreate,
  ZombieNFTCreate,
  ThemeCreate,
  M1155Create,
  Theme1155Create,
  AloneCreate,
  ArtCollection,
  isCanvas
} from '@/constants'
import './style.less'
import { Input, Pagination, Dropdown, Menu, Layout, Button, Empty, Spin, Switch, Tooltip, Tree } from 'antd'
import ImgSearch from '@/assets/images/icon/lau-search.png'
import { requestCanister } from '@/api/handler'
import { factorySoldListingsByType, getAllM1155FinshNFT } from '@/api/nftHandler'
import { factoryGetAllNFTByType } from '@/api/createHandler'
import { Storage, getValueDivide8 } from '@/utils/utils'
import CommonNFTCover from '@/components/common-nft'
import GridList from '@/components/grid-list'
import { saveLastMarketInfo, getBlindBoxStatus, getCollectionInfo } from '@/pages/home/store/actions'
import { RefreshIcon } from '@/icons'
import { ListingUpdate } from '@/message'
import PubSub from 'pubsub-js'
import { defaultsDeep, find } from 'lodash-es'
import lauActive from '@/assets/images/launchpad/lau-active.png'
import { useScrollToTop } from '@/components/hooks/useScrollToHooks'

const { Content, Footer } = Layout
function ListingsItems(props) {
  let mount = true
  const dispatch = useDispatch()
  const [collapsed, setCollapsed] = useState(false)
  const [pageCount, setPageCount] = useState(20)
  const nftTypes = props.nftTypes
  const curType = nftTypes[0]
  const isArtCollection = curType.startsWith(ArtCollection)
  const soldList = isArtCollection
    ? ['Current Listings', 'Sold Listings', 'All']
    : ['Current Listings', 'Sold Listings']
  const [nftData, setNFTData] = useState({})
  const nftDataRef = useRef()
  nftDataRef.current = nftData

  const [refreshCount, setRefreshCount] = useState(0)
  const refreshCountRef = useRef()
  refreshCountRef.current = refreshCount

  const { lastInfo, collectionsConfig } = useSelector((state) => {
    return {
      lastInfo: state.allcavans.getIn([`marktetLastInfo`]),
      collectionsConfig: state.auth.getIn(['collection']) || []
    }
  }, shallowEqual)
  const itemConfig = find(collectionsConfig, { key: curType })

  const collectionsConfigRef = useRef()
  collectionsConfigRef.current = collectionsConfig

  const [loading, setLoading] = useState(false)
  const [isRefresh, setRefresh] = useState(false)
  const [soldType, setSoldType] = useState(lastInfo?.soldType || 0) // 0: current listings, 1: history listings
  const [sortType, setSortType] = useState(Storage.get(`sortType-${curType}`) || 0) //0:Price: low to High,1:Price: High to Low,2:Number
  const [curPage, setCurPage] = useState(lastInfo?.curPage || 1)
  const [searchInput, setSearchInput] = useState(null)
  const sortList = [
    'Price: High to Low',
    'Price: Low to High',
    'Minting #',
    'Recently Listed',
    'Recently Sold',
    'Rarity Score',
    'CE'
  ]
  useScrollToTop()

  const [searchContent, setSearchContent] = useState('')
  const [colCount, setColCount] = useState(Storage.get('marketRows') || 2)

  const [autoRefresh, setAutoRefresh] = useState(Storage.get('autoRefresh'), false)
  let curFilterList

  const requestData = (nftType, soldType, currentCount) => {
    let success = (res) => {
      if (currentCount === refreshCountRef.current && mount) {
        let copy
        copy = defaultsDeep(copy, nftDataRef.current)
        if (!copy[soldType]) copy[soldType] = {}
        copy[soldType][nftType] = res
        setNFTData(copy)
        if (soldType === 0) {
          setLoading(false)
          setRefresh(false)
        }
      }
    }
    if (soldType === 0)
      dispatch(getCollectionInfo(isArtCollection ? nftType.split(':')[1] : itemConfig?.pricinpalId, nftType, success))
    else if (soldType === 1)
      requestCanister(
        factorySoldListingsByType,
        {
          type: nftType,
          success
        },
        false
      )
    else if (soldType === 2)
      requestCanister(
        factoryGetAllNFTByType,
        {
          type: nftType,
          success
        },
        false
      )
  }
  useEffect(() => {
    if (collectionsConfig.length > 0) refreshMarketList()
    if (itemConfig?.nftType === 'blindbox') {
      dispatch(getBlindBoxStatus(itemConfig))
    }
  }, [collectionsConfig])

  const refreshMarketList = () => {
    if (collectionsConfigRef.current.length === 0) return
    let currentCount = refreshCountRef.current + 1
    setRefreshCount(currentCount)
    for (let type of nftTypes) {
      if (type !== M1155Create && type !== Theme1155Create) {
        requestData(type, 0, currentCount)
        requestData(type, 1, currentCount)
        if (isArtCollection) requestData(type, 2, currentCount)
      } else {
        requestCanister(
          getAllM1155FinshNFT,
          {
            type,
            success: (res) => {
              if (refreshCountRef.current === currentCount) {
                let copy
                copy = defaultsDeep(copy, nftDataRef.current)
                if (!copy[0]) copy[0] = {}
                copy[0][type] = res
                setNFTData(copy)
              }
            }
          },
          false
        )
      }
    }
  }

  useEffect(() => {
    let loading
    for (let type of nftTypes) {
      if (!nftDataRef.current[0] || !nftDataRef.current[0][type]) loading = true
    }
    if (loading) setLoading(true)
    refreshMarketList()
    return () => {
      mount = false
    }
  }, [curType])

  useEffect(() => {
    if (soldType === 0 && sortType === 4) {
      setSortType(3)
    }
    if (soldType === 1 && sortType === 3) {
      setSortType(4)
    }
  }, [soldType])

  const listingUpdateFunc = (topic, info) => {
    if (info.type === curType) {
      refreshMarketList()
    }
  }
  useEffect(() => {
    dispatch(saveLastMarketInfo(null))
    const listUpdate = PubSub.subscribe(ListingUpdate, listingUpdateFunc)
    return () => {
      PubSub.unsubscribe(listUpdate)
    }
  }, [])

  useEffect(() => {
    let time
    if (autoRefresh) {
      time = setInterval(() => {
        refreshMarketList()
      }, 1000 * 10)
    }
    return () => {
      time && clearInterval(time)
    }
  }, [autoRefresh])

  const onItemClick = () => {
    let data = { soldType, curPage, nftData }
    dispatch(saveLastMarketInfo(data))
  }

  useImperativeHandle(props.cRef, () => ({
    onCheckActivity: () => {
      onItemClick()
    }
  }))

  const onSearch = () => {
    setCurPage(1)
    setSearchContent(searchInput)
  }

  const onChangeSortType = (e) => {
    if (parseInt(e.key) !== sortType) {
      setSortType(parseInt(e.key))
      Storage.set(`sortType-${curType}`, parseInt(e.key))
    }
  }

  const onShowPageChange = (page) => {
    setCurPage(page)
  }

  const onShowSizeChange = (current, size) => {
    setCurPage(current)
    setPageCount(size)
  }

  // toggle sider
  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  const onInputChange = (e) => {
    setSearchInput(e.target.value)
  }
  const getItemCount = () => {
    let length = 0
    for (let type of nftTypes) {
      if (nftData[soldType] && nftData[soldType][type]) length += nftData[soldType][type].length
    }
    return length
  }

  const handleRefresh = () => {
    setRefresh(true)
    refreshMarketList()
  }

  const onHandleChangeAutoRefresh = (res) => {
    Storage.set('autoRefresh', res)
    setAutoRefresh(res)
  }

  const getCurPageContent = () => {
    let list = []
    for (let type of nftTypes) {
      if (nftData[soldType] && nftData[soldType][type]) list = [...list, ...nftData[soldType][type]]
    }
    if (curType !== CrowdCreate)
      list &&
        list.sort((left, right) => {
          let value
          sortType === 0 && (value = getValueDivide8(right.sellPrice) - getValueDivide8(left.sellPrice))
          sortType === 1 && (value = getValueDivide8(left.sellPrice) - getValueDivide8(right.sellPrice))
          sortType === 2 && (value = parseInt(left.baseInfo.tokenIndex) - parseInt(right.baseInfo.tokenIndex))
          if (sortType === 3 || sortType === 4) value = parseInt(right.time) - parseInt(left.time)
          sortType === 5 && (value = parseInt(right.sellInfo.rarityScore) - parseInt(left.sellInfo.rarityScore))
          sortType === 6 && (value = parseInt(right.sellInfo.CE) - parseInt(left.sellInfo.CE))
          return value
        })

    if (list) {
      let filterList = list.filter((item) => {
        if (searchContent) {
          return parseInt(item.baseInfo.tokenIndex).toString().indexOf(searchContent) !== -1
        }
        return true
      })
      curFilterList = filterList
      let start = (curPage - 1) * pageCount
      let end = start + pageCount > filterList.length ? filterList.length : start + pageCount
      let pageList = filterList.slice(start, end)
      let empty = !(pageList && pageList.length > 0)
      let content = pageList.length ? (
        pageList.map((item, index) => {
          return isCanvas(item.nftType) ? (
            <MarKetNFTItem
              key={item.baseInfo.prinId.toText()}
              type={item.nftType}
              info={item.baseInfo}
              marketInfo={item.sellInfo}
              thumbType={'market-nft'}
              className="nft-list"
              colCount={colCount}
              onItemClick={onItemClick}
            ></MarKetNFTItem>
          ) : (
            <CommonNFTCover key={index} baseInfo={item.baseInfo} marketInfo={item.sellInfo} onItemClick={onItemClick} />
          )
        })
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={soldType === 0 ? 'There are currently no NFTs for sale' : 'There are currently no NFTs for sold'}
          style={{ width: '100%' }}
        />
      )
      return <GridList content={content} colCount={colCount} empty={empty} />
    }
  }

  const sortMenu = (
    <Menu onClick={onChangeSortType} className="ccc-drop-menu">
      <Menu.Item key={0}>{sortList[0]}</Menu.Item>
      <Menu.Divider />
      <Menu.Item key={1}>{sortList[1]}</Menu.Item>
      <Menu.Divider />
      <Menu.Item key={2}>{sortList[2]}</Menu.Item>
      <Menu.Divider />
      {soldType === 0 && (
        <>
          <Menu.Item key={3}>{sortList[3]}</Menu.Item>
          <Menu.Divider />
        </>
      )}
      {soldType === 1 && (
        <>
          <Menu.Item key={4}>{sortList[4]}</Menu.Item>
          <Menu.Divider />
        </>
      )}
      {nftData[0] && nftData[0][curType]?.length && nftData[0][curType][0].sellInfo.rarityScore != undefined && (
        <>
          <Menu.Item key={5}>{sortList[5]}</Menu.Item>
          <Menu.Divider />
        </>
      )}
      {curType === ZombieNFTCreate && <Menu.Item key={6}>{sortList[6]}</Menu.Item>}
    </Menu>
  )

  const soldListMenu = (
    <Menu
      className="ccc-drop-menu"
      onClick={(e) => {
        if (parseInt(e.key) !== soldType) {
          setSoldType(parseInt(e.key))
          setCurPage(1)
          let type = -1
          sortType === 3 && (type = 4)
          sortType === 4 && (type = 3)
          if (type !== -1) {
            setSortType(type)
            Storage.set(`sortType-${curType}`, type)
          }
        }
      }}
    >
      <Menu.Item key={0}>{soldList[0]}</Menu.Item>
      <Menu.Divider />
      <Menu.Item key={1}>{soldList[1]}</Menu.Item>
      {soldList[2] && (
        <>
          <Menu.Divider />
          <Menu.Item key={2}>{soldList[2]}</Menu.Item>
        </>
      )}
    </Menu>
  )

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: '#00000000'
      }}
    >
      <Content>
        <div className="market-content-wrapper">
          <div className="divider"></div>
          <div className="header">
            <div className="market-tabbar-left">
              <div className="flex-10">
                <div className="tip">{`${getItemCount()} items`}</div>
                <div className={`refresh ${isRefresh ? 'turn' : ''}`} onClick={handleRefresh}>
                  {RefreshIcon}
                </div>
                <Tooltip placement="top" title={'Refresh automatically every 10S'}>
                  <Switch checked={autoRefresh} onChange={onHandleChangeAutoRefresh} />
                </Tooltip>
              </div>
            </div>
            <div className="market-tabbar-right">
              <div className="search-input-content">
                <Input
                  className="input-style"
                  placeholder="ID Search…"
                  onChange={onInputChange}
                  onPressEnter={onSearch}
                />
                <img src={ImgSearch} className="search-img" onClick={onSearch}></img>
              </div>
              <Dropdown className="radio-group ccc-dropdown" overlay={soldListMenu} trigger="click">
                <Button className="radioButton">
                  {soldList[soldType]}
                  <img src={lauActive} className="menu-arrow" />
                  {/* <DownOutlined /> */}
                </Button>
              </Dropdown>
              {((curType !== CrowdCreate && curType !== ThemeCreate) || soldType === 1) && (
                <Dropdown className="radio-group ccc-dropdown" overlay={sortMenu} trigger="click">
                  <Button className="radioButton">
                    {sortList[sortType]}
                    <img src={lauActive} className="menu-arrow" />
                    {/* <DownOutlined /> */}
                  </Button>
                </Dropdown>
              )}
            </div>
          </div>
          <div className="market-listing">
            {loading ? (
              <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
            ) : (
              <div className="nft-list">{getCurPageContent()}</div>
            )}
          </div>
        </div>
      </Content>
      <Footer style={{ textAlign: 'right', background: '#0000' }}>
        {curFilterList && curFilterList.length && curFilterList.length > 20 && (
          <Pagination
            className="pagination"
            size="small"
            hideOnSinglePage={false}
            defaultCurrent={curPage}
            current={curPage}
            total={curFilterList ? curFilterList.length : 0}
            pageSize={pageCount}
            onChange={onShowPageChange}
            showSizeChanger={true}
            onShowSizeChange={onShowSizeChange}
          />
        )}
      </Footer>
    </Layout>
  )
}

export default ListingsItems
