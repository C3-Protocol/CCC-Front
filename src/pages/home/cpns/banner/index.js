import React, { memo, useEffect, useState } from 'react'
import { FirstPage } from './style'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { getAllUndoneCanvasByType } from '@/pages/home/store/actions'
import { isCollapsed } from '@/utils/utils'
import Link02 from '@/assets/images/footer/twitter.png'
import Link05 from '@/assets/images/footer/discord.png'
import { useHistory } from 'react-router-dom'
import { getCanvasWidth, M1155Create } from '@/constants'
import BannerCanvas from './banner-canvas'

function HomePageBanner(props) {
  const dispatch = useDispatch()
  const history = useHistory()
  const [scale, setScale] = useState(1)
  const type = M1155Create
  const CanvasWidth = getCanvasWidth(M1155Create)
  const bannerHeight =
    (Math.max(60, Math.floor((450 * CanvasWidth) / window.innerWidth)) * window.innerWidth) / CanvasWidth
  const [link] = useState([
    { icon: Link02, url: 'https://twitter.com/CCCProtocol' },
    { icon: Link05, url: 'https://discord.gg/jgyp6prPuj' }
  ])

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

  const { prinId, tokenIndex } = useSelector((state) => {
    let key1 = `undoneCanvas-${type}`
    let undone = (state.allcavans && state.allcavans.getIn([key1])) || []
    let prinId = ''
    let tokenIndex = -1
    if (undone && undone.length) {
      tokenIndex = undone[0].tokenIndex
      prinId = undone[0].prinId
    }
    return {
      prinId: prinId,
      tokenIndex: tokenIndex
    }
  }, shallowEqual)

  useEffect(() => {
    addListener()
    dispatch(getAllUndoneCanvasByType(type))
    return () => {
      removeListener()
    }
  }, [])

  return (
    <FirstPage>
      <div className="content-bg">
        {prinId && <BannerCanvas bannerHeight={bannerHeight} />}
        {/* <Carousel autoplay style={{ height: `${bannerHeight}px` }} effect="fade">
            {prinId && <BannerCanvas bannerHeight={bannerHeight} />}
            <div>
              <div style={{ width: '100%', height: `${bannerHeight}px` }}>
                <img
                  src={HomeBanner}
                  onClick={goToMarket}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%'
                  }}
                ></img>
              </div>
            </div>
          </Carousel> */}

        <div className="list">
          {link.map((item, index) => {
            return (
              <a href={item.url} target="_blank" rel="noopener noreferrer" key={index}>
                <img src={item.icon} />
              </a>
            )
          })}
        </div>
      </div>
    </FirstPage>
  )
}

export default memo(HomePageBanner)
