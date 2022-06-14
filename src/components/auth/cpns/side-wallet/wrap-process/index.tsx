import React, { useEffect, useState } from 'react'
import './style.less'
import {LedgerTransfer, MintWicp, Success,Depositing } from '@/icons'
import RightArrow from '@/assets/images/icon/right_arrow.svg'
import PubSub from 'pubsub-js'
import { WrapStateChange, CloseDialog } from '@/message'

export default React.memo(() => {
  const [state, setState]= useState(0) 
  const processInfo = [{icon: LedgerTransfer, info: 'Ledger Transfer ICP'},{icon: MintWicp, info: 'Minting WICP'},{icon: Success, info: 'Approving WICP'},{icon: Depositing, info: 'Depositing WICP'}]
  
  const onWrapStateChange = (_topic, info) => {
     if (info.state) setState(info.state)
  }
  useEffect(()=>{
    if (state >= processInfo.length - 1){
      setTimeout(() => {
        PubSub.publish(CloseDialog, {})
      }, 1000);
    }
  },[state])
  useEffect(()=>{
    const changeState = PubSub.subscribe(WrapStateChange, onWrapStateChange)
    return () => {
      PubSub.unsubscribe(changeState)
    }
  },[])

  return (
    <div className="icp-wrap-content-wrapper">
      <div className="title title-000"> ICP warpping in progress </div>
      <div className='wrap-tip margin-20'>Please wait some time for transactions to finish</div>
      <div className='wrap-process-layout margin-40'>
      {processInfo.map((item, index) => {
            return (
                <div key={index} className='wrap-process-item'>
                    <div className={index <= state ? 'processed': 'waiting'}>
                        <div className='icon-bg'>
                          <div className='content'>{item.icon}</div>
                        </div>
                        <div>{item.info}</div>
                    </div>
                    {index < processInfo.length - 1 && <img className='right-arrow'src={RightArrow}></img>}
                </div>
            )
          })}
      </div>
    </div>
  )
})
