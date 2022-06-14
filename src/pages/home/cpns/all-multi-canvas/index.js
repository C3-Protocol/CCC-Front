import React, { memo, useEffect, useState } from 'react'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { MultiListWrapper, MultiContentWrapper } from './style'
import CavansCover from '@/components/canvas-cover'
import { M1155Create, Theme1155Create, AloneCreate } from '@/constants'
import { NavLink } from 'react-router-dom'
import { RefreshCrowdUndone } from '@/message'
import { getAllUndoneCanvasByType } from '@/pages/home/store/actions'
import { requestCanister } from '@/api/handler'
import { factoryGetListingsByType } from '@/api/nftHandler'
import { isCollapsed, getValueDivide8 } from '@/utils/utils'

export default memo(function AllMultiUndone(props) {
  let mount = true
  const dispatch = useDispatch()
  let [aloneMarket, setAloneMarket] = useState([])
  const MaxCount = 4

  const { multi1155Undone, theme1155Undone } = useSelector((state) => {
    let key1 = `undoneCanvas-${M1155Create}`
    let multi1155Undone = (state.allcavans && state.allcavans.getIn([key1])) || []
    let key2 = `undoneCanvas-${Theme1155Create}`
    let theme1155Undone = (state.allcavans && state.allcavans.getIn([key2])) || []
    return {
      multi1155Undone,
      theme1155Undone
    }
  }, shallowEqual)

  // other hooks
  useEffect(() => {
    undoneListUpdateFunc()
    if (!props.onlyMultiCanvas) {
      requestCanister(
        factoryGetListingsByType,
        {
          type: AloneCreate,
          success: (res) => {
            res &&
              res.sort((left, right) => {
                let value = getValueDivide8(right.sellPrice) - getValueDivide8(left.sellPrice)
                return value
              })
            setAloneMarket(res)
          }
        },
        false
      )
    }
    const undoneListUpdate = PubSub.subscribe(RefreshCrowdUndone, undoneListUpdateFunc)
    return () => {
      setAloneMarket = () => false
      mount = false
      PubSub.unsubscribe(undoneListUpdate)
    }
  }, [])

  const undoneListUpdateFunc = (topic, info) => {
    dispatch(getAllUndoneCanvasByType(Theme1155Create))
  }

  const marketContent = () => {
    let res = []
    if (aloneMarket) {
      let list = aloneMarket.slice(0, Math.min(aloneMarket.length, MaxCount - res.length))
      let alone =
        list &&
        list.map((item) => {
          return (
            <CavansCover
              key={item.baseInfo.prinId.toText()}
              type={item.nftType}
              info={item.baseInfo}
              marketInfo={item.sellInfo}
              colCount={aloneMarket.length}
              thumbType={'market-nft'}
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
        {multi1155Undone &&
          multi1155Undone.slice(0, 1).map((item) => {
            return (
              <CavansCover key={item.tokenIndex} type={M1155Create} thumbType={'crowdUndone'} info={item}></CavansCover>
            )
          })}
      </div>
    </MultiListWrapper>
  ) : (
    <MultiContentWrapper>
      {((multi1155Undone && multi1155Undone.length > 1) || (theme1155Undone && theme1155Undone.length > 0)) && (
        <MultiListWrapper>
          {isCollapsed() ? <div /> : <div className="title">Canvas Available for Painting</div>}
          <div className="multi-list">
            {multi1155Undone &&
              multi1155Undone.slice(1).map((item) => {
                return (
                  <CavansCover
                    key={item.tokenIndex}
                    type={M1155Create}
                    thumbType={'crowdUndone'}
                    info={item}
                  ></CavansCover>
                )
              })}
            {theme1155Undone &&
              theme1155Undone.map((item) => {
                return (
                  <CavansCover
                    key={item.tokenIndex}
                    type={Theme1155Create}
                    thumbType={'crowdUndone'}
                    info={item}
                  ></CavansCover>
                )
              })}
          </div>
        </MultiListWrapper>
      )}

      {aloneMarket && aloneMarket.length > 0 && (
        <MultiListWrapper>
          <div className="aloneBg">
            <div className="title">Canvas NFT Market</div>
            <div className="market-list">{marketContent()}</div>
            <div className="more">
              <NavLink to={'marketplace/personal'}>{'More >>'}</NavLink>
            </div>
          </div>
        </MultiListWrapper>
      )}
    </MultiContentWrapper>
  )
})
