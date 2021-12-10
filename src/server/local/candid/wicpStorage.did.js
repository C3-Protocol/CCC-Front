export const idlFactory = ({ IDL }) => {
  const Operation = IDL.Variant({
    burn: IDL.Null,
    mint: IDL.Null,
    approve: IDL.Null,
    batchTransfer: IDL.Null,
    transfer: IDL.Null
  })
  const Time = IDL.Int
  const OpRecord = IDL.Record({
    op: Operation,
    to: IDL.Opt(IDL.Principal),
    fee: IDL.Nat,
    from: IDL.Opt(IDL.Principal),
    timestamp: Time,
    caller: IDL.Principal,
    index: IDL.Nat,
    amount: IDL.Nat
  })
  const Storage = IDL.Service({
    addRecord: IDL.Func([OpRecord], [IDL.Bool], []),
    addRecords: IDL.Func([IDL.Vec(OpRecord)], [IDL.Bool], []),
    getCycles: IDL.Func([], [IDL.Nat], ['query']),
    getHistory: IDL.Func([IDL.Nat, IDL.Nat], [IDL.Vec(OpRecord)], ['query']),
    getHistoryByAccount: IDL.Func([IDL.Principal], [IDL.Vec(OpRecord)], ['query']),
    getTokenCanisterId: IDL.Func([], [IDL.Principal], ['query']),
    setDataUser: IDL.Func([IDL.Principal], [IDL.Bool], []),
    setTokenCanisterId: IDL.Func([IDL.Principal], [IDL.Bool], []),
    wallet_receive: IDL.Func([], [IDL.Nat], [])
  })
  return Storage
}
export const init = ({ IDL }) => {
  return [IDL.Principal]
}
