export const idlFactory = ({ IDL }) => {
  const TokenIndex__1 = IDL.Nat;
  const TokenIndex = IDL.Nat;
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
  const Operation = IDL.Variant({
    'Bid' : IDL.Null,
    'List' : IDL.Null,
    'Mint' : IDL.Null,
    'Sale' : IDL.Null,
    'CancelList' : IDL.Null,
    'Transfer' : IDL.Null,
    'UpdateList' : IDL.Null,
  });
  const Time = IDL.Int;
  const OpRecord = IDL.Record({
    'op' : Operation,
    'to' : IDL.Opt(IDL.Principal),
    'from' : IDL.Opt(IDL.Principal),
    'timestamp' : Time,
    'price' : IDL.Opt(IDL.Nat),
  });
  const Listings = IDL.Record({
    'tokenIndex' : TokenIndex,
    'time' : Time,
    'seller' : IDL.Principal,
    'price' : IDL.Nat,
  });
  const ListRequest = IDL.Record({
    'tokenIndex' : TokenIndex,
    'price' : IDL.Nat,
  });
  const MintNFTRequest = IDL.Record({ 'desc' : IDL.Text, 'name' : IDL.Text });
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
      'ExceedMaxNum' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'Other' : IDL.Null,
      'LessThanFee' : IDL.Null,
      'AllowedInsufficientBalance' : IDL.Null,
    }),
  });
  const BonusParamPercent = IDL.Record({
    'feedBackPercent' : IDL.Nat,
    'bonusCreatorPercent' : IDL.Nat,
    'bonusWinnerPercent' : IDL.Nat,
    'bonusAllUserPercent' : IDL.Nat,
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
  const MultiNFT = IDL.Service({
    'approve' : IDL.Func([IDL.Principal, TokenIndex__1], [IDL.Bool], []),
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'buyNow' : IDL.Func([TokenIndex__1], [BuyResponse], []),
    'cancelFavorite' : IDL.Func([CanvasIdentity], [IDL.Bool], []),
    'cancelList' : IDL.Func([TokenIndex__1], [ListResponse], []),
    'clearParticateRecord' : IDL.Func([], [IDL.Bool], []),
    'clearTradeRecord' : IDL.Func([], [IDL.Bool], []),
    'getAllMultipCanvas' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))],
        ['query'],
      ),
    'getAllNFT' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))],
        ['query'],
      ),
    'getApproved' : IDL.Func(
        [TokenIndex__1],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'getBasicPrice' : IDL.Func([], [IDL.Nat], ['query']),
    'getCanvasStatus' : IDL.Func([IDL.Principal], [CanisterStatus], []),
    'getCreateCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getFavorite' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(CanvasIdentity)],
        ['query'],
      ),
    'getFeeTo' : IDL.Func([], [IDL.Principal], ['query']),
    'getGrowRatio' : IDL.Func([], [IDL.Nat], ['query']),
    'getHistory' : IDL.Func([TokenIndex__1], [IDL.Vec(OpRecord)], ['query']),
    'getListings' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(CanvasIdentity, Listings))],
        ['query'],
      ),
    'getMarketFeeRatio' : IDL.Func([], [IDL.Nat], ['query']),
    'getMaxMultiCounts' : IDL.Func([], [IDL.Nat], ['query']),
    'getMultiFee' : IDL.Func([], [IDL.Nat], ['query']),
    'getMultipCanvasSizes' : IDL.Func([], [IDL.Nat], ['query']),
    'getNFTByIndex' : IDL.Func(
        [TokenIndex__1],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'getNftFavoriteNum' : IDL.Func([TokenIndex__1], [IDL.Nat], ['query']),
    'getParticipate' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(CanvasIdentity)],
        ['query'],
      ),
    'getRecentFinshed' : IDL.Func([], [IDL.Vec(CanvasIdentity)], ['query']),
    'getStorageCanisterId' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'getWICPCanisterId' : IDL.Func([], [IDL.Principal], ['query']),
    'isApprovedForAll' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Bool],
        ['query'],
      ),
    'isFavorite' : IDL.Func(
        [IDL.Principal, CanvasIdentity],
        [IDL.Bool],
        ['query'],
      ),
    'isList' : IDL.Func([TokenIndex__1], [IDL.Opt(Listings)], ['query']),
    'list' : IDL.Func([ListRequest], [ListResponse], []),
    'mintMultiCanvas' : IDL.Func([MintNFTRequest], [CreateCanvasResponse], []),
    'newStorageCanister' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'ownerOf' : IDL.Func([TokenIndex__1], [IDL.Opt(IDL.Principal)], ['query']),
    'setApprovalForAll' : IDL.Func([IDL.Principal, IDL.Bool], [IDL.Bool], []),
    'setBasicPrice' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setBonusParam' : IDL.Func([BonusParamPercent], [IDL.Bool], []),
    'setController' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setCreateCycles' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setDeadline' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setDimension' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setFavorite' : IDL.Func([CanvasIdentity], [IDL.Bool], []),
    'setFeeTo' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setGrowRatio' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setMarketFeeRatio' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setMaxMultiCounts' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setMultiFee' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setNftOwner' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setOpen' : IDL.Func([IDL.Bool], [IDL.Bool], []),
    'setOwner' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setParticipate' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setStorageCanisterId' : IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Bool], []),
    'setWICPCanisterId' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'syncParticate' : IDL.Func([], [IDL.Bool], []),
    'syncTradeHistory' : IDL.Func([], [IDL.Bool], []),
    'transferFrom' : IDL.Func(
        [IDL.Principal, IDL.Principal, TokenIndex__1],
        [TransferResponse],
        [],
      ),
    'updateList' : IDL.Func([ListRequest], [ListResponse], []),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
  });
  return MultiNFT;
};
export const init = ({ IDL }) => {
  return [IDL.Principal, IDL.Principal, IDL.Principal];
};
