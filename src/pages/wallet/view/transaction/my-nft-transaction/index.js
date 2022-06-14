import React, { memo, useEffect, useState } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { getItemImageUrl, getIPFSLink, isAuthTokenEffect } from '@/utils/utils'
import BigNumber from 'bignumber.js'
import NftTransaction from '@/components/nft-transaction'
import { promiseFuncAllType } from '@/api/handler'
import { getNTFTransitionByAccount } from '@/api/nftHandler'

export default memo(function MyNFTTransaction(props) {
  const { isAuth, authToken, collectionsConfig, allCreateCollection } = useSelector((state) => {
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      authToken: state.auth.getIn(['authToken']) || '',
      collectionsConfig: state.auth.getIn(['collection']),
      allCreateCollection: state.auth.getIn(['allCreateCollection'])
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
        let transactionType
        if (price == 0) transactionType = 'transfer'
        else {
          if (item.from && item.from.length) {
            if (item.from[0].toText() === authToken) transactionType = 'sell'
          }
          if (item.to && item.to.length) {
            if (item.to[0].toText() === authToken) transactionType = 'buy'
          }
          if (!transactionType) transactionType = 'sale'
        }
        let collectionItem
        if (i < collectionsConfig.length) collectionItem = collectionsConfig[i]
        else collectionItem = allCreateCollection[i - collectionsConfig.length]

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
          title: `${collectionItem?.title || ' '}#${item.tokenIndex}`,
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

  const getSelfNFTTransaction = () => {
    if (isAuthTokenEffect(isAuth, authToken)) {
      let allTypes = []
      collectionsConfig.map((item) => allTypes.push(item.key))
      allCreateCollection.map((item) => allTypes.push(item.key))
      promiseFuncAllType(getNTFTransitionByAccount, allTypes, {
        prinId: authToken,
        success: (res) => {
          if (res) {
            paresData(res, allTypes)
          }
          setLoading(false)
        }
      })
    } else {
      setLoading(false)
      setTransaction([])
    }
  }

  useEffect(() => {
    if (collectionsConfig && allCreateCollection) {
      getSelfNFTTransaction()
    }
  }, [collectionsConfig, allCreateCollection])

  useEffect(() => {
    return () => {
      setLoading = () => false
      setTransaction = () => false
    }
  }, [])

  return <NftTransaction dataSource={transaction} loading={loading} />
})
