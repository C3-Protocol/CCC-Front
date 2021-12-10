export const idlFactory = ({ IDL }) => {
  const MintAloneNFTRequest = IDL.Record({
    'tokenIndex' : IDL.Nat,
    'owner' : IDL.Principal,
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'createFee' : IDL.Nat,
    'backGround' : IDL.Nat,
    'createUser' : IDL.Principal,
    'dimension' : IDL.Nat,
    'minDrawNum' : IDL.Nat,
    'wicpCanisterId' : IDL.Principal,
    'basePrice' : IDL.Nat,
    'feeTo' : IDL.Principal,
  });
  const DrawOverResponse = IDL.Variant({
    'ok' : IDL.Bool,
    'err' : IDL.Variant({
      'NotAttachMinNum' : IDL.Null,
      'NotCreator' : IDL.Null,
      'AlreadyOver' : IDL.Null,
    }),
  });
  const Position__1 = IDL.Record({ 'x' : IDL.Nat, 'y' : IDL.Nat });
  const Color__1 = IDL.Nat;
  const DrawPosRequest = IDL.Record({
    'pos' : Position__1,
    'color' : Color__1,
  });
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
  const Position = IDL.Record({ 'x' : IDL.Nat, 'y' : IDL.Nat });
  const Color = IDL.Nat;
  const AloneNFTDesInfo = IDL.Record({
    'createBy' : IDL.Principal,
    'tokenIndex' : IDL.Nat,
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'backGround' : IDL.Nat,
    'isNFTOver' : IDL.Bool,
    'totalWorth' : IDL.Nat,
    'basePrice' : IDL.Nat,
    'canisterId' : IDL.Principal,
  });
  const AloneCanvas = IDL.Service({
    'drawOver' : IDL.Func([], [DrawOverResponse], []),
    'drawPixel' : IDL.Func([IDL.Vec(DrawPosRequest)], [DrawResponse], []),
    'getAllPixel' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(Position, Color))],
        ['query'],
      ),
    'getCreator' : IDL.Func([], [IDL.Principal], ['query']),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getNftDesInfo' : IDL.Func([], [AloneNFTDesInfo], ['query']),
    'getWorth' : IDL.Func([], [IDL.Nat], ['query']),
    'isOver' : IDL.Func([], [IDL.Bool], ['query']),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
  });
  return AloneCanvas;
};
export const init = ({ IDL }) => {
  const MintAloneNFTRequest = IDL.Record({
    'tokenIndex' : IDL.Nat,
    'owner' : IDL.Principal,
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'createFee' : IDL.Nat,
    'backGround' : IDL.Nat,
    'createUser' : IDL.Principal,
    'dimension' : IDL.Nat,
    'minDrawNum' : IDL.Nat,
    'wicpCanisterId' : IDL.Principal,
    'basePrice' : IDL.Nat,
    'feeTo' : IDL.Principal,
  });
  return [MintAloneNFTRequest];
};
