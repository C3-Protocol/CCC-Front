import React, { memo, useState, useEffect } from 'react'
import './style.less'
import MintWaiting from '@/assets/images/launchpad/mint_waiting.webp'
import { Motion, spring } from 'react-motion'

export default memo(function MintWaitting(props) {
  let mount = true
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(1)
  const [transX, setTransX] = useState(1)
  const [rotate, setRotate] = useState(0)
  useEffect(() => {
    setTransX(transX * -1)
    return () => {
      mount = false
    }
  }, [count])

  const onBoxRest = () => {
    setRotate(rotate + 180)
    setCount(count + 1)
  }
  return (
    <div className="mint-waiting-wrapper">
      <Motion style={{ x: spring(transX) }} onRest={() => onBoxRest(transX)}>
        {({ x }) => {
          return (
            <div className={`mint-box`}>
              <img style={{ transform: `translateX(${x * 30}%) rotateY(${rotate}deg)` }} src={MintWaiting}></img>
            </div>
          )
        }}
      </Motion>
    </div>
  )
})
