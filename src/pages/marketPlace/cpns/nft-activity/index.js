import React, { memo, useEffect, useState } from 'react'
import { requestCanister } from '@/api/handler'
import { getAllNTFTransition } from '@/api/nftHandler'
import { ArtCollection } from '@/constants'
import { shallowEqual, useSelector } from 'react-redux'
import { getItemImageUrl, getIPFSLink } from '@/utils/utils'
import BigNumber from 'bignumber.js'
import NftTransaction from '@/components/nft-transaction'
import { find } from 'lodash-es'

export default memo(function NFTActivity(props) {
  const { type } = props
  const isArtCollection = type.startsWith(ArtCollection)

  const { authToken, collectionTitle } = useSelector((state) => {
    let collectionTitle
    if (isArtCollection) {
      collectionTitle = type.split(':')[3]
    } else {
      let collectionsConfig = state.auth.getIn(['collection'])
      if (collectionsConfig) {
        let itemConfig = find(collectionsConfig, { key: type })
        collectionTitle = itemConfig.title
      }
    }
    return {
      authToken: state.auth.getIn(['authToken']) || '',
      collectionTitle
    }
  }, shallowEqual)

  let [loading, setLoading] = useState(true)
  let [transaction, setTransaction] = useState([])

  const paresData = (datas, allTypes) => {
    let transaction = []
    for (let i = 0; i < datas.length; i++) {
      let nftData = datas[i]
      for (let item of nftData) {
        let price = item.price && item.price.length ? item.price[0] : 0
        if (price == 0) continue
        let transactionType = 'sale'
        transaction.push({
          key: transaction.length,
          index: item.tokenIndex,
          from: item.from && item.from.length ? item.from[0].toText() : '',
          to: item.to && item.to.length ? item.to[0].toText() : '',
          price,
          date: item.timestamp,
          transactionType: transactionType,
          type: allTypes[i],
          prinId: (item.cid && item.cid.toText()) || 'video',
          title: `${collectionTitle || ' '}#${item.tokenIndex}`,
          imgUrl:
            getIPFSLink(item.photoLink && item.photoLink[0]) || getItemImageUrl(allTypes[i], item.cid, item.tokenIndex),
          detailUrl:
            getIPFSLink(item.videoLink && item.videoLink[0]) ||
            `https://${item.cid}.raw.ic0.app/token/${item.tokenIndex}`
        })
      }
    }
    transaction.sort((left, right) => {
      let value = parseInt(new BigNumber(right.date).minus(new BigNumber(left.date)).dividedBy(Math.pow(10, 6)))
      return value
    })
    setTransaction(transaction)
  }

  const getAllNFTTransactionByType = (type) => {
    requestCanister(
      getAllNTFTransition,
      {
        type,
        success: (res) => {
          if (res) {
            paresData([res], [type])
          }
          setLoading(false)
        }
      },
      false
    )
  }

  useEffect(() => {
    getAllNFTTransactionByType(type)
  }, [])

  useEffect(() => {
    return () => {
      setLoading = () => false
      setTransaction = () => false
    }
  }, [])

  return <NftTransaction dataSource={transaction} loading={loading} />
})
