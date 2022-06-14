import React, { memo, useEffect, useState } from 'react'
import Footer from '@/components/footer'
import { Layout, Spin } from 'antd'
import './style.less'
import { shallowEqual, useSelector } from 'react-redux'
import { promiseFuncAllType } from '@/api/handler'
import { getMintOpentime } from '@/api/mintHandler'
import { handleLaunchpadConfig } from '@/api/handler'
import { filter } from 'lodash-es'
import Content from './newContent/index.tsx'

export default memo(function Launchpad(props) {
  const [loading, setLoading] = useState(true)
  const [bannerConfig, setBannerConfig] = useState(null)
  const [inprogressConfig, setInprogressConfig] = useState(null)
  const [upcommingConfig, setUpcommingConfig] = useState(null)
  const [launchpadConfig, setLaunchpadConfig] = useState([])
  //const [endConfig, setEndConfig] = useState([])

  const unEndConfig = filter(launchpadConfig, (item) => {
    if (!item.endMint) {
      return true
    }
  })

  const endConfig = filter(launchpadConfig, (item) => {
    if (item.endMint) {
      return true
    }
  })

  const updateData = (unEndConfig) => {
    const now = new Date().getTime()
    let bannerConfig = filter(unEndConfig, (item) => {
      if (now < item.mintTime) {
        return true
      }
    }).slice(0, 3)
    if (!bannerConfig || bannerConfig.length === 0) {
      bannerConfig = filter(unEndConfig, (item) => {
        if (!item.endMint) {
          return true
        }
      })
        .sort((left, right) => {
          return right.mintTime - left.mintTime
        })
        .slice(0, 3)
    }
    let inprogressConfig = filter(unEndConfig, (item) => {
      if (now > item.mintTime && !item.endMint) {
        return true
      }
    })

    let upcommingConfig = filter(unEndConfig, (item) => {
      if (now < item.mintTime && !item.endMint) {
        return true
      }
    })
    setBannerConfig(bannerConfig)
    setInprogressConfig(inprogressConfig)
    setUpcommingConfig(upcommingConfig)
  }

  const { isAuth, collectionsConfig } = useSelector((state) => {
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      collectionsConfig: state.auth.getIn(['collection']) || []
    }
  }, shallowEqual)

  const updateMintTime = (unEndConfig) => {
    if (unEndConfig && unEndConfig.length) {
      let allTypes = []
      for (let item of unEndConfig) allTypes.push(item.key)
      promiseFuncAllType(getMintOpentime, allTypes, {
        success: (res) => {
          if (res) {
            unEndConfig.map((item, index) => {
              item.mintTime = res[index].openTime
            })
            updateData(unEndConfig)
          }
          setLoading(false)
        }
      })
      updateData(unEndConfig)
    } else {
      setLoading(false)
    }
  }

  const handleChange = (type, value) => {
    switch (type) {
      case 'banner':
        updateData(unEndConfig)
        break
      default:
        break
    }
  }

  useEffect(() => {
    if (collectionsConfig.length > 0)
      handleLaunchpadConfig((res) => {
        const data = []
        ;(res || []).forEach((v) => {
          const item = collectionsConfig.find((it) => it.key === v.key)
          if (item) {
            data.push({ ...v, title: item.title })
          }
        })
        setLaunchpadConfig(data)
        let unend = filter(data, (item) => {
          if (!item.endMint) {
            return true
          }
        })
        updateMintTime(unend)
      })
  }, [collectionsConfig])

  useEffect(() => {
    updateMintTime(unEndConfig)
  }, [isAuth])

  return (
    <Layout
      style={{
        minHeight: '100%',
        background: 'transparent'
      }}
    >
      <Layout.Content>
        {loading ? (
          <div>
            <Spin
              style={{
                position: 'absolute',
                left: '50%',
                top: 'calc(50% - 200px)',
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>
        ) : (
          <Content
            bannerConfig={bannerConfig}
            inprogressConfig={inprogressConfig}
            upcommingConfig={upcommingConfig}
            endConfig={endConfig}
            onChange={handleChange}
          />
        )}
      </Layout.Content>
      <Layout.Footer
        style={{
          background: 'transparent',
          padding: 0
        }}
      >
        <Footer />
      </Layout.Footer>
    </Layout>
  )
})
