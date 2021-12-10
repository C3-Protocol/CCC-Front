import React, { memo, useEffect, useState } from 'react'
import { requestCanister, getWICPTransaction } from '@/api/handler'
import { Table } from 'antd'
import { formatMinuteSecond, getValueDivide8 } from '@/utils/utils'
export default memo(function ICPTransaction(props) {
  let mount = true
  const isAuth = props.isAuth
  const authToken = props.authToken
  const [transaction, setTransaction] = useState([])

  useEffect(() => {
    isAuth &&
      authToken &&
      requestCanister(getWICPTransaction, {
        prinId: authToken,
        success: (res) => {
          if (mount && res) {
            let transaction = []
            for (let item of res) {
              let type
              if (item.op) {
                for (let key in item.op) {
                  type = key
                  break
                }
              }
              if (type === 'approve') {
                continue
              }
              transaction.push({
                key: item.index + '',
                index: item.index + '',
                from: item.from && item.from.length ? item.from[0].toText() : '',
                to: item.to && item.to.length ? item.to[0].toText() : '',
                amount: getValueDivide8(item.amount) + '',
                time: formatMinuteSecond(item.timestamp, true),
                type: type
              })
            }
            transaction.sort((left, right) => {
              let value = right.index - left.index
              return value
            })
            setTransaction(transaction)
          }
        }
      })
    if (!isAuth) {
      setTransaction([])
    }
  }, [isAuth, authToken, props.refresh])

  useEffect(() => {
    return () => {
      mount = false
    }
  }, [])

  const columns = [
    {
      title: 'Height',
      dataIndex: 'index',
      key: 'index'
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time'
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from'
    },
    {
      title: 'To',
      key: 'to',
      dataIndex: 'to'
    },
    {
      title: 'Type',
      key: 'type',
      dataIndex: 'type'
    },
    {
      title: 'Ammount',
      key: 'amount',
      dataIndex: 'amount'
    }
  ]

  return (
    <div style={{ overflow: 'hidden' }}>
      <div style={{ color: '#4338CA', fontSize: '20px', marginBottom: '10px' }}>WICP Transactions</div>
      <div style={{ overflow: 'scroll' }}>
        <Table columns={columns} dataSource={transaction} scroll={{ y: props.height }} />
      </div>
    </div>
  )
})
