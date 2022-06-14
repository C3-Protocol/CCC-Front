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

export default class InfinitySwap {
  constructor() {
    this.infinityWallet = window?.ic?.infinityWallet
    let infinityWhitelist = Storage.get('infinityWhitelist')
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
    if (!infinityWhitelist) {
      this.whiteListSets = new Set(whiteList)
    } else {
      this.whiteListSets = new Set(whiteList)
      for (let item of infinityWhitelist) {
        this.whiteListSets.add(item)
      }
    }
    this.requestList = null
  }

  async isConnected() {
    const connected = await this.infinityWallet.isConnected()
    return connected
  }

  async createActor(idl, id) {
    if (!this.infinityWallet) return
    let res = await this.verifyConnectionAndAgent([`${id}`])
    if (res) {
      let actor = await this.infinityWallet.createActor({
        canisterId: id,
        interfaceFactory: idl
      })
      return actor
    }
  }

  resetRequest() {
    this.requestList = null
  }

  async loginOut() {
    this.infinityWallet.disconnect()
  }

  async getInfinityPrincipalId() {
    return await this.infinityWallet.getPrincipal()
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
    if (this.infinityWallet) {
      let res
      try {
        res = await this.infinityWallet.requestConnect({ whitelist, host: HOST_URL })
        this.requestList = null
        if (res) {
          Storage.set('infinityWhitelist', whitelist)
          return res
        }
      } catch (err) {
        console.warn('infinityswap request error', err)
        this.requestList = null
      }
    }
  }

  async verifyConnectionAndAgent(lists = [], host = HOST_URL) {
    if (!this.infinityWallet) return
    if (lists && lists.length) {
      for (let item of lists) {
        this.whiteListSets.add(item)
      }
    }
    let whitelist = [...this.whiteListSets]
    try {
      let connected = await this.isConnected()
      if (!connected || !this.infinityWallet.agent) {
        let res = await this.requestConnect({ whitelist, host })
        return res
      } else {
        let exist = Storage.get('infinityWhitelist')
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
