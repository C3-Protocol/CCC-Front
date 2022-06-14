import React, { useState, useEffect } from 'react'
import { Form, Input, InputNumber, Button, message, Select } from 'antd'
import './style.less'
import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import PubSub from 'pubsub-js'
import { ShowAuthDrawer } from '@/message'
import { isAuthTokenEffect, getValueDivide8 } from '@/utils/utils'
import { getCreateCollectionByUser } from '@/pages/home/store/actions'
import Toast from '@/components/toast'
import { requestCanister } from '@/api/handler'
import { createNewNFT, getCollectionConfigParam } from '@/api/createHandler'
import { useHistory } from 'react-router-dom'
import { MinusCircleOutlined } from '@ant-design/icons'
import { getCreatePubCollection } from '@/pages/home/store/actions'
import { Principal } from '@dfinity/principal'
import lauDefault from '@/assets/images/launchpad/lau-default.png'
import { plusBigNumber } from '../../../../../utils/utils'
const Jimp = require('jimp').default

const CompleteForm = (props) => {
  const layout = {
    labelCol: {
      span: 4
    },
    wrapperCol: {
      span: 24
    }
  }

  const validateMessages = {
    required: '${label} is required!',
    number: {
      range: '${label} must be between ${min} and ${max}'
    }
  }
  const history = useHistory()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const newNFTForm = React.useRef()
  const [config, setConfig] = useState({
    forkRoyaltyRatio: [],
    maxDescSize: 2000,
    totalSupply: 5000,
    uploadProtocolBaseFee: 10000000n,
    uploadProtocolFeeRatio: 1,
    maxRoyaltyRatio: 10,
    maxAttrNum: 20,
    maxNameSize: 20,
    maxCategorySize: 20,
    marketFeeRatio: 1,
    newItemForkFee: []
  })
  const [submitEnable, setSubmitEnable] = useState(false)
  const isFork = props.forkIndex !== undefined

  const { isAuth, authToken, userCollections, pubCollections } = useSelector((state) => {
    let authToken = state['auth'].getIn(['authToken']) || ''
    return {
      isAuth: state['auth'].getIn(['isAuth']) || false,
      authToken,
      userCollections: state['allcavans'].getIn([`createCollection-${authToken}`]) || null,
      pubCollections: state['allcavans'].getIn([`pubCollection`]) || null
    }
  }, shallowEqual)

  useEffect(() => {
    if (isAuthTokenEffect(isAuth, authToken))
      dispatch(
        getCreateCollectionByUser(authToken, () => {
          setLoading(false)
        })
      )
  }, [isAuth, authToken])

  useEffect(() => {
    dispatch(
      getCreatePubCollection(() => {
        setLoading(false)
      })
    )
  }, [])

  useEffect(() => {
    if (isFork && props.type) {
      requestCanister(
        getCollectionConfigParam,
        {
          type: props.type,
          success: (res) => {
            setConfig(res)
          }
        },
        false
      )
    }
  }, [isFork])

  useEffect(() => {
    if (isFork && newNFTForm?.current) {
      newNFTForm?.current.setFieldsValue({
        collection: props.type
      })
      setSubmitEnable(true)
    }
  }, [newNFTForm?.current])

  const confirmFunc = (values) => {
    let notice = Toast.loading('create', 0)
    let imageData = props.getCanvasImageData()
    resizeSelectImage(imageData, 500, 500, async (orignData, thumbnailData) => {
      let data = {
        key: values.collection,
        success: () => {
          message.success('success')
          if (isFork) history.replace(`/assets/wallet/myarts/${authToken}/${props.type}`)
          else history.replace('/assets/wallet/createItems')
          imageData = null
        },
        fail: (res) => {
          message.error(res)
        },
        error: (res) => {
          message.error(res)
        },
        notice
      }
      let attrArr = []
      if (values.attrArr) {
        for (let item of values.attrArr) {
          if (item.traitType && item.name) {
            attrArr.push(item)
          }
        }
      }
      data['param'] = {
        orignData,
        thumbnailData,
        nftType: 'image/png',
        thumbType: 'image/png',
        desc: values.desc || '',
        name: values.name || '',
        parentToken: props.forkIndex !== undefined ? [parseInt(props.forkIndex)] : [],
        attrArr,
        earnings: values.earnings || 0,
        royaltyFeeTo: values.royalty ? Principal.fromText(values.royalty) : Principal.fromText(authToken)
      }
      createNewNFT(data)
    })
  }

  const resizeSelectImage = (buffer, thumbWidth, thumbHeight, callback) => {
    Jimp.read(buffer).then(async (image) => {
      let width = image.bitmap.width
      let height = image.bitmap.height
      if (width > thumbWidth || height > thumbHeight) {
        let scale = Math.min(thumbWidth / width, thumbHeight / height)
        width = Math.floor(scale * width)
        height = Math.floor(scale * height)
        callback(await image.getBufferAsync('image/png'), await image.resize(width, height).getBufferAsync('image/png')) // resize
      } else {
        let buffer = await image.getBufferAsync('image/png')
        callback(buffer, buffer)
      }
    })
  }

  const onFinish = (values) => {
    if (!isAuth) {
      PubSub.publish(ShowAuthDrawer, {})
      return
    }
    confirmFunc(values)
  }

  const handleSelectCollection = (value) => {
    if (value === 'create') {
      history.push('/create/collection')
    } else {
      requestCanister(
        getCollectionConfigParam,
        {
          type: value,
          success: (res) => {
            setConfig(res)
          }
        },
        false
      )
    }
  }

  const horizonalLayout = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 16
    }
  }

  const onFieldsChange = () => {
    const fieldsValue = newNFTForm?.current?.getFieldsValue()
    if (fieldsValue) {
      const required = ['collection']
      const errArr = Object.keys(fieldsValue).filter((item) => {
        let index = required.indexOf(item)
        if (index !== -1) {
          if (!fieldsValue[item]) {
            return true
          }
        }
      })
      setSubmitEnable(errArr.length > 0 ? false : true)
    }
  }

  return (
    <Form
      className="canvas-nft-wrapper"
      {...layout}
      name="nest-messages"
      onFinish={onFinish}
      ref={newNFTForm}
      onFieldsChange={onFieldsChange}
      validateMessages={validateMessages}
    >
      {!isFork && (
        <Form.Item className="margin-10" label="Name" name="name" rules={[{ required: true }]} labelAlign="left">
          <Input showCount maxLength={parseInt(config.maxNameSize)} />
        </Form.Item>
      )}
      <Form.Item className="margin-10" label="Description" name="desc" labelAlign="left">
        <Input.TextArea showCount maxLength={parseInt(config.maxDescSize)} />
      </Form.Item>
      <div className="title margin-40">Add Properties:</div>
      <Form.List name="attrArr">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <div key={key} style={{ width: '100%', display: 'flex', marginTop: 10, alignItems: 'center' }}>
                <Form.Item
                  {...horizonalLayout}
                  {...restField}
                  name={[name, 'traitType']}
                  style={{ width: '35%', alignItems: 'center' }}
                  label="Type"
                  labelAlign="left"
                >
                  <Input maxLength={20} />
                </Form.Item>
                <Form.Item
                  {...horizonalLayout}
                  {...restField}
                  name={[name, 'name']}
                  style={{ width: '35%', alignItems: 'center' }}
                  label="Name"
                  labelAlign="left"
                >
                  <Input maxLength={20} />
                </Form.Item>
                <MinusCircleOutlined onClick={() => remove(name)} />
              </div>
            ))}
            <Form.Item className="margin-40">
              <Button
                className="add-button"
                onClick={() => {
                  if (fields.length >= 10) return
                  add()
                }}
                block
              >
                Add Properties +
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <div className="required-field title margin-40">Collection</div>
      <Form.Item className="margin-10" name="collection" rules={[{ required: true }]}>
        <Select
          dropdownClassName="create-dropdown"
          placeholder="This is the collection where your item will appear"
          loading={loading}
          defaultValue={isFork ? props.type : ''}
          onSelect={handleSelectCollection}
          suffixIcon={<img src={lauDefault} />}
        >
          {isFork && (
            <Select.Option key={props.type} value={props.type}>
              {props.type.split(':')[3]}
            </Select.Option>
          )}
          {!isFork &&
            pubCollections &&
            pubCollections.map((item) => {
              return (
                <Select.Option key={item.title} value={item.key}>
                  {item.title}
                  <div
                    style={{
                      fontSize: '14px',
                      fontFamily: 'Poppins-Medium, Poppins',
                      fontWeight: 500,
                      color: '#FFFFFF',
                      lineHeight: '23px',
                      padding: '2px 16px',
                      background: '#52C41A',
                      borderRadius: '6px',
                      marginLeft: '50px'
                    }}
                  >
                    public
                  </div>
                </Select.Option>
              )
            })}
          {!isFork &&
            userCollections &&
            userCollections.map((item) => {
              return (
                <Select.Option key={item.title} value={item.key}>
                  {item.title}
                  <div
                    style={{
                      fontSize: '14px',
                      fontFamily: 'Poppins-Medium, Poppins',
                      fontWeight: 500,
                      color: '#FFFFFF',
                      lineHeight: '23px',
                      padding: '2px 16px',
                      background: '#4338CA',
                      borderRadius: '6px',
                      marginLeft: '50px'
                    }}
                  >
                    owned
                  </div>
                </Select.Option>
              )
            })}
          {!isFork && (
            <Select.Option key={'create'} value={'create'}>
              {'Create new collection'}
              <div
                style={{
                  fontSize: '14px',
                  fontFamily: 'Poppins-Medium, Poppins',
                  fontWeight: 500,
                  color: '#FFFFFF',
                  lineHeight: '23px',
                  padding: '2px 16px',
                  background: '#E02020',
                  borderRadius: '6px',
                  marginLeft: '50px'
                }}
              >
                charge
              </div>
            </Select.Option>
          )}
        </Select>
      </Form.Item>
      {isFork && (
        <div className="tip margin-10">
          {`Your will fork nft from ${props.type.split(':')[3]}. When the transaction is concluded, you will pay ${
            config.forkRoyaltyRatio[0]
          }% fork fee to collection owner`}
        </div>
      )}
      <div>
        <div className="title margin-40">Creator Earnings</div>
        <div className="tip margin-10">
          Collect a fee when a user re-sells an item you originally created. This is deducted from the final sale price
          and paid monthly to a payout address of your choosing
        </div>
        <Form.Item className="margin-10" name="earnings">
          <InputNumber
            min={0}
            max={parseInt(config.maxRoyaltyRatio)}
            controls={false}
            precision={0}
            placeholder="Percentage fee e.g.2"
            addonAfter={`max ${config.maxRoyaltyRatio}`}
          />
        </Form.Item>

        <div className="title margin-40">Royalty Address</div>
        <div className="tip margin-10">The royalties will be stored in the Principal ID you created on CCC</div>
        <Form.Item className="margin-10" name="royalty">
          <Input placeholder="Entre your Principal ID" />
        </Form.Item>
      </div>
      <div className="divider margin-40"></div>

      <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 0 }} className="margin-40">
        <Button className="ccc-cancel-btn" onClick={props.modalClose}>
          Cancel
        </Button>
        <Button className="ccc-confirm-btn" htmlType="submit" disabled={!submitEnable} style={{ marginLeft: '40px' }}>
          {isAuth ? 'Create NFT' : 'Connect wallet'}
        </Button>
        <div className="required-field warning margin-10">{`Note that you need to pay ${getValueDivide8(
          plusBigNumber(config.uploadProtocolBaseFee, config.newItemForkFee[0] || 0)
        )} WICP to create an artwork once`}</div>
      </Form.Item>
    </Form>
  )
}

export default CompleteForm
