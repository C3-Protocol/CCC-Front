import React, { memo, useEffect } from 'react'
import { Card, Skeleton, Image } from 'antd'
import './style.css'
import { useHistory } from 'react-router-dom'
import WICPPrice from '@/components/wicp-price'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { getCollectionVolumeAndListings } from '@/pages/home/store/actions'
import { C3ProtocolUrl } from '@/constants'

const NftTypeCard = memo((props) => {
  const { item, owner } = props
  const history = useHistory()
  const dispatch = useDispatch()
  const handlerOnItemClick = () => {
    history.push(`/collection/${item.key}/items/${owner ? owner : ''}`)
  }

  const { volume, listing } = useSelector((state) => {
    let key1 = `collectionInfo-${item.key}-volume`
    let key2 = `collectionInfo-${item.key}-listing`
    let volume = state.allcavans && state.allcavans.getIn([key1])
    let listing = (state.allcavans && state.allcavans.getIn([key2])) || null
    return {
      volume,
      listing
    }
  }, shallowEqual)

  useEffect(() => {
    dispatch(getCollectionVolumeAndListings(item.key))
  }, [dispatch])

  return (
    <Card
      className="nft-card"
      bordered={false}
      actions={[
        volume === undefined || listing === null ? (
          <Skeleton.Button active={true} size="small" />
        ) : (
          <div className="vertical-center">
            <div className="value value-voilet">Volume</div>
            <WICPPrice iconSize={18} value={volume || 0} valueStyle={'value-16'} fixed={2} unit={1000} />
          </div>
        ),
        volume === undefined || listing === null ? (
          <Skeleton.Button active={true} size="small" />
        ) : (
          <div className="vertical-center">
            <div className="value value-voilet">Listings</div>
            <div className="value-16">{listing ? listing[0] : 0}</div>
          </div>
        ),
        volume === undefined || listing === null ? (
          <Skeleton.Button active={true} size="small" />
        ) : (
          <div className="vertical-center">
            <div className="value value-voilet">Floor price</div>
            <WICPPrice iconSize={18} value={listing ? listing[1] : 0} valueStyle={'value-16'} fixed={2} />
          </div>
        )
      ]}
      onClick={handlerOnItemClick}
    >
      <div className="image-content">
        <div className="image-thumb">
          <Image
            className="image-thumb-img"
            src={item.thumb || `${C3ProtocolUrl}/resource/${item.key}/thumb.png`}
            placeholder={<Skeleton.Image />}
            preview={false}
          ></Image>
        </div>
        <div className="content1 vertical-center flex-10">
          <div className="avator-img">
            <Image
              className="avator-img-img"
              src={item.avatar || `${C3ProtocolUrl}/resource/${item.key}/avatar.png`}
              placeholder={<Skeleton.Image />}
              preview={false}
            />
          </div>
          <div className="small-title small-title-000">{item.title}</div>
          <div className="limit-lines value value-666" style={{ '--lines': 2, height: '34px' }}>
            {item.brief}
          </div>
        </div>
      </div>
    </Card>
  )
})

export default NftTypeCard
