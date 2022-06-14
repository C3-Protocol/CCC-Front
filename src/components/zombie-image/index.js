import React, { memo, useState } from 'react'
import './style.css'
import { Popover, Image } from 'antd'
import Pot from '@/assets/images/market/zombie/pot.png'
import OpenEye from '@/assets/images/market/zombie/openeye.png'

// zombie的image
function ZombieImage(props) {
  const { prinId, tokenIndex, zombieInfo } = props
  const [showPartIndex, setShowPartIndex] = useState(-1)
  const zombiePart = ['hat', 'head', 'arm', 'leg', 'background']
  const zombiePartName = ['Hat', 'Head', 'Upper body', 'Lower body', 'Background']
  const [showLarge, setShowLarge] = useState(false)

  const setCurrentShowIndex = (show, index) => {
    if (show) {
      setShowPartIndex(index)
    } else {
      setShowPartIndex(-1)
    }
  }

  const getAttrContent = (i) => {
    let info = zombieInfo[zombiePart[i]]
    let value = info ? parseInt(info.attack) + parseInt(info.defense) + parseInt(info.agile) : 0

    return (
      <div className="box" key={i}>
        <div className="part">{zombiePartName[i]}</div>
        {info && <div className="part-value">{`Name:${info.name}`}</div>}
        {info && <div className="part-value">{`Attack: ${info.attack}`}</div>}
        {info && <div className="part-value">{`Defense: ${info.defense}`}</div>}
        {info && <div className="part-value">{`Agility: ${info.agile}`}</div>}
      </div>
    )
  }

  const getPartContent = (index, direction) => {
    return (
      <Popover
        content={getAttrContent(index)}
        trigger={['hover', 'click']}
        placement={direction}
        visible={showLarge || index === showPartIndex}
        onVisibleChange={(res) => {
          setCurrentShowIndex(res, index)
        }}
      >
        <div className={zombiePart[index]}>
          {(showLarge || showPartIndex === index) && <div className={`${direction}-line`}></div>}
          {(showLarge || showPartIndex === index) && <img className="pot" src={Pot} />}
        </div>
      </Popover>
    )
  }

  return (
    <Image.PreviewGroup>
      <div
        className={'container'}
        onClick={() => {
          showLarge && setShowLarge(false)
        }}
      >
        <Image className="zombie-image" src={`https://${prinId}.raw.ic0.app/token/${tokenIndex}`} />
        {/* {getPartContent(0, 'left')}
        {getPartContent(1, 'right')}
        {getPartContent(2, 'left')}
        {getPartContent(3, 'right')}
        {getPartContent(4, 'top')}
        <img
          className="open-eye"
          src={OpenEye}
          onClick={() => {
            setShowLarge(!showLarge)
          }}
        ></img> */}
      </div>
    </Image.PreviewGroup>
  )
}

export default memo(ZombieImage)
