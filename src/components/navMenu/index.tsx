import React from 'react'
import MenuConfig from '@/assets/scripts/menu'
import { NavLink, useLocation } from 'react-router-dom'
import { Dropdown, Menu } from 'antd'
//import { DownOutlined } from '@ant-design/icons'
import lauDefault from '@/assets/images/launchpad/lau-default.png'
import lauActive from '@/assets/images/launchpad/lau-active.png'
import Dialog from '@/components/dialog'
import { Storage } from '@/utils/utils'
import CreateAll from '@/pages/create/view/create-all'
import './style.less'

export default () => {
  const location = useLocation()
  let pathName = location.pathname
  if (pathName.startsWith('/wallet/')) pathName = '/wallet'
  const currKey = pathName || (Storage.get('currentItemKey') ? Storage.get('currentItemKey') : `${MenuConfig[0].key}`)
  const flag = ['/launchpad', '/airdrop'].find((v) => v === currKey)

  const onMenuItemClick =(e, key)=>{
    if (key === '/create'){
      e.stopPropagation()
      Dialog.createAndShowDialog(<CreateAll />, 0)
    }
  }
  const myIcon = (icon) => React.createElement('img', { src: icon })

  const renderChildren = (data, index) => {
    const menu = (
      <Menu className="top-menu">
        {data.map((item, index) => {
          return (
            <div key={item.key}>
              <Menu.Item >
                <NavLink className={(isActive) => 'nav-link' + (isActive ? ' selected-link' : '')} to={item.key}>
                  {myIcon(item.icon)}
                  <span style={{ marginLeft: 4 }}>{item.title}</span>
                </NavLink>
              </Menu.Item>
              {data.length !== index + 1 && <Menu.Divider />}
            </div>
          )
        })}
      </Menu>
    )
    return (
      <Dropdown overlay={menu} arrow={false} overlayClassName={'menu-drop'} key={index}>
        <span
          className="nav-dropdown-link"
          style={{ color: flag ? '#000' : '#6d7278' }}
          onClick={(e) => e.preventDefault()}
        >
          <span>Launchpad</span>
          <img src={flag ? lauActive : lauDefault} className="menu-arrow" />
        </span>
      </Dropdown>
    )
  }
  return (
    <div className="menu-nav">
      {MenuConfig.map((item, index) => {
        if (item.multiple) {
          return renderChildren(item.multiple, index)
        }
        return (item.key === '/create' ?  <a className='nav-link' key={item.key} onClick={(e)=>onMenuItemClick(e, item.key)}>
            {myIcon(item.icon)}
            <span style={{ marginLeft: 4 }}>{item.title}</span>
          </a>:
          <NavLink className={(isActive) => 'nav-link' + (isActive ? ' selected-link' : '')} to={item.key} key={item.key}>
            {myIcon(item.icon)}
            <span style={{ marginLeft: 4 }}>{item.title}</span>
          </NavLink>
        )
      })}
    </div>
  )
}
