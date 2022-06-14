export const idlFactory = ({ IDL }) => {
  const TokenIndex = IDL.Nat;
  const Rights = IDL.Record({ 'available' : IDL.Nat, 'freezen' : IDL.Nat });
  const TokenIndex__2 = IDL.Nat;
  const BuyRequest1155 = IDL.Record({
    'tokenIndex' : TokenIndex__2,
    'quantity' : IDL.Nat,
    'unitPrice' : IDL.Nat,
    'orderIndex' : IDL.Nat,
  });
  const BuyResponse1155 = IDL.Variant({
    'ok' : TokenIndex__2,
    'err' : IDL.Variant({
      'NotAllowBuySelf' : IDL.Null,
      'NotFoundOrderIndex' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
      'ExceedMaxNum' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'Other' : IDL.Null,
      'LessThanFee' : IDL.Null,
      'AllowedInsufficientBalance' : IDL.Null,
      'NoOrderInTokenIndex' : IDL.Null,
    }),
  });
  const TokenIndex__1 = IDL.Nat;
  const CanvasIdentity = IDL.Record({
    'index' : TokenIndex__1,
    'canisterId' : IDL.Principal,
  });
  const CancelListRequest1155 = IDL.Record({
    'tokenIndex' : TokenIndex__2,
    'unitPrice' : IDL.Nat,
    'orderIndex' : IDL.Nat,
  });
  const ListResponse1155 = IDL.Variant({
    'ok' : IDL.Nat,
    'err' : IDL.Variant({
      'ReachMaxOrderNum' : IDL.Null,
      'NotFoundOrderIndex' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
      'NotOrderOwner' : IDL.Null,
      'Other' : IDL.Null,
      'NoOrderInTokenIndex' : IDL.Null,
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
  const ListKey = IDL.Record({ 'unitPrice' : IDL.Nat, 'orderIndex' : IDL.Nat });
  const Time = IDL.Int;
  const Listings1155 = IDL.Record({
    'timeStamp' : Time,
    'seller' : IDL.Principal,
    'quantity' : IDL.Nat,
    'unitPrice' : IDL.Nat,
    'orderIndex' : IDL.Nat,
  });
  const ListRequest1155 = IDL.Record({
    'tokenIndex' : TokenIndex__2,
    'quantity' : IDL.Nat,
    'unitPrice' : IDL.Nat,
  });
  const MintNFTRequest = IDL.Record({ 'desc' : IDL.Text, 'name' : IDL.Text });
  const CanvasIdentity__1 = IDL.Record({
    'index' : TokenIndex__1,
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
    'bonusStakerPercent' : IDL.Nat,
    'bonusWinnerPercent' : IDL.Nat,
    'bonusBurnPercent' : IDL.Nat,
  });
  const TransferResponse = IDL.Variant({
    'ok' : TokenIndex__1,
    'err' : IDL.Variant({
      'NotAllowTransferToSelf' : IDL.Null,
      'NotOwnerOrNotApprove' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
    }),
  });
  const MultiNFT1155 = IDL.Service({
    'balanceOf' : IDL.Func([TokenIndex], [Rights], ['query']),
    'balanceOfByIndex' : IDL.Func(
        [IDL.Principal, TokenIndex],
        [Rights],
        ['query'],
      ),
    'burn' : IDL.Func([TokenIndex, IDL.Nat], [IDL.Bool], []),
    'buyNow' : IDL.Func([BuyRequest1155], [BuyResponse1155], []),
    'cancelFavorite' : IDL.Func([CanvasIdentity], [IDL.Bool], []),
    'cancelList' : IDL.Func([CancelListRequest1155], [ListResponse1155], []),
    'getAllFinshNFT' : IDL.Func([], [IDL.Vec(CanvasIdentity)], ['query']),
    'getAllMultipCanvas' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(TokenIndex, IDL.Principal))],
        ['query'],
      ),
    'getAllNFT' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Tuple(CanvasIdentity, Rights))],
        ['query'],
      ),
    'getBCanBuy' : IDL.Func([], [IDL.Bool], ['query']),
    'getBasicPrice' : IDL.Func([], [IDL.Nat], ['query']),
    'getCanvasStatus' : IDL.Func([IDL.Principal], [CanisterStatus], []),
    'getCreateCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getFeeTo' : IDL.Func([], [IDL.Principal], ['query']),
    'getGrowRatio' : IDL.Func([], [IDL.Nat], ['query']),
    'getListings' : IDL.Func(
        [TokenIndex],
        [IDL.Vec(IDL.Tuple(ListKey, Listings1155))],
        ['query'],
      ),
    'getMarketFeeRatio' : IDL.Func([], [IDL.Nat], ['query']),
    'getMaxOrderSize' : IDL.Func([], [IDL.Nat], ['query']),
    'getMultipCanvasSizes' : IDL.Func([], [IDL.Nat], ['query']),
    'getNFTByIndex' : IDL.Func(
        [TokenIndex],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'getStorageCanisterId' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'getTokenInfoByIndex' : IDL.Func(
        [TokenIndex],
        [IDL.Nat, IDL.Nat],
        ['query'],
      ),
    'getWICPCanisterId' : IDL.Func([], [IDL.Principal], ['query']),
    'isApprovedForAll' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Bool],
        ['query'],
      ),
    'list' : IDL.Func([ListRequest1155], [ListResponse1155], []),
    'mintMulti1155Canvas' : IDL.Func(
        [MintNFTRequest],
        [CreateCanvasResponse],
        [],
      ),
    'newStorageCanister' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setApprovalForAll' : IDL.Func([IDL.Principal, IDL.Bool], [IDL.Bool], []),
    'setBasicPrice' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setBonusParam' : IDL.Func([BonusParamPercent], [IDL.Bool], []),
    'setCanBuy' : IDL.Func([IDL.Bool], [IDL.Bool], ['query']),
    'setController' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setCreateCycles' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setDeadline' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setDimension' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setFavorite' : IDL.Func([CanvasIdentity], [IDL.Bool], []),
    'setFeeTo' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setGrowRatio' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setMarketFeeRatio' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setMaxOrderSize' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setNftOwner' : IDL.Func(
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
        [IDL.Bool],
        [],
      ),
    'setOwner' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setParticipate' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setStorageCanisterId' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setWICPCanisterId' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'transferFrom' : IDL.Func(
        [IDL.Principal, IDL.Principal, TokenIndex, IDL.Nat],
        [TransferResponse],
        [],
      ),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
  });
  return MultiNFT1155;
};
export const init = ({ IDL }) => {
  return [IDL.Principal, IDL.Principal, IDL.Principal];
};
