import React, { memo, useState, useEffect } from 'react'
import PubSub from 'pubsub-js'
import { CloseDialog, UpdateStakeZombie } from '@/message'
import { requestCanister } from '@/api/handler'
import { stakingZombie, unStakingZombie } from '@/api/zombieHandler'
import { ChangeStakeWrapper } from './style'
import ZombieNFTCover from '../zombie-item'
import EmptyImage from '@/assets/images/wallet/empty.png'
import ConfirmModal from '@/components/confirm-modal'
import Toast from '@/components/toast'
import { Menu, Button, Empty, message, Checkbox } from 'antd'
import { getIndexPrefix } from '@/utils/utils'
import { M1155Create } from '@/constants'
import { findIndex, remove, filter } from 'lodash-es'
import { STAKE_NFT_ID } from 'canister/local/id.js'

export default memo(function ChangeStake(props) {
  const StatusTypes = ['toStake', 'cancel']
  const operationType = props.stakeType // 'cancel or toStake'
  const staked = props.staked
  const type = props.type
  const allAvailableNFT = props.available || []
  const [selected, setSelected] = useState([])
  const [confrimVisible, setConfirmVisible] = useState(false)
  const isToStake = operationType === StatusTypes[0]

  const multi1155Undone = props.multi || []
  const [selectedMulti, setSelectedMulti] = useState(0)
  const [cancelList, setCancelList] = useState([])

  const { title } = props

  const handlerClose = () => {
    PubSub.publish(CloseDialog, {})
  }

  const onItemClick = (info, type) => {
    let tokenIndex = info.tokenIndex
    let index = findIndex(selected, (item) => {
      return item == tokenIndex
    })
    if (index === -1) {
      setSelected([...selected, ...[tokenIndex]])
    } else {
      remove(selected, (item) => {
        return item == tokenIndex
      })
      setSelected([...selected])
    }
  }
  const isSelected = (tokenIndex) => {
    let index = findIndex(selected, (item) => {
      return item == tokenIndex
    })
    return index !== -1
  }

  const handlerConfirm = () => {
    if (!selected || !selected.length) {
      message.error('Please select zombie')
      return
    }
    setConfirmVisible(true)
  }

  const stakeConfirm = () => {
    if ((!type && !multi1155Undone.length) || !multi1155Undone) {
      message.error('Please create multi canvas')
      return
    }
    let tip
    let func
    if (isToStake) {
      tip = 'staking'
      func = stakingZombie
    } else {
      tip = 'cancel staking'
      func = unStakingZombie
    }
    let notice = Toast.loading(tip, 0)
    notice: notice

    let data = {
      type,
      tokenIndex: selected,
      prinId: type === 'gang' ? allAvailableNFT[selectedMulti]?.prinId : multi1155Undone[selectedMulti]?.prinId,
      notice: notice,
      success: (response) => {
        if (response && response.ok) {
          PubSub.publish(CloseDialog, {})
          PubSub.publish(UpdateStakeZombie, { type })
        }
      },
      fail: (error) => {
        message.error(error)
      }
      // notice: notice
    }
    requestCanister(func, data)
  }

  useEffect(() => {
    if (!isToStake) {
      onChangeTab(selectedMulti)
    }
    return () => {}
  }, [])

  const onChangeTab = (key) => {
    setSelectedMulti(parseInt(key))
    if (!isToStake) {
      let list = filter(staked, (item) => {
        if (item.multi == multi1155Undone[selectedMulti]?.tokenIndex) return true
      })
      setCancelList(list)
    }
  }

  const onChangeSelected = (e) => {
    if (e.target.checked) {
      if (isToStake) {
        let indexs = []
        for (let item of allAvailableNFT) {
          indexs.push(item[0])
        }
        setSelected(indexs)
      } else {
        let res = []
        for (let item of cancelList) {
          res.push(item.zombie[0])
        }
        setSelected(res)
      }
    } else {
      setSelected([])
    }
  }
  const allCanvas = (
    <Menu
      onClick={(e) => {
        onChangeTab(e.key)
      }}
    >
      {multi1155Undone.map((item, index) => {
        return <Menu.Item key={index}>{`${getIndexPrefix(M1155Create, item.tokenIndex)}`}</Menu.Item>
      })}
    </Menu>
  )
  const getToStakeContent = () => {
    let list = allAvailableNFT
    if (list) {
      let pageList = list
      let content =
        pageList && pageList.length > 0 ? (
          pageList.map((item) => {
            return (
              <ZombieNFTCover
                key={item[0]}
                type={type}
                tokenIndex={parseInt(item[0])}
                prinId={item[1]}
                onItemClick={onItemClick}
                isSelected={isSelected(parseInt(item[0]))}
              />
            )
          })
        ) : (
          <Empty
            image={<img src={EmptyImage} />}
            imageStyle={{
              marginTop: '50px',
              height: 100
            }}
            style={{ margin: '0 auto' }}
            description={
              <span style={{ color: '#4338CA' }}>
                {'No owned...'}
                <a href={'#/marketplace'} onClick={handlerClose}>
                  {'Buy now'}
                </a>
              </span>
            }
          ></Empty>
        )
      return content
    }
  }

  const getCancelContent = () => {
    let list = cancelList
    if (list) {
      let pageList = list
      let content = pageList.map((item) => {
        return (
          <ZombieNFTCover
            key={item.zombie[0]}
            type={type}
            tokenIndex={parseInt(item.zombie[0])}
            reward={item.zombie[1]}
            onItemClick={onItemClick}
            isSelected={isSelected(parseInt(item.zombie[0]))}
          />
        )
      })
      return content
    }
  }

  const getCurPageContent = () => {
    if (isToStake) {
      return getToStakeContent()
    } else {
      return getCancelContent()
    }
  }

  return (
    <ChangeStakeWrapper>
      <div className="title">{title}</div>
      {/* <div className="title-000">{isToStake ? 'Stake Crazy Zombie' : 'Cancel Stake Crazy Zombie'}</div>
      <div className="tip-666">
        （The staking time must be greater than 24 hours, there is no benefit to taking it out before the end of the
        canvas）
      </div> */}
      <div className="subTitle">
        {/* <div className="subs">
          <div className="tip-000">{isToStake ? 'Staked Canvas' : 'Cancel Staked Canvas'}</div>
          <Dropdown overlay={allCanvas} trigger="click">
            <Button>
              {multi1155Undone.length > 0
                ? `${getIndexPrefix(M1155Create, multi1155Undone[selectedMulti].tokenIndex)}`
                : ''}
              <DownOutlined />
            </Button>
          </Dropdown>
        </div> */}
        <a
          className="about"
          target="_blank"
          href="https://medium.com/@dfinitygangs/dfinitygangs-staking-summary-319bff75a254"
        >
          About Staking
        </a>
        <div className="subs">
          <div className="tip-000 available">{`Available：${allAvailableNFT.length}`}</div>
          <Checkbox
            onChange={onChangeSelected}
            className="stake-check"
            checked={isToStake ? selected.length === allAvailableNFT.length : selected.length === cancelList.length}
          >
            <div className="tip-000">{isToStake ? `Select All` : 'Cancel All'}</div>
          </Checkbox>
        </div>
      </div>
      <div className="nft-list">{getCurPageContent()}</div>
      <div className="footer-stake">
        <div>{isToStake ? 'Lock time: minimum 7' : 'Redemption Period：24'}</div>
        <div style={{ textAlign: 'right', width: '100%' }}>{`Selected：${selected.length}`}</div>
      </div>
      <div className="button-layout">
        <Button type="white-gray" onClick={handlerClose} className="ccc-cancel-btn">
          Cancel
        </Button>
        <Button type="violet" onClick={handlerConfirm} className="ccc-confirm-btn" disabled={selected.length === 0}>
          Confirm
        </Button>
      </div>
      <ConfirmModal
        style={{
          background: 'rgba(0, 0, 0, 0.8)'
        }}
        title={<span className="stake-title"> {isToStake ? 'Stake' : 'Cancel Stake'}</span>}
        width={454}
        wrapClassName={'wallet-modal'}
        onModalClose={() => {
          setConfirmVisible(false)
        }}
        onModalConfirm={stakeConfirm}
        modalVisible={confrimVisible}
      >
        <>
          <div className="tips">
            {isToStake ? (
              <>
                <div>Are you sure to put {selected.length} Nfts?</div>
                <div> Lock time: minimum 7 staking days</div>
              </>
            ) : (
              `Are you sure you want to cancel the Staked, canceling the Staked will affect your income`
            )}
          </div>
        </>
      </ConfirmModal>
    </ChangeStakeWrapper>
  )
})
