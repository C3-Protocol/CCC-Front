import React, { memo, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Image, Carousel } from 'antd'
import MultiList from './cpns/all-multi-canvas'
import Footer from '@/components/footer'
import { HomePage, FirstPage, MultiCanvasPage, RoadMapWrapper } from './style'
import HomeBanner from '@/assets/images/home_banner.png'
import MobileHomeBanner from '@/assets/images/mobile_home_banner.png'
import Roadmap1 from '@/assets/images/footer/roadmap1.png'
import Roadmap2 from '@/assets/images/footer/roadmap2.png'
import MobileRoadmap1 from '@/assets/images/footer/mobile_roadmap1.png'
import MobileRoadmap2 from '@/assets/images/footer/mobile_roadmap2.png'
import MobileRoadmap3 from '@/assets/images/footer/mobile_roadmap3.png'
import MobileRoadmap4 from '@/assets/images/footer/mobile_roadmap4.png'
import { isCollapsed } from '@/utils/utils'
import AirdropCountDown from './cpns/airdrop-countdown'

function Home(props) {
  const droplistUrl =
    'https://medium.com/@CCCProtocol/zombies-holding-collectibles-and-dividing-up-bonus-pools-a84c4232c5c5'
  const [scale, setScale] = useState(1)
  const addListener = () => {
    window.addEventListener('resize', onWindowResize)
    onWindowResize()
  }
  const removeListener = () => {
    window.removeEventListener('resize', onWindowResize)
  }

  const onWindowResize = () => {
    setScale(window.innerWidth / (isCollapsed() ? 750 : 1680))
  }

  useEffect(() => {
    addListener()
    return () => {
      removeListener()
    }
  }, [])

  const endTimeFun = () => {}
  return (
    <HomePage>
      {/* banner */}
      <FirstPage scale={scale}>
        <div className="description">
          <div className="content">
            <AirdropCountDown endTime={1637805600000} endTimeFun={endTimeFun} />
            {/* 11-25-10点 */}
            <div className="center">
              <a href={droplistUrl} target="_blank" rel="noopener noreferrer">
                <Button type="yellow15" className="know-more">
                  Airdrop Rules
                </Button>
              </a>
            </div>
          </div>
        </div>
        <Image src={isCollapsed() ? MobileHomeBanner : HomeBanner} preview={false} width="100%" />
      </FirstPage>
      {/* canvas */}
      <MultiCanvasPage>
        <MultiList />
      </MultiCanvasPage>
      {/* road-mpa */}
      <RoadMapWrapper>
        <div className="title">Roadmap</div>
        {isCollapsed() ? (
          <Carousel>
            <div>
              <Image src={MobileRoadmap1} preview={false} />
            </div>
            <div>
              <Image src={MobileRoadmap2} preview={false} />
            </div>
            <div>
              <Image src={MobileRoadmap3} preview={false} />
            </div>
            <div>
              <Image src={MobileRoadmap4} preview={false} />
            </div>
          </Carousel>
        ) : (
          <Carousel>
            <div>
              <Image src={Roadmap1} preview={false} width={'80%'} />
            </div>
            <div>
              <Image src={Roadmap2} preview={false} width={'80%'} />
            </div>
          </Carousel>
        )}
      </RoadMapWrapper>
      <Footer />
    </HomePage>
  )
}

export default memo(Home)
