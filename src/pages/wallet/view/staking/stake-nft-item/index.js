import { Button, message, Image } from 'antd'
import React, { memo, useEffect, useState } from 'react'
import WICPPrice from '@/components/wicp-price'
import Dialog from '@/components/dialog'
import StakingContent from '../change-stake'
import { getAvailableZombieNFT } from '@/api/zombieHandler'
import { requestCanister } from '@/api/handler'
import { getMyAllStakingZombieByIndex } from '@/api/zombieHandler'
import { plusBigNumber } from '@/utils/utils'
import PubSub from 'pubsub-js'
import { LineOutlined } from '@ant-design/icons'
import { C3ProtocolUrl, ZombieNFTCreate } from '@/constants'
import { UpdateStakeZombie } from '@/message'
import { useSelector, shallowEqual } from 'react-redux'
import { find } from 'lodash-es'
import './style.less'

function StakingNFTItem(props) {
  let mount = true
  const { type, multi1155Undone, time } = props
  const [staked, setStaked] = useState([])
  const [reward, setReward] = useState(0)
  const [available, setAvailable] = useState(null)

  const { isAuth, collectionsConfig } = useSelector((state) => {
    return {
      isAuth: state.auth && state.auth.get('isAuth'),
      authToken: state.auth.getIn(['authToken']) || '',
      collectionsConfig: state.auth.getIn(['collection']) || []
    }
  }, shallowEqual)

  const itemConfig = find(collectionsConfig, { key: type })

  const onClickStaking = () => {
    if (available === null) {
      message.error('querying ...')
      return
    }
    // if (type === 'gang' && time[0] && time[0] / 1000 > new Date().getTime()) {
    //   message.error('StakingNotOpen')
    //   return
    // }
    if (type === ZombieNFTCreate) {
      if (!multi1155Undone || !multi1155Undone.length) {
        message.error('No multi canvas')
        return
      }
    }
    Dialog.createAndShowDialog(
      <StakingContent
        available={available}
        type={type}
        title={'Staking'}
        stakeType={'toStake'}
        multi={type === ZombieNFTCreate ? multi1155Undone : null}
        staked={staked}
      />,
      null
    )
  }

  const onClickCancelStaking = () => {
    if (staked.length > 0) {
      Dialog.createAndShowDialog(
        <StakingContent
          type={type}
          title={'Cancel Staking'}
          multi={type === ZombieNFTCreate ? multi1155Undone : null}
          stakeType={'cancel'}
          staked={staked}
        />,
        null
      )
    } else {
      message.error('No staking')
    }
  }

  const getStakeList = () => {
    if (type !== ZombieNFTCreate) {
      requestCanister(
        getMyAllStakingZombieByIndex,
        {
          type,
          success: (res) => {
            let stake = []
            let reward = 0
            for (let zom of res) {
              reward = plusBigNumber(reward, zom[1])
              stake.push({ zombie: zom })
            }
            mount && setStaked(stake)
            mount && setReward(reward)
          }
        },
        false
      )
    } else {
      multi1155Undone && getStakeZombie(multi1155Undone)
    }
  }

  const getStakeZombie = async (multi) => {
    if (!mount) return
    let stake = []
    let reward = 0
    let length = 0
    for (let item of multi) {
      let multi_stakes = await getMyAllStakingZombieByIndex({ prinId: item.prinId, type: item.type })
      for (let zom of multi_stakes) {
        reward = plusBigNumber(reward, zom[1])
        stake.push({ multi: item.tokenIndex, zombie: zom })
      }
      length += multi_stakes.length
    }
    mount && setStaked(stake)
    mount && setReward(reward)
  }

  const getAvaiableNFT = () => {
    requestCanister(
      getAvailableZombieNFT,
      {
        type,
        success: (res) => {
          //res
          setAvailable(res)
        }
      },
      false
    )
  }

  useEffect(() => {
    if (multi1155Undone && type === ZombieNFTCreate) getStakeZombie(multi1155Undone)
  }, [multi1155Undone])

  useEffect(() => {
    if (isAuth) {
      getAvaiableNFT()
      getStakeList()
    } else {
      if (mount) {
        setStaked([])
        setReward(0)
        setAvailable(0)
      }
    }
  }, [isAuth])

  useEffect(() => {
    const updateStakeFunc = (topic, info) => {
      if (info.type === type) {
        getAvaiableNFT()
        getStakeList()
      }
    }
    const stokeUpdate = PubSub.subscribe(UpdateStakeZombie, updateStakeFunc)
    return () => {
      PubSub.unsubscribe(stokeUpdate)
      mount = false
    }
  }, [])

  return (
    <>
      <div className="stake-item-wrapper">
        <div className="box">
          <Image width={30} preview={false} src={`${C3ProtocolUrl}/resource/${type}/avatar.png`} alt="" />
          <div className="tip-000 show">{itemConfig?.title}</div>
        </div>
        <div className="box">
          <div className="tip-000" style={{ paddingLeft: 10 }}>
            {available ? available.length : 0}
          </div>
        </div>
        <div className="box">
          <div className="value-000" style={{ paddingLeft: 10 }}>
            {staked.length}
          </div>
        </div>
        <div className="box" style={{ paddingLeft: 10 }}>
          <WICPPrice iconSize={16} value={reward} valueStyle={'value-16'} />
        </div>
        <div className="box flex">
          {staked.length > 0 && (
            <div className="minus" onClick={onClickCancelStaking}>
              <LineOutlined style={{ fontSize: 22 }} />
            </div>
          )}
          <Button
            className="stake-btn"
            style={{ borderRadius: staked.length > 0 ? '0px 10px 10px 0px' : '10px' }}
            onClick={onClickStaking}
          >
            Stake
          </Button>
        </div>
      </div>
      <hr style={{ border: '0.5px solid #EDEEF0', margin: '0px 60px' }} />
    </>
  )
}
export default memo(StakingNFTItem)
