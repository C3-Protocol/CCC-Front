export const idlFactory = ({ IDL }) => {
  const AccountIdentifier = IDL.Text;
  const TransactionIndex = IDL.Nat;
  const TxReceipt = IDL.Variant({
    'ok' : TransactionIndex,
    'err' : IDL.Variant({
      'InsufficientAllowance' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'Other' : IDL.Null,
    }),
  });
  const BlockHeight__1 = IDL.Nat64;
  const MintInfo = IDL.Record({
    'accountId' : IDL.Text,
    'amount' : IDL.Nat,
    'principalId' : IDL.Principal,
  });
  const Metadata = IDL.Record({
    'fee' : IDL.Nat,
    'decimals' : IDL.Nat8,
    'owner' : IDL.Principal,
    'logo' : IDL.Text,
    'name' : IDL.Text,
    'totalSupply' : IDL.Nat,
    'symbol' : IDL.Text,
  });
  const Operation = IDL.Variant({
    'burn' : IDL.Null,
    'mint' : IDL.Null,
    'approve' : IDL.Null,
    'batchTransfer' : IDL.Null,
    'transfer' : IDL.Null,
  });
  const Time = IDL.Int;
  const TxRecord = IDL.Record({
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
    'approve' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'batchTransfer' : IDL.Func(
        [IDL.Vec(IDL.Principal), IDL.Vec(IDL.Nat)],
        [TxReceipt],
        [],
      ),
    'batchTransferFrom' : IDL.Func(
        [IDL.Principal, IDL.Vec(IDL.Principal), IDL.Vec(IDL.Nat)],
        [TxReceipt],
        [],
      ),
    'burn' : IDL.Func([IDL.Nat], [TxReceipt], []),
    'clearMintInfo' : IDL.Func([], [IDL.Bool], []),
    'clearWithDrawRecord' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'clearZeroAccount' : IDL.Func([], [IDL.Bool], []),
    'decimals' : IDL.Func([], [IDL.Nat8], ['query']),
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
    'getFeeTo' : IDL.Func([], [IDL.Principal], ['query']),
    'getMetadata' : IDL.Func([], [Metadata], ['query']),
    'getMinBlockHeight' : IDL.Func([], [BlockHeight__1], ['query']),
    'getMinBurnAmount' : IDL.Func([], [IDL.Nat], ['query']),
    'getMintBlockInfo' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(BlockHeight__1, IDL.Bool))],
        ['query'],
      ),
    'getMintInfo' : IDL.Func([BlockHeight__1], [IDL.Opt(MintInfo)], ['query']),
    'getReceiveICPAcc' : IDL.Func([], [IDL.Vec(AccountIdentifier)], ['query']),
    'getStorageCanisterId' : IDL.Func([], [IDL.Opt(IDL.Principal)], ['query']),
    'getTokenFee' : IDL.Func([], [IDL.Nat], ['query']),
    'getTransaction' : IDL.Func([IDL.Nat], [TxRecord], ['query']),
    'getTransactions' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(TxRecord)],
        ['query'],
      ),
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
    'historySize' : IDL.Func([], [IDL.Nat], ['query']),
    'logo' : IDL.Func([], [IDL.Text], ['query']),
    'mint' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    'name' : IDL.Func([], [IDL.Text], ['query']),
    'newStorageCanister' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'owner' : IDL.Func([], [IDL.Principal], ['query']),
    'setDataUser' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setFee' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setFeeTo' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setLedHistoryCanisterId' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setLogo' : IDL.Func([IDL.Text], [], ['oneway']),
    'setMinBurnAmount' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setName' : IDL.Func([IDL.Text], [], ['oneway']),
    'setOwner' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setStorageCanisterId' : IDL.Func([IDL.Opt(IDL.Principal)], [IDL.Bool], []),
    'swap' : IDL.Func([ICPTransactionRecord], [MintResponse], []),
    'symbol' : IDL.Func([], [IDL.Text], ['query']),
    'totalSupply' : IDL.Func([], [IDL.Nat], ['query']),
    'transfer' : IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    'transferFrom' : IDL.Func(
        [IDL.Principal, IDL.Principal, IDL.Nat],
        [TxReceipt],
        [],
      ),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
  });
  return Token;
};
export const init = ({ IDL }) => { return [IDL.Principal, IDL.Principal]; };
