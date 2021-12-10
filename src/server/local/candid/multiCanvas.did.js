export const idlFactory = ({ IDL }) => {
  const MintMultiNFTRequest = IDL.Record({
    'tokenIndex' : IDL.Nat,
    'owner' : IDL.Principal,
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'createFee' : IDL.Nat,
    'createUser' : IDL.Principal,
    'deadline' : IDL.Nat,
    'growRatio' : IDL.Nat,
    'dimension' : IDL.Nat,
    'wicpCanisterId' : IDL.Principal,
    'basePrice' : IDL.Nat,
  });
  const BonusParamPercent = IDL.Record({
    'feedBackPercent' : IDL.Nat,
    'bonusCreatorPercent' : IDL.Nat,
    'bonusWinnerPercent' : IDL.Nat,
    'bonusAllUserPercent' : IDL.Nat,
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
  const MultiCanvasAccInfo = IDL.Record({
    'consume' : IDL.Nat,
    'userBonus' : IDL.Nat,
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
  const MultiNFTDesInfo = IDL.Record({
    'createBy' : IDL.Principal,
    'bonusPixelThreshold' : IDL.Nat,
    'tokenIndex' : IDL.Nat,
    'changeTotal' : IDL.Nat,
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'lastUpdate' : Time,
    'growRatio' : IDL.Nat,
    'isNFTOver' : IDL.Bool,
    'paintersNum' : IDL.Nat,
    'bonusWinner' : IDL.Opt(IDL.Principal),
    'bonus' : IDL.Nat,
    'totalWorth' : IDL.Nat,
    'basePrice' : IDL.Nat,
    'canisterId' : IDL.Principal,
  });
  const LotteryResponse = IDL.Variant({
    'ok' : IDL.Principal,
    'err' : IDL.Variant({
      'SetOwnerFail' : IDL.Null,
      'BonusDropFail' : IDL.Null,
      'Other' : IDL.Null,
      'NotThreshold' : IDL.Null,
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
    'clearUselessData' : IDL.Func([], [IDL.Bool], []),
    'drawPixel' : IDL.Func(
        [IDL.Vec(DrawPosRequest), IDL.Opt(IDL.Text)],
        [DrawResponse],
        [],
      ),
    'getAccInfo' : IDL.Func([], [MultiCanvasAccInfo], ['query']),
    'getAllAccChangeNums' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
        ['query'],
      ),
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
    'getBonus' : IDL.Func([], [IDL.Nat], ['query']),
    'getBonusWinner' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'getCreator' : IDL.Func([], [IDL.Principal], ['query']),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getDrawRecord' : IDL.Func([], [IDL.Vec(DrawRecord)], ['query']),
    'getFinshedTime' : IDL.Func([], [Time], ['query']),
    'getHighestPosition' : IDL.Func(
        [],
        [IDL.Opt(IDL.Tuple(Position, Pixel))],
        ['query'],
      ),
    'getIncrementalTime' : IDL.Func([], [Time], ['query']),
    'getLastUpdatedTime' : IDL.Func([], [Time, IDL.Nat], ['query']),
    'getNftDesInfo' : IDL.Func([], [MultiNFTDesInfo], ['query']),
    'getPixelByPosition' : IDL.Func([Position], [IDL.Opt(Pixel)], ['query']),
    'getWorth' : IDL.Func([], [IDL.Nat], ['query']),
    'isOver' : IDL.Func([], [IDL.Bool], ['query']),
    'lotteryNFTOwner' : IDL.Func([], [LotteryResponse], []),
    'setIncrementalTime' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
    'withDrawIncome' : IDL.Func([], [WithDrawResponse], []),
    'withDrawLeft' : IDL.Func([], [], []),
  });
  return MultiCanvas;
};
export const init = ({ IDL }) => {
  const MintMultiNFTRequest = IDL.Record({
    'tokenIndex' : IDL.Nat,
    'owner' : IDL.Principal,
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'createFee' : IDL.Nat,
    'createUser' : IDL.Principal,
    'deadline' : IDL.Nat,
    'growRatio' : IDL.Nat,
    'dimension' : IDL.Nat,
    'wicpCanisterId' : IDL.Principal,
    'basePrice' : IDL.Nat,
  });
  const BonusParamPercent = IDL.Record({
    'feedBackPercent' : IDL.Nat,
    'bonusCreatorPercent' : IDL.Nat,
    'bonusWinnerPercent' : IDL.Nat,
    'bonusAllUserPercent' : IDL.Nat,
  });
  return [MintMultiNFTRequest, BonusParamPercent];
};
