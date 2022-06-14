import React, { memo, useEffect, useState } from 'react'
import { requestCanister, getWICPTransaction } from '@/api/handler'
import { Table } from 'antd'
import { formatMinuteSecond, getValueDivide8 } from '@/utils/utils'
import { shallowEqual, useSelector } from 'react-redux'
import { isAuthTokenEffect } from '@/utils/utils'
import UserPrincipal from '@/components/user-principal'
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
      requestCanister(getWICPTransaction, {
        prinId: authToken,
        success: (res) => {
          if (res) {
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
      title: 'Type',
      key: 'type',
      dataIndex: 'type'
    },
    {
      title: 'Amount',
      key: 'amount',
      dataIndex: 'amount'
    }
  ]

  return (
    <div className="wicp-transaction-wrapper">
      <Table
        loading={loading}
        columns={columns}
        dataSource={transaction}
        pagination={{ size: 'small', showSizeChanger: 'true' }}
      />
    </div>
  )
})
