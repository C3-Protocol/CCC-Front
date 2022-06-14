import React, { useState, useEffect, useRef } from 'react'
import { isAuthTokenEffect } from '@/utils/utils'
import { shallowEqual, useSelector } from 'react-redux'
import Dialog from '@/components/dialog'
import AirdropTiger from '@/components/airdrop-manager/airdrop-tiger'
import Airdrop from '@/components/airdrop-manager/airdrop-claim'
import AirdropCommon from '@/components/airdrop-manager/airdrop-common'
import { requestCanister } from '@/api/handler'
import PubSub from 'pubsub-js'
import { DropComplete, ShowAuthDrawer } from '@/message'
import { queryAirDropRemain } from '@/api/mintHandler'
import { ZombieNFTCreate } from '@/constants'
import { Button } from 'antd'

const AirDropButton = (props) => {
  let mount = true
  const [dropCount, setDropCount] = useState(0)
  const dropType = props.type
  const dropCountRef = useRef()
  dropCountRef.current = dropCount
  const { isAuth, authToken } = useSelector((state) => {
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      authToken: state.auth.getIn(['authToken']) || ''
    }
  }, shallowEqual)

  const showDropLayout = () => {
    if (dropCount <= 0) {
      return
    }
    Dialog.createAndShowDialog(
      dropType === ZombieNFTCreate ? (
        <Airdrop type={dropType} />
      ) : dropType === 'gang' ? (
        <AirdropTiger type={dropType} />
      ) : (
        <AirdropCommon type={dropType} />
      ),
      0
    )
  }

  const onDropComplete = (topic, info) => {
    if (info.type === dropType) {
      console.log('dropCount', dropCountRef.current, dropType)
      mount && setDropCount(dropCountRef.current - 1)
    }
  }

  useEffect(async () => {
    const queryDrop = PubSub.subscribe(DropComplete, onDropComplete)
    return () => {
      PubSub.unsubscribe(queryDrop)
      mount = false
    }
  }, [])

  const queryAirDropStatus = () => {
    requestCanister(
      queryAirDropRemain,
      {
        type: dropType,
        success: (res) => {
          if (mount)
            if (res > 0) {
              setDropCount(parseInt(res))
            }
        }
      },
      true
    )
  }
  useEffect(async () => {
    if (isAuthTokenEffect(isAuth, authToken)) {
      queryAirDropStatus()
    }
    return () => {
      mount = false
    }
  }, [authToken, isAuth])

  const onClickAuth = () => {
    PubSub.publish(ShowAuthDrawer, {})
  }

  return isAuth ? (
    dropCount > 0 ? (
      <Button type="white-black" className="btn-normal" onClick={showDropLayout}>{`Claim(${dropCount})`}</Button>
    ) : (
      <></>
    )
  ) : (
    <Button type="white-black" className="btn-normal" onClick={onClickAuth}>
      Connect your wallet
    </Button>
  )
}

export default AirDropButton
