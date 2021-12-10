import {
  NFT_ALONE_FACTORY_ID,
  NFT_MULTI_FACTORY_ID,
  WICP_MOTOKO_ID,
  LEDGER_CANISTER_ID,
  WICP_STORAGE_ID,
  HOST_URL
} from 'canister/local/id.js'
import { Storage, compareArray } from '@/utils/utils'

export default class Plug {
  constructor() {
    this.plug = window?.ic?.plug
    this.plugAgent = window?.ic?.plug?.agent
    let plugWhitelist = Storage.get('plugWhitelist')
    if (!plugWhitelist) {
      this.whiteListSets = new Set([
        NFT_ALONE_FACTORY_ID,
        NFT_MULTI_FACTORY_ID,
        WICP_MOTOKO_ID,
        LEDGER_CANISTER_ID,
        WICP_STORAGE_ID
      ])
    } else {
      this.whiteListSets = new Set(plugWhitelist)
    }
  }

  getPlugAgent() {
    return window?.ic?.plug?.agent
  }

  async isConnected() {
    if (this.plug) return await this.plug.isConnected()
    return false
  }

  async createActor(idl, id) {
    if (!this.plug) return
    let res = await this.verifyConnectionAndAgent([id])
    if (res) {
      if (process.env.NODE_ENV === 'development' && this.getPlugAgent()) {
        await this.getPlugAgent().fetchRootKey()
      }
      let actor = await this.plug.createActor({
        canisterId: id,
        interfaceFactory: idl
      })
      return actor
    }
  }

  // Make the request
  async requestConnect(lists) {
    let whitelist
    if (lists && lists.length) {
      for (let item of lists) {
        this.whiteListSets.add(item)
      }
      whitelist = [...this.whiteListSets]
    } else {
      whitelist = [...this.whiteListSets]
    }
    if (this.plug) {
      console.error('requestConnect lists:', lists, HOST_URL)
      let res = await this.plug.requestConnect({ whitelist, host: HOST_URL })
      let prinId = await this.getPlugAgent().getPrincipal()
      Storage.set('plugWhitelist', whitelist)
      Storage.set('plugPrinId', prinId.toText())
      return res
    }
  }

  // create plug agent
  async verifyConnectionAndAgent(lists = [], host = HOST_URL) {
    console.log('verifyConnectionAndAgent lists:', lists, host)
    if (!this.plug) return
    let add = this.whiteListSets.size
    if (lists && lists.length) {
      for (let item of lists) {
        this.whiteListSets.add(item)
      }
      add = this.whiteListSets.size - add
    }
    console.log('verifyConnectionAndAgent lists1:', this.whiteListSets, add)
    let whitelist = [...this.whiteListSets]
    try {
      let connected = await this.isConnected()
      if (!connected) {
        let res = await this.requestConnect({ whitelist, host })
        let status = res ? 'allowed' : 'denied'
        if (status) {
          let prinId = await this.plug.agent.getPrincipal()
          Storage.set('plugWhitelist', whitelist)
          Storage.set('plugPrinId', prinId.toText())
        }
        return status
      } else {
        let exist = Storage.get('plugWhitelist')
        if ((!exist && whitelist) || (exist && whitelist && !compareArray(exist, whitelist) && add > 0)) {
          let res = await this.requestConnect({ whitelist, host })
          let status = res ? 'allowed' : 'denied'
          if (status) {
            Storage.set('plugWhitelist', whitelist)
            return status
          }
        } else {
          return true
        }
      }
    } catch (err) {
      console.log('error', err)
    }
  }
}
