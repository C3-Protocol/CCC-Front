import React, { memo } from 'react'
import MultiList from './cpns/all-multi-canvas'
import Footer from '@/components/footer'
import { HomePage, MultiCanvasPage } from './style'
import HomeBanner from './cpns/banner'
import Content from './Content'
import './style.less'
import { Layout } from 'antd'
function Home(props) {
  return (
    <HomePage>
      <Layout
        style={{
          minHeight: '100%',
          background: 'transparent'
        }}
      >
        <Content />
        {/* <Layout.Content>
          <HomeBanner />
          <MultiCanvasPage>
            <MultiList />
          </MultiCanvasPage>
        </Layout.Content> */}
        <Layout.Footer
          style={{
            padding: 0
          }}
        >
          <Footer />
        </Layout.Footer>
      </Layout>
    </HomePage>
  )
}

export default memo(Home)
