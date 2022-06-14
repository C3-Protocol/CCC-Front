import React, { useEffect, useRef, useState } from 'react'
import Videojs from 'video.js/dist/video.min.js'
import 'video.js/dist/video-js.css'
import './style.css'

export default React.memo(function VideoPlayer(props) {
  const [videoId] = useState('custom-video' + +new Date())
  const videoRef = useRef()

  useEffect(() => {
    const { src, controls } = props
    let player = initVideo(src, controls)
    return () => {
      player && player.dispose()
    }
  }, [])

  useEffect(() => {
    if (videoRef && videoRef.current && props.src) {
      videoRef.current.src = props.src
      videoRef.current.load() // 1. 先load
      const playPromise = videoRef.current.play() // 2.再play
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            videoRef?.current?.play()
          })
          .catch(() => {
            videoRef?.current?.pause()
          })
      }
    }
  }, [props.src])

  const initVideo = (src, controls) => {
    const player = Videojs(
      videoId,
      {
        controls: controls || false,
        preload: 'auto',
        loop: true,
        fluid: false
      },
      function onPlayerReady() {
        this.load()
        let promise = this.play()
        if (promise !== undefined) {
          promise.then((res) => {}).catch((error) => {})
        }
      }
    )
    return player
  }

  return (
    <div className="custom-video-warpper">
      <video id={videoId} className="video-js vjs-big-play-centered" autoPlay={true} ref={videoRef}>
        <source src={props.src} type="video/mp4" />
      </video>
    </div>
  )
})
