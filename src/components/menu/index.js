import React, { useState, useEffect, useContext } from 'react'
import { Menu } from 'antd'
import { Storage } from '@/utils/utils'

const { Item, SubMenu } = Menu

const BaseMenu = (props) => {
  const [mlist] = useState(props.MenuConfig)

  const handleSetItemCurrentKey = (key) => {
    console.log('onselect = ' + key)
    Storage.set(props.currentItemKey, key)
    props.handlerItemSelect && props.handlerItemSelect(key)
  }

  const myIcon = (icon) => React.createElement('img', { src: icon })

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
          icon={item.icon && myIcon(item.icon)}
          onClick={(item) => handleSetItemCurrentKey(item.key)}
          className={`ant-menu-item-${item.type}`}
        >
          {item.title}
        </Item>
      )
    })
  }

  return (
    <Menu
      mode={props.mode}
      style={{ backgroundColor: 'transparent', maxWidth: props.width }}
      defaultOpenKeys={[props.currKey]}
      defaultSelectedKeys={props.currKey}
      selectedKeys={[props.currKey]}
    >
      {renderMenu(mlist)}
    </Menu>
  )
}

export default BaseMenu
