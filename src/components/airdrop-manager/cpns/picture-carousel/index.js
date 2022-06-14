import React, { useEffect, useRef, useState } from 'react'
import { PictureListWrapper, PictureListItem } from './style'

const PictureCarousel = (props) => {
  const { pictures, imgUrl, isScroll, type } = props
  const speed = 30

  const warper = useRef()
  const childDom1 = useRef()
  const [step, setStep] = useState(50)
  const stepRef = useRef()
  stepRef.current = step
  const [showPicture, setShowPicture] = useState(pictures.slice(0, 2))
  const showPictureRef = useRef()
  showPictureRef.current = showPicture
  const [isCarousel, setCarousel] = useState(true)
  const [stopPosition, setStopPosition] = useState(-1)
  const stopPositionRef = useRef()
  stopPositionRef.current = stopPosition
  const [index, setIndex] = useState(0)
  const indexRef = useRef()
  indexRef.current = index

  useEffect(() => {
    console.log('isScroll', isScroll, isCarousel)
    if (isScroll && isCarousel) {
      let timer = setInterval(() => {
        const isStop = () => {
          if (showPictureRef.current[showPictureRef.current.length - 1].startsWith('https://')) {
            if (stopPositionRef.current !== -1 && stopPositionRef.current <= warper.current.scrollTop) return true
            else return false
          }
        }
        if (warper.current.scrollTop >= childDom1.current.scrollHeight && !isStop()) {
          warper.current.scrollTop = 0
          setIndex(indexRef.current === pictures.length - 1 ? 0 : indexRef.current + 1)
        } else if (isStop()) {
          warper.current.scrollTop = stopPositionRef.current
          setCarousel(false)
        } else {
          let temp = warper.current.scrollTop
          let ts = stepRef.current
          let index = 0
          while (temp === warper.current.scrollTop) {
            if (index > 1) {
              warper.current.scrollTop = 0
              setIndex(indexRef.current === pictures.length - 1 ? 0 : indexRef.current + 1)
              break
            }
            warper.current.scrollTop += ts
            index++
          }
        }
      }, speed)
      return () => {
        timer && clearTimeout(timer)
      }
    }
  }, [isScroll, isCarousel])

  useEffect(() => {
    let pic = []
    pic.push(pictures[index])
    if (index === pictures.length - 1) {
      pic.push(pictures[0])
    } else {
      pic.push(pictures[index + 1])
    }
    setShowPicture(pic)
  }, [index])

  useEffect(() => {
    if (imgUrl) {
      let delay = 5
      let stop = index + delay
      let temp = pictures.slice(index, stop)
      let length = temp.length
      if (length < delay) {
        for (let i = 0; i < delay - length; i++) {
          temp.push(pictures[i])
        }
      }
      setStopPosition(warper.current.clientHeight * delay)
      temp.push(imgUrl)
      setStep(10)
      setShowPicture(temp)
    }
  }, [imgUrl])

  const pictureContent = () => {
    return (
      showPicture &&
      showPicture.map((item, index) => (
        <PictureListItem key={index}>
          <img src={item}></img>
        </PictureListItem>
      ))
    )
  }
  return (
    <PictureListWrapper ref={warper}>
      {!isCarousel && (
        <PictureListItem>
          <img src={showPicture[showPicture.length - 1]}></img>
        </PictureListItem>
      )}
      {isCarousel && (
        <div className="child" ref={childDom1}>
          {pictureContent()}
        </div>
      )}
      {isCarousel && (
        <PictureListItem>
          <img src={showPicture[0]}></img>
        </PictureListItem>
      )}
    </PictureListWrapper>
  )
}

export default PictureCarousel
