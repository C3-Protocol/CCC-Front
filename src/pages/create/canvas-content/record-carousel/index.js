import React, { useEffect, useRef, useState, useImperativeHandle } from 'react'
import { RecordListWrapper, RecordListItem } from './style'
import { getMultiDrawRecord, requestCanister } from '@/api/handler'
import { getValueDivide8, formatMinuteSecond } from '@/utils/utils'
import { Progress } from 'antd'

const DrawRecordCarousel = (props) => {
  // 此处data为父组件传过来的数据，为数组格式
  const prinId = props.prinId
  const [isScrolle, setIsScrolle] = useState(true)
  const [drawRecord, setDrawRecord] = useState(null)
  // 滚动速度，值越小，滚动越快
  let getting = false
  const speed = 100
  const warper = useRef()
  const childDom1 = useRef()
  const drawRecordRef = useRef()
  drawRecordRef.current = drawRecord

  const getDrawRecord = () => {
    if (getting) {
      return
    }
    getting = true
    let data = {
      prinId: prinId,
      success: (res) => {
        getting = false
        let filter = res.filter((item) => {
          if (item.num <= 0) return false
          return true
        })
        filter.sort((left, right) => {
          return parseInt(right.updateTime) - parseInt(left.updateTime)
        })
        setDrawRecord(filter)
        console.log('getDrawRecord ')
      },
      fail: () => {
        getting = false
      },
      error: () => {
        getting = false
      }
    }
    requestCanister(getMultiDrawRecord, data, false)
  }
  useImperativeHandle(props.cRef, () => ({
    // refreshRecord 就是暴露给父组件的方法
    refreshRecord: () => {
      getDrawRecord()
    }
  }))

  // 开始滚动
  useEffect(() => {
    getDrawRecord()
    // 多拷贝一层，让它无缝滚动
    let timer
    let refreshTimer
    if (isScrolle) {
      timer = setInterval(() => {
        // 正常滚动不断给scrollTop的值+1,当滚动高度大于列表内容高度时恢复为0
        if (drawRecordRef.current && drawRecordRef.current.length) {
          if (warper.current.scrollTop >= childDom1.current.scrollHeight) warper.current.scrollTop = 0
          else {
            let temp = warper.current.scrollTop
            let step = 1
            while (temp === warper.current.scrollTop) {
              warper.current.scrollTop += step
              step++
            }
          }
          if (warper.current.scrollTop === 0) {
            getDrawRecord()
          }
        }
      }, speed)
      refreshTimer = setInterval(() => {
        if (!drawRecordRef.current || !drawRecordRef.current.length) {
          getDrawRecord()
        } else {
          clearTimeout(refreshTimer)
          refreshTimer = 0
        }
      }, 1000 * 10)
    }
    return () => {
      timer && clearTimeout(timer)
      refreshTimer && clearTimeout(refreshTimer)
    }
  }, [isScrolle])

  // 鼠标移入div时暂停滚动 鼠标移出div后继续滚动，设置boolean,true为动，false为停
  const hoverHandler = (flag) => setIsScrolle(flag)

  const getColor = (num) => {
    if (num >= 20) {
      return 'color'
    } else if (num >= 10 && num < 20) {
      return 'color1'
    } else if (num < 10) {
      return 'color2'
    }
  }

  return (
    <RecordListWrapper ref={warper}>
      <div className="child" ref={childDom1}>
        {drawRecord &&
          drawRecord.map((item, index) => (
            <RecordListItem key={index} onMouseOver={() => hoverHandler(false)} onMouseLeave={() => hoverHandler(true)}>
              <span className="item">{`${formatMinuteSecond(item.updateTime, true, true)},`}</span>
              <span className="item">{`${item.painter.toText().slice(0, 5)}* updated ${item.num}p for ${getValueDivide8(
                item.consume
              )} WICP`}</span>
              <h1 className={getColor(item.num)}>{item.memo}</h1>
            </RecordListItem>
          ))}
        {(drawRecord === null || drawRecord.length === 0) && <div>Come and join us</div>}
      </div>
      {drawRecord && (
        <div className="child">
          {drawRecord &&
            drawRecord.map((item, index) => (
              <RecordListItem
                key={index}
                onMouseOver={() => hoverHandler(false)}
                onMouseLeave={() => hoverHandler(true)}
              >
                <span className="item">{`${formatMinuteSecond(item.updateTime, true, true)},`}</span>
                <span className="item">{`${item.painter.toText().slice(0, 5)}* updated ${
                  item.num
                }p for ${getValueDivide8(item.consume)} WICP`}</span>
                <h1 className={getColor(item.num)}>{item.memo}</h1>
              </RecordListItem>
            ))}
          {(drawRecord === null || drawRecord.length === 0) && <div>Come and join us</div>}
        </div>
      )}
    </RecordListWrapper>
  )
}

export default DrawRecordCarousel
