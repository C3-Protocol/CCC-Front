import React, { Component } from 'react'
import { DialogWrapper } from './style'
import { CloseDialog } from '@/message'
import PubSub from 'pubsub-js'
import { Provider } from 'react-redux'
import store from '../../store'

class DialogBox extends Component {
  constructor(props) {
    super(props)
    this.transitionTime = 300
    this.state = { key: null, dialog: null, content: null }
    this.removeDialog = this.removeDialog.bind(this)
    this.removeUpdate = PubSub.subscribe(CloseDialog, this.removeDialog.bind(this))
  }

  getDialogKey() {
    return `dialog-${new Date().getTime()}-${1}`
  }

  handleBack() {
    this.removeDialog()
  }

  componentDidMount() {
    // 监听浏览器点击返回
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.handleBack.bind(this), false)
    }
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.removeUpdate)
    window.removeEventListener('popstate', this.handleBack.bind(this), false)
  }

  showDialog(prams) {
    let body = document.getElementsByTagName('body')[0]
    body.classList.add('overflow-hidden')
    let key = this.getDialogKey()
    const { dialog, content } = prams
    this.setState({ key, dialog, content })
    return () => {
      this.removeDialog()
    }
  }

  removeDialog() {
    let body = document.getElementsByTagName('body')[0]
    body.classList.remove('overflow-hidden')
    this.setState({
      dialog: null,
      key: null,
      content: null
    })
  }

  render() {
    return (
      <Provider store={store}>
        {this.state.key ? <DialogWrapper key={this.state.key}>{this.state.content}</DialogWrapper> : <></>}
      </Provider>
    )
  }
}

export default DialogBox
