export const idlFactory = ({ IDL }) => {
  const DisResponse = IDL.Variant({
    ok: IDL.Bool,
    err: IDL.Variant({ NotTimeToDistribute: IDL.Null })
  })
  const TokenIndex = IDL.Nat
  const StakeInfo = IDL.Record({
    participantsNum: IDL.Nat,
    stakedNum: IDL.Nat,
    prizePool: IDL.Nat
  })
  const Time = IDL.Int
  const TokenIndex__1 = IDL.Nat
  const RarityAttr = IDL.Record({
    tokenIndex: TokenIndex__1,
    rarityScore: IDL.Nat
  })
  const StakingResponse = IDL.Variant({
    ok: IDL.Bool,
    err: IDL.Variant({
      StakingNotOpen: IDL.Null,
      ListOnMarketPlace: IDL.Null,
      NotAllowTransferToSelf: IDL.Null,
      AlreayStakingOrIndexWrong: IDL.Null,
      TryAgain: IDL.Null,
      NotOwnerOrNotApprove: IDL.Null,
      NotFoundIndex: IDL.Null,
      NotTimeToDistribute: IDL.Null,
      Other: IDL.Null
    })
  })
  const StakeNFT = IDL.Service({
    disStakeBonus: IDL.Func([], [DisResponse], []),
    getAllStakeNFT: IDL.Func([], [IDL.Vec(TokenIndex)], ['query']),
    getAllStakingInfo: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(TokenIndex)))], ['query']),
    getONEDAY: IDL.Func([], [IDL.Nat], ['query']),
    getONEMONTH: IDL.Func([], [IDL.Nat], ['query']),
    getStakeInfo: IDL.Func([], [StakeInfo], ['query']),
    getStakerSize: IDL.Func([], [IDL.Nat], ['query']),
    getTimeStamp: IDL.Func([], [Time, Time], ['query']),
    getUserBonus: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Tuple(TokenIndex, IDL.Nat))], ['query']),
    getWeight: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex, IDL.Nat))], ['query']),
    init: IDL.Func([IDL.Principal, Time], [IDL.Bool], []),
    setONEDAY: IDL.Func([IDL.Nat], [], []),
    setONEMONTH: IDL.Func([IDL.Nat], [], []),
    setWeight: IDL.Func([IDL.Vec(RarityAttr)], [IDL.Bool], []),
    stakingNFT: IDL.Func([IDL.Vec(TokenIndex)], [StakingResponse], []),
    syncWICPBalance: IDL.Func([], [IDL.Bool], []),
    thawNFT: IDL.Func([], [], []),
    unStakingNFT: IDL.Func([IDL.Vec(TokenIndex)], [StakingResponse], [])
  })
  return StakeNFT
}
export const init = ({ IDL }) => {
  return [IDL.Principal, IDL.Principal]
}
