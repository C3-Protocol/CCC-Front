export const idlFactory = ({ IDL }) => {
  const TokenIndex__1 = IDL.Nat;
  const TokenIndex = IDL.Nat;
  const BuyRequest = IDL.Record({
    'tokenIndex' : TokenIndex,
    'marketFeeRatio' : IDL.Nat,
    'feeTo' : IDL.Principal,
  });
  const BuyResponse = IDL.Variant({
    'ok' : TokenIndex,
    'err' : IDL.Variant({
      'NotAllowBuySelf' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
      'AlreadyTransferToOther' : IDL.Null,
      'NotFoundIndex' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'Other' : IDL.Null,
      'LessThanFee' : IDL.Null,
      'AllowedInsufficientBalance' : IDL.Null,
    }),
  });
  const CanvasIdentity = IDL.Record({
    'index' : TokenIndex,
    'canisterId' : IDL.Principal,
  });
  const ListResponse = IDL.Variant({
    'ok' : TokenIndex,
    'err' : IDL.Variant({
      'NotApprove' : IDL.Null,
      'NotNFT' : IDL.Null,
      'NotFoundIndex' : IDL.Null,
      'SamePrice' : IDL.Null,
      'NotOwner' : IDL.Null,
      'Other' : IDL.Null,
      'AlreadyList' : IDL.Null,
    }),
  });
  const Status = IDL.Variant({
    'stopped' : IDL.Null,
    'stopping' : IDL.Null,
    'running' : IDL.Null,
  });
  const CanisterSettings = IDL.Record({
    'freezing_threshold' : IDL.Opt(IDL.Nat),
    'controllers' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'memory_allocation' : IDL.Opt(IDL.Nat),
    'compute_allocation' : IDL.Opt(IDL.Nat),
  });
  const CanisterStatus = IDL.Record({
    'status' : Status,
    'memory_size' : IDL.Nat,
    'cycles' : IDL.Nat,
    'settings' : CanisterSettings,
    'module_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Time = IDL.Int;
  const Listings = IDL.Record({
    'tokenIndex' : TokenIndex,
    'time' : Time,
    'seller' : IDL.Principal,
    'price' : IDL.Nat,
  });
  const SoldListings = IDL.Record({
    'lastPrice' : IDL.Nat,
    'time' : Time,
    'account' : IDL.Nat,
  });
  const ListRequest = IDL.Record({
    'tokenIndex' : TokenIndex,
    'price' : IDL.Nat,
  });
  const MintAloneRequest = IDL.Record({
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'backGround' : IDL.Nat,
  });
  const CanvasIdentity__1 = IDL.Record({
    'index' : TokenIndex,
    'canisterId' : IDL.Principal,
  });
  const CreateCanvasResponse = IDL.Variant({
    'ok' : CanvasIdentity__1,
    'err' : IDL.Variant({
      'NotBeInvited' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
      'InsufficientCycles' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'Other' : IDL.Null,
      'LessThanFee' : IDL.Null,
      'AllowedInsufficientBalance' : IDL.Null,
    }),
  });
  const TransferResponse = IDL.Variant({
    'ok' : TokenIndex,
    'err' : IDL.Variant({
      'ListOnMarketPlace' : IDL.Null,
      'NotAllowTransferToSelf' : IDL.Null,
      'NotOwnerOrNotApprove' : IDL.Null,
      'Other' : IDL.Null,
    }),
  });
  const AloneNFT = IDL.Service({
    'approve' : IDL.Func([IDL.Principal, TokenIndex__1], [IDL.Bool], []),
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'buyNow' : IDL.Func([BuyRequest], [BuyResponse], []),
    'cancelFavorite' : IDL.Func([CanvasIdentity], [IDL.Bool], []),
    'cancelList' : IDL.Func([TokenIndex__1], [ListResponse], []),
    'getAllInvited' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
        ['query'],
      ),
    'getAllNFT' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))],
        ['query'],
      ),
    'getAloneFee' : IDL.Func([], [IDL.Nat], ['query']),
    'getApproved' : IDL.Func(
        [TokenIndex__1],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'getBasicPrice' : IDL.Func([], [IDL.Nat], ['query']),
    'getCanvasStatus' : IDL.Func([IDL.Principal], [CanisterStatus], []),
    'getCreateCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getFeeTo' : IDL.Func([], [IDL.Principal], ['query']),
    'getInvited' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'getListings' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(CanvasIdentity, Listings))],
        ['query'],
      ),
    'getMinDrawNum' : IDL.Func([], [IDL.Nat], ['query']),
    'getNFTByIndex' : IDL.Func(
        [TokenIndex__1],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'getOwner' : IDL.Func([], [IDL.Principal], ['query']),
    'getSoldListings' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(CanvasIdentity, SoldListings))],
        ['query'],
      ),
    'getStorageCanisterId' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'getWICPCanisterId' : IDL.Func([], [IDL.Principal], ['query']),
    'initRoyalty' : IDL.Func([], [IDL.Bool], []),
    'isApprovedForAll' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Bool],
        ['query'],
      ),
    'isList' : IDL.Func([TokenIndex__1], [IDL.Opt(Listings)], ['query']),
    'list' : IDL.Func([ListRequest], [ListResponse], []),
    'mintAloneCanvas' : IDL.Func(
        [MintAloneRequest],
        [CreateCanvasResponse],
        [],
      ),
    'newStorageCanister' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'ownerOf' : IDL.Func([TokenIndex__1], [IDL.Opt(IDL.Principal)], ['query']),
    'setAloneFee' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setApprovalForAll' : IDL.Func([IDL.Principal, IDL.Bool], [IDL.Bool], []),
    'setBasicPrice' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setController' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setCreateCycles' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setDimension' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setFavorite' : IDL.Func([CanvasIdentity], [IDL.Bool], []),
    'setFeeTo' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setInvited' : IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    'setMarketFeeRatio' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setMinDrawNum' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setNftOwner' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setOpen' : IDL.Func([IDL.Bool], [IDL.Bool], []),
    'setOwner' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setParticipate' : IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    'setRoyalty' : IDL.Func([TokenIndex__1, IDL.Nat], [IDL.Bool], []),
    'setStorageCanisterId' : IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Bool], []),
    'setWICPCanisterId' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'transferFrom' : IDL.Func(
        [IDL.Principal, IDL.Principal, TokenIndex__1],
        [TransferResponse],
        [],
      ),
    'updateList' : IDL.Func([ListRequest], [ListResponse], []),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
  });
  return AloneNFT;
};
export const init = ({ IDL }) => {
  return [IDL.Principal, IDL.Principal, IDL.Principal];
};
