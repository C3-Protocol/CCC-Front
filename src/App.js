import './App.less'
import { Layout } from 'antd'
import { HashRouter, Route, Redirect } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.less'
import Home from '@/pages/home'
import MarketPlace from '@/pages/marketPlace'
import Create from '@/pages/create'
import CanvasContent from '@/pages/create/canvas-content'
import PhoneContent from '@/pages/create/canvas-content/phone-content'
import Wallet from '@/pages/wallet'
import Rule from '@/pages/rules'
import TopHeader from '@/components/top-header'
import MarketDetail from '@/pages/marketPlace/detail'
import { isPhone } from './utils/utils'
const { Content } = Layout
import { useDispatch } from 'react-redux'
import { requestInitLoginStates } from './components/auth/store/actions'

const App = () => {
  const dispatch = useDispatch()

  const [contentShow, setContentShow] = useState(true)
  const updateContent = (res) => {
    setContentShow(!res)
  }

  useEffect(async () => {
    let timer = setInterval(() => {
      dispatch(requestInitLoginStates())
    }, 1000 * 60 * 5)
    return () => {
      timer && clearInterval(timer)
    }
  }, [])

  return (
    <HashRouter>
      <div style={{ height: '100%', position: 'relative' }}>
        <div style={{ width: '100%', position: 'absolute', zIndex: 100 }}>
          {!isPhone() && <Route path="/canvas/:type/:id" component={CanvasContent} />}
        </div>

        <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <TopHeader updateContent={updateContent} />
          <Content
            style={{ position: 'absolute', height: '100%', width: '100%', display: contentShow ? 'block' : 'none' }}
          >
            <Route exact path="/">
              <Redirect to="/all" />
            </Route>
            <Route path="/all" component={Home} />
            <Route path="/marketplace" component={MarketPlace} />
            <Route path="/create" component={Create} />
            <Route path="/wallet" component={Wallet} />
            <Route path="/rule" component={Rule} />
            <Route path="/detail/:type?/:index?/:prinId?" component={MarketDetail} />
            {isPhone() && <Route path="/canvas/:type/:id" component={PhoneContent} />}
          </Content>
        </div>
      </div>
    </HashRouter>
  )
}

export default App
