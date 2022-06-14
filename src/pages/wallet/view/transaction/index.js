import React, { useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import './style.less'
import { isAuthTokenEffect } from '@/utils/utils'
import ICPTransaction from './icp-transaction'
import WICPTransaction from './wicp-transaction'
import NftTransaction from './my-nft-transaction'
import { Tabs } from 'antd'
const { TabPane } = Tabs

function Transaction(props) {
  const { isAuth, authToken } = useSelector((state) => {
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      authToken: state.auth.getIn(['authToken']) || ''
    }
  }, shallowEqual)

  useEffect(async () => {
    if (isAuthTokenEffect(isAuth, authToken)) {
    }
  }, [authToken])

  useEffect(() => {
    return () => {}
  }, [])

  return (
    <div className="transaction-wrapper">
      {/* 主体内容 */}
      <div className="content">
        <Tabs defaultActiveKey="1">
          <TabPane tab="NFT Transactions" key="1">
            <NftTransaction />
          </TabPane>
          <TabPane tab="WICP Transactions" key="2">
            <WICPTransaction />
          </TabPane>
          <TabPane tab="ICP Transactions" key="3">
            <ICPTransaction />
          </TabPane>
        </Tabs>
      </div>
      <div className="empty" />
    </div>
  )
}

export default Transaction
