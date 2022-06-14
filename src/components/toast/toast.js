import React, { Component } from 'react'
import { ToastWrapper, ToastBoxWrapper, ToastIconWrapper, ToastTextWrapper } from './style'
import Success from '@/assets/images/toast/success.png'
import Fail from '@/assets/images/toast/fail.png'
import Loading from '@/assets/images/toast/loading.gif'
import Info from '@/assets/images/toast/loading.gif'

export const icons = {
  info: Info,
  success: Success,
  error: Fail,
  loading: Loading
}
export const colors = {
  info: '#000000',
  success: '#38B16A',
  error: '#B30D0D',
  loading: '#000000'
}

class ToastBox extends Component {
  constructor() {
    super()
    this.transitionTime = 300
    this.state = { notices: [] }
    this.removeNotice = this.removeNotice.bind(this)
  }

  getNoticeKey() {
    const { notices } = this.state
    return `notice-${new Date().getTime()}-${notices.length}`
  }

  addNotice(notice) {
    const { notices } = this.state
    notice.key = this.getNoticeKey()
    let body = document.getElementsByTagName('body')[0]
    body.classList.add('overflow-hidden')
    notices[0] = notice //仅展示最后一个提示
    let timer
    if (notice.type === 'loading') {
      timer = setInterval(() => {
        if (this.state.count === undefined || this.state.count === 3) {
          this.setState({ count: 0 })
        } else {
          this.setState({ count: this.state.count + 1 })
        }
      }, 400)
    }
    this.setState({ notices })
    if (notice.duration > 0) {
      setTimeout(() => {
        timer && clearInterval(timer)
        this.removeNotice(notice.key)
      }, notice.duration)
    }

    return () => {
      timer && clearInterval(timer)
      this.removeNotice(notice.key)
    }
  }

  removeNotice(key) {
    const { notices } = this.state
    let body = document.getElementsByTagName('body')[0]
    body.classList.remove('overflow-hidden')
    this.setState({
      notices: notices.filter((notice) => {
        if (notice.key === key) {
          if (notice.onClose) setTimeout(notice.onClose, this.transitionTime)
          return false
        }
        return true
      })
    })
  }

  componentDidMount() {
    this.preloadImg(Object.keys(icons))
  }

  // 预加载图片
  preloadImg = (srcArr) => {
    if (srcArr instanceof Array) {
      for (let i = 0; i < srcArr.length; i++) {
        let oImg = new Image()
        const url = `${icons[srcArr[i]]}`
        oImg.src = url
      }
    }
  }

  render() {
    const { notices } = this.state
    return (
      <ToastWrapper>
        {notices.map((notice) => (
          <div className="toast_bg" key={notice.key}>
            <ToastBoxWrapper key={notice.key}>
              <ToastIconWrapper>
                <img
                  rel="dns-prefetch"
                  src={icons[notice.type]}
                  style={{
                    background: `url(${icons[notice.type]}) no-repeat -90% -90%`
                  }}
                ></img>
              </ToastIconWrapper>
              <ToastTextWrapper textColor={colors[notice.type]} count={this.state.count}>
                {notice.content}
                {notice.type === 'loading' && <div className="pot1">.</div>}
                {notice.type === 'loading' && <div className="pot2">.</div>}
                {notice.type === 'loading' && <div className="pot3">.</div>}
              </ToastTextWrapper>
            </ToastBoxWrapper>
          </div>
        ))}
      </ToastWrapper>
    )
  }
}

export default ToastBox
