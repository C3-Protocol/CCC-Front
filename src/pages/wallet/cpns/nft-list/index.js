import React, { useState } from 'react'
import MarKetNFTItem from '@/components/canvas-cover'
import { shallowEqual, useSelector } from 'react-redux'
import {
  AloneCreate,
  CrowdCreate,
  M1155Create,
  ThemeCreate,
  Theme1155Create,
  isCanvas,
  C3ProtocolUrl,
  ArtCollection
} from '@/constants'
import { Pagination, Layout, Menu, Dropdown, Button, Empty, Input, Spin, Avatar } from 'antd'
import CommonNFTCover from '@/components/common-nft'
import './style.less'
const { Sider, Content, Footer } = Layout
import { DownOutlined } from '@ant-design/icons'
import EmptyImage from '@/assets/images/wallet/empty.png'
import GridList from '@/components/grid-list'
import ImgSearch from '@/assets/images/icon/search.svg'
import { find, filter } from 'lodash-es'

function NFTList(props) {
  const [pageCount, setPageCount] = useState(20)
  const [collapsed] = useState(false)
  const { nfts, loading, defaultType } = props
  const { authToken, collectionsConfig, allCreateCollection } = useSelector((state) => {
    return {
      authToken: state.auth.getIn(['authToken']) || '',
      collectionsConfig: state.auth.getIn(['collection']) || [],
      allCreateCollection: state.auth.getIn(['allCreateCollection']) || []
    }
  }, shallowEqual)

  const isExistCollections = nfts[collectionsConfig[0].key] !== undefined

  const typeList = [
    [...collectionsConfig.map((item) => item.key), ...allCreateCollection.map((item) => item.key)],
    [CrowdCreate, M1155Create, AloneCreate, ThemeCreate, Theme1155Create]
  ]

  const [curType, setCurType] = useState(defaultType ? [defaultType] : isExistCollections ? typeList[0] : typeList[1])
  const [curTabIndex, setCurTabIndex] = useState(0)
  const [curPage, setCurPage] = useState(1)
  const topMenuList = ['Collected', 'Canvas']
  const [searchInput, setSearchInput] = useState(null)
  const [searchContent, setSearchContent] = useState('')

  let curSelectList
  const isSelf = authToken === props.user

  const onButton1Click = (info, type) => {
    props.onButton1Click(info, type)
  }

  const onButtonClick = (info, type, operation) => {
    props.onButtonClick(info, type, operation)
  }

  const onChangeMenuTab = (key) => {
    let types = key.split(',')
    setCurType(types)
    setCurPage(1)
  }

  const onChangeType = (index) => {
    setCurTabIndex(index)
    setCurPage(1)
  }

  const onChangeNFTType = (key) => {
    let types = key.split(',')
    setCurType(types)
    setCurPage(1)
    if (curTabIndex !== 0) {
      setCurTabIndex(0)
    }
  }

  const onShowSizeChange = (current, size) => {
    setCurPage(current)
    setPageCount(size)
  }

  const onInputChange = (e) => {
    setSearchInput(e.target.value)
  }

  const onSearch = () => {
    setCurPage(1)
    setSearchContent(searchInput)
  }

  const topMenu = (
    <Menu
      onClick={(e) => {
        onChangeType(parseInt(e.key))
      }}
    >
      {typeList.map((types, index) => {
        let length = 0
        let exist = false
        for (let item of types) {
          length += (nfts[item] && nfts[item].length) || 0
          if (nfts[item]) exist = true
        }

        return exist && <Menu.Item key={index}>{`${topMenuList[index]} (${length})`}</Menu.Item>
      })}
    </Menu>
  )

  const topNFTTypeMenu = () => {
    if (curTabIndex !== 0) {
      return <></>
    }
    if (typeList[0].length === 0) return <></>
    let items = []
    let total = 0
    typeList[0].map((type) => {
      if (nfts[type] && nfts[type].length) total += nfts[type].length
    })
    items.push(<Menu.Item key={typeList[0]}>{`All ${total}`}</Menu.Item>)
    typeList[0].map((type) => {
      let exist = false
      if (nfts[type] && nfts[type].length) exist = true
      if (exist) {
        let isArt = type.startsWith(ArtCollection)
        let title
        if (isArt) {
          let collection = find(allCreateCollection, { key: type })
          title = collection.title
        } else {
          let collection = find(collectionsConfig, { key: type })
          title = collection.title
        }
        items.push(<Menu.Item key={[type]}>{`${title}(${nfts[type].length})`}</Menu.Item>)
      }
    })
    const menu = (
      <Menu
        onClick={(e) => {
          onChangeNFTType(e.key)
        }}
      >
        {items}
      </Menu>
    )
    let name
    if (curType?.length > 1) {
      name = 'All'
    } else {
      let item = find(collectionsConfig, { key: curType[0] })
      name = item?.title
    }
    return (
      <Dropdown className="radio-group" overlay={menu} trigger="click">
        <Button className="radioButton">
          {name}
          <DownOutlined />
        </Button>
      </Dropdown>
    )
  }

  const leftSiderMenu = () => {
    return (
      <Menu
        mode="inline"
        defaultOpenKeys={['collections', curType.toString()]}
        defaultSelectedKeys={[curType.toString()]}
        onClick={(e) => {
          onChangeMenuTab(e.key)
        }}
      >
        {typeList.map((types, index) => {
          let length = 0
          let exist = false
          for (let item of types) {
            length += (nfts[item] && nfts[item].length) || 0
            if (nfts[item]) exist = true
          }

          if (exist && index === 0) {
            let subs = []
            subs.push(
              <Menu.Item key={types} icon={<Avatar style={{ background: '#ccc' }}>All</Avatar>}>
                {'All'} <span style={{ marginLeft: '20px' }}>{length}</span>
              </Menu.Item>
            )
            for (let item of types) {
              let isArt = item.startsWith(ArtCollection)
              let title, imgUrl
              if (isArt) {
                let collection = find(allCreateCollection, { key: item })
                title = collection.title
                imgUrl = collection.avatar
              } else {
                let collection = find(collectionsConfig, { key: item })
                title = collection.title
                imgUrl = `${C3ProtocolUrl}/resource/${collection.key}/avatar.png`
              }

              if (nfts[item] && nfts[item].length)
                subs.push(
                  <Menu.Item key={[item]} icon={<Avatar src={imgUrl} style={{ background: '#ccc' }} />}>
                    {title}
                    <span style={{ marginLeft: '20px' }}>{nfts[item].length}</span>
                  </Menu.Item>
                )
            }
            return (
              <Menu.SubMenu
                key={'collections'}
                title={
                  <span>
                    {topMenuList[index]}
                    <span style={{ marginLeft: '20px' }}>{length}</span>
                  </span>
                }
              >
                {subs}
              </Menu.SubMenu>
            )
          }
          return (
            exist && (
              <Menu.Item key={types}>
                {`${topMenuList[index]}`} <span style={{ marginLeft: '20px' }}>{length}</span>
              </Menu.Item>
            )
          )
        })}
      </Menu>
    )
  }

  const onShowPageChange = (page) => {
    setCurPage(page)
  }

  const getCurPageContent = () => {
    let selectTypes = curTabIndex !== 0 ? typeList[curTabIndex] : curType
    let already = false
    for (let type of selectTypes) {
      if (loading[type]) {
        already = true
        break
      }
    }
    if (!already) {
      return (
        <Spin
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            marginTop: '50px'
          }}
        />
      )
    }
    let list = []
    for (let type of selectTypes) {
      if (nfts[type] && nfts[type].length > 0) list = [...list, ...nfts[type]]
    }
    if (list) {
      let filterList = list.filter((item) => {
        if (searchContent) {
          return parseInt(item.tokenIndex).toString().indexOf(searchContent) !== -1
        }
        return true
      })
      curSelectList = filterList
      let start = (curPage - 1) * pageCount
      let end = start + pageCount > filterList.length ? filterList.length : start + pageCount
      let pageList = filterList.slice(start, end)
      let empty = !(pageList && pageList.length > 0)
      let content =
        pageList && pageList.length > 0 ? (
          pageList.map((item, index) => {
            return isCanvas(item.type) ? (
              <MarKetNFTItem
                key={`${item.type}-${index}`}
                type={item.type}
                info={item}
                thumbType={props.thumbType}
                className="nft-list"
                onButton1Click={onButton1Click}
                onButtonClick={onButtonClick}
                colCount={pageList.length}
                user={props.user}
              ></MarKetNFTItem>
            ) : (
              <CommonNFTCover
                key={item.tokenIndex}
                baseInfo={item}
                onButton1Click={onButton1Click}
                onButtonClick={onButtonClick}
              />
            )
          })
        ) : (
          <Empty
            image={<img src={EmptyImage} />}
            imageStyle={{
              marginTop: '50px',
              height: 100
            }}
            description={
              <span style={{ color: '#4338CA' }}>
                {props.nftType === 'nft'
                  ? 'No owned...'
                  : props.nftType === 'drew'
                  ? 'Have not drew...'
                  : 'No favorite'}{' '}
                {isSelf && (
                  <a href={props.nftType === 'drew' ? '#/create' : '#/marketplace'}>
                    {props.nftType === 'nft' ? 'Buy now' : props.nftType === 'drew' ? 'Go to drew' : 'Go to market'}
                  </a>
                )}
              </span>
            }
          ></Empty>
        )
      return <GridList content={content} colCount={2} empty={empty} />
    }
  }

  return (
    <div className="nft-list-wrapper">
      <Layout style={{ background: '#0000', width: '100%', height: '100%' }}>
        <Sider className="nft-list-sider" theme="light" collapsed={collapsed} width={280}>
          {leftSiderMenu()}
        </Sider>
        <Content style={{ padding: '20px', overflowY: 'scroll' }}>
          <div className="header">
            {
              <div className="top-menu">
                <Dropdown className="radio-group" overlay={topMenu} trigger="click">
                  <Button className="radioButton">
                    {topMenuList[curTabIndex]} <DownOutlined />
                  </Button>
                </Dropdown>
                {topNFTTypeMenu()}
              </div>
            }
            <div className="flex-10">
              <div className="search-input-content">
                <Input
                  className="input-style"
                  placeholder="ID Search…"
                  onChange={onInputChange}
                  onPressEnter={onSearch}
                />
                <img src={ImgSearch} onClick={onSearch}></img>
              </div>
            </div>
          </div>
          <div>
            <div className="nft-list">{getCurPageContent()}</div>
            {curSelectList && curSelectList.length && curSelectList.length > 20 ? (
              <div style={{ textAlign: 'right' }}>
                <Pagination
                  className="pagination"
                  size="small"
                  hideOnSinglePage={false}
                  defaultCurrent={curPage}
                  current={curPage}
                  total={curSelectList ? curSelectList.length : 0}
                  pageSize={pageCount}
                  onChange={onShowPageChange}
                  onShowSizeChange={onShowSizeChange}
                  showSizeChanger={true}
                  showTotal={(e) => {
                    return 'Total ' + e + ' NFTs'
                  }}
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        </Content>
      </Layout>
    </div>
  )
}

export default NFTList
