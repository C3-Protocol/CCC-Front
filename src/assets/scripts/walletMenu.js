import mywallet from '@/assets/images/wallet/my_wallet.png'
import drew from '@/assets/images/wallet/drew.png'
import offers from '@/assets/images/wallet/offers.png'
import favorite from '@/assets/images/wallet/favorite.png'

const WalletMenuConfig = [
  {
    title: 'My Wallet',
    key: '/wallet/mywallet',
    icon: mywallet,
    type: 'pink'
  },
  {
    title: 'Drew',
    key: '/wallet/drew',
    icon: drew,
    type: 'yellow'
  },
  {
    title: 'Offers',
    key: '/wallet/offers',
    icon: offers,
    type: 'green'
  },
  {
    title: 'Favorites',
    key: '/wallet/favorites',
    icon: favorite,
    type: 'red'
  }
]

export default WalletMenuConfig
