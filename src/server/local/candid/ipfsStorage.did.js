export const idlFactory = ({ IDL }) => {
  const TokenIndex__1 = IDL.Nat;
  const Time = IDL.Int;
  const Operation__1 = IDL.Variant({
    'Bid' : IDL.Null,
    'List' : IDL.Null,
    'Mint' : IDL.Null,
    'Sale' : IDL.Null,
    'CancelList' : IDL.Null,
    'Transfer' : IDL.Null,
    'UpdateList' : IDL.Null,
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
  const OpRecord__1 = IDL.Record({
    'op' : Operation,
    'to' : IDL.Opt(IDL.Principal),
    'from' : IDL.Opt(IDL.Principal),
    'timestamp' : Time,
    'price' : IDL.Opt(IDL.Nat),
  });
  const AncestorMintRecord = IDL.Record({
    'index' : IDL.Nat,
    'record' : OpRecord__1,
  });
  const TokenIndex = IDL.Nat;
  const NFTStoreInfo = IDL.Record({
    'photoLink' : IDL.Opt(IDL.Text),
    'videoLink' : IDL.Opt(IDL.Text),
    'index' : TokenIndex,
  });
  const SaleRecord = IDL.Record({
    'to' : IDL.Opt(IDL.Principal),
    'photoLink' : IDL.Opt(IDL.Text),
    'tokenIndex' : TokenIndex,
    'from' : IDL.Opt(IDL.Principal),
    'videoLink' : IDL.Opt(IDL.Text),
    'timestamp' : Time,
    'price' : IDL.Opt(IDL.Nat),
  });
  const OpRecord = IDL.Record({
    'op' : Operation,
    'to' : IDL.Opt(IDL.Principal),
    'from' : IDL.Opt(IDL.Principal),
    'timestamp' : Time,
    'price' : IDL.Opt(IDL.Nat),
  });
  const NFTLinkInfo = IDL.Record({ 'id' : TokenIndex, 'link' : IDL.Text });
  const Storage = IDL.Service({
    'addBuyRecord' : IDL.Func(
        [
          TokenIndex__1,
          IDL.Opt(IDL.Principal),
          IDL.Opt(IDL.Principal),
          IDL.Opt(IDL.Nat),
          Time,
        ],
        [],
        [],
      ),
    'addRecord' : IDL.Func(
        [
          TokenIndex__1,
          Operation__1,
          IDL.Opt(IDL.Principal),
          IDL.Opt(IDL.Principal),
          IDL.Opt(IDL.Nat),
          Time,
        ],
        [],
        [],
      ),
    'addRecord2' : IDL.Func([IDL.Vec(IDL.Nat), IDL.Principal], [], []),
    'addRecords' : IDL.Func([IDL.Vec(AncestorMintRecord)], [], []),
    'cancelFavorite' : IDL.Func([IDL.Principal, NFTStoreInfo], [], []),
    'getAllSaleRecord' : IDL.Func([], [IDL.Vec(SaleRecord)], ['query']),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getFavorite' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(NFTStoreInfo)],
        ['query'],
      ),
    'getHistory' : IDL.Func([TokenIndex__1], [IDL.Vec(OpRecord)], ['query']),
    'getNftFavoriteNum' : IDL.Func([TokenIndex__1], [IDL.Nat], ['query']),
    'getNftPhotoLink' : IDL.Func(
        [TokenIndex__1],
        [IDL.Opt(IDL.Text)],
        ['query'],
      ),
    'getNftVideoLink' : IDL.Func(
        [TokenIndex__1],
        [IDL.Opt(IDL.Text)],
        ['query'],
      ),
    'getOwner' : IDL.Func([], [IDL.Principal], []),
    'getSaleRecordByAccount' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(SaleRecord)],
        ['query'],
      ),
    'getZombieCanisterId' : IDL.Func([], [IDL.Principal], ['query']),
    'isFavorite' : IDL.Func(
        [IDL.Principal, NFTStoreInfo],
        [IDL.Bool],
        ['query'],
      ),
    'setFavorite' : IDL.Func([IDL.Principal, NFTStoreInfo], [], []),
    'setNftCanisterId' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setNftPhotoLink' : IDL.Func([IDL.Vec(NFTLinkInfo)], [IDL.Bool], []),
    'setNftVideoLink' : IDL.Func([IDL.Vec(NFTLinkInfo)], [IDL.Bool], []),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
  });
  return Storage;
};
export const init = ({ IDL }) => { return [IDL.Principal]; };
