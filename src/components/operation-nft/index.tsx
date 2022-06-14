import React from 'react'
import { BlindBoxStatus } from '@/constants'
import { Dropdown, Menu } from 'antd'
import more from '@/assets/images/icon/more.svg'

interface infoType {
  seller?: any
}
interface propsType {
  canOperation?: boolean
  listingInfo?: infoType
  blindBoxStatus?: any
  isBlindBox?: boolean
  handlerOnButtonClick: (key1?: any, key2?: string) => void
  handlerBuyClick: (key?: any) => void
  handlerOnTransferClick: (key?: any) => void
  handlerOpenBlindboxClick: (key?: any) => void
}

export default React.memo((props: propsType) => {
  const { handlerOnTransferClick, handlerOnButtonClick,handlerOpenBlindboxClick, handlerBuyClick, isBlindBox, listingInfo, canOperation, blindBoxStatus } = props
  const operationContext = () => {
    let content = []
    if (canOperation) {
      const obj = {
        title: listingInfo && listingInfo.seller ? 'Cancel' : 'Sell',
        click: (e) => handlerOnButtonClick(e, 'change')
      }
      content.push(obj)
      
      if (listingInfo && listingInfo.seller) {
        const objUpdate = {
          title: 'Update',
          click: (e) => handlerOnButtonClick(e, 'update')
        }
        content.push(objUpdate)
      }else{
        const objUpdate = {
          title: 'Transfer',
          click: (e) => handlerOnTransferClick(e)
        }
        content.push(objUpdate)
      }
      if (!(listingInfo && listingInfo.seller) && blindBoxStatus === BlindBoxStatus.CanOpen && isBlindBox) {
        const objBox = {
          title: 'Open box',
          click: (e) => handlerOpenBlindboxClick(e)
        }
        content.push(objBox)
      }
    } else if ((listingInfo && listingInfo.seller)) {
      const objBuy = {
        title: 'Buy',
        click: (e) => handlerBuyClick(e)
      }
      content.push(objBuy)
    }
    return (
      <Menu className="operation-menu">
        {content.map((va, index) => {
          return (
            <div key={va.title}>
              <Menu.Item key={va.title} onClick={(e: any)=>{ 
                e.domEvent.stopPropagation()
                va.click(e.domEvent)}} className="operation-menu-item">
                {va.title}
              </Menu.Item>
              {index !== content.length - 1 && <Menu.Divider className="operation-menu-divider" />}
            </div>
          )
        })}
      </Menu>
    )
  }

  return (
    <Dropdown overlay={operationContext()} className="operation-drop" overlayClassName="operation-overlay-menu">
      <img src={more} onClick={(e) => e.stopPropagation()}/>
    </Dropdown>
  )
})
