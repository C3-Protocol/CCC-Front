import React, { memo, useEffect, useState } from 'react'
import { requestCanister, getICPTransaction } from '@/api/handler'
import { Table } from 'antd'
import { Principal } from '@dfinity/principal'
import { getValueDivide8, formatMinuteSecond, principalToAccountId } from '@/utils/utils'
export default memo(function ICPTransaction(props) {
  let mount = true
  const isAuth = props.isAuth
  const authToken = props.authToken
  const [transaction, setTransaction] = useState([])

  useEffect(() => {
    isAuth &&
      authToken &&
      requestCanister(getICPTransaction, {
        accountAddress: principalToAccountId(Principal.fromText(authToken)), //'7531d783e80fa95cf2a8eb6374520650fcf83a9cc0a4726c3b6dbd31a6d6da80',
        success: (res) => {
          if (mount && res) {
            let transaction = []
            for (let item of res) {
              transaction.unshift({
                key: item.blockIndex + '',
                index: item.blockIndex + '',
                from: item.account1Address,
                to: item.account2Address,
                amount: getValueDivide8(item.amount) + '',
                time: formatMinuteSecond(new Date(item.timestamp).getTime(), false)
              })
            }
            setTransaction(transaction)
          }
        }
      })
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
      key: 'key'
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time'
    },
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
      ellipsis: true
    },
    {
      title: 'To',
      key: 'to',
      dataIndex: 'to',
      ellipsis: true
    },
    {
      title: 'Ammount',
      key: 'amount',
      dataIndex: 'amount'
    }
  ]

  return (
    <div style={{ overflow: 'hidden' }}>
      <div style={{ color: '#4338CA', fontSize: '20px', marginBottom: '10px' }}>ICP Transactions</div>
      <div style={{ overflow: 'scroll' }}>
        <Table columns={columns} dataSource={transaction} scroll={{ y: props.height }} />
      </div>
    </div>
  )
})
