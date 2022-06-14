export const AloneCreate = 'alone'
export const CrowdCreate = 'crowd'
export const ZombieNFTCreate = 'zombie'
export const ThemeCreate = 'theme'
export const Theme1155Create = 'theme1155'
export const M1155Create = 'm1155'
export const TurtlesCreate = 'turtles'
export const ArtCreate = 'create'
export const ArtCollection = 'artColl:'
//gang
export const gangNFTCreate = 'gang'
export const Crystals3d = 'ICDmail'

export const getCanvasWidth = (type) => (type !== AloneCreate ? 200 : 400)
export const DFINITY_TYPE = 'dfinity'
export const PLUG_TYPE = 'plug'
export const STOIC_TYPE = 'stoic'
export const INFINITY_TYPE = 'infinity'

export const ContentPaddingTop = '4.5rem'
export const PhoneContentPaddingTop = '3.3rem'
export const PhoneContentWidth = '98%'

export const isTestNet = process.env.DFX_NETWORK !== 'ic_line'

export const isCanvas = (type) => {
  return (
    type === CrowdCreate ||
    type === M1155Create ||
    type === AloneCreate ||
    type === Theme1155Create ||
    type === ThemeCreate
  )
}
export const C3ProtocolUrl = isTestNet ? 'https://testnet.c3-protocol.art' : 'https://market.c3-protocol.art'

export const homeListUrl = isTestNet ? 'https://test.backend.ccc.cmdb.xyz' : 'https://web-backend.c3-protocol.com'

export const BlindBoxStatus = {
  NotOpen: 1,
  CanOpen: 2,
  AutoOpen: 3
}
