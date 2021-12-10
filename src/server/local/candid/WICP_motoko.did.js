export const idlFactory = ({ IDL }) => {
  const AccountIdentifier = IDL.Text;
  const TransactionIndex = IDL.Nat;
  const TransferResponse = IDL.Variant({
    'ok' : TransactionIndex,
    'err' : IDL.Variant({
      'InsufficientBalance' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'Other' : IDL.Null,
      'LessThanFee' : IDL.Null,
      'AllowedInsufficientBalance' : IDL.Null,
    }),
  });
  const BurnResponse = IDL.Variant({
    'ok' : TransactionIndex,
    'err' : IDL.Variant({
      'LessThanMinBurnAmount' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
      'Other' : IDL.Null,
    }),
  });
  const BlockHeight__1 = IDL.Nat64;
  const MintInfo = IDL.Record({
    'accountId' : IDL.Text,
    'amount' : IDL.Nat,
    'principalId' : IDL.Principal,
  });
  const Operation = IDL.Variant({
    'burn' : IDL.Null,
    'mint' : IDL.Null,
    'approve' : IDL.Null,
    'batchTransfer' : IDL.Null,
    'transfer' : IDL.Null,
  });
  const Time = IDL.Int;
  const OpRecord = IDL.Record({
    'op' : Operation,
    'to' : IDL.Opt(IDL.Principal),
    'fee' : IDL.Nat,
    'from' : IDL.Opt(IDL.Principal),
    'timestamp' : Time,
    'caller' : IDL.Principal,
    'index' : IDL.Nat,
    'amount' : IDL.Nat,
  });
  const WithDrawRecord = IDL.Record({
    'op' : Operation,
    'fee' : IDL.Nat,
    'accountId' : IDL.Text,
    'timestamp' : Time,
    'caller' : IDL.Principal,
    'index' : IDL.Nat,
    'amount' : IDL.Nat,
  });
  const SubAccount = IDL.Vec(IDL.Nat8);
  const BlockHeight = IDL.Nat64;
  const ICPTransactionRecord = IDL.Record({
    'from_subaccount' : IDL.Opt(SubAccount),
    'blockHeight' : BlockHeight,
  });
  const MintResponse = IDL.Variant({
    'ok' : TransactionIndex,
    'err' : IDL.Variant({
      'BlockError' : IDL.Text,
      'NotTransferType' : IDL.Null,
      'NotRecharge' : IDL.Null,
      'AlreadyMint' : IDL.Null,
    }),
  });
  const Token = IDL.Service({
    'addAccountToReceiveArray' : IDL.Func([AccountIdentifier], [IDL.Bool], []),
    'allowance' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Nat],
        ['query'],
      ),
    'approve' : IDL.Func([IDL.Principal, IDL.Nat], [IDL.Nat], []),
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'batchTransfer' : IDL.Func(
        [IDL.Vec(IDL.Principal), IDL.Vec(IDL.Nat)],
        [TransferResponse],
        [],
      ),
    'batchTransferFrom' : IDL.Func(
        [IDL.Principal, IDL.Vec(IDL.Principal), IDL.Vec(IDL.Nat)],
        [TransferResponse],
        [],
      ),
    'burn' : IDL.Func([IDL.Nat], [BurnResponse], []),
    'clearAccRecord' : IDL.Func([], [IDL.Bool], []),
    'clearWithDrawRecord' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'decimals' : IDL.Func([], [IDL.Nat], ['query']),
    'getAllBalance' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
        ['query'],
      ),
    'getAllMintInfo' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(BlockHeight__1, MintInfo))],
        ['query'],
      ),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getFee' : IDL.Func([], [IDL.Nat], ['query']),
    'getFeeTo' : IDL.Func([], [IDL.Principal], ['query']),
    'getHistoryByAccount' : IDL.Func([], [IDL.Vec(OpRecord)], ['query']),
    'getHistoryByAccount2' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(OpRecord)],
        ['query'],
      ),
    'getMinBurnAmount' : IDL.Func([], [IDL.Nat], ['query']),
    'getMintInfo' : IDL.Func([BlockHeight__1], [IDL.Opt(MintInfo)], ['query']),
    'getReceiveICPAcc' : IDL.Func([], [IDL.Vec(AccountIdentifier)], ['query']),
    'getStorageCanisterId' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'getUserNumber' : IDL.Func([], [IDL.Nat], ['query']),
    'getWithDrawRecord' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(WithDrawRecord)],
        ['query'],
      ),
    'getWithDrawRecordByIndex' : IDL.Func(
        [IDL.Nat],
        [IDL.Opt(WithDrawRecord)],
        ['query'],
      ),
    'getWithDrawRecordSize' : IDL.Func([IDL.Nat], [IDL.Nat], ['query']),
    'mint' : IDL.Func([ICPTransactionRecord], [MintResponse], []),
    'mintForOwner' : IDL.Func([IDL.Principal, IDL.Nat], [MintResponse], []),
    'name' : IDL.Func([], [IDL.Text], ['query']),
    'newStorageCanister' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'owner' : IDL.Func([], [IDL.Principal], ['query']),
    'setDataUser' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setFee' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setFeeTo' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setLedHistoryCanisterId' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setMinBurnAmount' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setOwner' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setStorageCanisterId' : IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Bool], []),
    'symbol' : IDL.Func([], [IDL.Text], ['query']),
    'totalSupply' : IDL.Func([], [IDL.Nat], ['query']),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [TransferResponse], []),
    'transferFrom' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [TransferResponse],
        [],
      ),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
  });
  return Token;
};
export const init = ({ IDL }) => { return [IDL.Principal, IDL.Principal]; };
