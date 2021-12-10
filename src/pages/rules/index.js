import React, { memo } from 'react'

import { RuleWrapper, RuleBlockWrapper, RuleContentWrapper } from './style'
import Draw from '@/assets/images/rule/rule_draw.png'
import Eraser from '@/assets/images/rule/rule_eraser.png'
import Earn from '@/assets/images/rule/rule_earn.png'
import ItemBg from '@/assets/images/rule/rule_item_bg.png'
import MultiList from '@/pages/home/cpns/all-multi-canvas'

function Rules(props) {
  return (
    <RuleWrapper>
      {/* 主体内容 */}
      <MultiList onlyMultiCanvas={true} />
      <RuleBlockWrapper marginTop={75}>
        <div className="content">
          <h2>Completely on-Dfinity collaborative pixel painting</h2>
          <p>
            Crowd Created Canvas is the first-ever collectible, collaborative pixel artwork to be created by the Dfinity
            community. Each canvas is at least 100x100 pixels in size and has multiple authors who create a unique piece
            of art by collaborating. Those who participate in the completion of the artwork will have the opportunity to
            obtain great benefits.
          </p>
        </div>
      </RuleBlockWrapper>

      <RuleBlockWrapper marginTop={75}>
        <div className="content">
          <h2>Earn by contributing</h2>
          <p>
            Art creators: By contributing to the artwork, are digitally signing their address on each pixel painted on
            the Blockchain for eternity - as well as being entitled to 10 percent of the bonus pool. For painters: Once
            a new player paint an occupied pixel, the former owner is getting a 17% profit of that pixel value.
          </p>

          <li>
            Track 1: 50% of the total prize pool will be equally divided into all users participating in canvas
            creation.
          </li>
          <li>
            Track 2: 30% of the total prize pool will be given to the canvas last pixel painter. The painter of the last
            pixel is defined as the painter who draws at the nearest end time before the canvas deadline and then he
            successfully submits it.
          </li>
          <li>
            10% of the total bonus pool will also be allocated to CCC as operating cost , which will be later used as an
            incentive creator.
          </li>
        </div>
      </RuleBlockWrapper>

      <RuleBlockWrapper marginTop={100} itemBg={ItemBg}>
        <div className="picture_content">
          <h2>How can I contribute?</h2>
          <div className="box">
            <div className="item w-1">
              <img src={Draw} alt="difinity" />
              <p>Choose a color and select the pixels you would like to paint.</p>
            </div>
            <div className="item w-2">
              <img src={Eraser} alt="solrnr" />
              <p>Submit your pixel selection to the Canister.</p>
            </div>
            <div className="item w-3">
              <img src={Earn} alt="solrnr" />
              <p>Once the pixel is covered, you will receive 17% of the profit off of the pixel total value.</p>
            </div>
          </div>
          <div className="box"></div>
        </div>
      </RuleBlockWrapper>

      <RuleBlockWrapper marginTop={75}>
        <div className="content">
          <h2>How much does it cost to paint a pixel?</h2>
          <p>
            In essence, the pixel price is determined by the increasing odds, and the more the participants, the higher
            the price. For example, the initial cost of a canvas pixel is 0.0001 ICP, and the magnification is 30%. Then
            the second purchase price of the next pixel would be 0.00013 ICP.
          </p>
        </div>
      </RuleBlockWrapper>

      <RuleBlockWrapper marginTop={75}>
        <div className="content">
          <h2>Who holds the copyright to a canvas?</h2>
          <p>
            When the crowd-creation canvas is initiated, the initiator will automatically own 10% of the bonus pool
            right at the end of the canvas countdown. When the crowd-creation canvas ends, the smart contract is
            automatically triggered to randomly select a pixel within the canvas; that pixel owner will own the canvas.
            He can later decide to sell, auction or hold the canvas.
          </p>
        </div>
      </RuleBlockWrapper>

      <RuleBlockWrapper marginTop={75}>
        <div className="content">
          <h2>What’s the solidification period?</h2>
          <p>
            A CCC (Crowd-Created Canvas) is a living creature since it is generated. It allows players to paint on a
            permissionless Architecture resulting in the creation of a colorful unprecedented product. A living CCC
            enters a Remaining time + 6 minutes * pixels solidification period whenever it is updated. In other words,
            the solidification period is a moving interval. It restarts whenever it is updated. It also means a CCC
            solidified Remaining time + 6 minutes * pixels hours after the last update. Once solidified, the canvas will
            be kept and assigned to one of the painters as an NFT. At the same time, the remaining time will not exceed
            24 hours.
          </p>
        </div>
      </RuleBlockWrapper>
    </RuleWrapper>
  )
}
export default memo(Rules)
