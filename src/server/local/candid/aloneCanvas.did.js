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
    'bInvite' : IDL.Bool,
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
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'status_code' : IDL.Nat16,
  });
  const AloneCanvas = IDL.Service({
    'checkIfInvites' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'checkImage' : IDL.Func([], [IDL.Bool], ['query']),
    'deleteInviters' : IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    'drawOver' : IDL.Func([], [DrawOverResponse], []),
    'drawPixel' : IDL.Func([IDL.Vec(DrawPosRequest)], [DrawResponse], []),
    'getAllConsume' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
        ['query'],
      ),
    'getAllPixel' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(Position, Color))],
        ['query'],
      ),
    'getCreator' : IDL.Func([], [IDL.Principal], ['query']),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getNftDesInfo' : IDL.Func([], [AloneNFTDesInfo], ['query']),
    'getWorth' : IDL.Func([], [IDL.Nat], ['query']),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'invitePainters' : IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    'isOver' : IDL.Func([], [IDL.Bool], ['query']),
    'uploadImage' : IDL.Func([IDL.Vec(IDL.Nat8)], [IDL.Bool], []),
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
    'bInvite' : IDL.Bool,
    'minDrawNum' : IDL.Nat,
    'wicpCanisterId' : IDL.Principal,
    'basePrice' : IDL.Nat,
    'feeTo' : IDL.Principal,
  });
  return [MintAloneNFTRequest];
};
