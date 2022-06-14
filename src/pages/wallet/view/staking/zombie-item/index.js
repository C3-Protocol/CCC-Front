import { ZombieWrapper } from './style'
import React, { memo, useEffect } from 'react'
import { Skeleton, Image } from 'antd'
import { ZombieNFTCreate } from '@/constants'
import { getNFTDetailInfoByIndex } from '@/pages/home/store/actions'
import { getZombieCanister, getItemImageUrl } from '@/utils/utils'
import RarityNameConfig from '@/assets/scripts/rarityNameConfig'
import { getValueDivide8 } from '@/utils/utils'
import { find } from 'lodash-es'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'

// zombie的nft
function ZombieNFTCover(props) {
  const { tokenIndex, reward, type } = props
  const prinId = props.prinId || getZombieCanister(tokenIndex, type)
  const isSelected = props.isSelected
  const dispatch = useDispatch()
  const { collectionsConfig, nftInfo } = useSelector((state) => {
    let key1 = `noCanvasNFTInfo-${type}-${tokenIndex}`
    return {
      nftInfo: (state.allcavans && state.allcavans.getIn([key1])) || {},
      collectionsConfig: state.auth.getIn(['collection']) || []
    }
  }, shallowEqual)

  const itemConfig = find(collectionsConfig, { key: type })
  const rarityItem = find(RarityNameConfig, { key: type })

  useEffect(() => {
    dispatch(getNFTDetailInfoByIndex(type, tokenIndex))
  }, [type, tokenIndex])

  const getNFTRarityScore = () => {
    if (nftInfo.rarityScore) {
      return Math.round(nftInfo.rarityScore * 100) / 100
    }
    return 0
  }

  const handlerOnItemClick = () => {
    props.onItemClick && props.onItemClick({ tokenIndex, prinId }, ZombieNFTCreate)
  }

  return (
    <ZombieWrapper onClick={handlerOnItemClick} isSelected={isSelected}>
      <div className="image-content" style={{ paddingBottom: type === ZombieNFTCreate ? '128%' : '100%' }}>
        <div className="image-wrapper">
          <Image src={getItemImageUrl(type, prinId, tokenIndex)} placeholder={<Skeleton.Image />} preview={false} />
        </div>
      </div>

      {/* <div className="detail">
        <div className="nft-index">{`${itemConfig.title}#${tokenIndex}`}</div>
      </div> */}
      {getNFTRarityScore() > 0 && (
        <div className={`detail ${isSelected ? 'item-select' : ''} `}>
          <div className="nft-rare">
            <span className="rare-title">{`${rarityItem ? rarityItem.valueName : 'Rarity'}: `}</span>
            <span style={{ color: isSelected ? '#fff' : '#000' }}>
              {getNFTRarityScore() + (rarityItem ? rarityItem.valueAdd : '')}
            </span>
          </div>
        </div>
      )}
      {reward !== undefined && (
        <div className="reward">
          Pending reward:
          <span>{getValueDivide8(reward)}</span>
          WICP
        </div>
      )}
    </ZombieWrapper>
  )
}

export default memo(ZombieNFTCover)
