export const idlFactory = ({ IDL }) => {
  const MintThemeNFTRequest = IDL.Record({
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
  const Position = IDL.Record({ 'x' : IDL.Nat, 'y' : IDL.Nat });
  const Color = IDL.Nat;
  const DrawPosRequest = IDL.Record({ 'pos' : Position, 'color' : Color });
  const DrawResponse = IDL.Variant({
    'ok' : IDL.Bool,
    'err' : IDL.Variant({
      'NotOpen' : IDL.Null,
      'NotAttachGapTime' : IDL.Null,
      'PositionError' : IDL.Null,
      'NotBeInvite' : IDL.Null,
      'NFTDrawOver' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'Other' : IDL.Null,
      'LessThanFee' : IDL.Null,
      'AllowedInsufficientBalance' : IDL.Null,
    }),
  });
  const ThemeCanvasAccInfo = IDL.Record({
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
  const Position__1 = IDL.Record({ 'x' : IDL.Nat, 'y' : IDL.Nat });
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
  const ThemeNFTDesInfo = IDL.Record({
    'startTime' : Time,
    'createBy' : IDL.Principal,
    'tokenIndex' : IDL.Nat,
    'changeTotal' : IDL.Nat,
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'videoLink' : IDL.Text,
    'isNFTOver' : IDL.Bool,
    'finshTime' : Time,
    'paintersNum' : IDL.Nat,
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
  const ThemeCanvas = IDL.Service({
    'clearPinPixels' : IDL.Func([], [IDL.Bool], []),
    'clearUselessData' : IDL.Func([IDL.Bool], [IDL.Bool], []),
    'drawPixel' : IDL.Func(
        [IDL.Vec(DrawPosRequest), IDL.Opt(IDL.Text)],
        [DrawResponse],
        [],
      ),
    'fixAccPixelNums' : IDL.Func([], [IDL.Bool], []),
    'getAccInfo' : IDL.Func([], [ThemeCanvasAccInfo], ['query']),
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
        [IDL.Vec(IDL.Tuple(Position__1, PixelInfo))],
        ['query'],
      ),
    'getBonus' : IDL.Func([], [IDL.Nat], ['query']),
    'getCreator' : IDL.Func([], [IDL.Principal], ['query']),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getDrawRecord' : IDL.Func([], [IDL.Vec(DrawRecord)], ['query']),
    'getFinshedTime' : IDL.Func([], [Time], ['query']),
    'getHighestPosition' : IDL.Func(
        [],
        [IDL.Opt(IDL.Tuple(Position__1, Pixel))],
        ['query'],
      ),
    'getIncrementalTime' : IDL.Func([], [Time], ['query']),
    'getNftDesInfo' : IDL.Func([], [ThemeNFTDesInfo], ['query']),
    'getOpenTime' : IDL.Func([], [Time], ['query']),
    'getPinPosition' : IDL.Func([], [IDL.Vec(Position__1)], ['query']),
    'getPixelByPosition' : IDL.Func([Position__1], [IDL.Opt(Pixel)], ['query']),
    'getWorth' : IDL.Func([], [IDL.Nat], ['query']),
    'initialPixels' : IDL.Func([IDL.Vec(DrawPosRequest)], [IDL.Bool], []),
    'isOver' : IDL.Func([], [IDL.Bool], ['query']),
    'lotteryNFTOwner' : IDL.Func([], [LotteryResponse], []),
    'pinPositions' : IDL.Func([IDL.Vec(DrawPosRequest)], [IDL.Bool], []),
    'setFinshedTime' : IDL.Func([Time], [IDL.Bool], []),
    'setIncrementalTime' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setOpenTime' : IDL.Func([Time], [IDL.Bool], []),
    'setVideoLink' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
    'withDrawIncome' : IDL.Func([], [WithDrawResponse], []),
    'withDrawLeft' : IDL.Func([], [], []),
  });
  return ThemeCanvas;
};
export const init = ({ IDL }) => {
  const MintThemeNFTRequest = IDL.Record({
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
  return [MintThemeNFTRequest, BonusParamPercent];
};
