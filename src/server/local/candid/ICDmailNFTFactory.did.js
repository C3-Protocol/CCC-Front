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
      MarketNotOpen: IDL.Null,
      AlreadyList: IDL.Null
    })
  })
  const CanvasIdentity = IDL.Record({
    photoLink: IDL.Opt(IDL.Text),
    videoLink: IDL.Opt(IDL.Text),
    index: TokenIndex
  })
  const AirDropResponse = IDL.Variant({
    ok: CanvasIdentity,
    err: IDL.Variant({
      AlreadyCliam: IDL.Null,
      NotInAirDropListOrAlreadyCliam: IDL.Null,
      NotEnoughToMint: IDL.Null
    })
  })
  const Time = IDL.Int
  const NFTStoreInfo = IDL.Record({
    photoLink: IDL.Opt(IDL.Text),
    videoLink: IDL.Opt(IDL.Text),
    index: TokenIndex
  })
  const Listings = IDL.Record({
    tokenIndex: TokenIndex,
    time: Time,
    seller: IDL.Principal,
    price: IDL.Nat
  })
  const SoldListings = IDL.Record({
    lastPrice: IDL.Nat,
    time: Time,
    account: IDL.Nat
  })
  const ListRequest = IDL.Record({
    tokenIndex: TokenIndex,
    price: IDL.Nat
  })
  const PreMint = IDL.Record({ user: IDL.Principal, index: IDL.Nat })
  const NFTLinkInfo = IDL.Record({ id: TokenIndex, link: IDL.Text })
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
    getAirDropLeft: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))], ['query']),
    getAirDropRemain: IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    getAirDropStartTime: IDL.Func([], [Time], ['query']),
    getAll: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))], ['query']),
    getAllHistoryStorageCanisterId: IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    getAllNFT: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))], ['query']),
    getAllNftCanister: IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    getAllNftPhotoLink: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Text))], ['query']),
    getAllNftVideoLink: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Text))], ['query']),
    getAllUserNFT: IDL.Func([IDL.Principal], [IDL.Vec(NFTStoreInfo)], ['query']),
    getApproved: IDL.Func([TokenIndex__1], [IDL.Opt(IDL.Principal)], ['query']),
    getAvailableMint: IDL.Func([], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Bool))], ['query']),
    getCirculation: IDL.Func([], [IDL.Nat], ['query']),
    getCycles: IDL.Func([], [IDL.Nat], ['query']),
    getListings: IDL.Func([], [IDL.Vec(IDL.Tuple(NFTStoreInfo, Listings))], ['query']),
    getMarketFeeRatio: IDL.Func([], [IDL.Nat], ['query']),
    getMintAccount: IDL.Func([], [IDL.Nat], ['query']),
    getNftPhotoLink: IDL.Func([TokenIndex__1], [IDL.Opt(IDL.Text)], ['query']),
    getNftStoreCIDByIndex: IDL.Func([TokenIndex__1], [IDL.Principal], ['query']),
    getNftVideoLink: IDL.Func([TokenIndex__1], [IDL.Opt(IDL.Text)], ['query']),
    getOwnerSize: IDL.Func([], [IDL.Nat], ['query']),
    getRegistry: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(NFTStoreInfo)))], ['query']),
    getRoyaltyFeeRatio: IDL.Func([], [IDL.Nat], ['query']),
    getRoyaltyFeeTo: IDL.Func([], [IDL.Principal], ['query']),
    getSoldListings: IDL.Func([], [IDL.Vec(IDL.Tuple(NFTStoreInfo, SoldListings))], ['query']),
    getStorageCanisterId: IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    getSuppy: IDL.Func([], [IDL.Nat], ['query']),
    getWICPCanisterId: IDL.Func([], [IDL.Principal], ['query']),
    getbOpenMarket: IDL.Func([], [IDL.Bool], ['query']),
    isApprovedForAll: IDL.Func([IDL.Principal, IDL.Principal], [IDL.Bool], ['query']),
    isList: IDL.Func([TokenIndex__1], [IDL.Opt(Listings)], ['query']),
    list: IDL.Func([ListRequest], [ListResponse], []),
    newStorageCanister: IDL.Func([IDL.Principal], [IDL.Bool], []),
    ownerOf: IDL.Func([TokenIndex__1], [IDL.Opt(IDL.Principal)], ['query']),
    preMint: IDL.Func([IDL.Vec(PreMint)], [IDL.Nat], []),
    proAvailableMint: IDL.Func([], [IDL.Bool], []),
    setAirDropStartTime: IDL.Func([Time], [IDL.Bool], []),
    setApprovalForAll: IDL.Func([IDL.Principal, IDL.Bool], [IDL.Bool], []),
    setFavorite: IDL.Func([TokenIndex__1], [IDL.Bool], []),
    setMarketFeeRatio: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setMintAccount: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setNftCanister: IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    setNftPhotoLink: IDL.Func([IDL.Vec(NFTLinkInfo)], [IDL.Bool], []),
    setNftVideoLink: IDL.Func([IDL.Vec(NFTLinkInfo)], [IDL.Bool], []),
    setOwner: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setRoyaltyFeeTo: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setRoyaltyfeeRatio: IDL.Func([IDL.Nat], [IDL.Bool], []),
    setStorageCanisterId: IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Bool], []),
    setWICPCanisterId: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setbOpenMarket: IDL.Func([IDL.Bool], [IDL.Bool], []),
    transferFrom: IDL.Func([IDL.Principal, IDL.Principal, TokenIndex__1], [TransferResponse], []),
    updateList: IDL.Func([ListRequest], [ListResponse], []),
    uploadAirDropList: IDL.Func([IDL.Vec(AirDropStruct)], [IDL.Bool], []),
    wallet_receive: IDL.Func([], [IDL.Nat], [])
  })
  return NFT
}
export const init = ({ IDL }) => {
  return [IDL.Principal, IDL.Principal]
}
