import React, { memo, useEffect, useState } from 'react'
import './style.less'
import { DoubleRightOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import WICPPrice from '@/components/wicp-price'
import { Button, Skeleton, Tooltip, Menu, Dropdown } from 'antd'
import { ZombieNFTCreate, C3ProtocolUrl, ArtCollection, gangNFTCreate } from '@/constants'
import { getLinkIcon } from '@/icons'
import { useHistory } from 'react-router-dom'
import { shallowEqual, useSelector } from 'react-redux'
import { getValueDivide8 } from '@/utils/utils'
import Dialog from '@/components/dialog'
import CreateAll from '@/pages/create/view/create-all'

function CollectionListingInfo(props) {
  const history = useHistory()
  const { item, listingInfos } = props
  const { volume, listing, owners, circultaion, totalSupply, stakeInfo } = listingInfos

  const [collapseBlurb, setCollapseBlurb] = useState(false)
  const [isBlurbOpen, setIsBlurbOpen] = useState(false)
  const [blurbElement, setBlurbElement] = useState(false)
  const { authToken } = useSelector((state) => {
    return {
      authToken: state.auth.getIn(['authToken'])
    }
  }, shallowEqual)

  const isArtCollection = item.key.startsWith(ArtCollection)
  const owner = isArtCollection && item.key.split(':')[2]

  const goToCreateNFT = (e) => {
    e.stopPropagation()
    Dialog.createAndShowDialog(<CreateAll type={item.key} />, 0)
  }
  const goToEditCollection = () => {
    history.push(`/create/collection/${item.key}`)
  }
  useEffect(() => {
    if (blurbElement.clientHeight > 110) {
      setCollapseBlurb(true)
    }
  }, [blurbElement])

  const stakeMenu = (
    <Menu className="top-menu">
      <Menu.Item>{`All Staked: ${stakeInfo?.stakedNum || 0}`}</Menu.Item>
      <Menu.Item>{`Number of participants: ${stakeInfo?.participantsNum || 0}`}</Menu.Item>
      <Menu.Item>{`Prize Pool: ${getValueDivide8(stakeInfo?.prizePool || 0)} WICP`}</Menu.Item>
    </Menu>
  )

  const stakeButton =
    item.key === gangNFTCreate ? (
      <Dropdown overlay={stakeMenu} overlayClassName={'ccc-drop-menu'}>
        <a href={'/#/assets/wallet/staking'} target="_self" rel="noopener noreferrer">
          <Button className="btn-normal stake-btn" type="violet-gradient">
            Stake
            <ExclamationCircleOutlined style={{ color: '#C1C1C1', marginLeft: 10, fontSize: 16 }} />
          </Button>
        </a>
      </Dropdown>
    ) : (
      <></>
    )
  const isCanAddItem = () => {
    if (isArtCollection) {
      if (authToken && authToken === owner) {
        return true
      }
      if (item.isPublic) return true
    }
    return false
  }

  return (
    <div className="colletion-info-wrapper">
      <div className="banner-content">
        <img className="banner-wrapper" src={item.banner || `${C3ProtocolUrl}/resource/${item.key}/banner.png`}></img>
        <div className="avator">
          <img src={item.avatar || `${C3ProtocolUrl}/resource/${item.key}/avatar.png`} />
        </div>

        <div className="link-layout">
          {isCanAddItem() && (
            <Button type="violet-gradient" className="btn-normal" onClick={goToCreateNFT}>
              + Add item
            </Button>
          )}
          {/* <Button type="violet" className="btn-small" onClick={goToEditCollection}>
            Edit
          </Button> */}
          {item?.links && item.links.length > 0 && (
            <div className="link">
              {item?.links.map((item, index) => {
                return (
                  <Tooltip placement="top" title={item.name} key={index}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" key={index}>
                      {getLinkIcon(item.name)}
                    </a>
                  </Tooltip>
                )
              })}
            </div>
          )}
          {stakeButton}
        </div>
      </div>
      <div className="nft-blurb">
        <h2>{item?.title}</h2>
        <div
          ref={(e) => {
            setBlurbElement(e)
          }}
          style={{
            ...(collapseBlurb && !isBlurbOpen
              ? {
                  maxHeight: 110,
                  wordBreak: 'break-word',
                  WebkitMask: 'linear-gradient(rgb(255, 255, 255) 45%, transparent)'
                }
              : {}),
            overflow: 'hidden',
            fontSize: '1.2em'
          }}
          dangerouslySetInnerHTML={{ __html: item?.blurb }}
        ></div>
        {collapseBlurb ? (
          <DoubleRightOutlined rotate={isBlurbOpen ? 270 : 90} onClick={() => setIsBlurbOpen(!isBlurbOpen)} />
        ) : (
          ''
        )}
      </div>
      <div className="listing-info">
        {volume === undefined || owners === undefined ? (
          <div className="vertical-center">
            <Skeleton.Button active={true} size="small" />
          </div>
        ) : (
          <div className="vertical-center flex-5">
            <div className="value value-666">Volume</div>
            <WICPPrice iconSize={20} value={volume || 0} valueStyle={'value-20'} fixed={2} unit={1000} />
          </div>
        )}
        {volume === undefined || owners === undefined ? (
          <div className="vertical-center">
            <Skeleton.Button active={true} size="small" />
          </div>
        ) : (
          <div className="vertical-center flex-5">
            <div className="value value-666">Listings</div>
            <div className="value-20">{listing ? listing[0] : 0}</div>
          </div>
        )}
        {volume === undefined || owners === undefined ? (
          <div className="vertical-center">
            <Skeleton.Button active={true} size="small" />
          </div>
        ) : (
          <div className="vertical-center flex-5">
            <div className="value value-666">Floor price</div>
            <WICPPrice iconSize={20} value={listing ? listing[1] : 0} valueStyle={'value-20'} fixed={2} />
          </div>
        )}
        {volume === undefined || owners === undefined ? (
          <div className="vertical-center">
            <Skeleton.Button active={true} size="small" />
          </div>
        ) : (
          <div className="vertical-center flex-5">
            <div className="value value-666 flex-5">
              Owners
              {item.key === ZombieNFTCreate && (
                <Tooltip placement="top" title={'Not include staked'}>
                  <InfoCircleOutlined />
                </Tooltip>
              )}
            </div>
            <div className="value-20">{`${owners}`}</div>
          </div>
        )}
        {volume === undefined || owners === undefined ? (
          <div className="vertical-center">
            <Skeleton.Button active={true} size="small" />
          </div>
        ) : (
          <div className="vertical-center flex-5">
            <div className="value value-666">Total Supply</div>
            <div className="value-20">{`${totalSupply || item?.totalSupply || 0}`}</div>
          </div>
        )}
        {volume === undefined || owners === undefined ? (
          <div className="vertical-center">
            <Skeleton.Button active={true} size="small" />
          </div>
        ) : (
          <div className="vertical-center flex-5">
            <div className="value value-666">In Circulation</div>
            <div className="value-20">{`${circultaion || 0}`}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(CollectionListingInfo)
