import React, { memo, useEffect, useState } from 'react'
import { StakingWrapper } from './style'
import { requestCanister } from '@/api/handler'
import { getAllUndoneCanvas } from '@/api/canvasHandler'
import { M1155Create, gangNFTCreate, ZombieNFTCreate } from '@/constants'
import { useSelector, shallowEqual } from 'react-redux'
import { getTimeStampNFT } from '@/api/zombieHandler'
import StakeNftItem from './stake-nft-item'
import './style.less'

/*
   gang or 僵尸

*/
const stakeObject = [ZombieNFTCreate, gangNFTCreate]

function Staking(props) {
  let mount = true
  const [multi1155Undone, set1155Undone] = useState([])
  const [stakeTime, setTime] = useState([])
  const { isAuth } = useSelector((state) => {
    return {
      isAuth: state.auth && state.auth.get('isAuth')
    }
  }, shallowEqual)

  const get1155Undone = () => {
    let data = {
      type: M1155Create,
      success: async (res) => {
        mount && set1155Undone(res)
        console.log('get1155Undone res', res)
      }
    }
    requestCanister(getAllUndoneCanvas, data, false)
  }

  useEffect(() => {
    if (isAuth) {
      get1155Undone()
      let data = {
        type: 'gang',
        success: async (res) => {
          setTime(res)
        },
        fail: (error) => {
          message.error(error.StakingNotOpen)
        }
      }
      requestCanister(getTimeStampNFT, data)
    }
  }, [isAuth])

  return (
    <StakingWrapper>
      <div className="stakeList">
        <div className="stakeList-ul">
          {['Collection', 'Available', 'Staked', 'Pending Reward', ''].map((va) => {
            return <div className="box">{va}</div>
          })}
        </div>
        <hr style={{ border: '0.5px solid #EDEEF0', margin: '0px 60px' }} />
        <div className="stake-content">
          {stakeObject.map((item, index) => {
            return (
              <StakeNftItem type={item} time={stakeTime} key={index} index={index} multi1155Undone={multi1155Undone} />
            )
          })}
        </div>
      </div>
    </StakingWrapper>
  )
}
export default memo(Staking)
