import React, { memo } from 'react'

import { RuleWrapper, RuleBlockWrapper, RuleContentWrapper } from './style'
import Draw from '@/assets/images/rule/rule_draw.svg'
import Eraser from '@/assets/images/rule/rule_eraser.svg'
import Earn from '@/assets/images/rule/rule_earn.svg'
import ItemBg from '@/assets/images/rule/rule_item_bg.svg'
import MultiList from '@/pages/home/cpns/all-multi-canvas'

function Rules(props) {
  return (
    <RuleWrapper>
      {/* 主体内容 */}
      <MultiList onlyMultiCanvas={true} />

      <RuleBlockWrapper marginTop={50}>
        <div className="content">
          <h2>Earn by contributing</h2>
          <p>
            Art creators: By contributing to the artwork, are digitally signing their address on each pixel painted on
            the Blockchain for eternity
          </p>
          <p>The bonus pool is distributed as follow:</p>
          <li>60% goes to Zombie stakers.</li>
          <li>10% to the last person to draw on the canvas.</li>
          <li>
            25% to buy back and burn F-NFTs tokens left from previous canvas in order to increase holders token value.
          </li>
          <li>5% allocated to CCC for operations cost.</li>
          <p> </p>
          <p>
            Each pixel covered will make 17 percent profit, with 1155. However, each pixel covered gets a 30% increase
            of its previous price.
          </p>
          <h3>Pixel Tokenization of Crown Canvas last layer:</h3>
          <p>
            Only canvas last layer holders are affected by the formula below: 1 pixels = 10 F-NFT’s (fractionalized non
            fungible token) Each canvas = 40100 pixels which is also equal to 401000 F-NFT’s Distributed as follows:
          </p>
          <li>400000 F-NFTs to goes to canvas last layer holders.</li>
          <li>1000 F-NFTs allocated to CCC for operations cost.</li>
          <p> </p>
          <h3>Monthly Created Crowd Canvas:</h3>
          <p>1155 canvas will be released every month on the 4th week first day at 6 p.m. PST each month. </p>
        </div>
      </RuleBlockWrapper>

      <RuleBlockWrapper marginTop={75}>
        <div className="content">
          <h2>NFT Staking</h2>
          <p>
            The profit logic is calculated based on the amount of zombie holding and the staking period (at least 24
            hours).
          </p>
          <h3>Example: </h3>
          <p>
            Alice holding A and B Zombies starts staking at the beginning of the M-2 canvas. A and B zombies can
            participate in the staking at any time. Assuming that A zombie has been staked for 10 days and B for 15
            days, both will get their bonus pool weight if and only they have not been unlocked in advance.{' '}
          </p>
          <p>It is [1*10 + 1*15 = 25]. Meaning Alice will get a 25 days weight worth of WICP from the bonus pool. </p>
          <h3>Staking penalties:</h3>
          <p>
            Unlocking a Zombie stacked on a canvas before it finalizes will invalidate its weight, and rewards earned
            will be distributed to the remaining staked zombie holders.{' '}
          </p>

          <h3>How to claim reward:</h3>
          <p>
            After the canvas is done painting, rewards will be automatically distributed to valid zombie holders. Then
            All zombies previously staked unlocked.
          </p>
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
            When the crowd-creation canvas is finished, the final pixels holders control the entire canvas in the form
            of a Dao, which is fractionalized into F-NFTs tokens and distributed based on their pixel count. One pixel
            is equals 10 F-NFTs. On the secondary market, such tokens can be traded.
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
            solidified Remaining time + 6 minutes * pixels hours after the last update. At the same time, the remaining
            time will not exceed 24 hours.
          </p>
        </div>
      </RuleBlockWrapper>
    </RuleWrapper>
  )
}
export default memo(Rules)
