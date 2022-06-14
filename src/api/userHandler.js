import { canisterManager } from './canisterManager'
import { Principal } from '@dfinity/principal'
import { Storage, uint8arrayToBase64 } from '@/utils/utils'

const usernameMap = new Map()
const version = 2 //防止数据格式更新，存的时候加上版本号

export async function getUserProfileByPrinId(data) {
  let { prinId } = data
  let curPrin = await canisterManager.getCurrentPrinId()
  if (curPrin && curPrin.toText() === prinId) {
    let exist = Storage.get(`profile-${prinId}`)
    if (exist && exist.version === version && exist.value) {
      return exist.value
    }
  }
  let fetch = await canisterManager.getProfileCanister(false)
  let res = await fetch.getProfile(Principal.fromText(prinId))
  if (res.ok) {
    res.ok.remainTimes = parseInt(res.ok.remainTimes)
    res.ok.avatorCID = res.ok.avatorCID.toText()
    if (curPrin && curPrin.toText() === prinId && res.ok) {
      Storage.set(`profile-${prinId}`, { version, value: res.ok }) //存自己的数据
    }
  }
  if (res && res.ok && usernameMap.get(prinId) !== res.ok.textInfo.name) {
    usernameMap.set(prinId, res.ok.textInfo.name)
  }
  return res.ok || res
}

export async function getUserAvatar(data) {
  let { canisterId, prinId } = data
  let curPrin = await canisterManager.getCurrentPrinId()
  if (curPrin && curPrin.toText() === prinId) {
    let exist = Storage.get(`avatar-${prinId}`)
    if (exist && exist.version === version && exist.value) {
      return exist.value
    }
  }
  let fetch = await canisterManager.getAvatarCanister(canisterId)
  let principal = Principal.fromText(prinId)
  let res = await fetch.getAvatar(principal)
  if (res.ok) {
    res.ok = uint8arrayToBase64(res.ok)
    if (curPrin && curPrin.toText() === prinId && res.ok) {
      Storage.set(`avatar-${prinId}`, { version, value: res.ok }) //存自己的数据
    }
  }
  return res.ok || res
}

export async function uploadAvatar(data) {
  let curPrin = await canisterManager.getCurrentPrinId()
  let fetch = await canisterManager.getAvatarCanister('etuys-ziaaa-aaaai-qbjiq-cai')
  let res = await fetch.uploadAvatar(curPrin, data.avatar[0])
  Storage.set(`avatar-${curPrin.toText()}`, null) //存自己的数据
  return res
}

export async function uploadUserProfile(data) {
  let { bio, link, name, avatar } = data
  let param = { textInfo: { bio, link, name }, avatar }
  console.log('uploadUserProfile param', param)
  let fetch = await canisterManager.getProfileCanister(true)
  let uploadres = await fetch.uploadProfile(param)
  if (!uploadres.err) {
    let prinId = (await canisterManager.getCurrentPrinId()).toText()
    let noAuthfetch = await canisterManager.getProfileCanister(false)
    let res = await noAuthfetch.getProfile(Principal.fromText(prinId))
    res.ok.remainTimes = parseInt(res.ok.remainTimes)
    res.ok.avatorCID = res.ok.avatorCID.toText()
    Storage.set(`profile-${prinId}`, { version, value: res.ok }) //存自己的数据
    Storage.set(`avatar-${prinId}`, null) //存自己的数据
  }
  return uploadres
}

export async function userNameIsExist(data) {
  let { name } = data
  let fetch = await canisterManager.getProfileCanister(false)
  let isAvailabe = await fetch.nameIsAvailable(name)
  return !isAvailabe
}

export async function getUserRewardsPoints(data) {
  let { prinId } = data
  let fetch = await canisterManager.getProfileCanister(false)
  let res = await fetch.getUserRewardsPoints(Principal.fromText(prinId))
  return res
}

export async function getAllUserName(prinIds) {
  let unkownPrins = []
  for (let id of prinIds) {
    if (id && (usernameMap.get(id) === null || usernameMap.get(id) === undefined)) {
      unkownPrins.push(Principal.fromText(id))
    }
  }
  if (unkownPrins.length > 0) {
    let fetch = await canisterManager.getProfileCanister(false)
    let res = await fetch.getUserName(unkownPrins)
    for (let i = 0; i < unkownPrins.length; i++) {
      if (res[i][0]) usernameMap.set(unkownPrins[i].toText(), res[i][0])
    }
  }
  return usernameMap
}

export function getUserNameByPrinId(prinId) {
  let res = usernameMap.get(prinId) || prinId
  return res
}
