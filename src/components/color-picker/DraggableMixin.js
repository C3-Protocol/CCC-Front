import React from 'react'
import ReactDOM from 'react-dom'

const getDocument = (element) => element.ownerDocument

export default class DraggableMixin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      active: false
    }
  }

  componentDidMount() {
    this.document = getDocument(ReactDOM.findDOMNode(this))
    this.rect = this.getBoundingRect()
  }

  componentWillUnmount() {
    this.stopUpdates()
    this.setState = () => false
  }

  startUpdates(e) {
    const { document } = this

    document.addEventListener('mousemove', this.handleUpdate.bind(this))
    document.addEventListener('touchmove', this.handleUpdate.bind(this))
    document.addEventListener('mouseup', this.stopUpdates.bind(this))
    document.addEventListener('touchend', this.stopUpdates.bind(this))

    e.preventDefault()
    const { x, y } = this.getPosition(e)

    this.rect = this.getBoundingRect()
    this.setState({ active: true })
    this.updatePosition(this.rect, x, y)
  }

  handleUpdate(e) {
    if (this.state.active) {
      e.preventDefault()
      const { x, y } = this.getPosition(e)
      this.updatePosition(this.rect, x, y)
    }
  }

  stopUpdates() {
    const { document } = this

    document.removeEventListener('mousemove', this.handleUpdate.bind(this))
    document.removeEventListener('touchmove', this.handleUpdate.bind(this))
    document.removeEventListener('mouseup', this.stopUpdates.bind(this))
    document.removeEventListener('touchend', this.stopUpdates.bind(this))

    this.setState({ active: false })
  }

  getPosition(e) {
    if (e.touches) {
      e = e.touches[0]
    }

    return {
      x: e.clientX,
      y: e.clientY
    }
  }

  getPercentageValue(value) {
    return (value / this.props.max) * 100 + '%'
  }

  getScaledValue(value) {
    return Math.min(Math.max(value, 0), 1) * this.props.max
  }

  getBoundingRect() {
    return ReactDOM.findDOMNode(this).getBoundingClientRect()
  }
}
