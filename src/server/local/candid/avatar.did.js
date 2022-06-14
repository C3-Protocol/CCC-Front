export const idlFactory = ({ IDL }) => {
  const GetAvatarResponse = IDL.Variant({
    'ok' : IDL.Vec(IDL.Nat8),
    'err' : IDL.Variant({ 'EmptyAvatar' : IDL.Null, 'Other' : IDL.Null }),
  });
  const UploadAvatarResponse = IDL.Variant({
    'ok' : IDL.Null,
    'err' : IDL.Variant({
      'Other' : IDL.Null,
      'ExceededImageLimit' : IDL.Null,
    }),
  });
  const Avatar = IDL.Service({
    'getAvatar' : IDL.Func([IDL.Principal], [GetAvatarResponse], ['query']),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'uploadAvatar' : IDL.Func(
        [IDL.Principal, IDL.Vec(IDL.Nat8)],
        [UploadAvatarResponse],
        [],
      ),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
  });
  return Avatar;
};
export const init = ({ IDL }) => { return [IDL.Principal, IDL.Principal]; };
