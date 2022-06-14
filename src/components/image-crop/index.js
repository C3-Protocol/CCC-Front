/**
 * upload avator组件
 */
import * as React from 'react'
import { Upload, message, Avatar } from 'antd'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import avator from '@/assets/images/wallet/avator.png'
import ConfirmModal from '@/components/confirm-modal'
import Camera from '@/assets/images/wallet/camera.png'

class ImageCropper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      srcCropper: '',
      visible: false,
      confirmLoading: false,
      cropCanvas: props.original
    }
  }

  beforeUpload = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      // 添加文件限制
      message.error({ content: 'The file size cannot exceed 10M' })
      return false
    }
    const reader = new FileReader()
    reader.readAsDataURL(file) // read
    reader.onload = (e) => {
      this.setState({
        visible: true,
        srcCropper: e.target.result // cropper path
      })
    }
    return false
  }

  saveImg = () => {
    this.setState({
      confirmLoading: true
    })
    // Cropper instance，缩放到100的base64
    const cropper = this.cropper.cropper
    const base64 = cropper.getCroppedCanvas({ maxWidth: this.props.width, maxHeight: this.props.width }).toDataURL()
    this.setState({ cropCanvas: base64 })
    this.onCloseModal()
    const { onSuccess } = this.props
    onSuccess && onSuccess(base64)
  }

  onCloseModal = () => {
    this.setState({
      visible: false,
      confirmLoading: false
    })
  }
  componentDidUpdate(prevProps) {
    if (this.props.original !== prevProps.original) {
      this.setState({ cropCanvas: this.props.original })
    }
  }

  render() {
    const { title, aspectRatio = 1 } = this.props
    const { srcCropper, visible, confirmLoading } = this.state
    return (
      <div>
        <Upload beforeUpload={this.beforeUpload} showUploadList={false}>
          <div className="picture">
            <Avatar src={this.state.cropCanvas || avator} className="avatar"></Avatar>
            <div className="mask-inner">
              <img src={Camera} />
            </div>
          </div>
          {/* <img src={this.state.cropCanvas || avator} style={{ width: this.props.width + 'px' }}></img> */}
        </Upload>
        <ConfirmModal
          title={title}
          width={428}
          onModalClose={this.onCloseModal}
          onModalConfirm={this.saveImg}
          modalVisible={visible}
        >
          {srcCropper ? (
            <Cropper
              ref={(cropper) => {
                this.cropper = cropper
              }}
              style={{ height: 400, width: '100%' }}
              preview=".previewContainer"
              guides
              aspectRatio={aspectRatio}
              src={srcCropper}
            />
          ) : (
            ''
          )}
        </ConfirmModal>
      </div>
    )
  }
}

export default ImageCropper
