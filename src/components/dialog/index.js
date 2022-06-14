import React from 'react'
import ReactDOM from 'react-dom'
import Dialog from './dialog'

function createDialog() {
  let dialogParent = document.getElementById('dialog')
  const dialog = ReactDOM.render(<Dialog />, dialogParent)

  return {
    showDialog(params) {
      return dialog.showDialog(params)
    },
    destroy() {
      ReactDOM.unmountComponentAtNode(div)
      document.body.removeChild(div)
    }
  }
}

let dialog
const create = (content, onClose) => {
  if (!dialog) dialog = createDialog()
  return dialog.showDialog({ content, onClose })
}

export default {
  createAndShowDialog(content, onClose) {
    return create(content, onClose)
  }
}
