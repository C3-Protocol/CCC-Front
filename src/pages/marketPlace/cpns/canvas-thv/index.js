import React, { memo, useRef, useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { getCanvasWidth, AloneCreate } from '@/constants'
import PixelThumb from '@/components/pixel-thumb'
import PlayIcon from '@/assets/images/market/m1155/play.svg'
import { PixelContent, ThumbsList } from '../../nft-detail/1155-detail/style'
import CanvasHeatMap from '@/components/heatmap'
import VideoPlayer from '@/components/video-player'

function CanvasPictureInfo(props) {
  // canvas index
  const tokenIndex = parseInt(props.index)
  const type = props.type
  // id,cansiterid
  const canvasPrinId = props.prinId
  const CanvasWidth = getCanvasWidth(type)
  const isAlone = () => {
    return type === AloneCreate
  }
  const pixParent = useRef()
  const thumbParent = useRef()

  const [scale, setScale] = useState(1)
  const [thumbScale, setThumbScale] = useState(1)
  const allThumbTypes = ['thumb', 'heatmap', 'video']
  const [thumbType, setThumbType] = useState(allThumbTypes[0])

  const { canvasInfo } = useSelector((state) => {
    let key1 = `canvasInfo-${type}-${canvasPrinId}`
    let canvasInfo = (state.allcavans && state.allcavans.getIn([key1])) || {}
    return {
      canvasInfo: canvasInfo
    }
  }, shallowEqual)

  const addListener = () => {
    window.addEventListener('resize', onWindowResize)
    onWindowResize()
  }
  const removeListener = () => {
    window.removeEventListener('resize', onWindowResize)
  }

  const onWindowResize = () => {
    pixParent && pixParent.current && setScale(pixParent.current.clientWidth / CanvasWidth)
    thumbParent && thumbParent.current && setThumbScale((thumbParent.current.clientHeight - 4) / CanvasWidth)
  }

  useEffect(() => {
    addListener()
    onWindowResize()
    return () => {
      removeListener()
    }
  }, [])

  return (
    <PixelContent width={CanvasWidth} scale={scale} isAlone={isAlone()}>
      <div className="canvas-pixel" ref={pixParent}>
        {thumbType === allThumbTypes[0] && canvasPrinId && (
          <PixelThumb
            scale={scale / 2}
            width={CanvasWidth * 2}
            prinId={canvasPrinId}
            type={type}
            canvasInfo={canvasInfo}
          />
        )}
        {thumbType === allThumbTypes[1] && !isAlone() && (
          <div className="heatmap">
            <CanvasHeatMap
              showWidth={CanvasWidth}
              heatMapShow={thumbType === allThumbTypes[1]}
              multiple={1}
              emptyWidth={0}
              canvasInfo={canvasInfo}
              prinId={canvasPrinId}
              type={type}
            />
          </div>
        )}
        {thumbType === allThumbTypes[2] && !isAlone() && (
          <VideoPlayer src={canvasInfo ? canvasInfo.videoLink : ''} controls={true} />
        )}
      </div>
      {!isAlone() && (
        <ThumbsList ref={thumbParent} thumbScale={thumbScale}>
          {canvasPrinId && (
            <div
              className="canvas-parent"
              onClick={() => {
                setThumbType(allThumbTypes[0])
              }}
            >
              <PixelThumb scale={thumbScale} prinId={canvasPrinId} type={type} canvasInfo={canvasInfo} />
            </div>
          )}

          <div
            className="heatmap-thumb"
            onClick={() => {
              setThumbType(allThumbTypes[1])
            }}
          >
            <div className="thumb">
              <CanvasHeatMap
                showWidth={CanvasWidth}
                heatMapShow={true}
                multiple={1}
                emptyWidth={0}
                canvasInfo={canvasInfo}
                prinId={canvasPrinId}
                type={type}
                onClick={() => {
                  setThumbType(allThumbTypes[1])
                }}
              />
            </div>
          </div>

          {canvasInfo.canisterId && (
            <div
              className="canvas-parent"
              onClick={() => {
                if (canvasInfo && canvasInfo.videoLink) setThumbType(allThumbTypes[2])
                else {
                  console.log('video error ', canvasInfo)
                }
              }}
            >
              <PixelThumb scale={thumbScale} prinId={canvasPrinId} type={type} canvasInfo={canvasInfo} />
              <img src={PlayIcon}></img>
            </div>
          )}
        </ThumbsList>
      )}
    </PixelContent>
  )
}

export default memo(CanvasPictureInfo)
