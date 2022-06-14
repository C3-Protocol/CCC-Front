import React, { useEffect, useState, Suspense, lazy } from 'react'
import Auth from '@/components/auth'
import { isCollapsed } from '@/utils/utils'
import Menu from '@/assets/images/menu.svg'
import Close from '@/assets/images/close.svg'
import './style.less'
import CanvasFinish from '../../canvas-finish'

const AuthPage = lazy(() => import('@/components/auth-page'))

export default React.memo((props: any) => {
  const [authPageShow, setAuthPageShow] = useState(false)

  useEffect(() => {
  }, [])

  return (
    <div className="canvas-right-header">
       <div className="auth">
          {isCollapsed() && (
            <div
              onClick={() => {
                setAuthPageShow(!authPageShow)
                props.updateContent(!authPageShow)
              }}
            >
              {authPageShow ? <img src={Close} /> : <img src={Menu} />}
            </div>
          )}
          <CanvasFinish  {...props} />
          <Auth zIndex={105}/>
       </div>
      {authPageShow && (
        <div className="authPage">
          <Suspense fallback={<div />}>
            <AuthPage
              onMenuItemSelect={() => {
                setAuthPageShow(false)
                props.updateContent(false)
              }}
            />
          </Suspense>
        </div>
      )}
    </div>
  )
})
