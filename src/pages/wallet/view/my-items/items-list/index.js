import React, { useState } from 'react'
import { Input, message, Empty, Spin, Layout, Pagination } from 'antd'
import ConfirmModal from '@/components/confirm-modal'
import { requestCanister } from '@/api/handler'
import { cancelNFTList, nftTransferFrom } from '@/api/nftHandler'
import Toast from '@/components/toast'
import { ListingUpdate, OwnedNFTUpdate } from '@/message'
import PubSub from 'pubsub-js'
import SellModal from '@/components/sell-modal'
import CreateNFTCover from '@/components/common-nft'
import EmptyImage from '@/assets/images/wallet/empty.png'
import GridList from '@/components/grid-list'
import ImgSearch from '@/assets/images/icon/search.svg'
import './style.less'
import Dialog from '@/components/dialog'
import CreateAll from '@/pages/create/view/create-all'
import { find } from 'lodash-es'

export default function MyItemsList(props) {
  const { loading, myItems, user, isSelf, collectionConfig } = props
  const [pageCount, setPageCount] = useState(20)
  const [curPage, setCurPage] = useState(1)
  const [royaltyFee, setRoyaltyFeeTo] = useState(0)
  const [forkFee, setForkFee] = useState(0)
  const [listVisible, setListVisible] = useState(false)
  const [transFerVisible, setTransFerVisible] = useState(false)
  const [trans2Address, setTrans2Address] = useState('')
  const [type, setType] = useState(null)
  const [curTokenIndex, setCurTokenIndex] = useState(null)
  const [searchInput, setSearchInput] = useState(null)
  const [searchContent, setSearchContent] = useState('')

  let curSelectList

  const onShowSizeChange = (current, size) => {
    setCurPage(current)
    setPageCount(size)
  }

  const onShowPageChange = (page) => {
    setCurPage(page)
  }

  const handlerClose = () => {
    setListVisible(false)
    setType(null)
    setCurTokenIndex(null)
    setRoyaltyFeeTo(0)
    setForkFee(0)
  }

  const handlerTransferClose = () => {
    setTransFerVisible(false)
    setTrans2Address('')
    setType(null)
    setCurTokenIndex(null)
  }

  const handlerTransfer = async () => {
    if (!trans2Address) {
      message.error('Principal ID empty')
      return
    }
    let notice = Toast.loading('Transfering', 0)
    let address = trans2Address.replace(/\s+/g, '')
    let data = {
      type: type,
      tokenIndex: curTokenIndex,
      to: address,
      success: (res) => {
        if (res) {
          message.info('transfer successfully')
          handlerTransferClose()
          PubSub.publish(OwnedNFTUpdate, { type })
        }
      },
      fail: (error) => {
        if (error) message.error(error)
      },
      notice: notice
    }
    requestCanister(nftTransferFrom, data)
  }

  const cancelListing = (type, tokenIndex) => {
    let msg = 'cancel listing'
    let func = cancelNFTList
    let notice = Toast.loading(msg, 0)
    let data = {
      tokenIndex: BigInt(tokenIndex),
      type: type,
      success: (res) => {
        if (res) {
          handlerClose()
          PubSub.publish(ListingUpdate, { type: type, tokenIndex: tokenIndex })
        }
      },
      fail: (error) => {
        message.error(error)
      },
      notice: notice
    }
    requestCanister(func, data)
  }

  const onButtonClick = (info, type, operation) => {
    if (isSelf) {
      setType(type)
      setCurTokenIndex(info.tokenIndex)
      setRoyaltyFeeTo(info?.baseInfo?.royaltyRatio)
      let item = find(collectionConfig, { key: type })
      setForkFee(item.forkRoyaltyRatio)
      if (operation === 'change') {
        if (info.listingInfo && info.listingInfo.seller) {
          cancelListing(type, info.tokenIndex) //取消挂单
        } else {
          setListVisible(true) //去挂单
        }
      } else if (operation === 'update') {
        setListVisible(true) //去挂单
      }
    }
  }

  const onTransferClick = (info, type) => {
    if (info.listingInfo && info.listingInfo.seller) {
      message.error('This NFT is listed on the marketplace, please cancel first')
      return
    }
    setType(type)
    setCurTokenIndex(info.tokenIndex)
    setTransFerVisible(true)
  }

  const handleSetTransfer2Address = (e) => {
    setTrans2Address(e.target.value)
  }

  const onInputChange = (e) => {
    setSearchInput(e.target.value)
  }

  const onSearch = () => {
    setCurPage(1)
    setSearchContent(searchInput)
  }

  const goToCreate = (e) => {
    e.stopPropagation()
    Dialog.createAndShowDialog(<CreateAll type={type} />, 0)
  }

  const getCurPageContent = () => {
    if (myItems) {
      let filterList = myItems.filter((item) => {
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
            return (
              <CreateNFTCover
                key={index}
                baseInfo={item}
                onButton1Click={onTransferClick}
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
                {'No created...'}
                {isSelf && <a onClick={goToCreate}>{'Go to create'}</a>}
              </span>
            }
          ></Empty>
        )
      return <GridList content={content} colCount={2} empty={empty} />
    }
  }
  return loading ? (
    <Spin style={{ margin: '50px', width: '100%' }} />
  ) : (
    <div className="my-items-wrapper">
      <Layout style={{ minHeight: 'calc(100vh - 300px)', background: '#0000', width: '100%' }}>
        <div className="header">
          <div className="tip tip-666">{`${myItems.length} items`}</div>
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
        <Layout.Content>{getCurPageContent()}</Layout.Content>
        <Layout.Footer style={{ textAlign: 'right', background: '#0000' }}>
          {curSelectList && curSelectList.length && curSelectList.length > pageCount ? (
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
          ) : (
            <></>
          )}
        </Layout.Footer>
      </Layout>

      {listVisible && (
        <SellModal
          index={curTokenIndex}
          listVisible={listVisible}
          type={type}
          setListVisible={handlerClose}
          royaltyFee={royaltyFee}
          forkFee={forkFee}
        />
      )}
      <ConfirmModal
        title={'Transfer'}
        width={328}
        onModalClose={handlerTransferClose}
        onModalConfirm={handlerTransfer}
        modalVisible={transFerVisible}
      >
        <Input
          type="text"
          placeholder={'To Principal ID'}
          value={trans2Address}
          className="ant-input-violet input-radius10"
          onChange={(e) => handleSetTransfer2Address(e)}
        />
      </ConfirmModal>
    </div>
  )
}
