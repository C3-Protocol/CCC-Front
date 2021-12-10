import React, { Component } from 'react'
import {ToastWrapper, ToastBoxWrapper,ToastIconWrapper, ToastTextWrapper} from './style'
import Success from '@/assets/images/toast/success.png'
import Fail from '@/assets/images/toast/fail.png'
import Loading from '@/assets/images/toast/loading.png'
import Info from '@/assets/images/toast/loading.png'

class ToastBox extends Component {
    constructor() {
        super()
        this.transitionTime = 300
        this.state = { notices: [] }
        this.removeNotice = this.removeNotice.bind(this)
        document.documentElement.style.overflow = 'hidden';
    }

    getNoticeKey() {
        const { notices } = this.state
        return `notice-${new Date().getTime()}-${notices.length}`
    }

    addNotice(notice) {
        const { notices } = this.state
        notice.key = this.getNoticeKey()

        notices[0] = notice;//仅展示最后一个提示
        
        this.setState({ notices })
        if (notice.duration > 0) {
            setTimeout(() => {
                this.removeNotice(notice.key)
            }, notice.duration)
        }
        return () => { this.removeNotice(notice.key) }
    }

    removeNotice(key) {
        const { notices } = this.state
        this.setState({
            notices: notices.filter((notice) => {
                if (notice.key === key) {
                    if (notice.onClose) setTimeout(notice.onClose, this.transitionTime)
                    return false
                }
                return true
            })
        })
        document.documentElement.style.overflow = 'scroll';
    }

    render() {
        const { notices } = this.state
        const icons = {
            info: Info,
            success: Success,
            error: Fail,
            loading: Loading
        }
        const colors = {
            info: '#000000',
            success: '#38B16A',
            error: '#B30D0D',
            loading: '#000000'
        }
        return (
            <ToastWrapper>
                {
                    notices.map(notice => (
                        <div className="toast_bg" key={notice.key}>
                            <ToastBoxWrapper key={notice.key}>
                                {/*  */}
                                <ToastIconWrapper >
                                    <img src={icons[notice.type]}></img>
                                </ToastIconWrapper> 
                                <ToastTextWrapper textColor = {colors[notice.type]}>{notice.content}</ToastTextWrapper> 
                                
                            </ToastBoxWrapper>
                        </div>
                    ))
                }
            </ToastWrapper>
        )
    }
}

export default ToastBox