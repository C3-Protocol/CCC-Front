import React, { memo, useState, useEffect } from 'react'
import { Button, message, Spin } from 'antd'
import PubSub from 'pubsub-js'
import { ShowAuthDrawer, CloseDialog } from '@/message'
import './style.less'
import WICPPrice from '@/components/wicp-price'
import { requestCanister } from '@/api/handler'
import { getDisCountByUser, mintNFT, getMintPrice } from '@/api/mintHandler'
import ConfirmModal from '@/components/confirm-modal'
import { multiBigNumber } from '@/utils/utils'
import { shallowEqual, useSelector } from 'react-redux'
import Dialog from '@/components/dialog'
import MintSuccess from '../mint-success'
import MintWaitting from '../mint-waitting'

export default memo(function MintContent(props) {
  const [mintPrice, setMintPrice] = useState([])
  const [discount, setDiscount] = useState(props.discount || 100)
  const mintCount = props.mintCount
  const supplyCount = props.supplyCount
  const type = props.type
  const [selectIndex, setSelectIndex] = useState(0)
  const [minting, setMinting] = useState(false)
  const [confirmVisible, setConfirmVisible] = useState(false)
  const { isAuth } = useSelector((state) => {
    return {
      isAuth: state.auth.getIn(['isAuth']) || false
    }
  }, shallowEqual)

  const getCurrentMintPrice = () => {
    requestCanister(
      getMintPrice,
      {
        type,
        success: (res) => {
          setMintPrice(res)
        }
      },
      false
    )
  }
  useEffect(() => {
    if (discount === 100) {
      requestCanister(getDisCountByUser, {
        type,
        success: (res) => {
          setDiscount(res)
        }
      })
    }
    getCurrentMintPrice()
    return () => {}
  }, [])

  const cancelMint = () => {
    setConfirmVisible(false)
  }
  const showConfirmModal = () => {
    if (!isAuth) {
      PubSub.publish(ShowAuthDrawer, {})
      return
    }
    if (minting || mintPrice.length === 0) {
      return
    }
    setConfirmVisible(true)
  }

  const handlerMintNow = () => {
    if (!isAuth) {
      PubSub.publish(ShowAuthDrawer, {})
      return
    }
    if (minting || mintPrice.length === 0) {
      return
    }
    setMinting(true)
    cancelMint()
    Dialog.createAndShowDialog(<MintWaitting />, null)
    let data = {
      type,
      num: mintPrice[selectIndex][0],
      success: (res) => {
        props.onSuccessMint && props.onSuccessMint(res)
        Dialog.createAndShowDialog(<MintSuccess type={type} mintList={res} />, null)
        setMinting(false)
        getCurrentMintPrice()
      },
      fail: (error) => {
        message.error(error)
        setMinting(false)
        PubSub.publish(CloseDialog, {})
      },
      error: () => {
        setMinting(false)
        PubSub.publish(CloseDialog, {})
      }
    }
    requestCanister(mintNFT, data)
  }

  const getMintItem = () => {
    return mintPrice.map(([count, price], index) => {
      return (
        <div
          key={index}
          className={index === selectIndex ? 'mint-item mint-item-selected' : 'mint-item'}
          onClick={() => {
            setSelectIndex(index)
          }}
        >
          <div className="nft-count">{`${count} NFT${count > 1 ? 's' : ''}`}</div>
          <WICPPrice
            iconSize={26}
            value={price}
            valueStyle={index === selectIndex ? 'value-white-30' : 'value-30'}
          ></WICPPrice>
        </div>
      )
    })
  }

  return (
    <div className="mint-list-content">
      {mintPrice.length > 0 ? (
        <div className="content">
          {parseInt(discount) < 100 && (
            <div className="top">
              <div className="mint-tip">
                {`You have a ${100 - parseInt(discount)}% discount coupon`}
                <span>（This discount can only be used once）</span>
              </div>
            </div>
          )}
          <div className="mint-container">{getMintItem()}</div>
          {parseInt(discount) < 100 && (
            <div className="total">
              After discount:
              <WICPPrice
                iconSize={20}
                value={multiBigNumber(mintPrice[selectIndex][1], parseInt(discount) / 100)}
                valueStyle={'value-20'}
              ></WICPPrice>
            </div>
          )}
          <div className="button-layout">
            <Button
              type="black"
              className="btn-normal button"
              onClick={showConfirmModal}
              style={{ minWidth: '180px' }}
              disabled={mintCount >= supplyCount}
            >
              {isAuth ? 'Payment' : 'Connect your Wallet'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="content" style={{ position: 'relative' }}>
          <Spin style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>
      )}
      {mintPrice.length > 0 && (
        <ConfirmModal
          title={'Mint confirms'}
          width={428}
          onModalClose={cancelMint}
          onModalConfirm={handlerMintNow}
          modalVisible={confirmVisible}
        >
          <div
            className="tip tip-000"
            style={{ display: 'flex', alignItems: 'center', columnGap: '10px', marginBottom: '20px' }}
          >
            Please confirm to pay
            <WICPPrice
              iconSize={16}
              value={multiBigNumber(mintPrice[selectIndex][1], parseInt(discount) / 100)}
              valueStyle={'tip tip-000'}
            ></WICPPrice>
            {` to buy ${mintPrice[selectIndex][0]} NFT${mintPrice[selectIndex][0] > 1 ? 's' : ''}`}
          </div>
        </ConfirmModal>
      )}
    </div>
  )
})
