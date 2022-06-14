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
  NFT_MULTI_STORAGE_ID,
  NFT_ALONE_STORAGE_ID,
  NFT_ZOMBIE_FACOTRY_ID,
  NFT_ZOMBIE_STORAGE_ID,
  NFT_THEME_FACTORY_ID,
  NFT_THEME_STORAGE_ID,
  NFT_1155_FACTORY_ID,
  NFT_1155_STORAGE_ID,
  STAKE_NFT_ID,
  NFT_THEME_1155_FACTORY_ID,
  NFT_THEME_1155_STORAGE_ID,
  NFT_CREATE_FACTORY_ID,
  PROFILE_FACTORY_ID
} from 'canister/local/id.js'

import { idlFactory as AloneNFTDIL } from 'canister/local/candid/aloneNFT.did.js'
import { idlFactory as MultiNFTDIL } from 'canister/local/candid/multiNFT.did.js'
import { idlFactory as WICPMotokoDIL } from 'canister/local/candid/WICP_motoko.did.js'
import { idlFactory as AloneCanvasDIL } from 'canister/local/candid/aloneCanvas.did.js'
import { idlFactory as MultiCanvasDIL } from 'canister/local/candid/multiCanvas.did.js'
import { idlFactory as ThemeCanvasDIL } from 'canister/local/candid/themeCanvas.did.js'
import { idlFactory as StorageDIL } from 'canister/local/candid/storage.did'
import { idlFactory as InternetIdentiy } from 'canister/local/candid/internet_identity.did.js'
import { idlFactory as WICPStorage } from 'canister/local/candid/wicpStorage.did.js'
import { idlFactory as NFTStorage } from 'canister/local/candid/nftStorage.did.js'
import { idlFactory as C1155Storage } from 'canister/local/candid/c1155Storage.did.js'
import { idlFactory as ZombieNFTDIL } from 'canister/local/candid/zombieNFT.did.js'
import { idlFactory as ThemeNFTDIL } from 'canister/local/candid/themeNFT.did.js'
import { idlFactory as Mulit1155NFTDIL } from 'canister/local/candid/multiNFT1155.did.js'
import { idlFactory as Mulit1155CanvasDIL } from 'canister/local/candid/multiCanvas1155.did.js'
import { idlFactory as Theme1155NFTDIL } from 'canister/local/candid/themeNFT1155.did.js'
import { idlFactory as Theme1155CanvasDIL } from 'canister/local/candid/themeCanvas1155.did.js'
import { idlFactory as ICCreateDIL } from 'canister/local/candid/icCreateFactory.did.js'
import { idlFactory as ICCollectionDIL } from 'canister/local/candid/icCollection.did.js'
import { idlFactory as StakeNFTDIL } from 'canister/local/candid/NFTStake.did.js'
import { idlFactory as ProfileCanvasDIL } from 'canister/local/candid/profile.did.js'
import { idlFactory as AvatarCanvasDIL } from 'canister/local/candid/avatar.did.js'

import LedgerCanisterDIL from 'canister/local/candid/ledger.did.js'
import Plug from './plug'
import Infinity from './infinity'
import { StoicIdentity } from 'ic-stoic-identity'
import {
  DFINITY_TYPE,
  PLUG_TYPE,
  STOIC_TYPE,
  INFINITY_TYPE,
  AloneCreate,
  CrowdCreate,
  M1155Create,
  ThemeCreate,
  ZombieNFTCreate,
  Theme1155Create,
  ArtCollection,
  ArtCreate
} from '@/constants'

const EXPIRED_TIME = 24 * 60 * 60 * 1000 //一天 24 * 60 * 60 * 1000ms

const NFTFactoryInfos = {
  alone: [NFT_ALONE_FACTORY_ID, AloneNFTDIL],
  crowd: [NFT_MULTI_FACTORY_ID, MultiNFTDIL],
  zombie: [NFT_ZOMBIE_FACOTRY_ID, ZombieNFTDIL],
  theme: [NFT_THEME_FACTORY_ID, ThemeNFTDIL],
  theme1155: [NFT_THEME_1155_FACTORY_ID, Theme1155NFTDIL],
  m1155: [NFT_1155_FACTORY_ID, Mulit1155NFTDIL],
  ledger: [LEDGER_CANISTER_ID, LedgerCanisterDIL],
  wicp: [WICP_MOTOKO_ID, WICPMotokoDIL],
  profile: [PROFILE_FACTORY_ID, ProfileCanvasDIL],
  create: [NFT_CREATE_FACTORY_ID, ICCreateDIL]
}

const NFTStorageInfos = {
  alone: [NFT_ALONE_STORAGE_ID, NFTStorage],
  crowd: [NFT_MULTI_STORAGE_ID, NFTStorage],
  zombie: [NFT_ZOMBIE_STORAGE_ID, NFTStorage],
  theme: [NFT_THEME_STORAGE_ID, NFTStorage],
  theme1155: [NFT_THEME_1155_STORAGE_ID, C1155Storage],
  m1155: [NFT_1155_STORAGE_ID, C1155Storage],
  wicp: [WICP_STORAGE_ID, WICPStorage]
}

const CanvasDIL = {
  alone: AloneCanvasDIL,
  crowd: MultiCanvasDIL,
  theme: ThemeCanvasDIL,
  m1155: Mulit1155CanvasDIL,
  theme1155: Theme1155CanvasDIL
}

const StakeDIL = {
  gang: [STAKE_NFT_ID, StakeNFTDIL]
}

class CanisterManager {
  constructor() {
    this.nftCanisterMap = new Map()
    this.storageCanisterMap = new Map()
    this.canisterMap = new Map()
    this.plug = new Plug()
    this.infinity = new Infinity()
    this.loginType = null
  }

  handleCollectionConfig(config) {
    this.collectionConfig = config
    for (let item of config) {
      let type = item.key
      if (!NFTFactoryInfos[type]) {
        let did
        try {
          did = require(`canister/local/candid/${type}NFTFactory.did.js`)
        } catch (e) {
          if (item.nftType === 'video') did = require(`canister/local/candid/videoNFTFactory.did.js`)
          else did = require(`canister/local/candid/commonNFTFactory.did.js`)
        }
        NFTFactoryInfos[type] = [item.nftId, did.idlFactory]
      }
      if (!NFTStorageInfos[type]) {
        let did
        try {
          did = require(`canister/local/candid/${type}NFTStorage.did.js`)
        } catch (e) {
          if (item.nftType === 'video' || item.nftType === 'ipfs')
            did = require(`canister/local/candid/ipfsStorage.did.js`)
          else if (item.nftType === 'blindbox') did = require(`canister/local/candid/blindboxStorage.did.js`)
          else did = require(`canister/local/candid/nftStorage.did.js`)
        }
        NFTStorageInfos[type] = [item.storageId, did.idlFactory]
      }
    }
  }

  getColletcionConfig() {
    return this.collectionConfig
  }

  isAlone(type) {
    return type === AloneCreate
  }

  isCrowd(type) {
    return type === CrowdCreate
  }

  isZombie(type) {
    return type === ZombieNFTCreate
  }

  isTheme(type) {
    return type === ThemeCreate
  }

  isM1155(type) {
    return type === M1155Create
  }

  isTheme1155(type) {
    return type === Theme1155Create
  }

  getNFTFacotryIdByType(type) {
    if (type?.startsWith(ArtCollection)) {
      let prinId = type.split(':')[1]
      return prinId
    }
    let info = NFTFactoryInfos[type]
    if (info) {
      return info[0]
    }
  }

  getStakeIdByType(type) {
    let info = StakeDIL[type]
    if (info) {
      return info[0]
    }
  }
  // factor canister
  async getNftFactoryByType(type, isAuth) {
    if (!type) console.error('getNftFactoryByType', type)
    if (type?.startsWith(ArtCollection)) {
      let prinId = type.split(':')[1]
      return this.getCollectionCanister(prinId, isAuth)
    }
    let key = type
    if (isAuth) {
      key += '-auth'
    } else {
      key += '-noAuth'
    }
    let canister = this.nftCanisterMap.get(key)
    if (!canister) {
      let info = NFTFactoryInfos[type]
      if (info) {
        canister = await this.createCanister(info[1], info[0], isAuth)
        this.nftCanisterMap.set(key, canister)
      } else {
        throw `NFTFactorytype: ${type} not exist `
      }
    }
    return canister
  }

  async getFactoryStorageByType(type) {
    if (type?.startsWith(ArtCollection)) {
      let prinId = type.split(':')[1]
      return this.getCollectionCanister(prinId, false)
    }
    let key = type
    let canister = this.storageCanisterMap.get(key)
    if (!canister) {
      let info = NFTStorageInfos[type]
      if (info) {
        canister = await this.createCanister(info[1], info[0], false)
        this.storageCanisterMap.set(key, canister)
      } else {
        throw `storage type: ${type} not exist `
      }
    }
    return canister
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
    if (process.env.DFX_NETWORK !== 'dev' && process.env.NODE_ENV === 'development')
      args['host'] = 'https://boundary.ic0.app/'
    if (!this.identityAgent) this.identityAgent = new HttpAgent(args)
    return this.identityAgent
  }

  async getStoicIdentityAgent() {
    if (!this.stoicIdentity) {
      return null
    }
    const identity = this.stoicIdentity
    let args = { identity }
    if (process.env.DFX_NETWORK !== 'dev' && process.env.NODE_ENV === 'development')
      args['host'] = 'https://boundary.ic0.app/'
    if (!this.stoicIdentityAgent) {
      this.stoicIdentityAgent = new HttpAgent(args)
    }
    return this.stoicIdentityAgent
  }

  async dealWithDfinityIdentityInfo(callback) {
    if (this.loginType !== DFINITY_TYPE) {
      return
    }
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
    if (!window.ic || !window.ic.plug) {
      callback({ error: 'noplug' })
      return
    }
    if (this.loginType !== PLUG_TYPE) {
      return
    }
    let connected = await this.plug.isConnected()
    if (connected) {
      this.loginType = PLUG_TYPE
      Storage.set('loginType', PLUG_TYPE)
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
  async dealWithStoicIdentityInfo(identity, callback) {
    if (this.loginType !== STOIC_TYPE) {
      return
    }
    if (identity !== false) {
      //ID is a already connected wallet!
      if (identity._publicKey._der instanceof Object) {
        let res = []
        for (let key in identity._publicKey._der) {
          res.push(identity._publicKey._der[key])
        }
        let array = new Uint8Array(res, 0, res.length)
        identity._publicKey._der = array
      }
      this.updateIdentity()
      this.stoicIdentity = identity
      let principal = identity.getPrincipal()
      let prinId = principal.toText()
      const accountId = principalToAccountId(principal)
      identity.accounts().then((accs) => {
        console.log('accs ', accs, accountId)
      })
      this.loginType = STOIC_TYPE
      Storage.set('loginType', STOIC_TYPE)
      callback({ ok: { status: true, accountId: accountId, prinId: prinId } })
    } else {
      this.loginType = null
      this.stoicIdentity = null
      Storage.set('loginType', null)
      callback({ ok: { status: false, accountId: '', prinId: '' } })
    }
  }

  async dealWithInfinityIdentityInfo(callback) {
    if (!window?.ic?.infinityWallet) {
      callback({ error: 'noinfinity' })
      return
    }
    if (this.loginType !== INFINITY_TYPE) {
      return
    }
    let connected = await this.infinity.isConnected()
    if (connected) {
      this.loginType = INFINITY_TYPE
      Storage.set('loginType', INFINITY_TYPE)
      const plugPId = await this.infinity.getInfinityPrincipalId()
      if (plugPId) {
        const accountId = principalToAccountId(plugPId)
        callback({ ok: { status: connected, accountId: accountId, prinId: plugPId.toText() } })
      }
    } else {
      this.loginType = null
      Storage.set('loginType', null)
      callback({ ok: { status: connected, accountId: '', prinId: '' } })
    }
  }

  async dealWithStoicStatus(callback) {
    StoicIdentity.load().then(async (identity) => {
      this.dealWithStoicIdentityInfo(identity, callback)
    })
  }

  async initLoginStates(callback) {
    let loginType = Storage.get('loginType') || this.loginType
    if (!loginType) {
      //之前没有登陆
      callback({ ok: { status: false, accountId: '', prinId: '' } })
    } else {
      this.loginType = loginType
      if (loginType === DFINITY_TYPE) {
        this.dealWithDfinityIdentityInfo(callback)
      } else if (loginType === PLUG_TYPE) {
        let res = await this.plug.verifyConnectionAndAgent()
        res && this.dealWithPlugIdentityInfo(callback)
      } else if (loginType === STOIC_TYPE) {
        this.dealWithStoicStatus(callback)
      } else if (loginType === INFINITY_TYPE) {
        this.dealWithInfinityIdentityInfo(callback)
      }
    }
  }

  async isLogin() {
    if (this.loginType === DFINITY_TYPE) {
      let authClient = await this.getAuthClient()
      const boolean = await authClient.isAuthenticated()
      return boolean
    } else if (this.loginType === PLUG_TYPE) {
      let res = await this.plug.isConnected()
      return res
    } else if (this.loginType === STOIC_TYPE) {
      let res = this.stoicIdentity ? true : false
      return res
    } else if (this.loginType === INFINITY_TYPE) {
      return await this.infinity.isConnected()
    } else {
      return false
    }
  }

  async loginOut(callback) {
    callback({ ok: { status: false, accountId: '', prinId: '' } })
    if (this.loginType === PLUG_TYPE) {
      await this.plugLogout(callback)
    } else if (this.loginType === DFINITY_TYPE) {
      await this.authLoginOut(callback)
    } else if (this.loginType === STOIC_TYPE) {
      await this.stoicLogout(callback)
    } else if (this.loginType === INFINITY_TYPE) {
      await this.infinityLoginOut(callback)
    }
    this.updateIdentity()
    Storage.set('loginType', null)
    this.loginType = null
  }

  async authLoginOut(callback) {
    let authClient = await this.getAuthClient()
    await authClient.logout()
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
    if (!window.ic || !window.ic.plug) {
      callback({ error: 'noplug' })
      return
    }

    this.loginType = PLUG_TYPE
    try {
      let res = await this.plug.requestConnect()
      if (res) {
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
      } else {
        if (this.loginType === PLUG_TYPE) {
          this.loginType = null
          Storage.set('loginType', null)
        }
        this.plug.resetRequest()
        callback({ ok: { status: false, accountId: '', prinId: '' } })
      }
    } catch (err) {
      if (this.loginType === PLUG_TYPE) {
        this.loginType = null
        Storage.set('loginType', null)
      }
      this.plug.resetRequest()
      callback({ ok: { status: false, accountId: '', prinId: '' } })
      console.log('plugLogin error', err)
    }
  }

  plugLogout(callback) {}

  async stoicLogin(callback) {
    this.loginType = STOIC_TYPE
    let identity = await StoicIdentity.connect()
    if (this.loginType === STOIC_TYPE) {
      this.dealWithStoicIdentityInfo(identity, callback)
    }
  }

  async stoicLogout(callback) {
    await StoicIdentity.disconnect()
  }

  async infinityLoginOut() {
    await this.infinity.loginOut()
  }
  async infinityLogin(callback) {
    if (!window?.ic?.infinityWallet) {
      callback({ error: 'noinfinity' })
      return
    }

    this.loginType = INFINITY_TYPE
    try {
      let res = await this.infinity.requestConnect()
      if (res) {
        let connected = await this.infinity.isConnected()
        if (connected && this.loginType === INFINITY_TYPE) {
          this.updateIdentity()
          this.dealWithInfinityIdentityInfo(callback)
        }
      } else {
        if (this.loginType === INFINITY_TYPE) {
          this.loginType = null
          Storage.set('loginType', null)
          callback({ ok: { status: false, accountId: '', prinId: '' } })
        }
        this.infinity.resetRequest()
      }
    } catch (err) {
      if (this.loginType === PLUG_TYPE) {
        this.loginType = null
        Storage.set('loginType', null)
        callback({ ok: { status: false, accountId: '', prinId: '' } })
      }
      this.infinity.resetRequest()
    }
  }

  async createCanister(idl, id, needIdentity) {
    if (this.loginType === PLUG_TYPE && needIdentity) {
      return await this.plug.createActor(idl, id)
    } else if (this.loginType === INFINITY_TYPE && needIdentity) {
      return await this.infinity.createActor(idl, id)
    }
    let agent
    if (this.loginType === STOIC_TYPE && needIdentity) {
      agent = await this.getStoicIdentityAgent()
    } else {
      agent = await this.getIdentityAgent()
    }
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
    } else if (this.loginType === STOIC_TYPE) {
      if (this.stoicIdentity) return await this.stoicIdentity.getPrincipal()
    } else if (this.loginType === INFINITY_TYPE) {
      return await this.infinity.getInfinityPrincipalId()
    }
    return null
  }

  async getLedgerCanister(isAuth) {
    return this.getNftFactoryByType('ledger', isAuth)
  }

  async getWICPMotoko(isAuth) {
    return this.getNftFactoryByType('wicp', isAuth)
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
    return this.getFactoryStorageByType('wicp')
  }

  async getProfileCanister(isAuth) {
    return this.getNftFactoryByType('profile', isAuth)
  }

  async getAvatarCanister(prinId) {
    let canister = this.canisterMap.get(prinId)
    if (!canister) {
      canister = await this.createCanister(AvatarCanvasDIL, prinId, false)
      map.set(prinId, canister)
    }
    return canister
  }

  async getCanvasCanister(type, prinId, needIdentity) {
    let key = prinId
    if (this.loginType !== DFINITY_TYPE && needIdentity) {
      key += '-auth'
    } else {
      key += '-noAuth'
    }
    let canister = this.canisterMap.get(key)
    if (!canister) {
      canister = await this.createCanister(CanvasDIL[type], prinId, needIdentity)
      this.canisterMap.set(key, canister)
    }
    return canister
  }

  async getCollectionCanister(prinId, needIdentity) {
    let key = prinId
    if (this.loginType !== DFINITY_TYPE && needIdentity) {
      key += '-auth'
    } else {
      key += '-noAuth'
    }
    let canister = this.canisterMap.get(key)
    if (!canister) {
      canister = await this.createCanister(ICCollectionDIL, prinId, needIdentity)
      this.canisterMap.set(key, canister)
    }
    return canister
  }

  async getStakeCanister(type, needIdentity) {
    const info = StakeDIL[type]
    let key = info[0]
    if (this.loginType !== DFINITY_TYPE && needIdentity) {
      key += '-auth'
    } else {
      key += '-noAuth'
    }
    let canister = this.canisterMap.get(key)
    if (!canister) {
      canister = await this.createCanister(info[1], info[0], needIdentity)
      this.canisterMap.set(key, canister)
    }
    return canister
  }

  async getAvatarCanister(prinId) {
    let map = this.canisterMap
    if (map) {
      let canister = map.get(prinId)
      if (!canister) {
        canister = await this.createCanister(AvatarCanvasDIL, prinId, false)
        map.set(prinId, canister)
      }
      return canister
    }
  }

  updateIdentity() {
    this.identity = null
    this.authClient = null
    this.fetchStorageMotoko = null
    this.identityAgent = null
    this.interntIdentity = null
    this.stoicIdentity = null
    this.stoicIdentityAgent = null
    this.nftCanisterMap.clear()
    this.storageCanisterMap.clear()
    this.canisterMap.clear()
    console.log('updateIdentity')
  }
}

export const canisterManager = new CanisterManager()
