import { canisterManager } from './canisterManager'
import { ZombieNFTCreate, M1155Create } from '@/constants'
import { Principal } from '@dfinity/principal'

const getCanisterByType = async (type, prinId, needIdentity) => {
  let fetch = await canisterManager.getCanvasCanister(type, prinId, needIdentity)
  return fetch
}

const getStakeByType = async (type, needIdentity) => {
  let fetch = await canisterManager.getStakeCanister(type, needIdentity)
  return fetch
}

const getStakeFetch = async (type, prinId, flag) => {
  switch (type) {
    case M1155Create: {
      let fetch = await getCanisterByType(type, prinId, flag)
      return fetch
    }
    default:
      let fetch = await getStakeByType(type, flag)
      return fetch
  }
}

export async function getAvailableZombieNFT({ type = ZombieNFTCreate }) {
  let principal = await canisterManager.getCurrentPrinId()
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res = fetch && (await fetch.getAvaiableNFT(principal))
  return res || []
}

export async function getTimeStampNFT(data) {
  let { type } = data
  let fetch = await getStakeFetch(type)
  let res = fetch && (await fetch.getTimeStamp())
  return res || []
}

export async function approvedForAllToCanister(type, prinId) {
  let principal = await canisterManager.getCurrentPrinId()
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let res = await fetch.isApprovedForAll(principal, prinId) //僵尸容器授权画布容器
  if (!res) {
    let fetch1 = await canisterManager.getNftFactoryByType(type, true)
    await fetch1.setApprovalForAll(prinId, true)
  }
}

export async function stakingZombie(data) {
  console.log('data', data)
  let { tokenIndex, prinId, type = M1155Create } = data
  if (type !== M1155Create && !prinId) {
    prinId = Principal.fromText(canisterManager.getStakeIdByType(type))
  }
  await approvedForAllToCanister(type, prinId)
  let fetch = await getStakeFetch(type, prinId, true)
  let res = fetch?.stakingZombie ? await fetch.stakingZombie(tokenIndex) : await fetch.stakingNFT(tokenIndex)
  return res
}

export async function unStakingZombie(data) {
  let { tokenIndex, prinId, type = M1155Create } = data
  let fetch = await getStakeFetch(type, prinId, true)
  let res = fetch?.unStakingZombie ? await fetch.unStakingZombie(tokenIndex) : await fetch.unStakingNFT(tokenIndex)
  return res
}

export async function getMyAllStakingZombieByIndex(data) {
  let { prinId, type = M1155Create } = data
  let principal = await canisterManager.getCurrentPrinId()
  let fetch = await getStakeFetch(type, prinId, false)
  let res = fetch?.getUserBonusByIndexs
    ? await fetch.getUserBonusByIndexs(principal)
    : await fetch.getUserBonus(principal)
  return res
}

export async function getAllCanvasStakingZombie(data) {
  let { prinId, type = M1155Create } = data
  let fetch = await getStakeFetch(type, prinId, false)
  let res = fetch?.getAllStakeZombie ? await fetch.getAllStakeZombie() : await fetch.getStakeInfo()
  return res
}
