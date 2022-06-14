import React, { useState } from 'react'
import { Menu } from 'antd'
import { SettingWrapper, SettingContentWrapper } from './style'
import Profile from './profile'

function Setting(props) {
  const typeList = ['profile']
  const [curType, setCurType] = useState(typeList[0])
  const leftMenuList = ['Profile Settings']

  const onChangeTab = (key) => {
    if (key !== curType) {
      setCurType(key)
    }
  }

  const getLeftMenuContent = (
    <Menu
      onClick={(e) => {
        onChangeTab(e.key)
      }}
    >
      {leftMenuList.map((item, index) => {
        return <Menu.Item key={typeList[index]}>{item}</Menu.Item>
      })}
    </Menu>
  )

  const getLRightContent = () => {
    let content
    curType === 'profile' && (content = <Profile />)
    return content
  }

  return (
    <SettingWrapper>
      <SettingContentWrapper>
        <div className="left-menu">{getLeftMenuContent}</div>
        <div className="right-content">{getLRightContent()}</div>
      </SettingContentWrapper>
    </SettingWrapper>
  )
}

export default Setting
