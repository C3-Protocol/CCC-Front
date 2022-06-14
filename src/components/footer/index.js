import React, { useState, useEffect } from 'react'
import './style.less'
import ContactEmail from '@/assets/images/icon/email.svg'
import ContactDiscord from '@/assets/images/icon/discord.svg'
import Medium from '@/assets/images/footer/medium.png'
import GitHub from '@/assets/images/footer/github.png'
import Twitter from '@/assets/images/footer/twitter.png'
import Discord from '@/assets/images/footer/discord.png'
import Youtube from '@/assets/images/footer/youtube.png'
import CCCLogo from '@/assets/images/footer/ccc_logo_white.png'

const Footer = React.memo((props) => {
  const [link] = useState([
    { icon: Twitter, url: 'https://twitter.com/CCCProtocol' },
    { icon: Medium, url: 'https://medium.com/@CCCProtocol' },
    { icon: GitHub, url: 'https://github.com/C3-Protocol' },
    { icon: Discord, url: 'https://discord.gg/jgyp6prPuj' },
    { icon: Youtube, url: 'https://www.youtube.com/channel/UCI62B4ru5ZPXDRUzxcBSbMQ' }
  ])

  useEffect(() => {}, [])
  return (
    <div className="footer-wrapper">
      <div className="content-left">
        <img className="title" src={CCCLogo}></img>
        <p>
          CCC stands for Crowd Created Collectables, the first entirely decentralized collaborative platform with a
          unique goal of connecting and allowing 50 million creators to participate in Web3 world.
        </p>
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
      <div className="content-right">
        <h4>Contact us</h4>
        <div className="flex-10">
          <div className="tip-img">
            <img src={ContactEmail}></img>
          </div>
          <span>C3-Protocol@outlook.com</span>
        </div>
        <div className="margin-10 flex-10">
          <div className="tip-img">
            <img src={ContactDiscord}></img>
          </div>
          <span>CCC_Official#6678</span>
        </div>
      </div>
    </div>
  )
  // return (
  //   <FooterWrapper bg={footerBg} bg1={footerBg1} bg2={footerBg2}>
  //     <div className="content">
  //       <div className="form-wrapper">
  //         <h3>Join our newsletter</h3>
  //         <div className="flex-0">
  //           <Input type="text" placeholder="Your email address" onChange={handleOnChange} />
  //           <Button type="default" htmlType="submit" loading={loading}>
  //             Subscribe
  //           </Button>
  //         </div>
  //       </div>
  //       <div className="list">
  //         {link.map((item, index) => {
  //           return (
  //             <a href={item.url} target="_blank" rel="noopener noreferrer" key={index}>
  //               <img src={item.icon} />
  //             </a>
  //           )
  //         })}
  //       </div>
  //     </div>
  //   </FooterWrapper>
  // )
})

export default Footer
