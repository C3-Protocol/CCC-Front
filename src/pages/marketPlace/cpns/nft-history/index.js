import React, { memo, useEffect, useState } from 'react'
import { Table, TreeSelect } from 'antd'
import { formatMinuteSecond, is1155Canvas } from '@/utils/utils'
import List from '@/assets/images/market/list.svg'
import Mint from '@/assets/images/market/mint.svg'
import Sale from '@/assets/images/market/sale.svg'
import UpdateList from '@/assets/images/market/updateList.svg'
import CancelList from '@/assets/images/market/cancelList.svg'
import Transfer from '@/assets/images/market/transfer.svg'
import { requestCanister } from '@/api/handler'
import { getTradeHistoryByIndex } from '@/api/nftHandler'
import WICPPrice from '@/components/wicp-price'
import { UpdateNFTHistory } from '@/message'
import PubSub from 'pubsub-js'
import UserPrincipal from '@/components/user-principal'

// canvas缩略图组件
function NFTHistory(props) {
  const tokenIndex = parseInt(props.tokenIndex)
  const type = props.type
  let [loading, setLoading] = useState(true)
  let [tradeHistory, setTradeHistory] = useState([])
  let [filterHistory, setFilterTradeHistory] = useState([])
  let getting = false

  const treeData = [
    {
      title: 'All',
      value: ''
    },
    {
      title: 'List',
      value: 'List',
      image: List
    },
    {
      title: 'Mint',
      value: 'Mint',
      image: Mint
    },
    {
      title: 'Sale',
      value: 'Sale',
      image: Sale
    },
    {
      title: 'CancelList',
      value: 'CancelList',
      image: CancelList
    },
    {
      title: 'UpdateList',
      value: 'UpdateList',
      image: UpdateList
    },
    {
      title: 'Transfer',
      value: 'Transfer',
      image: Transfer
    }
  ]
  const [selectEvent, setSelectEvent] = useState(treeData[0].value)
  const column1 = {
    title: 'Event',
    dataIndex: 'event',
    key: 'event',
    render: (event) => {
      let image
      for (let item of treeData) {
        if (item.title === event) {
          image = item.image
          break
        }
      }
      return (
        <div className="flex-5">
          {image && <img src={image} style={{ height: '18px' }}></img>}
          <div>{event}</div>
        </div>
      )
    }
  }
  const column2 = {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (price) => {
      return price ? <WICPPrice iconSize={20} value={price} valueStyle={'value-14'} /> : <div></div>
    }
  }
  const column3 = {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity'
  }
  const column4 = {
    title: 'From',
    dataIndex: 'from',
    key: 'from',
    ellipsis: true,
    render: (from) => {
      return <UserPrincipal prinId={from} maxLength={8} />
    }
  }
  const column5 = {
    title: 'To',
    key: 'to',
    dataIndex: 'to',
    ellipsis: true,
    render: (to) => {
      return <UserPrincipal prinId={to} maxLength={8} />
    }
  }
  const column6 = {
    title: 'Date',
    key: 'date',
    dataIndex: 'date'
  }
  const columns = is1155Canvas(type)
    ? [column1, column2, column3, column4, column5, column6]
    : [column1, column2, column4, column5, column6]

  // other hooks
  useEffect(() => {
    getTradeHistory()
    //事件信息绑定
    let updateFunc = (topic, info) => {
      if (info.type === type && info.tokenIndex === tokenIndex) {
        setTimeout(() => {
          getTradeHistory()
        }, 2500)
      }
    }
    let update = PubSub.subscribe(UpdateNFTHistory, updateFunc)
    return () => {
      PubSub.unsubscribe(update)
      setLoading = () => false
      setTradeHistory = () => false
      setFilterTradeHistory = () => false
    }
  }, [])

  const getTradeHistory = () => {
    if (getting) {
      return
    }
    getting = true
    let getFinished = () => {
      getting = false
    }
    requestCanister(
      getTradeHistoryByIndex,
      {
        type: type,
        tokenIndex: tokenIndex,
        success: (res) => {
          if (res) {
            let history = []
            let index = 0
            for (let item of res) {
              let event
              if (item.op) {
                for (let key in item.op) {
                  event = key
                  break
                }
              }
              history.push({
                key: index + '',
                quantity: `${item.quantity || 0}`,
                from: item.from && item.from.length ? item.from[0].toText() : '',
                to: item.to && item.to.length ? item.to[0].toText() : '',
                price: item.price[0] ? item.price[0] : '',
                date: formatMinuteSecond(item.timestamp, true),
                event: event
              })
              index++
            }
            filterTradeHistory(history, selectEvent)
            setTradeHistory(history)
          }
          setLoading(false)
          getFinished()
        },
        fail: getFinished,
        error: getFinished
      },
      false
    )
  }

  const filterTradeHistory = (history, value) => {
    let res = history.filter((item) => {
      if (!value || item.event == value) {
        return true
      }
      return false
    })
    setFilterTradeHistory(res)
  }

  const onHistoryFilter = (value) => {
    filterTradeHistory(tradeHistory, value)
    setSelectEvent(value)
  }

  return (
    <div style={{ paddingTop: '16px' }}>
      <TreeSelect
        style={{ width: '100%', marginBottom: '20px' }}
        value={selectEvent}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={treeData}
        placeholder="Filter"
        onChange={onHistoryFilter}
      />
      <div className="history">
        <Table loading={loading} columns={columns} dataSource={filterHistory} pagination={{ size: 'small' }} />
      </div>
    </div>
  )
}

export default memo(NFTHistory)
