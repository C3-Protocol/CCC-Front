import React, { useState } from 'react'
import './style.less'
import {  Button, Form, InputNumber } from 'antd'
import { createHashHistory } from 'history' 
import PubSub from 'pubsub-js'
import { CloseDialog } from '@/message'

const CreateCanvasForm = (props) => {
   const history = createHashHistory()

  const [curColor, setCurColor] = useState('#FFFFFF')
  const handlerGoToCreate = (value)=>{
    history.push(`/canvas/create/${value.width || 1000}/${value.width || 1000}/${encodeURIComponent(curColor)}`)
    props.setCreateVisible(false)
    PubSub.publish(CloseDialog, {})
    
  }
  const recommendColor = ['#E02020','#FA6400','#F7B500','#6DD400','#44D7B6','#32C5FF','#FFFFFF','#000000']
  

  return (
    <div className='create-on-chain-dailog'>
    <Form size="large" autoComplete="off" preserve={false} onFinish={handlerGoToCreate}  >
      <Form.Item label={'Size:'} labelAlign="left" required={false} key={'size'} labelCol= {{span: 3}} wrapperCol= {{span: 22}}>
          <Form.Item className="margin-10" name="height">
            <InputNumber
              min={0}
              max={3000}
              controls={false}
              precision={0}
              placeholder="Height"
              addonAfter={`px`}
            />
          </Form.Item> 
          <div className='required-field margin-10'> Max：3000px</div>
          <Form.Item className="margin-25" name="width"  >
            <InputNumber
              min={0}
              max={3000}
              controls={false}
              precision={0}
              placeholder="Width"
              addonAfter={`px`}
            />
          </Form.Item> 
          <div className='required-field margin-10'> Max：3000px</div>
      </Form.Item>
      
      <div className='divider'/>

      <Form.Item labelCol= {{span: 6}} wrapperCol= {{span: 28}}>
        <Form.Item  label="Recommend color:" labelAlign="left">
          <div className='flex-content'>
          {recommendColor.map((color, index)=>{
            return <div key={index} className={curColor === color ? 'selected-color': `normal-color ${color === '#FFFFFF'? 'white-bg-border':''}`}  style={{background: color}} onClick={()=>setCurColor(color)}/>
          })}
          </div>
          
        </Form.Item> 
      </Form.Item>
      
      <div className='divider'/>

      <Form.Item>
        <div className="flex-40" style={{ margin: '10px auto', width: 'fit-content' }}>
          <Button  onClick={()=>props.setCreateVisible(false)} className="ccc-cancel-btn">
            Cancel
          </Button>
          
          <Button  htmlType="submit" className="ccc-confirm-btn">
            Confirm
          </Button>
          
          
        </div>
      </Form.Item>
    </Form>

  </div>
  )
}

export default CreateCanvasForm
