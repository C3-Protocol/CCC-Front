import React, { useState, useEffect, useRef } from 'react'
import { isAuthTokenEffect } from '@/utils/utils'
import { shallowEqual, useSelector } from 'react-redux'
import Dialog from '@/components/dialog'
import AirdropTiger from '@/components/airdrop-manager/airdrop-tiger'
import Airdrop from '@/components/airdrop-manager/airdrop-claim'
import AirdropCommon from '@/components/airdrop-manager/airdrop-common'
import { requestCanister } from '@/api/handler'
import PubSub from 'pubsub-js'
import { DropComplete } from '@/message'
import { queryAirDropRemain } from '@/api/mintHandler'
import { ZombieNFTCreate } from '@/constants'

const AirDropManager = () => {
  let mount = true
  const [dropCount, setDropCount] = useState(0)
  const [dropType, setDropType] = useState(null)
  const dropCountRef = useRef()
  const dropTypeRef = useRef()
  dropCountRef.current = dropCount
  dropTypeRef.current = dropType
  const { isAuth, authToken, collectionsConfig } = useSelector((state) => {
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      authToken: state.auth.getIn(['authToken']) || '',
      collectionsConfig: state.auth.getIn(['collection']) || []
    }
  }, shallowEqual)
  const dropList = []
  collectionsConfig.map((item) => {
    if (item.airdrop) {
      dropList.unshift(item.key)
    }
  })

  const showDropLayout = (count, type) => {
    setDropCount(count - 1)
    setDropType(type)
    Dialog.createAndShowDialog(
      type === ZombieNFTCreate ? (
        <Airdrop type={type} />
      ) : type === 'gang' ? (
        <AirdropTiger type={type} />
      ) : (
        <AirdropCommon type={type} />
      ),
      0
    )
  }

  const onDropComplete = (topic, info) => {
    console.log('dropCount', dropCountRef.current)
    if (dropCountRef.current > 0) showDropLayout(dropCountRef.current, dropTypeRef.current)
    else {
      let type = info.type
      let index = dropList.indexOf(type)
      queryAirDropStatus(index + 1)
    }
  }

  useEffect(async () => {
    const queryDrop = PubSub.subscribe(DropComplete, onDropComplete)
    return () => {
      PubSub.unsubscribe(queryDrop)
      mount = false
    }
  }, [])

  const queryAirDropStatus = (index = 0) => {
    if (!dropList.length || index >= dropList.length || index < 0) return

    requestCanister(
      queryAirDropRemain,
      {
        type: dropList[index],
        success: (res) => {
          if (mount)
            if (res > 0) {
              showDropLayout(parseInt(res), dropList[index])
            } else {
              queryAirDropStatus(index + 1)
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
  }, [authToken, isAuth])

  return <></>
}

export default AirDropManager
