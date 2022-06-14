import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import copy from 'copy-to-clipboard'
import { Typography, Tooltip, Image } from 'antd'
import CopyIcon from '@/assets/images/icon/copy.svg'
const { Text } = Typography

const CSCopy = (props) => {
  const { suffixCount, value, className, copyable } = props
  const start = value.slice(0, suffixCount).trim()
  const suffix = value.slice(-suffixCount).trim()
  let [tipStr, setTipString] = useState('Copy')

  const handleCopy = () => {
    copy(value || '')
    setTipString('Copied!')
    setTimeout(() => {
      setTipString('Copy')
    }, 3000)
  }
  useEffect(() => {
    return () => {
      setTipString = () => false
    }
  }, [])
  return !copyable ? (
    <Tooltip placement="top" title={tipStr}>
      <Text
        className={className}
        style={{ cursor: 'pointer' }}
        ellipsis={{ suffix }}
        copyable={false}
        onClick={handleCopy}
      >
        {start}...
      </Text>
    </Tooltip>
  ) : (
    <Text
      className={className}
      style={{ cursor: 'pointer' }}
      ellipsis={{ suffix }}
      copyable={{ text: value, icon: <Image src={CopyIcon} width={14} preview={false} /> }}
      onClick={handleCopy}
    >
      {start}...
    </Text>
  )
}

CSCopy.propTypes = {
  suffixCount: PropTypes.number.isRequired
}

CSCopy.defaultProps = {
  suffixCount: 6
}

export default CSCopy
