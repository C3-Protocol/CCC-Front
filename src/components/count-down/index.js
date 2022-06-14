import React, { Component } from 'react'

export default class CountDown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
    }
    this.timer = -1
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.endTime !== prevState.endTime) {
      return {
        value: nextProps.endTime
      }
    } else {
      return null
    }
  }

  componentDidMount() {
    if (this.props.endTime > 0 && this.timer === -1) {
      this.countFun(this.props.endTime)
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.endTime !== prevProps.endTime) {
      this.timer && clearInterval(this.timer)
      this.timer = -1
      this.countFun(this.props.endTime)
    }
    if (prevProps.endTime === this.props.endTime && prevProps.endTime > 0) {
      if (this.timer === -1 || !this.timer) {
        this.countFun(this.props.endTime)
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    this.timer = -1
  }

  countFun = (time) => {
    let sys_second = time - new Date().getTime()
    if (sys_second < 1000) {
      this.timer && clearInterval(this.timer)
      this.timer = -1
      return
    }
    const startTimer = () => {
      if (sys_second > 1000) {
        sys_second -= 1000
        let day = Math.floor(sys_second / 1000 / 3600 / 24)
        let hour = Math.floor((sys_second / 1000 / 3600) % 24)
        let minute = Math.floor((sys_second / 1000 / 60) % 60)
        let second = Math.floor((sys_second / 1000) % 60)
        this.setState({
          day: day,
          hour: hour < 10 ? '0' + hour : hour,
          minute: minute < 10 ? '0' + minute : minute,
          second: second < 10 ? '0' + second : second
        })
      } else {
        clearInterval(this.timer)
        this.timer = -1
        this.props.endTimeFun && this.props.endTimeFun()
      }
      return startTimer
    }
    this.timer = setInterval(startTimer(), 1000)
  }

  render() {
    const { day, hour, minute, second } = this.state
    return (
      <>
        {day ? `${day}d:` : ''}
        {hour && hour !== '00' ? `${hour}:` : '00:'}
        {minute == '0' ? '00' : minute}:{second == '0' ? '00' : second}
      </>
    )
  }
}
