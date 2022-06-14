export const idlFactory = ({ IDL }) => {
  const TokenIndex__1 = IDL.Nat
  const TokenIndex = IDL.Nat
  const TransferResponse = IDL.Variant({
    ok: TokenIndex,
    err: IDL.Variant({
      ListOnMarketPlace: IDL.Null,
      NotAllowTransferToSelf: IDL.Null,
      NotOwnerOrNotApprove: IDL.Null,
      Other: IDL.Null
    })
  })
  const BuyRequest = IDL.Record({
    tokenIndex: TokenIndex,
    price: IDL.Nat,
    marketFeeRatio: IDL.Nat,
    feeTo: IDL.Principal
  })
  const BuyResponse = IDL.Variant({
    ok: TokenIndex,
    err: IDL.Variant({
      NotAllowBuySelf: IDL.Null,
      InsufficientBalance: IDL.Null,
      AlreadyTransferToOther: IDL.Null,
      NotFoundIndex: IDL.Null,
      Unauthorized: IDL.Null,
      Other: IDL.Null,
      LessThanFee: IDL.Null,
      AllowedInsufficientBalance: IDL.Null
    })
  })
  const ListResponse = IDL.Variant({
    ok: TokenIndex,
    err: IDL.Variant({
      NotApprove: IDL.Null,
      NotNFT: IDL.Null,
      NotFoundIndex: IDL.Null,
      SamePrice: IDL.Null,
      NotOwner: IDL.Null,
      Other: IDL.Null,
      AlreadyList: IDL.Null
    })
  })
  const CanvasIdentity = IDL.Record({
    index: TokenIndex,
    canisterId: IDL.Principal
  })
  const AirDropResponse = IDL.Variant({
    ok: CanvasIdentity,
    err: IDL.Variant({
      AlreadyCliam: IDL.Null,
      NotInAirDropListOrAlreadyCliam: IDL.Null,
      NotEnoughToMint: IDL.Null
    })
  })
  const NFTMetaData = IDL.Record({
    id: IDL.Nat,
    attrIds: IDL.Vec(IDL.Nat)
  })
  const ComponentAttribute = IDL.Record({
    name: IDL.Text,
    rarity: IDL.Float64,
    traitType: IDL.Text
  })
  const Component = IDL.Record({
    id: IDL.Nat,
    attribute: ComponentAttribute
  })
  const NFTStoreInfo = IDL.Record({
    index: TokenIndex,
    canisterId: IDL.Principal
  })
  const Time = IDL.Int
  const Listings__1 = IDL.Record({
    tokenIndex: TokenIndex,
    time: Time,
    seller: IDL.Principal,
    price: IDL.Nat
  })
  const GetListingsRes = IDL.Record({
    listings: Listings__1,
    rarityScore: IDL.Float64
  })
  const SoldListings = IDL.Record({
    lastPrice: IDL.Nat,
    time: Time,
    account: IDL.Nat
  })
  const GetSoldListingsRes = IDL.Record({
    listings: SoldListings,
    rarityScore: IDL.Float64
  })
  const TokenDetails = IDL.Record({
    id: IDL.Nat,
    attrArr: IDL.Vec(ComponentAttribute),
    rarityScore: IDL.Float64
  })
  const GetTokenResponse = IDL.Variant({
    ok: TokenDetails,
    err: IDL.Variant({ NotFoundIndex: IDL.Null })
  })
  const Listings = IDL.Record({
    tokenIndex: TokenIndex,
    time: Time,
    seller: IDL.Principal,
    price: IDL.Nat
  })
  const ListRequest = IDL.Record({
    tokenIndex: TokenIndex,
    price: IDL.Nat
  })
  const MintResponse = IDL.Variant({
    ok: IDL.Vec(CanvasIdentity),
    err: IDL.Variant({
      NotOpen: IDL.Null,
      NotWhiteListOrMaximum: IDL.Null,
      SoldOut: IDL.Null,
      InsufficientBalance: IDL.Null,
      Unauthorized: IDL.Null,
      Other: IDL.Null,
      NotEnoughToMint: IDL.Null,
      LessThanFee: IDL.Null,
      AllowedInsufficientBalance: IDL.Null
    })
  })
  const PreMint = IDL.Record({ user: IDL.Principal, index: IDL.Nat })
  const AirDropStruct = IDL.Record({
    user: IDL.Principal,
    remainTimes: IDL.Nat
  })
  const NFT = IDL.Service({
    approve: IDL.Func([IDL.Principal, TokenIndex__1], [IDL.Bool], []),
    balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    batchTransferFrom: IDL.Func(
      [IDL.Principal, IDL.Vec(IDL.Principal), IDL.Vec(TokenIndex__1)],
      [TransferResponse],
      []
    ),
    buyNow: IDL.Func([BuyRequest], [BuyResponse], []),
    cancelFavorite: IDL.Func([TokenIndex__1], [IDL.Bool], []),
    cancelList: IDL.Func([TokenIndex__1], [ListResponse], []),
    checkIfWhiteList: IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    clearAirDrop: IDL.Func([], [IDL.Bool], []),
    clearWhiteList: IDL.Func([], [IDL.Bool], []),
    cliamAirdrop: IDL.Func([], [AirDropResponse], []),
    deleteAirDrop: IDL.Func([IDL.Principal], [IDL.Bool], []),
    getAirDropLeft: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))], ['query']),
    getAirDropRemain: IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    getAll: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))], ['query']),
    getAllHistoryStorageCanisterId: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    getAllNFT: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))], ['query']),
    getAllNftCanister: IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    getAllTokens: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex__1, NFTMetaData))], []),
    getApproved: IDL.Func([TokenIndex__1], [IDL.Opt(IDL.Principal)], ['query']),
    getAvailableMint: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Bool))], ['query']),
    getCirculation: IDL.Func([], [IDL.Nat], ['query']),
    getComponentById: IDL.Func([TokenIndex__1], [IDL.Opt(Component)], ['query']),
    getComponentsSize: IDL.Func([], [IDL.Nat], ['query']),
    getCycles: IDL.Func([], [IDL.Nat], ['query']),
    getListings: IDL.Func([], [IDL.Vec(IDL.Tuple(NFTStoreInfo, GetListingsRes))], ['query']),
    getSoldListings: IDL.Func([], [IDL.Vec(IDL.Tuple(NFTStoreInfo, GetSoldListingsRes))], ['query']),

    getMaxMarketFeeRatio: IDL.Func([], [IDL.Nat], ['query']),
    getMintAccount: IDL.Func([], [IDL.Nat], ['query']),
    getMintPrice: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))], ['query']),
    getNftStoreCIDByIndex: IDL.Func([TokenIndex__1], [IDL.Principal], ['query']),
    getOpenTime: IDL.Func([], [Time, Time], ['query']),
    getOwnerSize: IDL.Func([], [IDL.Nat], ['query']),
    getPreSellOpenTime: IDL.Func([], [Time], ['query']),
    getPubSellOpenTime: IDL.Func([], [Time], ['query']),
    getRegistry: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(NFTStoreInfo)))], ['query']),
    getRoyaltyFeeRatio: IDL.Func([], [IDL.Nat], ['query']),
    getRoyaltyFeeTo: IDL.Func([], [IDL.Principal], ['query']),
    getSaleInfo: IDL.Func([], [IDL.Nat, IDL.Nat], ['query']),
    getStorageCanisterId: IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    getSuppy: IDL.Func([], [IDL.Nat], ['query']),
    getTokenById: IDL.Func([IDL.Nat], [GetTokenResponse], ['query']),
    getWICPCanisterId: IDL.Func([], [IDL.Principal], ['query']),
    getWhiteList: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Bool))], ['query']),
    getWhiteListPrice: IDL.Func([], [IDL.Nat], ['query']),
    isApprovedForAll: IDL.Func([IDL.Principal, IDL.Principal], [IDL.Bool], ['query']),
    isList: IDL.Func([TokenIndex__1], [IDL.Opt(Listings)], ['query']),
    list: IDL.Func([ListRequest], [ListResponse], []),
    mint: IDL.Func([IDL.Nat], [MintResponse], []),
    newStorageCanister: IDL.Func([IDL.Principal], [IDL.Bool], []),
    ownerOf: IDL.Func([TokenIndex__1], [IDL.Opt(IDL.Principal)], ['query']),
    preMint: IDL.Func([IDL.Vec(PreMint)], [IDL.Nat], []),
    proAvailableMint: IDL.Func([], [IDL.Bool], []),
    setApprovalForAll: IDL.Func([IDL.Principal, IDL.Bool], [IDL.Bool], []),
    setFavorite: IDL.Func([TokenIndex__1], [IDL.Bool], []),
    setMaxMarketFeeRatio: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setMintAccount: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setMintFeeRatio: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setMintPrice: IDL.Func([IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Nat))], [IDL.Bool], []),
    setNftCanister: IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    setOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setPreSellOpenTime: IDL.Func([Time], [IDL.Bool], []),
    setPubSellOpenTime: IDL.Func([Time], [IDL.Bool], []),
    setRoyaltyFeeTo: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setRoyaltyRatio: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setRoyaltyfeeRatio: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setStorageCanisterId: IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Bool], []),
    setWICPCanisterId: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setWhiteListPrice: IDL.Func([IDL.Nat], [IDL.Bool], []),
    transferFrom: IDL.Func([IDL.Principal, IDL.Principal, TokenIndex__1], [TransferResponse], []),
    updateList: IDL.Func([ListRequest], [ListResponse], []),
    uploadAirDropList: IDL.Func([IDL.Vec(AirDropStruct)], [IDL.Bool], []),
    uploadComponents: IDL.Func([IDL.Vec(Component)], [IDL.Bool], []),
    uploadNftMetaData: IDL.Func([IDL.Vec(NFTMetaData)], [IDL.Bool], []),
    uploadWhiteList: IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    wallet_receive: IDL.Func([], [IDL.Nat], []),
    whiteListMint: IDL.Func([], [MintResponse], [])
  })
  return NFT
}
export const init = ({ IDL }) => {
  return [IDL.Principal, IDL.Principal, IDL.Principal, IDL.Principal, IDL.Principal]
}
