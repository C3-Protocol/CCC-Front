import {
  NFT_ALONE_FACTORY_ID,
  NFT_MULTI_FACTORY_ID,
  WICP_MOTOKO_ID,
  LEDGER_CANISTER_ID,
  WICP_STORAGE_ID,
  NFT_ZOMBIE_FACOTRY_ID,
  NFT_1155_FACTORY_ID,
  NFT_THEME_FACTORY_ID,
  PROFILE_FACTORY_ID,
  HOST_URL
} from 'canister/local/id.js'
import { Storage } from '@/utils/utils'

export default class Plug {
  constructor() {
    this.plug = window?.ic?.plug
    this.plugAgent = window?.ic?.plug?.agent
    let plugWhitelist = Storage.get('plugWhitelist')
    let whiteList = [
      NFT_ALONE_FACTORY_ID,
      NFT_MULTI_FACTORY_ID,
      WICP_MOTOKO_ID,
      LEDGER_CANISTER_ID,
      WICP_STORAGE_ID,
      NFT_ZOMBIE_FACOTRY_ID,
      NFT_1155_FACTORY_ID,
      NFT_THEME_FACTORY_ID,
      PROFILE_FACTORY_ID
    ]
    if (!plugWhitelist) {
      this.whiteListSets = new Set(whiteList)
    } else {
      this.whiteListSets = new Set(whiteList)
      for (let item of plugWhitelist) {
        this.whiteListSets.add(item)
      }
    }
    this.requestList = null
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
    let res = await this.verifyConnectionAndAgent([`${id}`])
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

  resetRequest() {
    this.requestList = null
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
    if (this.requestList && whitelist.length === this.requestList.length) {
      return
    }
    this.requestList = whitelist
    if (this.plug) {
      let res
      try {
        res = await this.plug.requestConnect({ whitelist, host: HOST_URL })
        this.requestList = null
        if (res) {
          let prinId = await this.getPlugAgent().getPrincipal()
          Storage.set('plugWhitelist', whitelist)
          Storage.set('plugPrinId', prinId.toText())
          return res
        }
      } catch (err) {
        console.warn('plug request error', err)
        this.requestList = null
      }
    }
  }

  // create plug agent
  async verifyConnectionAndAgent(lists = [], host = HOST_URL) {
    if (!this.plug) return
    if (lists && lists.length) {
      for (let item of lists) {
        this.whiteListSets.add(item)
      }
    }
    let whitelist = [...this.whiteListSets]
    try {
      let connected = await this.isConnected()
      if (!connected) {
        let res = await this.requestConnect({ whitelist, host })
        return res
      } else {
        if (!window.ic.plug.agent) {
          await window.ic.plug.createAgent({ whitelist })
        }
        let exist = Storage.get('plugWhitelist')
        if ((!exist && whitelist.length) || (exist && whitelist.length && exist.length !== whitelist.length)) {
          let res = await this.requestConnect({ whitelist, host })
          return res
        }
        return true
      }
    } catch (err) {
      console.log('error', err)
    }
  }
}
