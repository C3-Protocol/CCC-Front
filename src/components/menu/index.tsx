import React from 'react'
import { Menu, Avatar } from 'antd'
import { Storage } from '@/utils/utils'

const { Item, SubMenu } = Menu

const BaseMenu = (props) => {
  const mlist = props.MenuConfig

  const handleSetItemCurrentKey = (key) => {
    props.currentItemKey && Storage.set(props.currentItemKey, key)
    props.handlerItemSelect && props.handlerItemSelect(key)
  }


  // render menu
  const renderMenu = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <SubMenu key={item.key} title={item.title}>
            {renderMenu(item.children)}
          </SubMenu>
        )
      }
      return (
        <Item
          key={item.key}
          icon={item.icon && <Avatar src={item.icon} style={{ background: '#ccc' }} />}
          onClick={(item) => handleSetItemCurrentKey(item.key)}
        >
          {item.title}
        </Item>
      )
    })
  }

  return (
    <Menu
      className={props.className}
      mode={props.mode}
      style={{ backgroundColor: 'transparent', width: props.width, justifyContent: 'center' }}
      defaultOpenKeys={[props.currKey]}
      defaultSelectedKeys={props.currKey}
      selectedKeys={[props.currKey]}
    >
      {renderMenu(mlist)}
    </Menu>
  )
}

export default BaseMenu
