import React, { memo } from 'react'
import LeftMenu from '@/components/menu'
import WalletMenuConfig from '@/assets/scripts/walletMenu'
import { WalletWrapper, FlexWrapper, ScrollWrapper, RightContentWrapper, LeftMenuWrapper } from './style'
import background from '@/assets/images/wallet_bg.png'
import { Storage, isCollapsed } from '@/utils/utils'
import MyWallet from './view/my-wallet'
import Drew from './view/drew'
import Offers from './view/offers'
import Favorites from './view/favorites'
import { HashRouter, Route, useHistory, Redirect } from 'react-router-dom'

function Wallet(props) {
  //const pathName = props.history.location.pathname
  let initKey = Storage.get('walletItemKey') ? Storage.get('walletItemKey') : `${WalletMenuConfig[0].key}`
  if (!initKey.startsWith('/wallet/')) initKey = '/wallet/' + initKey
  const history = useHistory()

  const handlerItemSelect = (key) => {
    history.push(key)
  }

  return (
    <HashRouter>
      <WalletWrapper bg={background}>
        <FlexWrapper>
          {/* 主体内容 */}
          {!isCollapsed() && (
            <LeftMenuWrapper className="wallet" bg={background}>
              <LeftMenu
                MenuConfig={WalletMenuConfig}
                currKey={initKey}
                route={false}
                currentItemKey={'walletItemKey'}
                mode={'vertical'}
                minWidth={'299px'}
                handlerItemSelect={handlerItemSelect}
              />
            </LeftMenuWrapper>
          )}
          <ScrollWrapper>
            <RightContentWrapper>
              <Route exact path="/wallet">
                <Redirect to="/wallet/mywallet" />
              </Route>
              <Route path="/wallet/mywallet" component={MyWallet} />
              <Route path="/wallet/drew" component={Drew} />
              <Route path="/wallet/offers" component={Offers} />
              <Route path="/wallet/favorites" component={Favorites} />
            </RightContentWrapper>
          </ScrollWrapper>
        </FlexWrapper>
      </WalletWrapper>
    </HashRouter>
  )
}

export default memo(Wallet)
