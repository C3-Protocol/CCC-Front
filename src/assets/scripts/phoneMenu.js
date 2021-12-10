import mywallet from '@/assets/images/wallet/my_wallet.png'
import drew from '@/assets/images/wallet/drew.png'
import offers from '@/assets/images/wallet/offers.png'
import favorite from '@/assets/images/wallet/favorite.png'
const PhoneMenuConfig = [
  {
    title: 'Canvas Gallery',
    key: '/all',
    icon: ''
  },
  {
    title: 'MarketPlace',
    key: '/marketplace',
    icon: ''
  },
  {
    title: 'Create',
    key: '/create',
    icon: ''
  },
  {
    title: 'Wallet',
    key: '/wallet',
    icon: '',
    children: [
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
        title: 'Favorites',
        key: '/wallet/favorites',
        icon: favorite,
        type: 'red'
      }
    ]
  },
  {
    title: 'Rules',
    key: '/rule',
    icon: ''
  }
]

export default PhoneMenuConfig
