/**
 * create agent
 */
import { Actor, HttpAgent } from '@dfinity/agent'
import { AuthClient } from '@dfinity/auth-client'
import { Storage, principalToAccountId } from '@/utils/utils'
import { II_LOCAL_URL } from 'canister/local/id.js'
import { Principal } from '@dfinity/principal'

import {
  NFT_ALONE_FACTORY_ID,
  NFT_MULTI_FACTORY_ID,
  WICP_MOTOKO_ID,
  LEDGER_CANISTER_ID,
  STORAGE_EMAIL_CID,
  WICP_STORAGE_ID,
  NFT_MULTI_STORAGE_ID
} from 'canister/local/id.js'

import { idlFactory as AloneNFTDIL } from 'canister/local/candid/aloneNFT.did.js'
import { idlFactory as MultiNFTDIL } from 'canister/local/candid/multiNFT.did.js'
import { idlFactory as WICPMotokoDIL } from 'canister/local/candid/WICP_motoko.did.js'
import { idlFactory as AloneCanvasDIL } from 'canister/local/candid/aloneCanvas.did.js'
import { idlFactory as MultiCanvasDIL } from 'canister/local/candid/multiCanvas.did.js'
import { idlFactory as StorageDIL } from 'canister/local/candid/storage.did'
import { idlFactory as InternetIdentiy } from 'canister/local/candid/internet_identity.did.js'
import { idlFactory as WICPStorage } from 'canister/local/candid/wicpStorage.did.js'
import { idlFactory as MultiStorage } from 'canister/local/candid/multiStorage.did.js'
//import { idlFactory as AloneStorage } from 'canister/local/candid/aloneStorage.did.js'
import LedgerCanisterDIL from 'canister/local/candid/ledger.did.js'
import Plug from './plug'
import { DFINITY_TYPE, PLUG_TYPE } from '@/constants'
import { AloneCreate } from '../constants'

const EXPIRED_TIME = 24 * 60 * 60 * 1000 //一天 24 * 60 * 60 * 1000ms

export default class CanisterManager {
  constructor() {
    this.canisterMap = new Map()
    this.plugIdentifyCanisterMap = new Map()
    this.plug = new Plug()
    this.loginType = null
  }

  async getAuthClient() {
    if (!this.authClient) {
      this.authClient = await AuthClient.create()
      this.identity = await this.authClient.getIdentity()
    }
    return this.authClient
  }

  async getIdentity() {
    if (!this.identity) {
      await this.getAuthClient()
    }
    return this.identity
  }

  async getIdentityAgent() {
    const identity = await this.getIdentity()
    let args = { identity }
    // args['host'] = 'https://boundary.ic0.app/'
    if (!this.identityAgent) this.identityAgent = new HttpAgent(args)
    return this.identityAgent
  }

  async dealWithDfinityIdentityInfo(callback) {
    let authClient = await this.getAuthClient()
    let isLogin = await authClient.isAuthenticated()
    let identity = await authClient.getIdentity()
    let principal = identity.getPrincipal()
    let prinId = principal.toText()
    if (isLogin && prinId && prinId !== '2vxsx-fae') {
      let time = Storage.get('dfinityLoginTime')
      if (time) {
        let now = new Date().getTime()
        if (now - time > EXPIRED_TIME) {
          await authClient.logout()
          this.updateIdentity()
          this.loginType = null
          Storage.set('loginType', null)
          callback({ ok: { status: isLogin, accountId: '', prinId: '' } })
          return
        }
      }
      this.loginType = DFINITY_TYPE
      Storage.set('loginType', DFINITY_TYPE)
      let accountId = principalToAccountId(principal)
      callback({ ok: { status: isLogin, accountId: accountId, prinId: prinId } })
    } else {
      this.loginType = null
      Storage.set('loginType', null)
      callback({ ok: { status: isLogin, accountId: '', prinId: '' } })
    }
    return isLogin
  }

  async dealWithPlugIdentityInfo(callback) {
    if (!window.ic) {
      callback({ error: 'noplug' })
      return
    }
    let connected = await this.plug.isConnected()
    if (connected) {
      this.loginType = PLUG_TYPE
      //Storage.set('loginType', PLUG_TYPE)//因为plug重新刷新页面，agent再次丢失，需要再次requestconnect，这边不记录,由用户发起，也可以记录，进入界面代码调起requestconnect
      const plugPId = Storage.get('plugPrinId')
      if (plugPId) {
        const accountId = principalToAccountId(Principal.fromText(plugPId))
        callback({ ok: { status: connected, accountId: accountId, prinId: plugPId } })
      }
    } else {
      this.loginType = null
      Storage.set('loginType', null)
      Storage.set('plugPrinId', null)
      callback({ ok: { status: connected, accountId: '', prinId: '' } })
    }
  }

  async initLoginStates(callback) {
    let loginType = Storage.get('loginType') || this.loginType
    if (!loginType) {
      //之前没有登陆
      callback({ ok: { status: false, accountId: '', prinId: '' } })
    } else if (loginType === DFINITY_TYPE) {
      this.dealWithDfinityIdentityInfo(callback)
    } else if (loginType === PLUG_TYPE) {
      this.dealWithPlugIdentityInfo(callback)
    }
  }

  async isLogin() {
    if (this.loginType === DFINITY_TYPE) {
      let authClient = await this.getAuthClient()
      const boolean = await authClient.isAuthenticated()
      return boolean
    } else if (this.loginType === PLUG_TYPE) {
      let res = await this.plug.isConnected()
      console.log('isLogin res ', res)
      return res
    } else {
      return false
    }
  }

  async loginOut(callback) {
    if (this.loginType === PLUG_TYPE) {
      this.plugLogout(callback)
    } else if (this.loginType === DFINITY_TYPE) {
      this.authLoginOut(callback)
    }
  }

  async authLoginOut(callback) {
    Storage.set('loginType', null)
    let authClient = await this.getAuthClient()
    await authClient.logout()
    console.log('logout')
    this.updateIdentity()
    this.dealWithDfinityIdentityInfo(callback)
  }

  async authLogin(callback) {
    this.loginType = DFINITY_TYPE
    let authClient = await this.getAuthClient()
    authClient.login({
      maxTimeToLive: BigInt(EXPIRED_TIME * 1000000), //24 * 60 * 60
      identityProvider: II_LOCAL_URL,
      onSuccess: () => {
        if (this.loginType === DFINITY_TYPE) {
          Storage.set('dfinityLoginTime', new Date().getTime())
          this.updateIdentity()
          this.dealWithDfinityIdentityInfo(callback)
          setTimeout(() => {
            this.updateIdentity()
            this.dealWithDfinityIdentityInfo(callback)
          }, EXPIRED_TIME)
        }
      },
      onError: (error) => {
        console.error('login error ', error)
      }
    })
  }

  sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time))
  }

  getCurrentLoginType() {
    return this.loginType
  }

  async plugLogin(callback) {
    if (!window.ic) {
      callback({ error: 'noplug' })
      return
    }
    this.loginType = PLUG_TYPE
    await this.plug.requestConnect()
    try {
      const maxTryTime = 300
      let times = 1
      let connected = await this.plug.isConnected()
      while (!connected && times < maxTryTime) {
        connected = await this.plug.isConnected()
        await this.sleep(100)
        times++
      }
      if (times >= maxTryTime) {
        throw 'timeout'
      }
      if (this.loginType === PLUG_TYPE) {
        this.updateIdentity()
        this.dealWithPlugIdentityInfo(callback)
      }
    } catch (err) {
      if (this.loginType === PLUG_TYPE) {
        this.loginType = null
        Storage.set('loginType', null)
      }
      console.log('plugLogin error', err)
    }
  }

  plugLogout(callback) {
    Storage.set('loginType', null)
    this.updateIdentity()
    callback({ ok: { status: false, accountId: '', prinId: '' } })
  }

  async createCanister(idl, id, needIdentity) {
    if (this.loginType === PLUG_TYPE && needIdentity) {
      return await this.plug.createActor(idl, id)
    }
    let agent = await this.getIdentityAgent()
    if (agent) {
      if (process.env.NODE_ENV === 'development') {
        await agent.fetchRootKey()
      }
      return Actor.createActor(idl, {
        agent,
        canisterId: id
      })
    }
  }

  async getCurrentPrinId() {
    if (this.loginType === DFINITY_TYPE) {
      return (await this.getIdentity()).getPrincipal()
    } else if (this.loginType === PLUG_TYPE) {
      const plugPId = Storage.get('plugPrinId')
      if (plugPId) return Principal.fromText(plugPId)
    }
    return null
  }

  async getAloneNFTFactory(isAuth) {
    if (isAuth) {
      if (!this.fetchAloneNFT) this.fetchAloneNFT = await this.createCanister(AloneNFTDIL, NFT_ALONE_FACTORY_ID, true)
      return this.fetchAloneNFT
    } else {
      if (!this.fetchAloneNoAuthNFT)
        this.fetchAloneNoAuthNFT = await this.createCanister(AloneNFTDIL, NFT_ALONE_FACTORY_ID, false)
      return this.fetchAloneNoAuthNFT
    }
  }

  async getMultiNFTFactory(isAuth) {
    if (isAuth) {
      if (!this.fetchMultiNFT) this.fetchMultiNFT = await this.createCanister(MultiNFTDIL, NFT_MULTI_FACTORY_ID, true)
      return this.fetchMultiNFT
    } else {
      if (!this.fetchMultiNoAuthNFT)
        this.fetchMultiNoAuthNFT = await this.createCanister(MultiNFTDIL, NFT_MULTI_FACTORY_ID, false)
      return this.fetchMultiNoAuthNFT
    }
  }

  async getLedgerCanister(isAuth) {
    if (isAuth) {
      if (!this.fetchLedgerCanister)
        this.fetchLedgerCanister = await this.createCanister(LedgerCanisterDIL, LEDGER_CANISTER_ID, true)
      return this.fetchLedgerCanister
    } else {
      if (!this.fetchLedgerNoAuthCanister)
        this.fetchLedgerNoAuthCanister = await this.createCanister(LedgerCanisterDIL, LEDGER_CANISTER_ID, false)
      return this.fetchLedgerNoAuthCanister
    }
  }

  async getWICPMotoko(isAuth) {
    if (isAuth) {
      if (!this.fetchWICPMotoko) this.fetchWICPMotoko = await this.createCanister(WICPMotokoDIL, WICP_MOTOKO_ID, true)
      return this.fetchWICPMotoko
    } else {
      if (!this.fetchWICPNoAuthMotoko)
        this.fetchWICPNoAuthMotoko = await this.createCanister(WICPMotokoDIL, WICP_MOTOKO_ID, false)
      return this.fetchWICPNoAuthMotoko
    }
  }

  async getStorageMotoko() {
    if (!this.fetchStorageMotoko)
      this.fetchStorageMotoko = await this.createCanister(StorageDIL, STORAGE_EMAIL_CID, false) //订阅邮件不需要身份
    return this.fetchStorageMotoko
  }

  async getInternetIdentity() {
    if (!this.interntIdentity)
      this.interntIdentity = await this.createCanister(InternetIdentiy, 'rdmx6-jaaaa-aaaaa-aaadq-cai', false)
    return this.interntIdentity
  }

  async getWICPStorage() {
    if (!this.wicpStorage) this.wicpStorage = await this.createCanister(WICPStorage, WICP_STORAGE_ID, false)
    return this.wicpStorage
  }

  async getNFTMultiStroage() {
    if (!this.multiStorage) this.multiStorage = await this.createCanister(MultiStorage, NFT_MULTI_STORAGE_ID, false)
    return this.multiStorage
  }

  async getNFTAloneStroage() {
    // if (!this.aloneStorage) this.aloneStorage = await this.createCanister(AloneStorage, NFT_ALONE_STORAGE_ID, false)
    // return this.aloneStorage
  }

  async getCanvasCanister(type, prinId, needIdentity) {
    let map
    if (this.loginType === PLUG_TYPE && needIdentity) {
      map = this.plugIdentifyCanisterMap
    } else {
      map = this.canisterMap
    }
    if (map) {
      let canister = map.get(prinId)
      if (!canister) {
        canister = await this.createCanister(
          type === AloneCreate ? AloneCanvasDIL : MultiCanvasDIL,
          prinId,
          needIdentity
        )
        map.set(prinId, canister)
      }
      return canister
    }
  }

  updateIdentity() {
    this.identity = null
    this.authClient = null
    this.fetchAloneNFT = null
    this.fetchAloneNoAuthNFT = null
    this.fetchMultiNFT = null
    this.fetchMultiNoAuthNFT = null
    this.fetchLedgerCanister = null
    this.fetchLedgerNoAuthCanister = null
    this.fetchWICPMotoko = null
    this.fetchWICPNoAuthMotoko = null
    this.fetchStorageMotoko = null
    this.identityAgent = null
    this.interntIdentity = null
    this.wicpStorage = null
    this.multiStorage = null
    this.aloneStorage = null
    this.canisterMap.clear()
    this.plugIdentifyCanisterMap.clear()
    console.log('updateIdentity')
  }
}
