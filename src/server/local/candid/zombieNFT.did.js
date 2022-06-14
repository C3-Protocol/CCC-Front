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
  const Token = IDL.Record({
    id: IDL.Nat,
    arm: IDL.Nat,
    hat: IDL.Nat,
    leg: IDL.Nat,
    background: IDL.Nat,
    head: IDL.Nat
  })
  const ZombieStoreCID = IDL.Record({
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
    CE: IDL.Nat,
    listings: Listings__1,
    rarityScore: IDL.Float64
  })
  const SoldListings = IDL.Record({
    lastPrice: IDL.Nat,
    time: Time,
    account: IDL.Nat
  })
  const GetSoldListingsRes = IDL.Record({
    CE: IDL.Nat,
    listings: SoldListings,
    rarityScore: IDL.Float64
  })
  const ComponentAttribute = IDL.Record({
    agile: IDL.Nat,
    name: IDL.Text,
    level: IDL.Variant({
      OG: IDL.Null,
      hero: IDL.Null,
      legend: IDL.Null
    }),
    defense: IDL.Nat,
    attack: IDL.Nat,
    rarityScore: IDL.Float64
  })
  const TokenDetails = IDL.Record({
    id: IDL.Nat,
    arm: ComponentAttribute,
    hat: ComponentAttribute,
    leg: ComponentAttribute,
    background: ComponentAttribute,
    head: ComponentAttribute,
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
  const MintZombieResponse = IDL.Variant({
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
  const Component = IDL.Record({
    id: IDL.Nat,
    componentType: IDL.Variant({
      arm: IDL.Null,
      hat: IDL.Null,
      leg: IDL.Null,
      background: IDL.Null,
      head: IDL.Null
    }),
    attribute: ComponentAttribute
  })
  const DisCountStruct = IDL.Record({
    disCount: IDL.Nat,
    user: IDL.Principal
  })
  const ZombieNFT = IDL.Service({
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
    clearDisCount: IDL.Func([], [IDL.Bool], []),
    cliamAirdrop: IDL.Func([], [AirDropResponse], []),
    getAirDropLeft: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))], ['query']),
    getAirDropRemain: IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    getAllNFT: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))], ['query']),
    getAllNftCanister: IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    getAllTokens: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex__1, Token))], []),
    getAllZombie: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))], ['query']),
    getApproved: IDL.Func([TokenIndex__1], [IDL.Opt(IDL.Principal)], ['query']),
    getAvaiableNFT: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))], ['query']),
    getAvailableMint: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Bool))], ['query']),
    getCirculation: IDL.Func([], [IDL.Nat], ['query']),
    getComponentsSize: IDL.Func([], [IDL.Nat], []),
    getCycles: IDL.Func([], [IDL.Nat], ['query']),
    getDisCountByUser: IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    getDisCountLeft: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))], ['query']),
    getFeeTo: IDL.Func([], [IDL.Principal], ['query']),
    getListings: IDL.Func([], [IDL.Vec(IDL.Tuple(ZombieStoreCID, GetListingsRes))], ['query']),
    getMarketFeeRatio: IDL.Func([], [IDL.Nat], ['query']),
    getMintPrice: IDL.Func([], [IDL.Nat], ['query']),
    getNftStoreCIDByIndex: IDL.Func([TokenIndex__1], [IDL.Principal], ['query']),
    getOpenTime: IDL.Func([], [Time], ['query']),
    getOwnerSize: IDL.Func([], [IDL.Nat], ['query']),
    getPreMintLimit: IDL.Func([], [IDL.Nat], ['query']),
    getSoldListings: IDL.Func([], [IDL.Vec(IDL.Tuple(ZombieStoreCID, GetSoldListingsRes))], ['query']),
    getStorageCanisterId: IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    getTokenById: IDL.Func([IDL.Nat], [GetTokenResponse], ['query']),
    getWICPCanisterId: IDL.Func([], [IDL.Principal], ['query']),
    isApprovedForAll: IDL.Func([IDL.Principal, IDL.Principal], [IDL.Bool], ['query']),
    isList: IDL.Func([TokenIndex__1], [IDL.Opt(Listings)], ['query']),
    list: IDL.Func([ListRequest], [ListResponse], []),
    mintZombie: IDL.Func([IDL.Nat], [MintZombieResponse], []),
    newStorageCanister: IDL.Func([IDL.Principal], [IDL.Bool], []),
    ownerOf: IDL.Func([TokenIndex__1], [IDL.Opt(IDL.Principal)], ['query']),
    preMintZombie: IDL.Func([IDL.Vec(PreMint)], [IDL.Bool], []),
    preMintZombie2: IDL.Func([IDL.Vec(PreMint)], [IDL.Bool], []),
    proAvailableMint: IDL.Func([], [IDL.Bool], []),
    reaminCountofPreMint: IDL.Func([], [IDL.Nat], ['query']),
    setApprovalForAll: IDL.Func([IDL.Principal, IDL.Bool], [IDL.Bool], []),
    setDataUser: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setFavorite: IDL.Func([TokenIndex__1], [IDL.Bool], []),
    setFeeTo: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setMarketFeeRatio: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setMintPrice: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setNftCanister: IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    setOpenTime: IDL.Func([Time], [IDL.Bool], []),
    setOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setPreMintLimit: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setStorageCanisterId: IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Bool], []),
    setWICPCanisterId: IDL.Func([IDL.Principal], [IDL.Bool], []),
    transferFrom: IDL.Func([IDL.Principal, IDL.Principal, TokenIndex__1], [TransferResponse], []),
    updateList: IDL.Func([ListRequest], [ListResponse], []),
    uploadAirDropList: IDL.Func([IDL.Vec(AirDropStruct)], [IDL.Bool], []),
    uploadComponents: IDL.Func([IDL.Vec(Component)], [IDL.Bool], []),
    uploadDisCountList: IDL.Func([IDL.Vec(DisCountStruct)], [IDL.Bool], []),
    uploadTokens: IDL.Func([IDL.Vec(Token)], [IDL.Bool], []),
    wallet_receive: IDL.Func([], [IDL.Nat], [])
  })
  return ZombieNFT
}
export const init = ({ IDL }) => {
  return [IDL.Principal, IDL.Principal, IDL.Principal]
}
