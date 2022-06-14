export const idlFactory = ({ IDL }) => {
  const ContentInfo = IDL.Record({
    'twitter' : IDL.Opt(IDL.Text),
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'webLink' : IDL.Opt(IDL.Text),
    'category' : IDL.Text,
    'discord' : IDL.Opt(IDL.Text),
    'medium' : IDL.Opt(IDL.Text),
  });
  const CollectionParamInfo = IDL.Record({
    'featured' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'contentInfo' : ContentInfo,
    'logo' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'banner' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'forkRoyaltyRatio' : IDL.Opt(IDL.Nat),
    'totalSupply' : IDL.Nat,
    'forkFee' : IDL.Opt(IDL.Nat),
  });
  const CreateError = IDL.Variant({
    'SupplyTooLarge' : IDL.Null,
    'InsufficientBalance' : IDL.Null,
    'EarningsTooHigh' : IDL.Null,
    'NotOnWhiteList' : IDL.Null,
    'RoyaltyRatioTooHigh' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'NotOwner' : IDL.Null,
    'NameAlreadyExit' : IDL.Null,
    'Other' : IDL.Null,
    'ParamError' : IDL.Null,
    'LessThanFee' : IDL.Null,
    'AllowedInsufficientBalance' : IDL.Null,
    'NotSetDataUser' : IDL.Null,
  });
  const CreateResponse = IDL.Variant({ 'ok' : IDL.Text, 'err' : CreateError });
  const CollectionInfo = IDL.Record({
    'cid' : IDL.Principal,
    'owner' : IDL.Principal,
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'forkRoyaltyRatio' : IDL.Opt(IDL.Nat),
    'totalSupply' : IDL.Nat,
    'category' : IDL.Text,
    'forkFee' : IDL.Opt(IDL.Nat),
  });
  const FactorySettings = IDL.Record({
    'maxForkFee' : IDL.Nat,
    'createFee' : IDL.Nat,
    'maxDescSize' : IDL.Nat,
    'maxNameSize' : IDL.Nat,
    'maxCategorySize' : IDL.Nat,
    'maxSupply' : IDL.Nat,
    'maxForkRoyaltyRatio' : IDL.Nat,
  });
  const NFTFactory = IDL.Service({
    'checkIfWhiteList' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'checkProjectName' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'clearWhiteList' : IDL.Func([], [IDL.Bool], []),
    'createNewCollection' : IDL.Func(
        [CollectionParamInfo],
        [CreateResponse],
        [],
      ),
    'getAllCollInfo' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, CollectionInfo))],
        ['query'],
      ),
    'getCollInfoByCategory' : IDL.Func(
        [IDL.Text],
        [IDL.Vec(CollectionInfo)],
        ['query'],
      ),
    'getCollInfoByUser' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(CollectionInfo)],
        ['query'],
      ),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getCyclesCreate' : IDL.Func([], [IDL.Nat], ['query']),
    'getDataUser' : IDL.Func([], [IDL.Principal], ['query']),
    'getOwner' : IDL.Func([], [IDL.Principal], ['query']),
    'getPublicCollInfo' : IDL.Func([], [IDL.Vec(CollectionInfo)], ['query']),
    'getSettings' : IDL.Func([], [FactorySettings], ['query']),
    'getWhiteList' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
        ['query'],
      ),
    'isPublic' : IDL.Func([], [IDL.Bool], ['query']),
    'setCreateFee' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setCreateFeeTo' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setCyclesCreate' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setDataUser' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setOwner' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setbPublic' : IDL.Func([IDL.Bool], [IDL.Bool], []),
    'uploadWhiteList' : IDL.Func([IDL.Vec(IDL.Principal)], [IDL.Bool], []),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
  });
  return NFTFactory;
};
export const init = ({ IDL }) => { return [IDL.Principal, IDL.Principal]; };
