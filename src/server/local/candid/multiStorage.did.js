export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec()
  const TokenIndex = IDL.Nat
  const Time = IDL.Int
  const Operation__1 = IDL.Variant({
    Bid: IDL.Null,
    List: IDL.Null,
    Mint: IDL.Null,
    Sale: IDL.Null,
    CancelList: IDL.Null,
    Transfer: IDL.Null,
    UpdateList: IDL.Null
  })
  const TokenIndex__1 = IDL.Nat
  const CanvasIdentity = IDL.Record({
    index: TokenIndex__1,
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
  List.fill(IDL.Opt(IDL.Tuple(OpRecord, List)))
  const MultiStorage = IDL.Service({
    addBuyRecord: IDL.Func(
      [TokenIndex, IDL.Opt(IDL.Principal), IDL.Opt(IDL.Principal), IDL.Opt(IDL.Nat), Time],
      [],
      []
    ),
    addRecord: IDL.Func(
      [TokenIndex, Operation__1, IDL.Opt(IDL.Principal), IDL.Opt(IDL.Principal), IDL.Opt(IDL.Nat), Time],
      [],
      []
    ),
    cancelFavorite: IDL.Func([IDL.Principal, CanvasIdentity], [], []),
    getCycles: IDL.Func([], [IDL.Nat], ['query']),
    getFavorite: IDL.Func([IDL.Principal], [IDL.Vec(CanvasIdentity)], ['query']),
    getHistory: IDL.Func([TokenIndex], [IDL.Vec(OpRecord)], ['query']),
    getMultiNftCanisterId: IDL.Func([], [IDL.Principal], ['query']),
    getNftFavoriteNum: IDL.Func([TokenIndex], [IDL.Nat], ['query']),
    getParticipate: IDL.Func([IDL.Principal], [IDL.Vec(CanvasIdentity)], ['query']),
    isFavorite: IDL.Func([IDL.Principal, CanvasIdentity], [IDL.Bool], ['query']),
    setFavorite: IDL.Func([IDL.Principal, CanvasIdentity], [], []),
    setMultiNftCanisterId: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setParticipate: IDL.Func([IDL.Principal, CanvasIdentity], [], []),
    syncParticate: IDL.Func([IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Vec(CanvasIdentity)))], [IDL.Bool], []),
    syncTradeHistory: IDL.Func([IDL.Vec(IDL.Tuple(TokenIndex, List))], [IDL.Bool], []),
    wallet_receive: IDL.Func([], [IDL.Nat], [])
  })
  return MultiStorage
}
export const init = ({ IDL }) => {
  return [IDL.Principal]
}
