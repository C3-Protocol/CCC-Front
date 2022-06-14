// import Hot from '@/assets/images/icon/hot.svg'
// import New from '@/assets/images/icon/new.svg'
const MenuConfig = [
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
    title: '',
    key: 'test',
    type: 'select',
    multiple: [
      {
        title: 'Launchpad',
        key: '/launchpad'
        // icon: New
      },
      {
        title: 'AirDrop',
        key: '/airdrop'
        // icon: Hot
      }
    ]
  },
  {
    title: 'Create',
    key: '/create',
    icon: ''
  }
]

export default MenuConfig
