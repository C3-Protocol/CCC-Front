const PhoneMenuConfig = [
  {
    title: '',
    key: '/all',
    icon: ''
  },
  {
    title: 'Explore',
    key: '/marketplace',
    icon: ''
  },
  {
    title: 'Launchpad',
    key: '/launchpad',
    icon: ''
  },
  {
    title: 'AirDrop',
    key: '/airdrop',
    icon: ''
  },
  {
    title: 'Create',
    key: '/create',
    icon: ''
  },
  {
    title: 'Assets',
    key: '/wallet',
    icon: '',
    children: [
      {
        title: 'Collected',
        key: '/assets/wallet/myarts'
      },
      {
        title: 'Create',
        key: '/createItems',
        children: [
          {
            title: 'Collections',
            key: '/assets/wallet/createCollections'
          },
          {
            title: 'Items',
            key: '/assets/wallet/createItems'
          }
        ]
      },
      {
        title: 'Staking',
        key: '/assets/wallet/staking'
      },
      {
        title: 'Drew',
        key: '/assets/wallet/drew'
      },
      {
        title: 'Favorites',
        key: '/assets/wallet/favorites'
      },
      {
        title: 'Transaction Record',
        key: '/assets/wallet/transaction'
      }
    ]
  }
]

export default PhoneMenuConfig
