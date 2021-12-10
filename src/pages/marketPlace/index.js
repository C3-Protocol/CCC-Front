import React, { useEffect, useState } from 'react'
import MarKetNFTItem from '@/components/canvas-cover'
import { shallowEqual, useSelector, useDispatch } from 'react-redux'
import { getMarketListNFT } from '@/pages/home/store/request'
import { AloneCreate, CrowdCreate } from '@/constants'
import { MarketContentWrapper, MarketTabbarLeftContent, MarketListingWrapper, MarketTabbarRightContent } from './style'
import { createHashHistory } from 'history'
import { Tabs, Input, Pagination, Dropdown, Menu, Layout, Button, Radio, Empty } from 'antd'
import ImgSearch from '@/assets/images/market/search.png'
import { DownOutlined } from '@ant-design/icons'
import { transformPxToRem } from '../../utils/utils'
import grid from '@/assets/images/market/grid.png'
import gridSelected from '@/assets/images/market/grid_selected.png'
import grid2 from '@/assets/images/market/grid2.png'
import grid2Selected from '@/assets/images/market/grid2_selected.png'
import { Storage, isCollapsed } from '@/utils/utils'
const { Content, Footer } = Layout

function MarketPlace(props) {
  let mount = true
  const pageCount = 20
  const dispatch = useDispatch()
  const [curType, setCurType] = useState(0)
  const [sortType, setSortType] = useState(0) //0:Price: low to High,1:Price: High to Low,2:Number
  const [curPage, setCurPage] = useState(1)
  const [searchInput, setSearchInput] = useState(null)
  const sortList = ['Price: Low to High', 'Price: High to Low', 'Number']
  const topMenuList = ['All NFT', 'Crowd NFT', 'Personal NFT']
  const [searchContent, setSearchContent] = useState('')
  const [nftCrowdListing, setMultiMarket] = useState([])
  const [nftAloneListing, setAloneMarket] = useState([])
  const [allListing, setAllListing] = useState([])
  const [colCount, setColCount] = useState(Storage.get('marketRows') || 2)
  let curFilterList
  const { isAuth } = useSelector((state) => {
    return {
      isAuth: state.auth.getIn(['isAuth']) || false
    }
  }, shallowEqual)

  const refreshMarketList = () => {
    getMarketListNFT((res) => {
      if (!mount) return
      setAloneMarket(res.alone)
      setMultiMarket(res.crowd)
      setAllListing([...res.crowd, ...res.alone])
    })
  }
  useEffect(() => {
    refreshMarketList()
    let timer = setInterval(() => {
      refreshMarketList()
    }, 1000 * 60 * 5)
    return () => {
      mount = false
      timer && clearTimeout(timer)
    }
  }, [])

  const isAlone = (type) => {
    return type === AloneCreate
  }
  const onSearch = () => {
    setCurPage(1)
    setSearchContent(searchInput)
  }

  const onItemClick = (info, type) => {
    let history = createHashHistory()
    history.push(`/detail/${type}/${info.canvasInfo.tokenIndex}/${info.prinId}`)
  }

  const onChangeSortType = (e) => {
    if (parseInt(e.key) !== sortType) setSortType(parseInt(e.key))
  }

  const onChangeTab = (key) => {
    if (parseInt(key) !== curType) {
      setCurType(parseInt(key))
      setCurPage(1)
    }
  }

  const onShowPageChange = (page) => {
    setCurPage(page)
  }

  const onInputChange = (e) => {
    setSearchInput(e.target.value)
  }

  const getCurPageContent = (type) => {
    let list
    if (type === 0) list = allListing
    else if (type === 1) list = nftCrowdListing
    else list = nftAloneListing
    list &&
      list.sort((left, right) => {
        let value
        sortType === 0 && (value = left.sellPrice - right.sellPrice)
        sortType === 1 && (value = right.sellPrice - left.sellPrice)
        sortType === 2 && (value = parseInt(left.baseInfo[0]) - parseInt(right.baseInfo[0]))
        return value
      })

    if (list) {
      let filterList = list.filter((item) => {
        if (searchContent) {
          return parseInt(item.baseInfo[0]).toString().indexOf(searchContent) !== -1
        }
        return true
      })
      curFilterList = filterList
      let start = (curPage - 1) * pageCount
      let end = start + pageCount > filterList.length ? filterList.length : start + pageCount
      let pageList = filterList.slice(start, end)
      return pageList.length ? (
        pageList.map((item) => {
          return (
            <MarKetNFTItem
              key={item.baseInfo[1].toText()}
              type={item.nftType}
              info={item.baseInfo}
              thumbType={'market-nft'}
              className="nft-list"
              onItemClick={onItemClick}
              colCount={colCount}
            ></MarKetNFTItem>
          )
        })
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="There are currently no NFTs for sale"
          style={{ width: '100%' }}
        />
      )
    }
  }

  const sortMenu = (
    <Menu onClick={onChangeSortType}>
      <Menu.Item key={0}>{sortList[0]}</Menu.Item>
      <Menu.Item key={1}>{sortList[1]}</Menu.Item>
      <Menu.Item key={2}>{sortList[2]}</Menu.Item>
    </Menu>
  )

  const topMenu = (
    <Menu
      onClick={(e) => {
        onChangeTab(e.key)
      }}
    >
      <Menu.Item key={0}>{topMenuList[0]}</Menu.Item>
      <Menu.Item key={1}>{topMenuList[1]}</Menu.Item>
      <Menu.Item key={2}>{topMenuList[2]}</Menu.Item>
    </Menu>
  )

  return (
    <Layout
      style={{
        minHeight: '100vh',
        paddingTop: isCollapsed() ? transformPxToRem('70px') : transformPxToRem('140px'),
        background: 'linear-gradient(270deg, #d0eaff 0%, #fcf0ff 100%)'
      }}
    >
      <Content style={{ margin: '0 1%' }}>
        <MarketContentWrapper>
          <div className="header">
            {isCollapsed() ? (
              <MarketTabbarLeftContent>
                <Dropdown overlay={topMenu} trigger="click">
                  <Button>
                    {topMenuList[curType]} <DownOutlined />
                  </Button>
                </Dropdown>
                <img
                  src={colCount === 1 ? gridSelected : grid}
                  onClick={() => {
                    if (colCount !== 1) {
                      setColCount(1)
                      Storage.set('marketRows', 1)
                    }
                  }}
                ></img>
                <img
                  src={colCount === 2 ? grid2Selected : grid2}
                  onClick={() => {
                    if (colCount !== 2) {
                      setColCount(2)
                      Storage.set('marketRows', 2)
                    }
                  }}
                ></img>
              </MarketTabbarLeftContent>
            ) : (
              <Radio.Group
                onChange={(e) => {
                  onChangeTab(e.target.value)
                }}
                value={curType}
                size="large"
              >
                <Radio.Button value={0}>{topMenuList[0]}</Radio.Button>
                <Radio.Button value={1}>{topMenuList[1]}</Radio.Button>
                <Radio.Button value={2}>{topMenuList[2]}</Radio.Button>
              </Radio.Group>
            )}

            <MarketTabbarRightContent>
              <div className="search-input-content">
                <Input className="input-style" placeholder="ID Search…" onChange={onInputChange} />
                <img src={ImgSearch} onClick={onSearch}></img>
              </div>
              <Dropdown className="radio-group" overlay={sortMenu} trigger="click">
                {isCollapsed() ? (
                  <Button>
                    {sortList[sortType]} <DownOutlined />
                  </Button>
                ) : (
                  <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                    {sortList[sortType]} <DownOutlined />
                  </a>
                )}
              </Dropdown>
            </MarketTabbarRightContent>
          </div>
          <MarketListingWrapper>
            <div className="nft-list">{getCurPageContent(curType)}</div>
          </MarketListingWrapper>
        </MarketContentWrapper>
      </Content>
      <Footer style={{ textAlign: 'right', background: '#0000' }}>
        <Pagination
          className="pagination"
          hideOnSinglePage={false}
          defaultCurrent={curPage}
          current={curPage}
          total={curFilterList ? curFilterList.length : 0}
          pageSize={pageCount}
          onChange={onShowPageChange}
          showTotal={(e) => {
            return 'Total ' + e + ' NFTs'
          }}
        />
      </Footer>
    </Layout>
  )
}

export default MarketPlace
