import React, { memo, useRef, useState, useEffect, useCallback } from 'react'
import { Button, message, Checkbox, Input, Switch, Slider } from 'antd'
import { HomeOutlined } from '@ant-design/icons'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import CanvasPixel from '@/components/canvas-pixel'
import * as ColorUtils from '@/utils/ColorUtils'

import {
  MultiDrawWrapper,
  MultiContentWrapper,
  MultiDrawLeft,
  MultiDrawRight,
  MultiDrawMiddle,
  MultiTitleWrapper,
  MultiSubTitleWrapper,
  BlockAreaWrapper,
  BlockTitleWrapper
} from './style'
import {
  drawPixel,
  aloneCanvasDrawOver,
  balanceWICP,
  requestWithdrawIncome,
  addWhiteList,
  requestCanister
} from '@/api/handler'
import ColorPicker from '@/components/color-picker/ColorPicker'
import { getValueDivide8 } from '@/utils/utils'
import { getCanvasInfoById, changeInfoAction } from '@/pages/home/store/actions'
import DrawRecordCarousel from './record-carousel'
import { getCrowdCanvasConsumeAndBalance, getHighestInfoById, getFinshedTimeById } from '@/pages/home/store/request'

import { useHistory } from 'react-router-dom'
import Pixel from '@/assets/images/create/pixel.png'
import Record from '@/assets/images/create/paint_record.png'
import Detail from '@/assets/images/create/detail.png'
import { AloneCreate, CanvasWidth } from '@/constants'
import CountDown from '@/components/count-down'
import Toast from '@/components/toast'
import BigNumber from 'bignumber.js'
import CanvasThumb from './canvas-thumb'
import Auth from '@/components/auth'
import ConfirmModal from '@/components/confirm-modal'
import CanvasInfo from './canvas-info'
import PersonInfo from './person-info'
import CanvasTool from './canvas-tool'
import SelectFrame from '@/components/select-frame'
/**
 * 画布,需整理
 */

function CanvasContent(props) {
  // state/props
  let mount = true
  const [curColor, setCurColor] = useState(ColorUtils.getColorString(Math.ceil(Math.random() * 16777215)))
  const history = useHistory()
  const [submitVisible, setSubmitVisible] = useState(false)
  const [finishVisible, setFinishVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  const [lastUpload, setLastUpload] = useState(0)
  const [drawType, setDrawType] = useState('draw-1') //draw,eraser两种状态
  const [detailExpand, setDetailExpand] = useState(false)
  const { type, id: prinId } = props.match.params
  const [wicp, setWICP] = useState(0)
  const [heatMapShow, setHeatMapShow] = useState(false)
  const canvasThumb = useRef()
  const canvasPixel = useRef()
  const recordRef = useRef()
  const selectFrameRef = useRef()
  const [consumeBalance, setConsumeBalance] = useState({})
  const [highestInfo, setHighestInfo] = useState([])
  const [finishTime, setFinishTime] = useState(0)
  // redux
  const dispatch = useDispatch()
  const isAlone = () => {
    return type === AloneCreate
  }
  const showCanvasWidth = 800
  const thumbWidth = 200
  const [totalPrice, setTotalPrice] = useState(0)
  const [count, setCount] = useState(0)
  const [hideLineInfo, setShowLineInfo] = useState(false)
  const [canvasScale, setCanvasScale] = useState(1)
  const defaultMemo = [
    'Every step you take here is valueable',
    'Players are actually producers,not consumers',
    'A play2earn platform with valueable arts output',
    "Let's work together to make this canvas great",
    'First real-time collaborative creation platform'
  ]
  const selectMemo = defaultMemo[Math.floor(Math.random() * defaultMemo.length)]
  const memoInputRef = useRef()
  const canvasScaleRef = useRef()
  canvasScaleRef.current = canvasScale

  const getWICPBalance = (authToken) => {
    requestCanister(balanceWICP, {
      curPrinId: authToken,
      success: (res) => {
        updateState('wicp', res)
      },
      fail: (error) => {}
    })
  }

  const { isAuth, canvasInfo, authToken } = useSelector((state) => {
    let key = isAlone() ? `aloneInfo-${prinId}` : `multiInfo-${prinId}`
    let isAuth = state.auth.getIn(['isAuth']) || false
    let authToken = state.auth.getIn(['authToken']) || ''
    let canvasInfo = (state.allcavans && state.allcavans.getIn([key])) || {}
    return {
      isAuth: isAuth,
      canvasInfo: canvasInfo,
      authToken: authToken
    }
  }, shallowEqual)
  const authTokenRef = useRef()
  authTokenRef.current = authToken
  // other hooks
  useEffect(() => {
    console.log('canvas-content prinId: ', prinId, ', isAuth: ', isAuth)
    if (props.canvasInfo) {
      dispatch(changeInfoAction({ type: props.type, prinId: prinId, res: props.canvasInfo }))
    } else {
      dispatch(getCanvasInfoById(type, prinId))
    }
    if (!isAlone()) {
      getFinshedTimeById(prinId, (res) => {
        updateState('finishTime', res)
      })
      getHighestInfoById(prinId, (res) => {
        updateState('highest', res)
      })
    }
    let scrollFunc = () => {
      let left =
        (canvasParent.scrollLeft / (showCanvasWidth * canvasScaleRef.current - showCanvasWidth)) *
        (thumbWidth - thumbWidth / canvasScaleRef.current)
      let top =
        (canvasParent.scrollTop / (showCanvasWidth * canvasScaleRef.current - showCanvasWidth)) *
        (thumbWidth - thumbWidth / canvasScaleRef.current)
      selectFrameRef.current.updatePosition(left, top)
    }
    let canvasParent = document.getElementById('canvas-parent')
    canvasParent.addEventListener('scroll', scrollFunc)
    let timer = setInterval(() => {
      updateContentInfo(false)
    }, 1000 * 60 * 1)
    if (document?.documentElement || document?.body) {
      document.documentElement.scrollTop = document.body.scrollTop = 0
    }
    return () => {
      mount = true
      timer && clearInterval(timer)
      canvasParent.removeEventListener('scroll', scrollFunc)
    }
  }, [dispatch])

  //之所以这样写，是防止线程访问数据，但控件已经unmount
  const updateState = (type, res) => {
    if (!mount) return
    if (type === 'consume') {
      setConsumeBalance(res)
    } else if (type === 'wicp') {
      setWICP(res)
    } else if (type === 'finishTime') {
      setFinishTime(res)
    } else if (type === 'highest') {
      setHighestInfo(res)
    }
  }
  useEffect(() => {
    if (!isAlone()) {
      getCrowdCanvasConsumeAndBalance(prinId, (res) => {
        updateState('consume', res)
      })
    }
    if (isAuth && authToken && authToken !== '2vxsx-fae') {
      console.log('authToken = ', authToken)
      addWhiteList(type, prinId)
      getWICPBalance(authToken)
    } else {
      setWICP(0)
    }
  }, [authToken])

  const getScaleMask = () => {
    let res = {}
    for (let i = 1; i <= 3; i += 0.25) {
      res[i] = {
        style: {
          color: '#000'
        }
        // label: <strong>{i + 'x'}</strong>
      }
    }
    return res
  }

  const updatCanvasParentScroll = (left, top) => {
    let canvasParent = document.getElementById('canvas-parent')
    let scrolllLeft =
      (left / (thumbWidth - thumbWidth / canvasScaleRef.current)) *
      (showCanvasWidth * canvasScaleRef.current - showCanvasWidth)
    let scrollTop =
      (top / (thumbWidth - thumbWidth / canvasScaleRef.current)) *
      (showCanvasWidth * canvasScaleRef.current - showCanvasWidth)
    canvasParent.scrollTo(scrolllLeft, scrollTop)
  }

  const updateContentInfo = (resetCanvas = true) => {
    dispatch(getCanvasInfoById(type, prinId))
    if (!isAlone()) {
      getHighestInfoById(prinId, (res) => {
        updateState('highest', res)
      })
      getCrowdCanvasConsumeAndBalance(prinId, (res) => {
        updateState('consume', res)
      })
      getFinshedTimeById(prinId, (res) => {
        updateState('finishTime', res)
      })
    }
    if (authTokenRef.current && authTokenRef.current !== '2vxsx-fae') {
      getWICPBalance(authTokenRef.current)
    } else {
      setWICP(0)
    }
    canvasThumb.current.pixelInfoUpdateFunc({ type, prinId, resetCanvas })
    canvasPixel.current.pixelInfoUpdateFunc({ type, prinId, resetCanvas })
  }

  const handleColorChange = (color) => {
    color && setCurColor(color)
    setDrawType('draw-1')
  }

  const calPrice = (totalPrice, count) => {
    setTotalPrice(totalPrice)
    setCount(count)
  }

  const uploadCanvasInfo = async (e, finish) => {
    cancelSubmitModal()
    let colors = canvasPixel.current.getDrawPixelInfo()
    if (colors && colors.length) {
      let notice = Toast.loading('drawing...', 0)
      let memo = memoInputRef.current.state.value || selectMemo
      let data = {
        type,
        prinId,
        colors: colors,
        memo: memo,
        success: (res) => {
          setLastUpload(new Date().getTime())
          if (finish && isAlone()) {
            finishCanvasUpload()
          } else {
            message.info('Your changes are Uploaded successfully')
            setTotalPrice(0)
            setCount(0)
            updateContentInfo()
            !isAlone() && recordRef.current.refreshRecord()
            // goBack()
          }
        },
        fail: (error, code) => {
          message.error(error)
          if (code === 'NFTDrawOver') {
            history.push('/')
          }
        },
        notice
      }
      requestCanister(drawPixel, data)
    } else {
      message.info('Please draw something before submitting')
    }
  }

  const finishCanvasUpload = async () => {
    cancelFinishModal()
    if (canvasInfo && canvasInfo.isNFTOver) {
      message.info('This NFT is finished, please try a new one')
      return
    }
    let notice = Toast.loading('finish...', 0)
    let data = {
      prinId: prinId,
      success: (res) => {
        // updateContentInfo()
        // PubSub.publish(UndownUpdate, { type })
        message.info('Congratulations! The painting is finished. Please check it in your wallet')
        history.push('/')
      },
      fail: (error) => {
        message.error(error)
      },
      notice: notice
    }
    isAlone() && requestCanister(aloneCanvasDrawOver, data)
  }

  const showSubmitModal = () => {
    let time = new Date().getTime()
    if (!isAlone() && time - lastUpload < 30 * 1000) {
      message.info('30s+ interval is required between two consecutive submissions')
      return
    }
    if (canvasInfo && canvasInfo.isNFTOver) {
      message.info('This NFT is finished, please try a new one')
      return
    }
    let count = canvasPixel.current.getPixelPriceToUpdload()[1]
    if (count === 0) {
      message.info('Please draw something before submitting')
      return
    }
    if (!isAlone() && count > 1000) {
      message.info('At most 1000 pixels can be updated in one submission')
      return
    }
    setSubmitVisible(true)
  }

  const cancelSubmitModal = () => {
    setSubmitVisible(false)
    memoInputRef.current.setValue('')
  }

  const showFinishModal = () => {
    if (canvasInfo && canvasInfo.isNFTOver) {
      message.info('This NFT is finished, please try a new one')
      return
    }
    if (count > 0) {
      message.info('You have updated pixels, please submit the change before finishing')
      return
    }
    if (canvasInfo.totalWorth < 10000000) {
      message.info('Total invested value > 0.1WICP is required to finish an NFT')
      return
    }
    setFinishVisible(true)
  }

  const cancelFinishModal = () => {
    setFinishVisible(false)
  }

  const cancelWithdrawModal = () => {
    setWithdrawVisible(false)
  }

  const showWithdrawModal = () => {
    if (canvasInfo.changeTotal < canvasInfo.bonusPixelThreshold) {
      message.error('Bonus not active')
      return
    }
    if (!consumeBalance.income || consumeBalance.income <= 0) {
      message.error('No income,go on playing')
      return
    }
    setWithdrawVisible(true)
  }

  const endTimeFun = () => {
    dispatch(getCanvasInfoById(type, prinId))
  }

  const onChangeShowHeatmap = useCallback((e) => {
    setHeatMapShow(e.target.checked)
  }, [])

  const withdrawIncome = () => {
    setWithdrawVisible(false)
    let notice = Toast.loading('Withdrawing...', 0)
    let data = {
      type,
      prinId,
      success: (res) => {
        if (res.ok) {
          updateContentInfo()
        }
      },
      fail: (error) => {
        message.error(error)
      },
      notice
    }
    requestCanister(requestWithdrawIncome, data)
  }

  const onSelectImage = (res) => {
    if (res.ok) {
      canvasPixel.current.drawImage(res.ok)
    }
  }

  const updateSelectPosition = (left, top) => {
    canvasThumb.current.updateSelectPosition(left, top)
  }

  const onHandleUpdateLineShow = useCallback((res) => {
    setShowLineInfo(res)
  }, [])

  const onHandlerScaleChange = useCallback((value) => {
    setCanvasScale(value)
    if (value > 1) {
      setHeatMapShow(false)
    }
    if (canvasScaleRef.current > 1) {
      let canvasParent = document.getElementById('canvas-parent')
      let left =
        (canvasParent.scrollLeft / (showCanvasWidth * canvasScaleRef.current - showCanvasWidth)) *
        (thumbWidth - thumbWidth / canvasScaleRef.current)
      let top =
        (canvasParent.scrollTop / (showCanvasWidth * canvasScaleRef.current - showCanvasWidth)) *
        (thumbWidth - thumbWidth / canvasScaleRef.current)
      selectFrameRef.current.updatePosition(left, top)
    } else {
      selectFrameRef.current.updatePosition(0, 0)
    }
  }, [])

  const resetColor = () => {
    canvasPixel.current.resetColor()
  }

  const initBlockArea = (width, height, title, img, children, otherTitle) => {
    return (
      <BlockAreaWrapper width={width} height={height} marginBottom={isAlone() ? 30 : 10}>
        {(title || img) && (
          <BlockTitleWrapper>
            <h5>{title}</h5>
            <img src={img}></img>
            {otherTitle && otherTitle}
          </BlockTitleWrapper>
        )}
        {children}
      </BlockAreaWrapper>
    )
  }
  const defaultWrapperContent = (
    <MultiContentWrapper>
      <MultiDrawLeft>
        <div className="content">
          {initBlockArea(
            344,
            222,
            null,
            null,
            <div className="thumb">
              <div className="canvas">
                {canvasInfo.canisterId && (
                  <CanvasThumb
                    cRef={canvasThumb}
                    count={count}
                    realWidth={CanvasWidth}
                    realHeight={CanvasWidth}
                    width={thumbWidth}
                    type={type}
                    prinId={prinId}
                    canvasInfo={canvasInfo}
                    hideLineInfo={hideLineInfo}
                  ></CanvasThumb>
                )}
                <SelectFrame
                  cRef={selectFrameRef}
                  selectWidth={thumbWidth}
                  canvasScale={canvasScale}
                  backGround={canvasInfo.backGround}
                  updateSelect={updatCanvasParentScroll}
                />
              </div>
              <div></div>
            </div>
          )}
          {initBlockArea(
            344,
            36,
            null,
            null,
            <CanvasTool
              type={type}
              drawType={drawType}
              setDrawType={setDrawType}
              resetColor={resetColor}
              onSelectImage={onSelectImage}
            />
          )}
          {!isAlone() &&
            initBlockArea(
              344,
              72,
              null,
              null,
              <div className="textPriceContent">
                <div className="totalPrice">{`Total price: ${getValueDivide8(totalPrice)} WICP`}</div>
                <div className="totalNum">{`Number: ${count}*`}</div>
                <div className="buttonLayout">
                  <Button type="violet" className="confirm" onClick={showSubmitModal}>
                    Submit
                  </Button>
                </div>
              </div>
            )}
          {initBlockArea(
            344,
            isAlone() ? 444 : 320,
            'Color picker',
            Pixel,
            <ColorPicker color={curColor} onChange={handleColorChange} />,
            <div className="curColor" style={{ backgroundColor: curColor }}></div>
          )}
        </div>
      </MultiDrawLeft>
      <MultiDrawMiddle width={showCanvasWidth + 2}>
        {/* +2是边框的2像素值 */}
        <div className="sliderParent">
          <strong>1x</strong>
          <Slider
            className="slider"
            marks={getScaleMask()}
            min={1}
            max={3}
            step={0.25}
            value={canvasScale}
            onChange={onHandlerScaleChange}
          />
          <strong>3x</strong>
        </div>

        <div id="canvas-parent" className="canvasPixel">
          <div style={{ width: showCanvasWidth * canvasScale + 'px', height: showCanvasWidth * canvasScale + 'px' }}>
            {canvasInfo.canisterId && (
              <CanvasPixel
                prinId={prinId}
                modify={true}
                type={type}
                cRef={canvasPixel}
                width={showCanvasWidth * canvasScale}
                height={showCanvasWidth * canvasScale}
                canvasInfo={canvasInfo}
                calPrice={calPrice}
                drawType={drawType}
                canvas={true}
                color={curColor}
                heatMapShow={heatMapShow}
                updateCurrentColor={handleColorChange}
                updateSelect={updateSelectPosition}
              />
            )}
          </div>
        </div>
      </MultiDrawMiddle>

      <MultiDrawRight>
        <div className="content">
          <div
            onClick={() => {
              !isAlone() && setDetailExpand(!detailExpand)
            }}
          >
            {initBlockArea(
              376,
              isAlone() ? 444 : 222,
              'Canvas Info',
              Detail,
              <CanvasInfo
                canvasInfo={canvasInfo}
                highestInfo={highestInfo}
                type={type}
                prinId={prinId}
                detailExpand={detailExpand}
                setDetailExpand={setDetailExpand}
              />
            )}
          </div>

          {!isAlone() && (
            <div>
              {initBlockArea(
                376,
                350,
                'Modify record',
                Record,
                <DrawRecordCarousel prinId={prinId} cRef={recordRef} />
              )}
            </div>
          )}
          {!isAlone() &&
            initBlockArea(
              376,
              196,
              'Personal Info',
              Detail,
              <PersonInfo consumeBalance={consumeBalance} showWithdrawModal={showWithdrawModal} />
            )}
          {isAlone() &&
            initBlockArea(
              424,
              310,
              null,
              null,
              <div className="textPriceContent">
                <div className="totalPrice">{`Total price: ${getValueDivide8(totalPrice)} WICP`}</div>
                <div className="totalNum">{`Number: ${count}*`}</div>
                <div className="tips">{'Total invested value > 0.1WICP is required to finish an NFT'}</div>
                <div className="buttonLayout">
                  <Button type="violet" className="confirm" onClick={showSubmitModal}>
                    Submit
                  </Button>
                  <Button type="violet" className="confirm" onClick={showFinishModal}>
                    Finish
                  </Button>
                </div>
              </div>
            )}
        </div>
      </MultiDrawRight>
    </MultiContentWrapper>
  )

  const getEndTime = () => {
    let endTime = parseInt(new BigNumber(parseInt(finishTime || 0)).dividedBy(Math.pow(10, 6)))
    return endTime
  }

  const mainContent = (
    <MultiDrawWrapper>
      <MultiTitleWrapper>
        <div>CROWD CREATED CANVAS</div>
        {!isAlone() && <div>{`Name: ${canvasInfo.name}`}</div>}
        <div>Number:</div>
        <div>{`${isAlone() ? '#A-' : '#M-'}${canvasInfo.tokenIndex}`}</div>
      </MultiTitleWrapper>

      <MultiSubTitleWrapper>
        <div className="hideLineInfo">
          <div>Hide</div>
          <Switch checked={hideLineInfo} onChange={onHandleUpdateLineShow} />
        </div>
        <div
          className="home"
          onClick={() => {
            history.push('/')
          }}
        >
          <HomeOutlined />
        </div>

        {!isAlone() ? (
          <div className="content">
            <div>Remaining Time:</div>
            <CountDown endTime={getEndTime()} endTimeFun={endTimeFun} />
          </div>
        ) : (
          <div className="content">{`Name: ${canvasInfo.name}`}</div>
        )}
        <div className="rightInfo">
          {!isAlone() && (
            <div>
              <Checkbox onChange={onChangeShowHeatmap} disabled={canvasScale !== 1} checked={heatMapShow}>
                HeatMap
              </Checkbox>
            </div>
          )}
          <div className="wicp">{isAuth && authToken ? `Balance:${getValueDivide8(wicp)} WICP` : ''}</div>
          <div className="auth">
            <Auth prinIds={[prinId]} />
          </div>
        </div>
      </MultiSubTitleWrapper>

      {defaultWrapperContent}
      <ConfirmModal
        title={'Submit'}
        width={450}
        onModalClose={cancelSubmitModal}
        onModalConfirm={uploadCanvasInfo}
        modalVisible={submitVisible}
      >
        <div className="tips">
          {`It will take about ${getValueDivide8(
            canvasPixel && canvasPixel.current && canvasPixel.current.getPixelPriceToUpdload()[0]
          )} WICP  for the ${
            canvasPixel && canvasPixel.current && canvasPixel.current.getPixelPriceToUpdload()[1]
          } pixels update. Please confirm you want to make the change.`}
        </div>
        {!isAlone() && (
          <Input
            ref={memoInputRef}
            type="text"
            maxLength={50}
            placeholder={selectMemo}
            style={{ marginTop: '15px' }}
            className="ant-input-violet"
          />
        )}
      </ConfirmModal>
      <ConfirmModal
        title={'Finish'}
        width={500}
        onModalClose={cancelFinishModal}
        onModalConfirm={finishCanvasUpload}
        modalVisible={finishVisible}
      >
        <div className="tips">
          {`You are closing this canvas painting. You will not be able to change it any more once it is finished. Please confirm or cancel it. 
You can find the finished canvas in your wallet ( Wallet-> My Wallet -> Non-Fungible Tokens )`}
        </div>
      </ConfirmModal>
      <ConfirmModal
        title={'Withdraw'}
        width={500}
        onModalClose={cancelWithdrawModal}
        onModalConfirm={withdrawIncome}
        modalVisible={withdrawVisible}
      >
        <div className="tips">
          {`It will withdraw abount ${getValueDivide8(
            consumeBalance ? consumeBalance.income : 0
          )} WICP .Please confirm you want to withdraw.`}
        </div>
      </ConfirmModal>
    </MultiDrawWrapper>
  )

  return mainContent
}

export default memo(CanvasContent)
