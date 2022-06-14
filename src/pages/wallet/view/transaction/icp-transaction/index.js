import React, { memo, useEffect, useState } from 'react'
import { requestCanister, getICPTransaction } from '@/api/handler'
import { shallowEqual, useSelector } from 'react-redux'
import { Table } from 'antd'
import { Principal } from '@dfinity/principal'
import { getValueDivide8, formatMinuteSecond, principalToAccountId } from '@/utils/utils'
import { isAuthTokenEffect } from '@/utils/utils'
import './style.less'

export default memo(function ICPTransaction(props) {
  let [loading, setLoading] = useState(true)
  const { isAuth, authToken } = useSelector((state) => {
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      authToken: state.auth.getIn(['authToken']) || ''
    }
  }, shallowEqual)

  let [transaction, setTransaction] = useState([])

  const transactionUpdate = () => {
    if (isAuthTokenEffect(isAuth, authToken))
      requestCanister(getICPTransaction, {
        accountAddress: principalToAccountId(Principal.fromText(authToken)), //'7531d783e80fa95cf2a8eb6374520650fcf83a9cc0a4726c3b6dbd31a6d6da80',
        success: (res) => {
          if (res) {
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
          setLoading(false)
        }
      })
    else {
      setTransaction([])
      setLoading(false)
    }
  }
  useEffect(() => {
    transactionUpdate()
  }, [isAuth, authToken])

  useEffect(() => {
    return () => {
      setLoading = () => false
      setTransaction = () => false
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
      title: 'Amount',
      key: 'amount',
      dataIndex: 'amount'
    }
  ]

  return (
    <div className="icp-transaction-wrapper">
      <Table
        loading={loading}
        columns={columns}
        dataSource={transaction}
        pagination={{ size: 'small', showSizeChanger: 'true' }}
      />
    </div>
  )
})
