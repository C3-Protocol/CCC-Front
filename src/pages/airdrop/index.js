import React, { memo, useEffect, useState } from 'react'
import { Spin, Layout } from 'antd'
import './style.less'
import AirdropItem from './cpn/airdrop-item'
import { shallowEqual, useSelector } from 'react-redux'
import { handleAirDropConfig } from '@/api/handler'
import { filter } from 'lodash-es'

export default memo(function AirDrop(props) {
  const [loading, setLoading] = useState(true)
  const [airdropConfig, setAirdropConfig] = useState([])

  const inprogressConfig = filter(airdropConfig, (item) => {
    if (item.airdropStart) {
      return true
    }
  }).sort((left, right) => {
    return right.airdropIndex - left.airdropIndex
  })

  const { collectionsConfig } = useSelector((state) => {
    return {
      collectionsConfig: state.auth.getIn(['collection']) || []
    }
  }, shallowEqual)

  useEffect(() => {
    if (collectionsConfig.length) {
      handleAirDropConfig((res) => {
        setAirdropConfig(res)
        setLoading(false)
      })
    }
  }, [collectionsConfig])

  return (
    <Layout
      style={{
        minHeight: '100%',
        background: 'transparent'
      }}
    >
      <Layout.Content style={{ paddingTop: '0px' }}>
        {loading ? (
          <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
        ) : (
          <div className="airdrop-wrapper">
            {inprogressConfig.length > 0 && (
              <div className="airdrop-list">
                {inprogressConfig.map((item, index) => {
                  return <AirdropItem item={item} key={index} index={index} />
                })}
              </div>
            )}
          </div>
        )}
      </Layout.Content>
    </Layout>
  )
})
