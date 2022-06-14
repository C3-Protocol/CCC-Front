import React, { memo, useRef, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import CanvasHeaderLeft from './canvas-header/header-left'
import CanvasHeaderRight from './canvas-header/header-right'
import { requestWICPBalance } from '@/components/auth/store/actions'
import './style.less'
import { CCCPaint } from 'ccc-react-paint'
function CanvasContent(props) {
  const { createType, param1, param2, param3 } = props.match.params
  const isFork = createType === 'fork'
  const [params] = useState(
    isFork
      ? {
          type: param1,
          forkIndex: param2,
          originImage: decodeURIComponent(param3)
        }
      : { width: param1, height: param2, background: decodeURIComponent(param3) }
  )
  const dispatch = useDispatch()
  const paint = useRef()

  const { authToken } = useSelector((state) => {
    let isAuth = state['auth'].getIn(['isAuth']) || false
    let authToken = state['auth'].getIn(['authToken']) || ''
    let wicpBalance = (state['auth'] && state['auth'].getIn(['wicpBalance'])) || 0
    return {
      isAuth: isAuth,
      authToken: authToken,
      wicpBalance
    }
  }, shallowEqual)

  useEffect(() => {
    dispatch(requestWICPBalance(authToken))
  }, [authToken])

  const getCanvasImageData = () => {
    return paint.current.getCurrentImageData()
  }

  const defaultWrapperContent = (
    <div className="content-detail">
      <div className="paint-wrapper">
        <CCCPaint
          width={params.width}
          height={params.height}
          background={params.background}
          id="ccc-id"
          imgSrc={params.originImage}
          cRef={paint}
        />
      </div>
      <CanvasHeaderLeft />
      <CanvasHeaderRight getCanvasImageData={getCanvasImageData} {...params} />
    </div>
  )

  const mainContent = <div className="canvas-content-wrapper">{defaultWrapperContent}</div>

  return mainContent
}

export default memo(CanvasContent)
