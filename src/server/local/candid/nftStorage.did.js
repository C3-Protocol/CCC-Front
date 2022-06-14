export const idlFactory = ({ IDL }) => {
  const TokenIndex__1 = IDL.Nat
  const Time = IDL.Int
  const TokenIndex = IDL.Nat
  const CanvasIdentity = IDL.Record({
    index: TokenIndex,
    canisterId: IDL.Principal
  })
  const Operation = IDL.Variant({
    Bid: IDL.Null,
    List: IDL.Null,
    Mint: IDL.Null,
    Sale: IDL.Null,
    CancelList: IDL.Null,
    Transfer: IDL.Null,
    UpdateList: IDL.Null
  })
  const OpRecord = IDL.Record({
    op: Operation,
    to: IDL.Opt(IDL.Principal),
    from: IDL.Opt(IDL.Principal),
    timestamp: Time,
    price: IDL.Opt(IDL.Nat)
  })
  const SaleRecord = IDL.Record({
    to: IDL.Opt(IDL.Principal),
    cid: IDL.Principal,
    tokenIndex: TokenIndex,
    from: IDL.Opt(IDL.Principal),
    timestamp: Time,
    price: IDL.Opt(IDL.Nat)
  })
  const nftStorage = IDL.Service({
    getFavorite: IDL.Func([IDL.Principal], [IDL.Vec(CanvasIdentity)], ['query']),
    getHistory: IDL.Func([TokenIndex__1], [IDL.Vec(OpRecord)], ['query']),
    getNftFavoriteNum: IDL.Func([TokenIndex__1], [IDL.Nat], ['query']),
    getParticipate: IDL.Func([IDL.Principal], [IDL.Vec(CanvasIdentity)], ['query']),
    isFavorite: IDL.Func([IDL.Principal, CanvasIdentity], [IDL.Bool], ['query']),
    getAllSaleRecord: IDL.Func([], [IDL.Vec(SaleRecord)], ['query']),
    getSaleRecordByAccount: IDL.Func([IDL.Principal], [IDL.Vec(SaleRecord)], ['query'])
  })
  return nftStorage
}
export const init = ({ IDL }) => {
  return [IDL.Principal]
}
