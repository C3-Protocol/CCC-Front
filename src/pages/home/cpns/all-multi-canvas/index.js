import React, { memo, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { message } from 'antd'
import { MultiListWrapper, MultiContentWrapper } from './style'
import { getMarketListNFT } from '@/pages/home/store/request'
import CavansCover from '@/components/canvas-cover'
import { AloneCreate, CrowdCreate } from '@/constants'
import { NavLink } from 'react-router-dom'
import { createHashHistory } from 'history'
import { RefreshCrowdUndone } from '@/message'
import { getAllUndoneCanvas, getRecentFinishedCanvas, requestCanister } from '@/api/handler'
import { isCollapsed } from '@/utils/utils'

export default memo(function AllMultiUndone(props) {
  let mount = true
  const dispatch = useDispatch()
  const history = useHistory()
  const [multiUndone, setMultiUndone] = useState([])
  const [multiDone, setMultiDone] = useState([])
  const [multiMarket, setMultiMarket] = useState([])
  const [aloneMarket, setAloneMarket] = useState([])

  const { isAuth } = useSelector((state) => {
    return {
      isAuth: state.auth.getIn(['isAuth']) || false
    }
  }, shallowEqual)

  // other hooks
  useEffect(() => {
    undoneListUpdateFunc()
    if (!props.onlyMultiCanvas) {
      getMarketListNFT((res) => {
        if (mount) {
          setAloneMarket(res.alone)
          setMultiMarket(res.crowd)
        }
      })
    }
    const undoneListUpdate = PubSub.subscribe(RefreshCrowdUndone, undoneListUpdateFunc)
    return () => {
      mount = false
      PubSub.unsubscribe(undoneListUpdate)
    }
  }, [])

  const undoneListUpdateFunc = (topic, info) => {
    let data = {
      type: CrowdCreate,
      success: async (res) => {
        mount && setMultiUndone(res)
      }
    }
    requestCanister(getAllUndoneCanvas, data, false)
    requestCanister(
      getRecentFinishedCanvas,
      {
        success: async (res) => {
          mount && setMultiDone(res)
        }
      },
      false
    )
  }

  const onItemClick = (info, type, thumbType) => {
    if (thumbType === 'crowdUndone') {
      if (!isAuth) {
        message.error('Please sign in first')
        return
      }
      // jump '/canvas'
      history.push(`/canvas/${type}/${info.prinId}`)
    } else {
      let history = createHashHistory()
      history.push(`/detail/${type}/${info.canvasInfo.tokenIndex}/${info.prinId}`)
    }
  }

  const marketContent = () => {
    let res = []
    if (multiMarket) {
      let list = multiMarket.slice(0, Math.min(multiMarket.length, 6))
      let multi =
        list &&
        list.map((item) => {
          return (
            <CavansCover
              key={item.baseInfo[1].toText()}
              type={item.nftType}
              info={item.baseInfo}
              thumbType={isCollapsed() ? 'market-nft' : 'home-nft'}
              colCount={multiMarket.length + aloneMarket.length}
              className="multi-list"
              onItemClick={onItemClick}
            ></CavansCover>
          )
        })
      res.push(...multi)
    }
    if (res.length < 6 && aloneMarket) {
      let list = aloneMarket.slice(0, Math.min(aloneMarket.length, 6 - res.length))
      let alone =
        list &&
        list.map((item) => {
          return (
            <CavansCover
              key={item.baseInfo[1].toText()}
              type={item.nftType}
              info={item.baseInfo}
              colCount={multiMarket.length + aloneMarket.length}
              thumbType={isCollapsed() ? 'market-nft' : 'home-nft'}
              className="multi-list"
              onItemClick={onItemClick}
            ></CavansCover>
          )
        })
      res.push(...alone)
    }
    return res
  }

  return props.onlyMultiCanvas ? (
    <MultiListWrapper>
      <div className="multi-list">
        {multiUndone &&
          multiUndone.slice(0, 1).map((item) => {
            return (
              <CavansCover
                key={item[0]}
                type={CrowdCreate}
                thumbType={'crowdUndone'}
                info={item}
                className="multi-list"
                onItemClick={onItemClick}
              ></CavansCover>
            )
          })}
      </div>
    </MultiListWrapper>
  ) : (
    <MultiContentWrapper>
      {multiUndone && multiUndone.length > 0 && (
        <MultiListWrapper>
          {isCollapsed() ? '' : <div className="title">Canvases Available for Painting</div>}
          <div className="multi-list">
            {multiUndone &&
              multiUndone.slice(0, 1).map((item) => {
                return (
                  <CavansCover
                    key={item[0]}
                    type={CrowdCreate}
                    thumbType={'crowdUndone'}
                    info={item}
                    className="multi-list"
                    onItemClick={onItemClick}
                  ></CavansCover>
                )
              })}
          </div>
        </MultiListWrapper>
      )}
      {multiDone && multiDone.length > 0 && (
        <MultiListWrapper>
          <div className="aloneBg">
            <div className="title">Completed Canvas</div>
            <div className="multi-done-list">
              {multiDone &&
                multiDone.map((item) => {
                  return (
                    <CavansCover
                      key={item.index}
                      type={CrowdCreate}
                      thumbType={'crowdDone'}
                      info={[item.index, item.canisterId]}
                      colCount={multiDone.length}
                      className="multi-list"
                      onItemClick={onItemClick}
                    ></CavansCover>
                  )
                })}
            </div>
          </div>
        </MultiListWrapper>
      )}

      {((multiMarket && multiMarket.length > 0) || (aloneMarket && aloneMarket.length > 0)) && (
        <MultiListWrapper>
          <div className="aloneBg">
            <div className="title">NFT MarketPlace</div>
            <div className="market-list">{marketContent()}</div>
            <div className="more">
              <NavLink to={'marketplace'}>{'More >>'}</NavLink>
            </div>
          </div>
        </MultiListWrapper>
      )}
    </MultiContentWrapper>
  )
})
