import React, { memo, useState, useEffect, useRef } from 'react'
import { isCollapsed } from '@/utils/utils'

//todo 这里通过缩放的方式来自适应屏幕，需要修改
function GridList(props) {
  const listRef = useRef()
  const itemWidth = props.itemWidth || 258
  const gap = props.gap || 10
  const [showItemWidth, setShowItemWidth] = useState(itemWidth)
  const [windowWidth, setWindowSize] = useState(0)

  const addListener = () => {
    window.addEventListener('resize', onWindowResize)
    onWindowResize()
  }
  const removeListener = () => {
    window.removeEventListener('resize', onWindowResize)
  }

  const onWindowResize = () => {
    setWindowSize(window.innerWidth)
  }

  useEffect(() => {
    addListener()
    return () => {
      removeListener()
    }
  }, [])

  useEffect(() => {
    if (isCollapsed()) {
      let listWidth = listRef.current.clientWidth
      let col = props.colCount || 2
      let showItemWidth = Math.floor((listWidth - gap * (col - 1)) / col) - 1
      setShowItemWidth(showItemWidth)
    } else {
      let listWidth = listRef.current.clientWidth
      let col = props.showCol ? props.showCol : Math.floor(listWidth / itemWidth)
      if (col * itemWidth + col * gap - gap > listWidth) col = Math.max(col - 1, 2)
      let showItemWidth = Math.floor((listWidth - (col - 1) * gap) / col) - 1
      setShowItemWidth(showItemWidth)
    }
  }, [windowWidth, props.colCount])

  return (
    <div
      ref={listRef}
      style={{
        display: 'grid',
        width: '100%',
        gridTemplateColumns: `repeat(auto-fill, ${props.empty ? '100%' : showItemWidth + 'px'})`,
        columnGap: `${gap}px`,
        rowGap: `${gap}px`
      }}
    >
      {props.content}
    </div>
  )
}

export default memo(GridList)
