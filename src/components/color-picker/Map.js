import React from 'react'
import cx from 'classnames'
import DraggableMixin from './DraggableMixin'
import { MapWrapper } from './color-picker'

class Map extends DraggableMixin {
  constructor(props) {
    super(props)
  }

  updatePosition(rect, clientX, clientY) {
    const x = (clientX - rect.left) / rect.width
    const y = (rect.bottom - clientY) / rect.height
    this.props.onChange(this.getScaledValue(x), this.getScaledValue(y))
  }

  render() {
    const backgroundColor = this.props.backgroundColor
    return (
      <MapWrapper onMouseDown={this.startUpdates.bind(this)} onTouchStart={this.startUpdates.bind(this)}>
        <div className="background" style={{ backgroundColor }} />
        <div
          className="pointer"
          style={{
            left: this.getPercentageValue(this.props.x),
            bottom: this.getPercentageValue(this.props.y)
          }}
        />
      </MapWrapper>
    )
  }
}
export default Map
