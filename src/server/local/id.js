export const NFT_ALONE_FACTORY_ID =
  process.env['DFX_NETWORK'] === 'ic' ? '' : 'q4eej-kyaaa-aaaaa-aaaha-cai'
export const NFT_MULTI_FACTORY_ID =
  process.env['DFX_NETWORK'] === 'ic' ? '' : 'sgymv-uiaaa-aaaaa-aaaia-cai'
export const WICP_MOTOKO_ID =
  process.env['DFX_NETWORK'] === 'ic' ? '' : 'qhbym-qaaaa-aaaaa-aaafq-cai'
export const STORAGE_EMAIL_CID =
  process.env['DFX_NETWORK'] === 'ic' ? '' : 't6rzw-2iaaa-aaaaa-aaama-cai'
export const WICP_STORAGE_ID =
  process.env['DFX_NETWORK'] === 'ic' ? '' : '2i5un-taaaa-aaaaa-aab7q-cai'
export const NFT_MULTI_STORAGE_ID = process.env['DFX_NETWORK'] === 'ic' ? '' : 'n4t2m-tyaaa-aaaaa-aacba-cai'
export const NFT_ALONE_STORAGE_ID = process.env['DFX_NETWORK'] === 'ic' ? '' : ''

export const LEDGER_CANISTER_ID =
  process.env['DFX_NETWORK'] === 'ic' ? 'ryjl3-tyaaa-aaaaa-aaaba-cai' : 'ryjl3-tyaaa-aaaaa-aaaba-cai'
export const II_LOCAL_URL =
  process.env['DFX_NETWORK'] === 'ic' ? 'https://identity.ic0.app/#authorize' : 'http://localhost:8888/'
export const HOST_URL =
  process.env['DFX_NETWORK'] === 'ic' ? 'https://mainnet.dfinity.network' : 'http://localhost:8888/'
