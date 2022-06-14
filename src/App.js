import './App.less'
import { Layout } from 'antd'
import { HashRouter, Route } from 'react-router-dom'
import React, { useState, useEffect, Suspense } from 'react'
import 'antd/dist/antd.less'
import TopHeader from '@/components/top-navy'
import { isCollapsed, Storage } from './utils/utils'
import { useDispatch } from 'react-redux'
import { requestInitLoginStates, requestCollectionConfig } from './components/auth/store/actions'
import CanvasContent from '@/pages/create/canvas-content'
import Router from './Router'
import { Spin } from 'antd'
const { Content } = Layout
import { ContentPaddingTop, DFINITY_TYPE, PhoneContentPaddingTop } from './constants'

const App = () => {
  let mount = true
  const dispatch = useDispatch()

  const [contentShow, setContentShow] = useState(true)
  const updateContent = (res) => {
    setContentShow(!res)
  }
  useEffect(async () => {
    dispatch(requestCollectionConfig())
    let loginType = Storage.get('loginType')
    let timer
    if (loginType === DFINITY_TYPE)
      timer = setInterval(() => {
        dispatch(requestInitLoginStates())
      }, 1000 * 60 * 5)
    return () => {
      timer && clearInterval(timer)
      mount = false
    }
  }, [])

  return (
    <HashRouter>
      <div style={{ height: '100%', position: 'relative' }}>
        <div style={{ width: '100%',position: 'absolute', zIndex: 100 }}>
          <Suspense
            fallback={
              <div
                style={{
                  width: '100%',
                  height: '100vh',
                  background: '#fff'
                }}
              >
                <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
              </div>
              
            }
          >
            <Route path="/canvas/:createType?/:param1?/:param2?/:param3?" component={CanvasContent} />
          </Suspense>
        </div>

        <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <TopHeader updateContent={updateContent} />
          <Content
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              display: contentShow ? 'block' : 'none',
              paddingTop: isCollapsed() ? PhoneContentPaddingTop : ContentPaddingTop
            }}
          >
            <Suspense
              fallback={
                <div
                  style={{
                    height: '100vh',
                    width: '100%',
                    background: '#fff'
                  }}
                >
                  <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
                </div>
              }
            >
              <Router  />
            </Suspense>
          </Content>
        </div>
      </div>
    </HashRouter>
  )
}

export default App
