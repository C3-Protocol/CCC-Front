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
  const TokenIndex__1 = IDL.Nat;
  const TokenIndex = IDL.Nat;
  const TransferResponse = IDL.Variant({
    'ok' : TokenIndex,
    'err' : IDL.Variant({
      'ListOnMarketPlace' : IDL.Null,
      'NotAllowTransferToSelf' : IDL.Null,
      'NotOwnerOrNotApprove' : IDL.Null,
      'Other' : IDL.Null,
    }),
  });
  const BuyRequest = IDL.Record({
    'tokenIndex' : TokenIndex,
    'price' : IDL.Nat,
    'marketFeeRatio' : IDL.Nat,
    'feeTo' : IDL.Principal,
  });
  const BuyResponse = IDL.Variant({
    'ok' : TokenIndex,
    'err' : IDL.Variant({
      'NotAllowBuySelf' : IDL.Null,
      'InsufficientBalance' : IDL.Null,
      'AlreadyTransferToOther' : IDL.Null,
      'NotFoundIndex' : IDL.Null,
      'Unauthorized' : IDL.Null,
      'Other' : IDL.Null,
      'LessThanFee' : IDL.Null,
      'AllowedInsufficientBalance' : IDL.Null,
    }),
  });
  const ListResponse = IDL.Variant({
    'ok' : TokenIndex,
    'err' : IDL.Variant({
      'NotApprove' : IDL.Null,
      'NotNFT' : IDL.Null,
      'NotFoundIndex' : IDL.Null,
      'SamePrice' : IDL.Null,
      'NotOwner' : IDL.Null,
      'Other' : IDL.Null,
      'AlreadyList' : IDL.Null,
      'NotOpenList' : IDL.Null,
    }),
  });
  const NFTMetaData = IDL.Record({
    'photoLink' : IDL.Opt(IDL.Text),
    'attrIds' : IDL.Vec(IDL.Nat),
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'videoLink' : IDL.Opt(IDL.Text),
    'parentToken' : IDL.Opt(TokenIndex),
    'index' : TokenIndex,
    'royaltyRatio' : IDL.Nat,
    'royaltyFeeTo' : IDL.Principal,
  });
  const Time = IDL.Int;
  const SaleRecord = IDL.Record({
    'to' : IDL.Opt(IDL.Principal),
    'photoLink' : IDL.Opt(IDL.Text),
    'tokenIndex' : TokenIndex,
    'from' : IDL.Opt(IDL.Principal),
    'videoLink' : IDL.Opt(IDL.Text),
    'timestamp' : Time,
    'price' : IDL.Opt(IDL.Nat),
  });
  const Listings = IDL.Record({
    'tokenIndex' : TokenIndex,
    'time' : Time,
    'seller' : IDL.Principal,
    'price' : IDL.Nat,
  });
  const ContentInfo__1 = IDL.Record({
    'twitter' : IDL.Opt(IDL.Text),
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'webLink' : IDL.Opt(IDL.Text),
    'category' : IDL.Text,
    'discord' : IDL.Opt(IDL.Text),
    'medium' : IDL.Opt(IDL.Text),
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
  const OpRecord = IDL.Record({
    'op' : Operation,
    'to' : IDL.Opt(IDL.Principal),
    'from' : IDL.Opt(IDL.Principal),
    'timestamp' : Time,
    'price' : IDL.Opt(IDL.Nat),
  });
  const AttrStru = IDL.Record({ 'attrIds' : IDL.Vec(IDL.Nat) });
  const CollectionSettings = IDL.Record({
    'uploadProtocolBaseFee' : IDL.Nat,
    'forkRoyaltyRatio' : IDL.Opt(IDL.Nat),
    'maxDescSize' : IDL.Nat,
    'totalSupply' : IDL.Nat,
    'maxRoyaltyRatio' : IDL.Nat,
    'maxAttrNum' : IDL.Nat,
    'uploadProtocolFeeRatio' : IDL.Nat,
    'maxNameSize' : IDL.Nat,
    'maxCategorySize' : IDL.Nat,
    'marketFeeRatio' : IDL.Nat,
    'newItemForkFee' : IDL.Opt(IDL.Nat),
  });
  const SoldListings = IDL.Record({
    'lastPrice' : IDL.Nat,
    'time' : Time,
    'account' : IDL.Nat,
  });
  const ComponentAttribute = IDL.Record({
    'name' : IDL.Text,
    'traitType' : IDL.Text,
  });
  const TokenDetails = IDL.Record({
    'id' : IDL.Nat,
    'attrArr' : IDL.Vec(ComponentAttribute),
  });
  const GetTokenResponse = IDL.Variant({
    'ok' : TokenDetails,
    'err' : IDL.Variant({ 'NotFoundIndex' : IDL.Null }),
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    'url' : IDL.Text,
    'method' : IDL.Text,
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
  });
  const StreamingCallbackToken = IDL.Record({
    'key' : IDL.Text,
    'sha256' : IDL.Opt(IDL.Vec(IDL.Nat8)),
    'index' : IDL.Nat,
    'content_encoding' : IDL.Text,
  });
  const StreamingCallbackResponse = IDL.Record({
    'token' : IDL.Opt(StreamingCallbackToken),
    'body' : IDL.Vec(IDL.Nat8),
  });
  const StreamingStrategy = IDL.Variant({
    'Callback' : IDL.Record({
      'token' : StreamingCallbackToken,
      'callback' : IDL.Func(
          [StreamingCallbackToken],
          [StreamingCallbackResponse],
          ['query'],
        ),
    }),
  });
  const HttpResponse = IDL.Record({
    'body' : IDL.Vec(IDL.Nat8),
    'headers' : IDL.Vec(HeaderField),
    'streaming_strategy' : IDL.Opt(StreamingStrategy),
    'status_code' : IDL.Nat16,
  });
  const ListRequest = IDL.Record({
    'tokenIndex' : TokenIndex,
    'price' : IDL.Nat,
  });
  const NewIPFSItem = IDL.Record({
    'photoLink' : IDL.Opt(IDL.Text),
    'attrArr' : IDL.Vec(ComponentAttribute),
    'desc' : IDL.Text,
    'name' : IDL.Text,
    'videoLink' : IDL.Opt(IDL.Text),
    'earnings' : IDL.Nat,
    'parentToken' : IDL.Opt(TokenIndex),
    'royaltyFeeTo' : IDL.Principal,
  });
  const MintError = IDL.Variant({
    'NoIPFSLink' : IDL.Null,
    'InsufficientBalance' : IDL.Null,
    'IPFSLinkAlreadyExist' : IDL.Null,
    'Unauthorized' : IDL.Null,
    'NotOwner' : IDL.Null,
    'Other' : IDL.Null,
    'ParamError' : IDL.Null,
    'SupplyUsedUp' : IDL.Null,
    'TooManyAttr' : IDL.Null,
    'LessThanFee' : IDL.Null,
    'AllowedInsufficientBalance' : IDL.Null,
  });
  const MintResponse = IDL.Variant({ 'ok' : TokenIndex, 'err' : MintError });
  const NFT = IDL.Service({
    'approve' : IDL.Func([IDL.Principal, TokenIndex__1], [IDL.Bool], []),
    'balanceOf' : IDL.Func([IDL.Principal], [IDL.Nat], ['query']),
    'batchTransferFrom' : IDL.Func(
        [IDL.Principal, IDL.Vec(IDL.Principal), IDL.Vec(TokenIndex__1)],
        [TransferResponse],
        [],
      ),
    'buyNow' : IDL.Func([BuyRequest], [BuyResponse], []),
    'cancelFavorite' : IDL.Func([TokenIndex__1], [IDL.Bool], []),
    'cancelList' : IDL.Func([TokenIndex__1], [ListResponse], []),
    'getAll' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))],
        ['query'],
      ),
    'getAllNFT' : IDL.Func([IDL.Principal], [IDL.Vec(NFTMetaData)], ['query']),
    'getAllSaleRecord' : IDL.Func([], [IDL.Vec(SaleRecord)], ['query']),
    'getAllToken' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(NFTMetaData, IDL.Opt(Listings)))],
        ['query'],
      ),
    'getApproved' : IDL.Func(
        [TokenIndex__1],
        [IDL.Opt(IDL.Principal)],
        ['query'],
      ),
    'getCirculation' : IDL.Func([], [IDL.Nat], ['query']),
    'getCollectionInfo' : IDL.Func([], [ContentInfo__1], ['query']),
    'getCurrentSupply' : IDL.Func([], [IDL.Nat], ['query']),
    'getCycles' : IDL.Func([], [IDL.Nat], ['query']),
    'getFeeTo' : IDL.Func([], [IDL.Principal], ['query']),
    'getHistory' : IDL.Func([TokenIndex__1], [IDL.Vec(OpRecord)], ['query']),
    'getListings' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(NFTMetaData, Listings))],
        ['query'],
      ),
    'getListingsByAttr' : IDL.Func(
        [IDL.Vec(AttrStru)],
        [IDL.Vec(IDL.Tuple(NFTMetaData, Listings))],
        ['query'],
      ),
    'getNFTMetaDataByIndex' : IDL.Func(
        [TokenIndex__1],
        [IDL.Opt(NFTMetaData)],
        ['query'],
      ),
    'getOwnerSize' : IDL.Func([], [IDL.Nat], ['query']),
    'getSaleRecordByAccount' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(SaleRecord)],
        ['query'],
      ),
    'getSettings' : IDL.Func([], [CollectionSettings], ['query']),
    'getSoldListings' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(NFTMetaData, SoldListings))],
        ['query'],
      ),
    'getTokenById' : IDL.Func([IDL.Nat], [GetTokenResponse], ['query']),
    'http_request' : IDL.Func([HttpRequest], [HttpResponse], ['query']),
    'isApprovedForAll' : IDL.Func(
        [IDL.Principal, IDL.Principal],
        [IDL.Bool],
        ['query'],
      ),
    'isList' : IDL.Func([TokenIndex__1], [IDL.Opt(Listings)], ['query']),
    'isPublic' : IDL.Func([], [IDL.Bool], ['query']),
    'list' : IDL.Func([ListRequest], [ListResponse], []),
    'ownerOf' : IDL.Func([TokenIndex__1], [IDL.Opt(IDL.Principal)], ['query']),
    'setApprovalForAll' : IDL.Func([IDL.Principal, IDL.Bool], [IDL.Bool], []),
    'setFavorite' : IDL.Func([TokenIndex__1], [IDL.Bool], []),
    'setItemBaseFee' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setMAXRoyaltyRatio' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setMaxMarketFeeRatio' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'setbPublic' : IDL.Func([IDL.Bool], [IDL.Bool], []),
    'transferFrom' : IDL.Func(
        [IDL.Principal, IDL.Principal, TokenIndex__1],
        [TransferResponse],
        [],
      ),
    'updateList' : IDL.Func([ListRequest], [ListResponse], []),
    'uploadIPFSItem' : IDL.Func([NewIPFSItem], [MintResponse], []),
    'wallet_receive' : IDL.Func([], [IDL.Nat], []),
  });
  return NFT;
};
export const init = ({ IDL }) => {
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
  return [
    CollectionParamInfo,
    IDL.Principal,
    IDL.Principal,
    IDL.Principal,
    IDL.Principal,
    IDL.Bool,
  ];
};
