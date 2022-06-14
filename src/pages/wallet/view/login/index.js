import React, { memo } from 'react'
import Footer from '@/components/footer'
import LoginSelect from '@/components/auth/cpns/login-select'
import { Layout } from 'antd'
import { LoginSelectContent } from './style'

export default memo(function LoginView(props) {
  return (
    <Layout
      style={{
        minHeight: '100%',
        background: 'transparent',
        padding: 0
      }}
    >
      <Layout.Content>
        <LoginSelectContent>
          <div className="headline headline-000">Connect your wallet</div>
          <div className="tip tip-666">Connect with one of our available wallet providers or create a new one.</div>
          <LoginSelect />
        </LoginSelectContent>
      </Layout.Content>
      <Layout.Footer
        style={{
          background: 'transparent',
          padding: 0,
          marginLeft: '-1%'
        }}
      >
        <Footer />
      </Layout.Footer>
    </Layout>
  )
})
