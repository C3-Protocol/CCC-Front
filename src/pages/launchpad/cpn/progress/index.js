import React, { Component } from 'react'
import './style.less'

export default class Progress extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let percent = (this.props.percentageNum * 100) / this.props.allNum
    return (
      <div className="mint-progress">
        <div className="progress-bg">
          <div className="progress-value" style={{ right: `calc(${100 - percent}% + 3px)` }}></div>
          {/* <div
            className="tip-value"
            style={{ right: `calc(${100 - percent}% + 10px)`, color: percent < 5 ? '#fff' : '#000' }}
          >
            {this.props.percentageNum}
          </div> */}
        </div>
        <div className="progress-text">{`${this.props.percentageNum}/${this.props.allNum}`}</div>
      </div>
    )
  }
}
