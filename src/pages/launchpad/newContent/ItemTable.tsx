import React, { useEffect } from 'react'
import { Table } from 'antd'
import { C3ProtocolUrl } from '@/constants'
import logoSVG from '@/assets/images/wicp_logo.svg'
import { useHistory } from 'react-router-dom'
import { useDispatch, shallowEqual, useSelector } from 'react-redux'
import { getCollectionVolumeAndListings } from '@/pages/home/store/actions'
import { getValueDivide8 } from '@/utils/utils'

interface configType {
  mintTime: string
  key: string
  floorPrice?: number | string
}

interface propsType {
  data: configType[]
  title?: string
}

const columns = [
  {
    dataIndex: 'title',
    key: 'Name',
    title: 'Name',
    width: '25%',
    render: (text, record) => {
      return (
        <span className="table-name">
          <img className="person-img" src={`${C3ProtocolUrl}/resource/${record.key}/avatar.png`} alt="" />
          {text}
        </span>
      )
    }
  },
  {
    dataIndex: 'supplyCount',
    key: 'supplyCount',
    title: 'Items',
    width: '20%'
  },
  {
    dataIndex: 'price',
    key: 'price',
    title: 'Mint Price',
    width: '20%',
    render: (text) => {
      return (
        <span>
          <img style={{ width: 20, marginRight: '4px', marginTop: '-4px' }} src={logoSVG} />
          <span>{text}</span>
        </span>
      )
    }
  },

  {
    dataIndex: 'floorPrice',
    key: 'floorPrice',
    title: 'Floor Price',
    width: '20%',
    render: (text) => {
      return (
        <span>
          <img style={{ width: 20, marginRight: '4px', marginTop: '-4px' }} src={logoSVG} />
          <span>{text}</span>
        </span>
      )
    }
  },
  {
    dataIndex: 'Change',
    key: 'Change',
    title: 'Change',
    width: '20%',
    render: (_text, record) => {
      const num = record[`floorPrice`] && Number((Number(record[`floorPrice`]) - Number(record[`price`])) / Number(record[`price`])) * 100
      const showNum = (record[`price`] !== 0 && !!num && num?.toFixed(2)) || ''
      let flag = ''
      if (showNum && record[`floorPrice`] !== record[`price`]) {
        flag = record[`floorPrice`] > record[`price`] ? '+' : ''
      }

      return <span style={{ color: flag && flag === '+' ? '#52C41A' : '#E02020' }}>{flag + showNum || 0}%</span>
    }
  }
]

export default (props: propsType) => {
  const { data, title } = props
  //  const [showData, setShow] = useState([])
  const dispatch = useDispatch()
  const history = useHistory()

  const endConfigChange = (res) => {
    if (res.length > 0) {
      res.forEach((item) => {
        if (item.endMint) {
          dispatch(getCollectionVolumeAndListings(item.key))
        }
      })
    }
  }

  let endConfigData = useSelector((state: any) => {
    let calcData = []
    data.forEach((value: configType) => {
      const item = { ...value }
      let key2 = `collectionInfo-${item.key}-listing`
      let listing = (state.allcavans && state.allcavans.getIn([key2])) || null
      item.floorPrice = (listing && listing[1] && getValueDivide8(listing[1])) || 0
      calcData.push(item)
    })
    return calcData
  }, shallowEqual)

  useEffect(() => {
    endConfigChange(data)
  }, [data])

  return (
    <div className="launchpad-list">
      <h3>{title}</h3>
      <Table
        key={title}
        className="launchpad-list-table"
        rowClassName="launchpad-list-table-row"
        dataSource={[...endConfigData]}
        size={'small'}
        columns={columns}
        onRow={(record: { key: string }) => {
          return {
            onClick: () => {
              history.push(`/collection/${record.key}`)
            } // 点击行
          }
        }}
        pagination={{
          pageSize: 10
        }}
      />
    </div>
  )
}
