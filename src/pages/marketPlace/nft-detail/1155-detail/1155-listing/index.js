import React, { memo } from 'react'
import { Table } from 'antd'
import { formatMinuteSecond } from '@/utils/utils'
import WICPPrice from '@/components/wicp-price'
import { message, Button } from 'antd'
import Toast from '@/components/toast'
import { ListingUpdate, UpdateNFTHistory } from '@/message'
import Dialog from '@/components/dialog'
import BuyContent from '../buy'
import { requestCanister } from '@/api/handler'
import { cancelNFTList } from '@/api/nftHandler'
import { shallowEqual, useSelector } from 'react-redux'
import UserPrincipal from '@/components/user-principal'

function M1155Listing(props) {
  const tokenIndex = parseInt(props.tokenIndex)
  const type = props.type
  const self = props.self
  const listing = props.listing
  const filter = props.filter

  const { isAuth, authToken, pixelInfo } = useSelector((state) => {
    let isAuth = state.auth.getIn(['isAuth']) || false
    let authToken = state.auth.getIn(['authToken']) || ''
    let key3 = `pixelInfo-${type}-${props.prinId}`
    let pixelInfo = state.piexls && state.piexls.getIn([key3])

    return {
      isAuth: isAuth,
      authToken: authToken,
      pixelInfo: pixelInfo
    }
  }, shallowEqual)

  const handlerListingAction = (item) => {
    if (item.action === 'Cancel') {
      cancelListing(item)
    } else if (item.action === 'Buy') {
      Dialog.createAndShowDialog(
        <BuyContent
          isAuth={isAuth}
          authToken={authToken}
          pendingItem={[1, item]}
          tokenIndex={tokenIndex}
          pixelInfo={pixelInfo}
          type={type}
        />,
        0
      )
    }
  }

  const cancelListing = (item) => {
    let msg = 'cancel listing'
    let func = cancelNFTList
    let notice = Toast.loading(msg, 0)
    let { unitPrice, orderIndex } = item
    let data = {
      tokenIndex: tokenIndex,
      type: type,
      unitPrice: unitPrice,
      orderIndex: orderIndex,
      success: (res) => {
        if (res) {
          PubSub.publish(ListingUpdate, { type: type, tokenIndex: tokenIndex })
          PubSub.publish(UpdateNFTHistory, { type: type, tokenIndex: tokenIndex })
        }
      },
      fail: (error) => {
        message.error(error)
      },
      notice: notice
    }
    requestCanister(func, data)
  }

  const columns = [
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price) => {
        return price ? <WICPPrice iconSize={20} value={price} valueStyle={'value-14'} /> : <div></div>
      }
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'List Time',
      dataIndex: 'time',
      key: 'time'
    },
    {
      title: 'From',
      key: 'from',
      dataIndex: 'from',
      ellipsis: true,
      render: (from) => {
        return <UserPrincipal prinId={from} maxLength={8} />
      }
    },
    {
      title: '',
      key: 'action',
      dataIndex: 'action',
      render: (action, item) => {
        return (
          <Button
            type="violet"
            style={{ float: 'right', width: '80px' }}
            onClick={() => {
              handlerListingAction(item)
            }}
          >
            {action}
          </Button>
        )
      }
    }
  ]
  const getDataList = () => {
    let res = []
    let index = 0
    for (let item of listing) {
      if (item.length === 2) {
        if (filter === 'My listings' && item[1].seller.toText() !== self) {
          continue
        }
        res.push({
          key: index + '',
          from: item[1].seller ? item[1].seller.toText() : '',
          seller: item[1].seller,
          unitPrice: item[1].unitPrice ? item[1].unitPrice : '',
          quantity: item[1].quantity ? parseInt(item[1].quantity) : '',
          time: formatMinuteSecond(item[1].timeStamp || 0, true),
          action: item[1].seller.toText() === self ? 'Cancel' : 'Buy',
          orderIndex: item[1].orderIndex
        })
        index++
      }
    }
    return res
  }

  return (
    <div style={{ maxHeight: '445px', overflow: 'scroll', paddingTop: '15px' }}>
      <div>
        <Table columns={columns} dataSource={getDataList()} pagination={false} />
      </div>
    </div>
  )
}

export default memo(M1155Listing)
