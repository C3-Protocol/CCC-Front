import React, { memo } from 'react'

import { AloneCreate, CrowdCreate, M1155Create } from '@/constants'
import { DoubleRightOutlined } from '@ant-design/icons'
import { getValueDivide8 } from '@/utils/utils'
import UserPrincipal from '@/components/user-principal'

function CanvasInfo(props) {
  const canvasInfo = props.canvasInfo
  const prinId = props.prinId
  const type = props.type
  const highestInfo = props.highestInfo
  const detailExpand = props.detailExpand

  const isAlone = () => {
    return type === AloneCreate
  }
  const isShowBonus = () => {
    return type === M1155Create || type === CrowdCreate
  }

  return (
    <div>
      <div className="textDetail">
        Description:
        <span>{` ${canvasInfo.desc}`}</span>
      </div>
      <div className="textDetail">
        CID:
        <span>{` ${prinId}`}</span>
      </div>
      {canvasInfo.createBy && (
        <div className="textDetail">
          Created by:
          <span>{` `}</span>
          <UserPrincipal prinId={canvasInfo.createBy.toText()} maxLength={20} />
        </div>
      )}
      <div className="textDetail">
        Total invested:
        <span>{` ${getValueDivide8(canvasInfo.totalWorth)} WICP`}</span>
      </div>

      {isShowBonus() && canvasInfo.bonusPixelThreshold !== undefined && detailExpand && (
        <div className="textDetail">
          Bonus status:
          <span>
            {canvasInfo.changeTotal >= (canvasInfo.bonusPixelThreshold || 0)
              ? ' Open'
              : ` Not open(${canvasInfo.changeTotal}/${canvasInfo.bonusPixelThreshold})`}
          </span>
        </div>
      )}
      {isAlone() && props.allMember && (
        <div className="textDetail">
          Artwork Collaborators:
          <span>{` `}</span>
          {props.allMember.map((item, index) => {
            return (
              <span key={index}>
                {index > 0 && '、'}
                <UserPrincipal prinId={item[0].toText()} maxLength={5} />
              </span>
            )
          })}
        </div>
      )}
      {isShowBonus() && detailExpand && (
        <div className="textDetail">
          Bonus to vest:
          <span>{` ${getValueDivide8(canvasInfo.bonus)} WICP`}</span>
        </div>
      )}

      {!isAlone() && detailExpand && (
        <div className="textDetail">
          Number of Updated Pixels:
          <span>{` ${canvasInfo.changeTotal}`}</span>
        </div>
      )}

      {!isAlone() && detailExpand && (
        <div className="textDetail">
          Number of Players:
          <span>{` ${canvasInfo.paintersNum || 1}`}</span>
        </div>
      )}
      {!isAlone() && detailExpand && (
        <div className="textDetail">
          MVP (Most Valuable Pixel):
          <span>{` ${getValueDivide8(highestInfo.length ? highestInfo[0][1].curPrice : 0)} WICP, Coordinates:(${
            highestInfo.length ? highestInfo[0][0].x : 0
          },${highestInfo.length ? highestInfo[0][0].y : 0})`}</span>
        </div>
      )}
      {!isAlone() && !props.hideLine && (
        <div className="buttonLayout">
          <div className="more">
            <DoubleRightOutlined rotate={detailExpand ? 270 : 90} />
          </div>
        </div>
      )}
    </div>
  )
}
export default memo(CanvasInfo)
