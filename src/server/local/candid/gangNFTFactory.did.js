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
      NotInAirDropListOrAlreadyCliam: IDL.Null
    })
  })
  const NFTMetaData = IDL.Record({
    id: IDL.Nat,
    dna: IDL.Text,
    top: IDL.Nat,
    accessory: IDL.Nat,
    mouth: IDL.Nat,
    background: IDL.Nat,
    body: IDL.Nat,
    eyes: IDL.Nat,
    hair: IDL.Nat
  })
  const ComponentAttribute = IDL.Record({
    name: IDL.Text,
    rarity: IDL.Float64
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
    dna: IDL.Text,
    top: ComponentAttribute,
    accessory: ComponentAttribute,
    mouth: ComponentAttribute,
    background: ComponentAttribute,
    body: ComponentAttribute,
    eyes: ComponentAttribute,
    hair: ComponentAttribute,
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
    clearAirDrop: IDL.Func([], [IDL.Bool], []),
    cliamAirdrop: IDL.Func([], [AirDropResponse], []),
    deleteAirDrop: IDL.Func([IDL.Principal], [IDL.Bool], []),
    fixNftBalance: IDL.Func([IDL.Principal], [IDL.Bool], []),
    getAirDropLeft: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))], ['query']),
    getAirDropRemain: IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    getAll: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))], ['query']),
    getAllNFT: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))], ['query']),
    getAllNftCanister: IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    getAllTokens: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex__1, NFTMetaData))], []),
    getApproved: IDL.Func([TokenIndex__1], [IDL.Opt(IDL.Principal)], ['query']),
    getAvaiableNFT: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))], ['query']),
    getAvailableMint: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Bool))], ['query']),
    getCirculation: IDL.Func([], [IDL.Nat], ['query']),
    getComponentById: IDL.Func([TokenIndex__1], [IDL.Opt(Component)], ['query']),
    getComponentsSize: IDL.Func([], [IDL.Nat], ['query']),
    getCycles: IDL.Func([], [IDL.Nat], ['query']),
    getListings: IDL.Func([], [IDL.Vec(IDL.Tuple(NFTStoreInfo, GetListingsRes))], ['query']),
    getMaxMarketFeeRatio: IDL.Func([], [IDL.Nat], ['query']),
    getNftStoreCIDByIndex: IDL.Func([TokenIndex__1], [IDL.Principal], ['query']),
    getOwnerSize: IDL.Func([], [IDL.Nat], ['query']),
    getRegistry: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(NFTStoreInfo)))], ['query']),
    getRoyaltyFeeRatio: IDL.Func([], [IDL.Nat], ['query']),
    getRoyaltyFeeTo: IDL.Func([], [IDL.Principal], ['query']),
    getSoldListings: IDL.Func([], [IDL.Vec(IDL.Tuple(NFTStoreInfo, GetSoldListingsRes))], ['query']),
    getStakeFeeTo: IDL.Func([], [IDL.Principal], ['query']),
    getStorageCanisterId: IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    getTokenById: IDL.Func([IDL.Nat], [GetTokenResponse], ['query']),
    getWICPCanisterId: IDL.Func([], [IDL.Principal], ['query']),
    isApprovedForAll: IDL.Func([IDL.Principal, IDL.Principal], [IDL.Bool], ['query']),
    isList: IDL.Func([TokenIndex__1], [IDL.Opt(Listings)], ['query']),
    list: IDL.Func([ListRequest], [ListResponse], []),
    newStorageCanister: IDL.Func([IDL.Principal], [IDL.Bool], []),
    ownerOf: IDL.Func([TokenIndex__1], [IDL.Opt(IDL.Principal)], ['query']),
    preMint: IDL.Func([IDL.Vec(PreMint)], [IDL.Nat], []),
    proAvailableMint: IDL.Func([], [IDL.Bool], []),
    setApprovalForAll: IDL.Func([IDL.Principal, IDL.Bool], [IDL.Bool], []),
    setController: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setFavorite: IDL.Func([TokenIndex__1], [IDL.Bool], []),
    setMaxMarketFeeRatio: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setNftCanister: IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    setOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setRoyaltyFeeTo: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setRoyaltyRatio: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setStakeFeeTo: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setStorageCanisterId: IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Bool], []),
    setWICPCanisterId: IDL.Func([IDL.Principal], [IDL.Bool], []),
    transferFrom: IDL.Func([IDL.Principal, IDL.Principal, TokenIndex__1], [TransferResponse], []),
    updateList: IDL.Func([ListRequest], [ListResponse], []),
    uploadAirDropList: IDL.Func([IDL.Vec(AirDropStruct)], [IDL.Bool], []),
    uploadComponents: IDL.Func([IDL.Vec(Component)], [IDL.Bool], []),
    uploadNftMetaData: IDL.Func([IDL.Vec(NFTMetaData)], [IDL.Bool], []),
    wallet_receive: IDL.Func([], [IDL.Nat], [])
  })
  return NFT
}
export const init = ({ IDL }) => {
  return [IDL.Principal, IDL.Principal, IDL.Principal]
}
