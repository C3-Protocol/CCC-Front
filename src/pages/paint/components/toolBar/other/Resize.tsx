import React from 'react'
import { Dialog, TextField, Button } from '@material-ui/core'
import './index.less'
import { useContext } from 'react'
import { SizeContext } from '../../../context'

const OtherOperator = () => {
  const [open, setOpen] = React.useState(false)
  const [width, setWidth] = React.useState(null)
  const [height, setHeight] = React.useState(null)
  const sizeContext = useContext(SizeContext)

  const handleResize = () => {
    setOpen(false)
    sizeContext.onSize({
      width: Number(width),
      height: Number(height)
    })
  }

  return (
    <span title="resize">
      <span
        onClick={() => {
          setOpen(true)
        }}
      >
        RESIZE
      </span>
      <Dialog
        open={open}
        aria-describedby="modal-description"
        onClose={() => setOpen(false)}
        aria-labelledby="Resize Graphic"
      >
        <div className="resize-content">
          <div className="resize-content-body">
            <TextField
              className="resize-content-input"
              value={width}
              id="outlined-basic"
              label="width (px)"
              variant="outlined"
              onChange={(e: any) => {
                setWidth(e.target.value)
              }}
            />
            <span className="x">X</span>
            <TextField
              value={height}
              onChange={(e: any) => {
                setHeight(e.target.value)
              }}
              className="resize-content-input"
              id="outlined-basic"
              label="height (px)"
              variant="outlined"
            />
          </div>

          <div className="resize-content-footer">
            <Button
              color="primary"
              variant="outlined"
              className="resize-content-celBtn"
              autoFocus
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button color="primary" variant="outlined" className="resize-content-okBtn" onClick={handleResize}>
              Resize
            </Button>
          </div>
        </div>
      </Dialog>
    </span>
  )
}

export default OtherOperator
