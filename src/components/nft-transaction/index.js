import React, { memo } from 'react'
import { Table } from 'antd'
import { formatMinuteSecond } from '@/utils/utils'
import UserPrincipal from '@/components/user-principal'
import WICPPrice from '@/components/wicp-price'
import { useHistory } from 'react-router-dom'
import Buy from '@/assets/images/market/buy.svg'
import Sell from '@/assets/images/market/sell.svg'
import Sale from '@/assets/images/market/sale.svg'
import Transfer from '@/assets/images/market/transfer.svg'
import './style.less'

export default memo(function NFTTransaction(props) {
  const history = useHistory()

  const transferTypes = {
    transfer: { name: 'Transfer', icon: Transfer },
    buy: { name: 'Buy', icon: Buy },
    sell: { name: 'Sell', icon: Sell },
    sale: { name: 'Sale', icon: Sale }
  }

  const onRowClick = (item) => {
    history.push(
      `/third/${item.type}/${item.index}/${item.prinId}/${encodeURIComponent(item.imgUrl)}/${encodeURIComponent(
        item.detailUrl
      )}`
    )
  }

  const columns = [
    {
      title: '',
      key: 'transactionType',
      dataIndex: 'transactionType',
      render: (type, item) => {
        let res = transferTypes[type]
        return (
          <div
            className="flex-5"
            style={{ paddingLeft: '10%' }}
            onClick={() => {
              onRowClick(item)
            }}
          >
            {res.icon && <img src={res.icon} style={{ height: '18px' }}></img>}
            <div>{res.name}</div>
          </div>
        )
      }
    },
    {
      title: 'Item',
      dataIndex: 'title',
      key: 'title',
      render: (title, item) => {
        return (
          <div
            className="flex-5"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              onRowClick(item)
            }}
          >
            <div
              style={{ width: '38px', height: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
              <img
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                src={item.imgUrl}
                onError={(e) => {
                  e.target.src = item.detailUrl
                }}
              ></img>
            </div>

            {title}
          </div>
        )
      }
    },
    {
      title: 'Price',
      key: 'price',
      dataIndex: 'price',
      render: (price, item) => {
        return price == 0 ? (
          <div
            className="value-16"
            onClick={() => {
              onRowClick(item)
            }}
          >
            N/A
          </div>
        ) : (
          <WICPPrice
            iconSize={16}
            value={price}
            valueStyle={'value-16'}
            onClick={() => {
              onRowClick(item)
            }}
          />
        )
      }
    },

    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
      render: (from) => {
        return <UserPrincipal prinId={from} maxLength={12} />
      }
    },
    {
      title: 'To',
      key: 'to',
      dataIndex: 'to',
      render: (to) => {
        return <UserPrincipal prinId={to} maxLength={12} />
      }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (timestamp, item) => {
        return (
          <div
            onClick={() => {
              onRowClick(item)
            }}
          >
            {formatMinuteSecond(timestamp, true)}
          </div>
        )
      }
    }
  ]

  return (
    <div className="nft-transaction-wrapper">
      <Table {...props} columns={columns} pagination={{ showSizeChanger: 'true' }} />
    </div>
  )
})
