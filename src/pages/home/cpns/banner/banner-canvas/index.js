import React, { memo, useEffect, useState, useRef } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { FirstPage, BannerContentAvailableWrapper } from './style'
import { M1155Create, getCanvasWidth } from '@/constants'
import Link02 from '@/assets/images/footer/app_ico_02_dark.png'
import Link05 from '@/assets/images/footer/app_ico_05_dark.png'
import CanvasBannerBg from './canvas-bg'
import PixelThumb from '@/components/pixel-thumb'
import { getValueDivide8, getIndexPrefix } from '@/utils/utils'
import CountDown from '@/components/count-down'
import { getCanvasInfoById } from '@/pages/home/store/actions'
import BigNumber from 'bignumber.js'
import { Button } from 'antd'
import { useHistory } from 'react-router-dom'
import { is1155Canvas } from '@/utils/utils'
import BannnerBg from '@/assets/images/home/canvas_banner.webp'

function HomePageBanner(props) {
  const history = useHistory()
  const [link] = useState([
    { icon: Link02, url: 'https://twitter.com/CCCProtocol' },
    { icon: Link05, url: 'https://discord.gg/jgyp6prPuj' }
  ])
  const pixParent = useRef()
  const type = M1155Create
  const [scale, setScale] = useState(1)
  const CanvasWidth = getCanvasWidth(type)
  const dispatch = useDispatch()
  const bannerHeight = props.bannerHeight
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

  const { canvasInfo } = useSelector((state) => {
    let key1 = `canvasInfo-${type}-${prinId}`
    let canvasInfo = (state.allcavans && state.allcavans.getIn([key1])) || {}

    return {
      canvasInfo: canvasInfo
    }
  }, shallowEqual)

  // other hooks
  useEffect(() => {
    //获取画布的相关信息：name、desc等
    if (prinId) {
      dispatch(getCanvasInfoById(type, prinId))
    }
    //事件信息绑定
  }, [dispatch, prinId])

  const addListener = () => {
    window.addEventListener('resize', onWindowResize)
    onWindowResize()
  }
  const removeListener = () => {
    window.removeEventListener('resize', onWindowResize)
  }

  const onWindowResize = () => {
    pixParent && pixParent.current && setScale(pixParent.current.clientWidth / CanvasWidth)
  }

  useEffect(() => {
    addListener()
    onWindowResize()

    return () => {
      removeListener()
    }
  }, [dispatch])

  useEffect(() => {
    onWindowResize()
  }, [pixParent.current])

  const handlerOnItemClick = () => {
    if (!prinId) return
    if (canvasInfo.isNFTOver) {
      if (is1155Canvas(type)) {
        history.push(`/1155/${type}/${tokenIndex}/${prinId}`)
      } else {
        history.push(`/detail/${type}/${tokenIndex}/${prinId}`)
      }
    } else {
      history.push(`/canvas/${type}/${prinId}`)
    }
  }
  const getEndTime = () => {
    let endTime = parseInt(new BigNumber(parseInt(canvasInfo.finshTime || 0)).dividedBy(Math.pow(10, 6)))
    return endTime
  }

  const endTimeFun = () => {}
  return (
    <FirstPage>
      {prinId && (
        <div className="content-bg" style={{ height: `${bannerHeight}px` }}>
          <CanvasBannerBg width={window.innerWidth} prinId={prinId} type={type} bannerHeight={bannerHeight} />
          {/* <div className="canvas-bg" style={{ height: `${bannerHeight}px` }} /> */}
          <img className="canvas-bg" style={{ objectFit: 'cover', height: `${bannerHeight}px` }} src={BannnerBg}></img>
          <BannerContentAvailableWrapper height={bannerHeight}>
            <div className="info-right">
              <div className="canvas-index">
                <span>{`${getIndexPrefix(type, tokenIndex)}`}</span>
                <span>
                  <CountDown endTime={getEndTime()} endTimeFun={endTimeFun} />
                </span>
              </div>
              <div className="ui-content">
                <ul>
                  <h4>
                    <label>Total invested:</label>
                    {`${getValueDivide8(canvasInfo.totalWorth)} WICP`}
                  </h4>
                  {canvasInfo.bonus !== undefined && (
                    <h4>
                      <label>Bonus to vest:</label>
                      {`${getValueDivide8(canvasInfo.bonus)} WICP`}
                    </h4>
                  )}

                  <h4>
                    <label>Number of Updated Pixels:</label>
                    {`${canvasInfo.changeTotal}`}
                  </h4>

                  <h4>
                    <label>Number of Players:</label>
                    {`${canvasInfo.paintersNum}`}
                  </h4>

                  <h4>
                    <label>All staked:</label>
                    {`${canvasInfo.allStaked}`}
                  </h4>
                </ul>
              </div>

              <div>
                <Button type="violet" className="btn-normal" onClick={handlerOnItemClick}>
                  Draw
                </Button>
              </div>
            </div>
            <div className="pixel-wrapper" ref={pixParent}>
              {prinId && <PixelThumb scale={scale} prinId={prinId} type={type} canvasInfo={canvasInfo} canvas={true} />}
            </div>
          </BannerContentAvailableWrapper>

          {/* <div className="list">
            {link.map((item, index) => {
              return (
                <a href={item.url} target="_blank" rel="noopener noreferrer" key={index}>
                  <img src={item.icon} />
                </a>
              )
            })}
          </div> */}
        </div>
      )}
    </FirstPage>
  )
}

export default memo(HomePageBanner)
