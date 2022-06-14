import { canisterManager } from './canisterManager'
import { Storage } from '../utils/utils'
import BigNumber from 'bignumber.js'
import { AloneCreate } from '@/constants'
import { getAllUserName } from './userHandler'
import { lessBalanceApproveWICPNat, approveWICPNat } from './handler'

const getCanisterByType = async (type, prinId, needIdentity) => {
  let fetch = await canisterManager.getCanvasCanister(type, prinId, needIdentity)
  return fetch
}

export async function checkInvited(data) {
  let { type } = data
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let principal = await canisterManager.getCurrentPrinId()
  let res = await fetch.getInvited(principal)
  return res
}

export async function mintPixelCanvas(data) {
  let { type, description, name } = data
  let fetch = await canisterManager.getNftFactoryByType(type, true)
  if (!fetch) {
    return { err: { NotCanister: 1 } }
  }
  /** auth temp begin **/
  let _pid = canisterManager.getNFTFacotryIdByType(type)
  await lessBalanceApproveWICPNat(_pid)
  let param = { desc: description, name: name }
  if (canisterManager.isAlone(type)) {
    param.backGround = data.background
  }
  if (canisterManager.isTheme(type) || canisterManager.isTheme1155(type)) {
    param.deadline = data.deadline
  }
  console.log('mint param ', param)
  let res
  canisterManager.isAlone(type) && (res = await fetch.mintAloneCanvas(param))
  canisterManager.isCrowd(type) && (res = await fetch.mintMultiCanvas(param))
  canisterManager.isTheme(type) && (res = await fetch.mintThemeCanvas(param))
  canisterManager.isM1155(type) && (res = await fetch.mintMulti1155Canvas(param))
  canisterManager.isTheme1155(type) && (res = await fetch.mintTheme1155Canvas(param))
  if (res) {
    if (res.err) {
      for (let key in res.err) {
        if (key === 'AllowedInsufficientBalance') {
          await approveWICPNat(_pid)
        }
      }
    }
  }
  return res
}

export async function getMintFee(data) {
  let { type } = data
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  let fee = canisterManager.isAlone(type) ? await fetch.getAloneFee() : await fetch.getMultiFee()
  return fee
}

export async function drawPixel(data) {
  let { type, prinId, colors } = data
  let fetch = await getCanisterByType(type, prinId, true)
  if (canisterManager.isTheme(type)) {
    let openTime = Storage.get(`themeOpen-${prinId}`)
    if (!openTime) {
      let time = await fetch.getOpenTime()
      openTime = parseInt(new BigNumber(parseInt(time || 0)).dividedBy(Math.pow(10, 6)))
      Storage.set(`themeOpen-${prinId}`, openTime)
    }
    let time = new Date().getTime()
    if (time < openTime) {
      return { err: { NotOpen: 1 } }
    }
  }
  await lessBalanceApproveWICPNat(prinId)
  if (fetch) {
    const res = canisterManager.isAlone(type)
      ? await fetch.drawPixel(colors)
      : await fetch.drawPixel(colors, [data.memo])
    if (res.err) {
      for (let key in res.err) {
        if (key === 'AllowedInsufficientBalance') {
          await approveWICPNat(prinId)
        }
      }
    }
    return res
  } else {
    return { err: { NotCanister: 1 } }
  }
}

export async function getAllUndoneCanvas(data) {
  let { type } = data
  let fetch = await canisterManager.getNftFactoryByType(type, false)
  if (fetch) {
    let res
    if (!canisterManager.isAlone(type)) {
      res = await fetch.getAllMultipCanvas()
    }
    if (res) {
      let result = []
      for (let item of res) {
        result.push({ tokenIndex: item[0], prinId: item[1], type })
      }
      return result
    }
    return []
  } else {
    return []
  }
}

export async function getCanisterCanvasInfoById(data) {
  let { type, prinId } = data
  let fetch = await getCanisterByType(type, prinId, false)
  if (fetch) {
    let res = await fetch.getNftDesInfo()
    if (res.createBy) {
      await getAllUserName([res.createBy.toText()])
    }
    return res
  }
}

export async function getCanisterPixelInfoById(data) {
  let { type, prinId } = data
  let fetch = await getCanisterByType(type, prinId, false)
  if (fetch) {
    let res = await fetch.getAllPixel()
    return res
  }
}

export async function aloneCanvasDrawOver(data) {
  let { prinId } = data
  let fetch = await getCanisterByType(AloneCreate, prinId, true)
  if (fetch) {
    let res = await fetch.drawOver()
    if (res) {
      return res
    }
  }
  return null
}

export async function getHighestPosition(data) {
  let { type, prinId } = data
  let fetch = await getCanisterByType(type, prinId, false)
  let highest = fetch && (await fetch.getHighestPosition())
  return highest || {}
}

export async function getPinPosition(data) {
  let { type, prinId } = data
  let fetch = await getCanisterByType(type, prinId, false)
  let pinPos = fetch && (await fetch.getPinPosition())
  return pinPos || []
}

export async function getConsumeAndBalance(data) {
  let { type, prinId } = data

  if (canisterManager.isTheme1155(type)) {
    let fetch = await getCanisterByType(type, prinId, false)
    let curPrin = await canisterManager.getCurrentPrinId()
    let res = fetch && (await fetch.getAccInfo(curPrin))
    return res || {}
  } else {
    let fetch = await getCanisterByType(type, prinId, true)
    let res = fetch && (await fetch.getAccInfo())
    return res || {}
  }
}

export async function isCanvasOver(data) {
  let { type, prinId } = data
  let fetch = await getCanisterByType(type, prinId, false)
  let res = fetch && (await fetch.isOver())
  return res
}

export async function getFinshedTime(data) {
  let { prinId, type } = data
  let fetch = await getCanisterByType(type, prinId, false)
  let res = fetch && (await fetch.getFinshedTime())
  return res
}

export async function requestWithdrawIncome(data) {
  let { type, prinId } = data
  let fetch = await getCanisterByType(type, prinId, true)
  let res = fetch && (await fetch.withDrawIncome())
  approveWICPNat(prinId)
  return res
}

export async function getMultiDrawRecord(data) {
  let { type, prinId } = data
  let fetch = await getCanisterByType(type, prinId, false)
  let res = fetch && (await fetch.getDrawRecord())
  let set = new Set()
  for (let item of res) {
    item.painter && set.add(item.painter.toText())
  }
  await getAllUserName([...set])
  return res
}

export async function checkCanvasInvited(data) {
  let { type, prinId } = data
  let fetch = await canisterManager.getCanvasCanister(type, prinId, false)
  let principal = await canisterManager.getCurrentPrinId()
  let res = await fetch.checkIfInvites(principal)
  return res
}

export async function getAllMemberConsume(data) {
  let { prinId } = data
  let fetch = await getCanisterByType(AloneCreate, prinId, false)
  let res = await fetch.getAllConsume()
  let set = new Set()
  for (let item of res) {
    item[0] && set.add(item[0].toText())
  }
  await getAllUserName([...set])
  return res
}

export async function inviteMemberDrawCanvas(data) {
  let { type, canvasPrinId, invites } = data
  let fetch = await getCanisterByType(type, canvasPrinId, true)
  let res = await fetch.invitePainters(invites)
  return res
}

export async function deleteMemberLeaveCanvas(data) {
  let { canvasPrinId, deleteArray } = data
  let fetch = await getCanisterByType(AloneCreate, canvasPrinId, true)
  let res = await fetch.deleteInviters([...deleteArray])
  return res
}

export async function checkImage(data) {
  let { type, prinId } = data
  if (type === AloneCreate) {
    let fetch = await getCanisterByType(type, prinId, false)
    let res
    try {
      res = await fetch?.checkImage()
    } catch (e) {}
    return res || false
  }
  return false
}
