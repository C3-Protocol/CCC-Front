export const idlFactory = ({ IDL }) => {
  const Mint1155NFTRequest = IDL.Record({
    'creator' : IDL.Principal,
    'tokenIndex' : IDL.Nat,
    'owner' : IDL.Principal,
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'deadline' : IDL.Nat,
    'growRatio' : IDL.Nat,
    'dimension' : IDL.Nat,
    'wicpCanisterId' : IDL.Principal,
    'basePrice' : IDL.Nat,
  });
  const BonusParamPercent = IDL.Record({
    'feedBackPercent' : IDL.Nat,
    'bonusStakerPercent' : IDL.Nat,
    'bonusWinnerPercent' : IDL.Nat,
    'bonusBurnPercent' : IDL.Nat,
  });
  const Position__1 = IDL.Record({ 'x' : IDL.Nat, 'y' : IDL.Nat });
  const Color = IDL.Nat;
  const DrawPosRequest = IDL.Record({ 'pos' : Position__1, 'color' : Color });
  const DrawResponse = IDL.Variant({
    'ok' : IDL.Bool,
    'err' : IDL.Variant({
      'NotAttachGapTime' : IDL.Null,
      'PositionError' : IDL.Null,
      'NFTDrawOver' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'Other' : IDL.Null,
      'LessThanFee' : IDL.Null,
      'AllowedInsufficientBalance' : IDL.Null,
    }),
  });
  const AccInfo = IDL.Record({
    'consume' : IDL.Nat,
    'pixelNum' : IDL.Nat,
    'income' : IDL.Nat,
    'withDrawed' : IDL.Nat,
  });
  const Asset = IDL.Record({
    'withdraw' : IDL.Nat,
    'income' : IDL.Nat,
    'invest' : IDL.Nat,
  });
  const Position = IDL.Record({ 'x' : IDL.Nat, 'y' : IDL.Nat });
  const PixelInfo = IDL.Record({ 'color' : Color, 'price' : IDL.Nat });
  const TokenIndex = IDL.Nat;
  const Time = IDL.Int;
  const DrawRecord = IDL.Record({
    'num' : IDL.Nat,
    'updateTime' : Time,
    'consume' : IDL.Nat,
    'memo' : IDL.Opt(IDL.Text),
    'painter' : IDL.Principal,
    'index' : IDL.Nat,
  });
  const Pixel = IDL.Record({
    'curPrice' : IDL.Nat,
    'prevOwner' : IDL.Principal,
    'color' : Color,
    'curOwner' : IDL.Principal,
  });
  const NFTDesInfo = IDL.Record({
    'startTime' : Time,
    'tokenIndex' : IDL.Nat,
    'changeTotal' : IDL.Nat,
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'growRatio' : IDL.Nat,
    'videoLink' : IDL.Text,
    'isNFTOver' : IDL.Bool,
    'finshTime' : Time,
    'paintersNum' : IDL.Nat,
    'bonusWinner' : IDL.Opt(IDL.Principal),
    'bonus' : IDL.Nat,
    'allStaked' : IDL.Nat,
    'totalWorth' : IDL.Nat,
    'basePrice' : IDL.Nat,
    'canisterId' : IDL.Principal,
  });
  const CanvasOverResponse = IDL.Variant({
    'ok' : IDL.Bool,
    'err' : IDL.Variant({
      'SetOwnerFail' : IDL.Null,
      'BonusDropFail' : IDL.Null,
      'Other' : IDL.Null,
      'NotThreshold' : IDL.Null,
    }),
  });
  const StakingResponse = IDL.Variant({
    'ok' : IDL.Bool,
    'err' : IDL.Variant({
      'ListOnMarketPlace' : IDL.Null,
      'NotAllowTransferToSelf' : IDL.Null,
      'AlreayStakingOrIndexWrong' : IDL.Null,
      'NFTDrawOver' : IDL.Null,
      'NotOwnerOrNotApprove' : IDL.Null,
      'NotFoundIndex' : IDL.Null,
      'NotOwner' : IDL.Null,
      'Other' : IDL.Null,
    }),
  });
  const WithDrawResponse = IDL.Variant({
    'ok' : IDL.Nat,
    'err' : IDL.Variant({
      'BonusNotActive' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'Other' : IDL.Null,
      'LessThanFee' : IDL.Null,
      'AllowedInsufficientBalance' : IDL.Null,
    }),
  });
  const MultiCanvas = IDL.Service({
    'clearUselessData' : IDL.Func([IDL.Bool], [IDL.Bool], []),
    'drawPixel' : IDL.Func(
        [IDL.Vec(DrawPosRequest), IDL.Opt(IDL.Text)],
        [DrawResponse],
        [],
      ),
    'fixAccPixelNums' : IDL.Func([], [IDL.Bool], []),
    'getAccInfo' : IDL.Func([], [AccInfo], ['query']),
    'getAccInfo2' : IDL.Func([IDL.Principal], [AccInfo], ['query']),
    'getAllAccPixelNums' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
        ['query'],
      ),
    'getAllIncome' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, Asset))],
        ['query'],
      ),
    'getAllPixel' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(Position, PixelInfo))],
        ['query'],
      ),
    'getAllStakeZombie' : IDL.Func([], [IDL.Vec(TokenIndex)], ['query']),
    'getBonus' : IDL.Func([], [IDL.Nat], ['query']),
    'getBonusWinner' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getDrawRecord' : IDL.Func([], [IDL.Vec(DrawRecord)], ['query']),
    'getFinshedTime' : IDL.Func([], [Time], ['query']),
    'getHighestPosition' : IDL.Func(
        [],
        [IDL.Opt(IDL.Tuple(Position, Pixel))],
        ['query'],
      ),
    'getIncrementalTime' : IDL.Func([], [Time], ['query']),
    'getNftDesInfo' : IDL.Func([], [NFTDesInfo], ['query']),
    'getPixelByPosition' : IDL.Func([Position], [IDL.Opt(Pixel)], ['query']),
    'getUserBonusByIndexs' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Tuple(TokenIndex, IDL.Nat))],
        ['query'],
      ),
    'getWorth' : IDL.Func([], [IDL.Nat], ['query']),
    'getZombieCanisterId' : IDL.Func([], [IDL.Principal], ['query']),
    'isOver' : IDL.Func([], [IDL.Bool], ['query']),
    'lotteryNFTOwner' : IDL.Func([], [CanvasOverResponse], []),
    'setDeadLine' : IDL.Func([Time], [IDL.Bool], []),
    'setIncrementalTime' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setOneDay' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setVideoLink' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'setZombieCanisterId' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'stakingZombie' : IDL.Func([IDL.Vec(TokenIndex)], [StakingResponse], []),
    'thawZombie' : IDL.Func([], [], []),
    'unStakingZombie' : IDL.Func([IDL.Vec(TokenIndex)], [StakingResponse], []),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
    'withDrawIncome' : IDL.Func([], [WithDrawResponse], []),
    'withDrawLeft' : IDL.Func([], [], []),
  });
  return MultiCanvas;
};
export const init = ({ IDL }) => {
  const Mint1155NFTRequest = IDL.Record({
    'creator' : IDL.Principal,
    'tokenIndex' : IDL.Nat,
    'owner' : IDL.Principal,
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'deadline' : IDL.Nat,
    'growRatio' : IDL.Nat,
    'dimension' : IDL.Nat,
    'wicpCanisterId' : IDL.Principal,
    'basePrice' : IDL.Nat,
  });
  const BonusParamPercent = IDL.Record({
    'feedBackPercent' : IDL.Nat,
    'bonusStakerPercent' : IDL.Nat,
    'bonusWinnerPercent' : IDL.Nat,
    'bonusBurnPercent' : IDL.Nat,
  });
  return [Mint1155NFTRequest, BonusParamPercent];
};
