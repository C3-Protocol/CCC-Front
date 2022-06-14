export const idlFactory = ({ IDL }) => {
  const CommonResponse = IDL.Variant({
    'ok' : IDL.Null,
    'err' : IDL.Variant({ 'InsufficientPermissions' : IDL.Null }),
  });
  const TextInfo = IDL.Record({
    'bio' : IDL.Text,
    'link' : IDL.Text,
    'name' : IDL.Text,
  });
  const AccInfo__1 = IDL.Record({
    'textInfo' : TextInfo,
    'remainTimes' : IDL.Nat,
    'avatorCID' : IDL.Principal,
  });
  const AccInfo = IDL.Record({
    'textInfo' : TextInfo,
    'remainTimes' : IDL.Nat,
    'avatorCID' : IDL.Principal,
  });
  const GetProfileResponse = IDL.Variant({
    'ok' : AccInfo,
    'err' : IDL.Variant({ 'EmptyProfile' : IDL.Null }),
  });
  const UserRewardsPoints = IDL.Record({
    'account' : IDL.Principal,
    'amount' : IDL.Nat,
  });
  const ProfileInfo = IDL.Record({
    'textInfo' : TextInfo,
    'avatar' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const UploadProfileResponse = IDL.Variant({
    'ok' : IDL.Null,
    'err' : IDL.Variant({
      'ModifyTimesUsedUp' : IDL.Null,
      'NameNotAvailable' : IDL.Null,
      'ExceededContentLimit' : IDL.Null,
      'Other' : IDL.Null,
      'SystemBusy' : IDL.Null,
      'ExceededImageLimit' : IDL.Null,
    }),
  });
  const Profile = IDL.Service({
    'addCanvas' : IDL.Func([IDL.Vec(IDL.Principal)], [CommonResponse], []),
    'deleteProfile' : IDL.Func([IDL.Principal], [], []),
    'getAllProfile' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Vec(IDL.Tuple(IDL.Principal, AccInfo__1))],
        ['query'],
      ),
    'getAvatarCanisters' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getCanvasFactory' : IDL.Func([], [IDL.Principal], ['query']),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getProfile' : IDL.Func([IDL.Principal], [GetProfileResponse], []),
    'getUserName' : IDL.Func(
        [IDL.Vec(IDL.Principal)],
        [IDL.Vec(IDL.Opt(IDL.Text))],
        ['query'],
      ),
    'getUserRewardsPoints' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'increaseUserRewardsPoints' : IDL.Func(
        [IDL.Vec(UserRewardsPoints)],
        [CommonResponse],
        [],
      ),
    'listTopPonits' : IDL.Func(
        [IDL.Nat],
        [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))],
        ['query'],
      ),
    'nameIsAvailable' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'setCanvasFactory' : IDL.Func([IDL.Principal], [], []),
    'setController' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'uploadProfile' : IDL.Func([ProfileInfo], [UploadProfileResponse], []),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
  });
  return Profile;
};
export const init = ({ IDL }) => { return [IDL.Principal, IDL.Principal]; };
