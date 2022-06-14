import React, { memo, useEffect, useState } from 'react'
import { HashRouter, useHistory } from 'react-router-dom'
import WICPPrice from '@/components/wicp-price'
import { Tooltip, Button, Spin } from 'antd'
import Wait from '@/assets/images/launchpad/wait.svg'
import { shallowEqual, useSelector } from 'react-redux'
import { getValueMultiplied8 } from '@/utils/utils'
import MintContent from '../cpn/mint-content'
import './style.less'
import { getMintSaleInfo, getMintOpentime } from '@/api/mintHandler'
import { handleLaunchpadConfig } from '@/api/handler'
import { requestCanister } from '@/api/handler'
import PubSub from 'pubsub-js'
import { UpdateMintRemain } from '@/message'
import Progress from '../cpn/progress'
import { getLinkIcon } from '@/icons'
import { find } from 'lodash-es'
import { C3ProtocolUrl } from '@/constants'
import BackIcon from '@/assets/images/icon/back.svg'

function LaunchpadDetail(props) {
  let mount = true
  let getting = false
  const history = useHistory()
  const params = props.match.params
  const key = params.type
  const [launchpadConfig, setLaunchpadConfig] = useState([])
  const item = find(launchpadConfig, { key })
  const isEnd = item?.endMint
  const [mintCount, setMintCount] = useState(isEnd ? item?.supplyCount : 0)
  const [supplyCount, setSupplyCount] = useState(isEnd ? item?.supplyCount : 0)
  const [mintTime, setMintTime] = useState(item?.mintTime)
  const [loading, setLoading] = useState(mintTime ? false : true)
  const { isAuth, collectionsConfig } = useSelector((state) => {
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      collectionsConfig: state.auth.getIn(['collection']) || []
    }
  }, shallowEqual)
  const collectionItem = find(collectionsConfig, { key })

  const onSuccessMint = () => {
    getMintCount()
    updateMintOpenTime()
  }

  useEffect(() => {
    if (collectionsConfig.length > 0)
      handleLaunchpadConfig((res) => {
        setLaunchpadConfig(res)
        updateMintOpenTime()
      })
  }, [collectionsConfig])

  useEffect(() => {
    getMintCount()
  }, [item])

  useEffect(() => {
    if (collectionsConfig.length > 0) updateMintOpenTime()
  }, [isAuth])

  const bottomContent = () => {
    let now = new Date().getTime()
    if (isEnd || (supplyCount > 0 && mintCount >= supplyCount)) {
      return (
        <Button type="black" className="btn-normal" onClick={() => history.push(`/collection/${item?.key}/items`)}>
          Visit MarketPlace
        </Button>
      )
    } else {
      if ((!mintTime && loading) || supplyCount === 0) {
        return <Spin />
      } else if (mintTime <= now) {
        return <MintContent type={key} onSuccessMint={onSuccessMint} mintCount={mintCount} supplyCount={supplyCount} />
      } else {
        return (
          <div className="coming-soon">
            <img src={Wait}></img>
            <div className="small-title small-title-666">Coming soon</div>
          </div>
        )
      }
    }
  }

  const getMintCount = () => {
    if (getting || !item) {
      return
    }
    getting = true
    requestCanister(
      getMintSaleInfo,
      {
        type: key,
        supply: item.supplyCount,
        success: (res) => {
          getting = false
          if (mount) {
            let supply = parseInt(res[1])
            let count = parseInt(res[0])
            if (count > supply) count = supply
            setMintCount(count)
            setSupplyCount(supply)
          }
        },
        fail: () => {
          getting = false
        },
        error: () => {
          getting = false
        }
      },
      false
    )
  }

  const updateMintOpenTime = () => {
    requestCanister(
      getMintOpentime,
      {
        type: key,
        success: ({ openTime, preMint }) => {
          setMintTime(openTime)
          setLoading(false)
        }
      },
      false
    )
  }

  useEffect(() => {
    let timer
    if (!isEnd) {
      timer = setInterval(() => {
        getMintCount()
      }, 1000 * 5)
    }
    const updatefunc = PubSub.subscribe(UpdateMintRemain, getMintCount)
    return () => {
      timer && clearInterval(timer)
      PubSub.unsubscribe(updatefunc)
      mount = false
    }
  }, [isEnd])

  const handlerGoBack = () => {
    history.replace(`/launchpad`)
  }

  return (
    <HashRouter>
      <div className="mint-detail-wrapper">
        <div>
          <div className="go-back">
            <a href={'/#/launchpad'}>
              <img src={BackIcon} />
            </a>
          </div>
          <div className="top-wrapper">
            <div className="top-left">
              <div className="title">{collectionItem?.title}</div>
              <div className="line">
                <div className="flex-20">
                  <div className="tip-bold tip-bold-000 flex-5">
                    Price:
                    <WICPPrice iconSize={20} value={getValueMultiplied8(item?.price)} valueStyle={'tip-bold-666'} />
                  </div>
                  <div className="tip-bold tip-bold-000">
                    Total Items: <span className="tip-bold-666">{collectionItem?.totalSupply}</span>
                  </div>
                </div>

                <div className="link">
                  {collectionItem?.links.map((item, index) => {
                    return (
                      <Tooltip placement="top" title={item.name} key={index}>
                        <a href={item.link} target="_blank" rel="noopener noreferrer" key={index}>
                          {getLinkIcon(item.name)}
                        </a>
                      </Tooltip>
                    )
                  })}
                </div>
              </div>
              <div className="description ">
                <div
                  className="limit-lines tip tip-000"
                  style={{ '--lines': 5 }}
                  dangerouslySetInnerHTML={{ __html: collectionItem?.blurb }}
                ></div>
              </div>
              <div className="bottom-content">{bottomContent()}</div>
            </div>
            <div className="top-right">
              <img src={`${C3ProtocolUrl}/resource/${key}/thumb.png`}></img>
              <div className="progress-layout">
                {supplyCount > 0 && <Progress percentageNum={mintCount} allNum={supplyCount} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HashRouter>
  )
}

export default memo(LaunchpadDetail)
