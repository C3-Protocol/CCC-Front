import React, { useEffect, lazy } from 'react'
import { useHistory } from 'react-router-dom'
import { isTestNet } from '@/constants'
import Logo from '@/assets/images/logo.svg'
import LogoC from '@/assets/images/logo-ccc.png'
import './style.less'

export default React.memo(() => {
  const history = useHistory()

  useEffect(() => {
  }, [])

  return (
    <div
      className="logo"
      onClick={() => {
        history.push('/all')
      }}
    >
      <div className="logo-detail">
        <img src={Logo} className="one" />
        <img src={LogoC} className="two" />
        <div className="three">Beta</div>
      </div>
      {isTestNet && <div className="test"> Testnets </div>}
    </div>
  )
})
