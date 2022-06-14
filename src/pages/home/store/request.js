import { requestCanister } from '@/api/handler'
import { getHighestPosition, getConsumeAndBalance, checkCanvasInvited } from '@/api/canvasHandler'
import { getAllCanvasStakingZombie, getMyAllStakingZombieByIndex } from '@/api/zombieHandler'
import {
  getNFTOwner,
  getNFTFavoritesNum,
  isNFTFavoriteByTypeAndId,
  getAll1155ListingByIndex,
  balance1155PixelByIndex
} from '@/api/nftHandler'
export const getCrowdCanvasConsumeAndBalance = (type, prinId, successFunc) => {
  let data = {
    type: type,
    prinId: prinId,
    success: (res) => {
      successFunc && successFunc(res)
    }
  }
  requestCanister(getConsumeAndBalance, data)
}

export const getHighestInfoById = (type, prinId, successFunc) => {
  let data = {
    type: type,
    prinId: prinId,
    success: (res) => {
      successFunc && successFunc(res)
    }
  }
  requestCanister(getHighestPosition, data, false)
}

export const getNFTOwnerByIndex = (type, tokenIndex, successFunc) => {
  let data = {
    type: type,
    tokenIndex: tokenIndex,
    success: (res) => {
      if (res.length > 0) {
        successFunc && successFunc(res)
      } else {
        successFunc && successFunc(null)
      }
    }
  }
  requestCanister(getNFTOwner, data, false)
}

export const isNFTFavorite = (type, prinId, tokenIndex, successFunc) => {
  let data = {
    type: type,
    prinId: prinId,
    tokenIndex: tokenIndex,
    success: (res) => {
      successFunc && successFunc(res)
    }
  }
  requestCanister(isNFTFavoriteByTypeAndId, data)
}

export const getFavoriteNum = (type, tokenIndex, successFunc) => {
  let data = {
    type: type,
    tokenIndex: tokenIndex,
    success: (res) => {
      successFunc && successFunc(res)
    }
  }
  requestCanister(getNFTFavoritesNum, data, false)
}

export const balance1155Info = (type, tokenIndex, successFunc) => {
  let data = {
    type,
    tokenIndex: tokenIndex,
    success: (res) => {
      successFunc && successFunc(res)
    }
  }
  requestCanister(balance1155PixelByIndex, data)
}

export const getAllCanvasStaked = (prinId, successFunc) => {
  let data = {
    prinId,
    success: (res) => {
      successFunc && successFunc(res)
    }
  }
  requestCanister(getAllCanvasStakingZombie, data, false)
}

export const getMyCanvasStaked = (prinId, successFunc) => {
  let data = {
    prinId,
    success: (res) => {
      successFunc && successFunc(res)
    }
  }
  requestCanister(getMyAllStakingZombieByIndex, data)
}

export const getM1155Listing = (type, tokenIndex, successFunc) => {
  requestCanister(
    getAll1155ListingByIndex,
    {
      type,
      tokenIndex,
      success: (res) => {
        if (res && res.length) {
          res.sort((left, right) => {
            let value = parseInt(left[1].unitPrice) - parseInt(right[1].unitPrice)
            return value
          })
          successFunc(res)
        } else {
          successFunc([])
        }
      }
    },
    false
  )
}

export const checkUserInvited = (type, prinId, successFunc) => {
  requestCanister(checkCanvasInvited, {
    type,
    prinId,
    success: (res) => {
      successFunc(res)
    }
  })
}
