import React, { useState, useEffect } from 'react'
import { Row, Col, Form, List, Avatar, Input, Button, message } from 'antd'
import { subEmail } from '@/api/handler.js'
import { FooterWrapper } from './style'
import footerBg from '@/assets/images/footer/footer_bg.svg'
import Link01 from '@/assets/images/footer/app_ico_01.png'
import Link02 from '@/assets/images/footer/app_ico_02.png'
import Link03 from '@/assets/images/footer/app_ico_03.png'
import Link04 from '@/assets/images/footer/app_ico_04.png'
import Link05 from '@/assets/images/footer/app_ico_05.png'

const Footer = React.memo((props) => {
  const [link] = useState([
    { icon: Link01, url: 'https://t.me/joinchat/sfq9yoY39NUwMmZl' },
    { icon: Link02, url: 'https://twitter.com/CCCProtocol' },
    { icon: Link03, url: 'https://medium.com/@CCCProtocol' },
    { icon: Link04, url: 'https://github.com/C3-Protocol' },
    { icon: Link05, url: 'https://discord.gg/jgyp6prPuj' }
  ])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOnChange = (str) => {
    setEmail(str.target.value)
  }

  // Subscribe Email
  const handleSubscribeEmail = async () => {
    try {
      setLoading(true)
      const res = await subEmail(email)
      if (res.ok) {
        message.success('Subscribe Success!')
        setLoading(false)
      }
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }
  useEffect(() => {}, [])
  return (
    <FooterWrapper bg={footerBg}>
      <div className="content">
        <div className="form-wrapper">
          <h3>Join our newsletter</h3>
          <Form layout="inline" size="large" onFinish={handleSubscribeEmail} autoComplete="off">
            <Form.Item
              name="email"
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!'
                },
                {
                  required: true,
                  message: 'Please input your E-mail!'
                }
              ]}
            >
              <Input type="text" placeholder="Your email address" onChange={handleOnChange} />
            </Form.Item>
            <Form.Item>
              <Button type="default" htmlType="submit" loading={loading}>
                Subscribe
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div className="list">
          {link.map((item, index) => {
            return (
              <a href={item.url} target="_blank" rel="noopener noreferrer" key={index}>
                <img src={item.icon} />
              </a>
            )
          })}
        </div>
      </div>
    </FooterWrapper>
  )
})

export default Footer
