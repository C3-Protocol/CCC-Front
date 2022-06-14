import React, { useState } from 'react'
import { Table, Select } from 'antd'
import { useHistory } from 'react-router-dom'
import champion from '@/assets/images/champion.png'
import SilverMedal from '@/assets/images/SilverMedal.png'
import BronzeAward from '@/assets/images/BronzeAward.png'
import logoSVG from '@/assets/images/wicp_logo.svg'

const { Option } = Select
/*
  class Collection(models.Model):
    name = models.CharField(max_length=30, unique=True)
    logo = models.ImageField(default=None, null=True, blank=True)

    day7_volume = models.BigIntegerField(default=None, null=True, blank=True)
    all_time_volume = models.BigIntegerField(default=None, null=True, blank=True)

    day7_floor_price = models.BigIntegerField(default=None, null=True, blank=True)
    all_time_floor_price = models.BigIntegerField(default=None, null=True, blank=True)

    day7_gain = models.FloatField(default=None, null=True, blank=True)
    all_time_gain = models.FloatField(default=None, null=True, blank=True)

    owner_count = models.IntegerField(default=None, null=True, blank=True)
*/

export default React.memo(({ title, data, width }) => {
  const history = useHistory()
  const [selectValue, setSelect] = useState('day7')
  const handleSelect = (value) => {
    setSelect(value)
  }

  const columns = [
    {
      key: 'testIndex',
      dataIndex: 'testIndex',
      title: '',
      render: (text, record, index) => {
        let imgUrl = index === 0 ? champion : index === 1 ? SilverMedal : index === 2 ? BronzeAward : ''
        return (
          <div style={{ paddingLeft: imgUrl ? '' : '5px' }}>
            {imgUrl ? <img src={imgUrl} style={{ width: '23px', height: '20px' }} /> : index + 1}
          </div>
        )
      }
    },
    {
      key: 'name',
      dataIndex: 'name',
      title: 'Collection',
      width: '25%',
      render: (text, record, index) => {
        return (
          <div className="list-name">
            <img className="top-img" src={record.logo || ''} />
            <span>{record.name}</span>
          </div>
        )
      }
    },
    {
      key: 'volume',
      dataIndex: 'volume',
      title: 'Volume',
      width: '20%',
      render: (text, record) => (
        <span>
          <span>
            <img style={{ width: 20, marginRight: '4px', marginTop: '-4px' }} src={logoSVG} />
          </span>
          {record[`${selectValue}_volume`]
            ? Number(record[`${selectValue}_volume`] / 100000000).toFixed(2)
            : record[`${selectValue}_volume`]}
        </span>
      )
    },
    {
      key: `price`,
      dataIndex: 'price',
      title: 'Floor Price',
      width: '20%',
      render: (text, record) => (
        <span>
          <span>
            <img style={{ width: 20, marginRight: '4px', marginTop: '-4px' }} src={logoSVG} />
          </span>
          {record[`current_floor_price`]
            ? Number(record[`current_floor_price`] / 100000000).toFixed(2)
            : record[`current_floor_price`]}
          {/* {record[`${selectValue}_floor_price`]
            ? Number(record[`${selectValue}_floor_price`] / 100000000).toFixed(2)
            : record[`${selectValue}_floor_price`]} */}
        </span>
      )
    },
    {
      key: 'percentage',
      dataIndex: 'percentage',
      title: '7d %',
      width: '20%',
      render: (text, record) => {
        const unit = record[`${selectValue}_gain`] > 0 ? '+' : ''
        return (
          <span style={{ color: unit ? '#52C41A' : '#E02020' }}>
            {unit}
            {record[`${selectValue}_gain`]
              ? Math.round(record[`${selectValue}_gain`] * 100 * 100) / 100 + '%'
              : record[`${selectValue}_gain`]}
          </span>
        )
      }
    },
    { key: 'owner_count', dataIndex: 'owner_count', title: 'Owners', width: '15%' }
  ]

  return (
    <div className="home-list">
      <div className="title">
        <span>{title}</span>
        <span className="topList-select" style={{ marginLeft: 8 }}>
          Last 7d
        </span>
        {/* <Select className="topList-select" bordered={false} defaultValue="day7" onChange={handleSelect}>
          <Option value="day7">Last 7d</Option>
        </Select> */}
      </div>
      <Table
        onRow={(record) => {
          return {
            onClick: () => {
              history.push(`/collection/${record.key}/items`)
            } // 点击行
          }
        }}
        className="home-list-table"
        rowClassName="home-list-table-row"
        dataSource={data.length > 5 ? data.slice(0, 5) : data}
        columns={columns}
        rowKey={(record) => record.id}
        pagination={false}
      />
      {/* {
        width > 600 ? (
          <Table
            onRow={(record) => {
              return {
                onClick: () => {
                  history.push(`/collection/${record.key}`)
                } // 点击行
              }
            }}
            className="home-list-table"
            rowClassName="home-list-table-row"
            dataSource={data.length > 5 ? data.slice(0, 5) : data}
            columns={columns}
            rowKey={(record) => record.id}
            pagination={false}
          />
        ) : null
        // <MobileTable columns={columns} data={data} onClick={(row) => history.push(`/collection/${record.key}`)} />
      } */}
    </div>
  )
})
