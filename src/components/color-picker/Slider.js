import React from 'react'
import cx from 'classnames'
import DraggableMixin from './DraggableMixin'

class Slider extends DraggableMixin {
  constructor(props) {
    super(props)
  }

  updatePosition(rect, clientX, clientY) {
    let value

    if (this.props.vertical) {
      value = (rect.bottom - clientY) / rect.height
    } else {
      value = (clientX - rect.left) / rect.width
    }

    this.props.onChange(this.getScaledValue(value))
  }

  getCss() {
    const attr = this.props.vertical ? 'bottom' : 'left'

    return {
      [attr]: this.getPercentageValue(this.props.value)
    }
  }

  render() {
    const background = this.props.background
    return (
      <div className="slider" onMouseDown={this.startUpdates.bind(this)} onTouchStart={this.startUpdates.bind(this)}>
        <div className="track" style={{ background }} />
        <div className="pointer" style={this.getCss()} />
      </div>
    )
  }
}

export default Slider
