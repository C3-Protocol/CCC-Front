export const idlFactory = ({ IDL }) => {
  const TokenIndex__1 = IDL.Nat;
  const TokenIndex = IDL.Nat;
  const TransferResponse = IDL.Variant({
    'ok' : TokenIndex,
    'err' : IDL.Variant({
      'ListOnMarketPlace' : IDL.Null,
      'NotAllowTransferToSelf' : IDL.Null,
      'NotOwnerOrNotApprove' : IDL.Null,
      'Other' : IDL.Null,
    }),
  });
  const BuyRequest = IDL.Record({
    'tokenIndex' : TokenIndex,
    'price' : IDL.Nat,
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
  const ListResponse = IDL.Variant({
    'ok' : TokenIndex,
    'err' : IDL.Variant({
      'NotApprove' : IDL.Null,
      'NotNFT' : IDL.Null,
      'NotFoundIndex' : IDL.Null,
      'SamePrice' : IDL.Null,
      'NotOwner' : IDL.Null,
      'Other' : IDL.Null,
      'MarketNotOpen' : IDL.Null,
      'AlreadyList' : IDL.Null,
    }),
  });
  const CanvasIdentity = IDL.Record({
    'photoLink' : IDL.Opt(IDL.Text),
    'videoLink' : IDL.Opt(IDL.Text),
    'index' : TokenIndex,
  });
  const AirDropResponse = IDL.Variant({
    'ok' : CanvasIdentity,
    'err' : IDL.Variant({
      'AlreadyCliam' : IDL.Null,
      'NotInAirDropListOrAlreadyCliam' : IDL.Null,
      'NotEnoughToMint' : IDL.Null,
    }),
  });
  const Time = IDL.Int;
  const ComponentAttribute = IDL.Record({
    'name' : IDL.Text,
    'traitType' : IDL.Text,
  });
  const Component = IDL.Record({
    'id' : IDL.Nat,
    'attribute' : ComponentAttribute,
  });
  const NFTLinkInfo = IDL.Record({
    'id' : TokenIndex,
    'photoLink' : IDL.Text,
    'videoLink' : IDL.Text,
  });
  const NFTMetaData = IDL.Record({
    'id' : IDL.Nat,
    'attrIds' : IDL.Vec(IDL.Nat),
  });
  const NFTStoreInfo = IDL.Record({
    'photoLink' : IDL.Opt(IDL.Text),
    'videoLink' : IDL.Opt(IDL.Text),
    'index' : TokenIndex,
  });
  const Listings__1 = IDL.Record({
    'tokenIndex' : TokenIndex,
    'time' : Time,
    'seller' : IDL.Principal,
    'price' : IDL.Nat,
  });
  const GetListingsRes = IDL.Record({
    'listings' : Listings__1,
    'rarityScore' : IDL.Float64,
  });
  const AttrStru = IDL.Record({ 'attrIds' : IDL.Vec(IDL.Nat) });
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
  const GetSoldListingsRes = IDL.Record({
    'listings' : SoldListings,
    'rarityScore' : IDL.Float64,
  });
  const TokenDetails = IDL.Record({
    'id' : IDL.Nat,
    'attrArr' : IDL.Vec(ComponentAttribute),
  });
  const GetTokenResponse = IDL.Variant({
    'ok' : TokenDetails,
    'err' : IDL.Variant({ 'NotFoundIndex' : IDL.Null }),
  });
  const ListRequest = IDL.Record({
    'tokenIndex' : TokenIndex,
    'price' : IDL.Nat,
  });
  const MintResponse = IDL.Variant({
    'ok' : IDL.Vec(CanvasIdentity),
    'err' : IDL.Variant({
      'NotOpen' : IDL.Null,
      'NotWhiteListOrMaximum' : IDL.Null,
      'SoldOut' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'Other' : IDL.Null,
      'NotEnoughToMint' : IDL.Null,
      'LessThanFee' : IDL.Null,
      'AllowedInsufficientBalance' : IDL.Null,
    }),
  });
  const OpenBoxResponse = IDL.Variant({
    'ok' : CanvasIdentity,
    'err' : IDL.Variant({
      'NotOpen' : IDL.Null,
      'NotOwner' : IDL.Null,
      'AlreadyOpen' : IDL.Null,
    }),
  });
  const PreMint = IDL.Record({ 'user' : IDL.Principal, 'index' : IDL.Nat });
  const AirDropStruct = IDL.Record({
    'user' : IDL.Principal,
    'remainTimes' : IDL.Nat,
  });
  const NFT = IDL.Service({
    'approve' : IDL.Func([IDL.Principal, TokenIndex__1], [IDL.Bool], []),
    'bBlindBoxOpen' : IDL.Func([TokenIndex__1], [IDL.Bool], ['query']),
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'batchTransferFrom' : IDL.Func(
        [IDL.Principal, IDL.Vec(IDL.Principal), IDL.Vec(TokenIndex__1)],
        [TransferResponse],
        [],
      ),
    'buyNow' : IDL.Func([BuyRequest], [BuyResponse], []),
    'cancelFavorite' : IDL.Func([TokenIndex__1], [IDL.Bool], []),
    'cancelList' : IDL.Func([TokenIndex__1], [ListResponse], []),
    'checkIfWhiteList' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'clearAirDrop' : IDL.Func([], [IDL.Bool], []),
    'clearWhiteList' : IDL.Func([], [IDL.Bool], []),
    'cliamAirdrop' : IDL.Func([], [AirDropResponse], []),
    'deleteAirDrop' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'getAirDropLeft' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
        ['query'],
      ),
    'getAirDropRemain' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'getAirDropStartTime' : IDL.Func([], [Time], ['query']),
    'getAll' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))],
        ['query'],
      ),
    'getAllComponent' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(TokenIndex__1, Component))],
        ['query'],
      ),
    'getAllHistoryStorageCanisterId' : IDL.Func(
        [],
        [IDL.Vec(IDL.Principal)],
        ['query'],
      ),
    'getAllNFT' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))],
        ['query'],
      ),
    'getAllNftCanister' : IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    'getAllNftLinkInfo' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(TokenIndex__1, NFTLinkInfo))],
        ['query'],
      ),
    'getAllTokens' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(TokenIndex__1, NFTMetaData))],
        [],
      ),
    'getAllUserNFT' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(NFTStoreInfo)],
        ['query'],
      ),
    'getApproved' : IDL.Func(
        [TokenIndex__1],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'getAvailableMint' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Bool))],
        ['query'],
      ),
    'getBlindBoxLink' : IDL.Func([], [IDL.Text, IDL.Text], ['query']),
    'getBlindTime' : IDL.Func([], [Time, Time], ['query']),
    'getCirculation' : IDL.Func([], [IDL.Nat], ['query']),
    'getComponentById' : IDL.Func(
        [TokenIndex__1],
        [IDL.Opt(Component)],
        ['query'],
      ),
    'getComponentsSize' : IDL.Func([], [IDL.Nat], ['query']),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getLinkInfoByIndex' : IDL.Func(
        [TokenIndex__1],
        [IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)],
        ['query'],
      ),
    'getLinkInfoByIndexArr' : IDL.Func(
        [IDL.Vec(TokenIndex__1)],
        [IDL.Vec(IDL.Tuple(IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)))],
        ['query'],
      ),
    'getListings' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(NFTStoreInfo, GetListingsRes))],
        ['query'],
      ),
    'getListingsByAttr' : IDL.Func(
        [IDL.Vec(AttrStru)],
        [IDL.Vec(IDL.Tuple(NFTStoreInfo, Listings))],
        ['query'],
      ),
    'getMaxMarketFeeRatio' : IDL.Func([], [IDL.Nat], ['query']),
    'getMintAccount' : IDL.Func([], [IDL.Nat], ['query']),
    'getMintPrice' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))],
        ['query'],
      ),
    'getNftHoldInfo' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
        ['query'],
      ),
    'getNftLinkInfo' : IDL.Func(
        [TokenIndex__1],
        [IDL.Opt(NFTLinkInfo)],
        ['query'],
      ),
    'getNftStoreCIDByIndex' : IDL.Func(
        [TokenIndex__1],
        [IDL.Principal],
        ['query'],
      ),
    'getOpenTime' : IDL.Func([], [Time, Time], ['query']),
    'getOwnerSize' : IDL.Func([], [IDL.Nat], ['query']),
    'getRegistry' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(NFTStoreInfo)))],
        ['query'],
      ),
    'getRoyaltyFeeRatio' : IDL.Func([], [IDL.Nat], ['query']),
    'getRoyaltyFeeTo' : IDL.Func([], [IDL.Principal], ['query']),
    'getSaleInfo' : IDL.Func([], [IDL.Nat, IDL.Nat], ['query']),
    'getSoldListings' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(NFTStoreInfo, GetSoldListingsRes))],
        ['query'],
      ),
    'getStorageCanisterId' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'getSuppy' : IDL.Func([], [IDL.Nat], ['query']),
    'getTokenById' : IDL.Func([IDL.Nat], [GetTokenResponse], ['query']),
    'getWICPCanisterId' : IDL.Func([], [IDL.Principal], ['query']),
    'getWhiteList' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
        ['query'],
      ),
    'getWhiteListPrice' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))],
        ['query'],
      ),
    'getbOpenMarket' : IDL.Func([], [IDL.Bool], ['query']),
    'isApprovedForAll' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Bool],
        ['query'],
      ),
    'isList' : IDL.Func([TokenIndex__1], [IDL.Opt(Listings)], ['query']),
    'list' : IDL.Func([ListRequest], [ListResponse], []),
    'mint' : IDL.Func([IDL.Nat], [MintResponse], []),
    'newStorageCanister' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'openBlindBox' : IDL.Func([TokenIndex__1], [OpenBoxResponse], []),
    'ownerOf' : IDL.Func([TokenIndex__1], [IDL.Opt(IDL.Principal)], ['query']),
    'preMint' : IDL.Func([IDL.Vec(PreMint)], [IDL.Nat], []),
    'proAvailableMint' : IDL.Func([], [IDL.Bool], []),
    'setAirDropStartTime' : IDL.Func([Time], [IDL.Bool], []),
    'setApprovalForAll' : IDL.Func([IDL.Principal, IDL.Bool], [IDL.Bool], []),
    'setBlindBoxLink' : IDL.Func([NFTLinkInfo], [IDL.Bool], []),
    'setCapacity' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setFavorite' : IDL.Func([TokenIndex__1], [IDL.Bool], []),
    'setMaxMarketFeeRatio' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setMintAccount' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setMintFeeRatio' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setMintPrice' : IDL.Func(
        [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))],
        [IDL.Bool],
        [],
      ),
    'setNftCanister' : IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    'setNftLinkInfo' : IDL.Func([IDL.Vec(NFTLinkInfo)], [IDL.Bool], []),
    'setOwner' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setRoyaltyFeeTo' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setRoyaltyfeeRatio' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setStorageCanisterId' : IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Bool], []),
    'setSuppy' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setTime' : IDL.Func([IDL.Vec(Time)], [IDL.Bool], []),
    'setWICPCanisterId' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setWhiteListPrice' : IDL.Func(
        [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))],
        [IDL.Bool],
        [],
      ),
    'setbOpenMarket' : IDL.Func([IDL.Bool], [IDL.Bool], []),
    'transferFrom' : IDL.Func(
        [IDL.Principal, IDL.Principal, TokenIndex__1],
        [TransferResponse],
        [],
      ),
    'updateList' : IDL.Func([ListRequest], [ListResponse], []),
    'uploadAirDropList' : IDL.Func([IDL.Vec(AirDropStruct)], [IDL.Bool], []),
    'uploadComponents' : IDL.Func([IDL.Vec(Component)], [IDL.Bool], []),
    'uploadNftMetaData' : IDL.Func([IDL.Vec(NFTMetaData)], [IDL.Bool], []),
    'uploadWhiteList' : IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
    'whiteListMint' : IDL.Func([IDL.Nat], [MintResponse], []),
  });
  return NFT;
};
export const init = ({ IDL }) => {
  return [
    IDL.Principal,
    IDL.Principal,
    IDL.Principal,
    IDL.Principal,
    IDL.Principal,
  ];
};
