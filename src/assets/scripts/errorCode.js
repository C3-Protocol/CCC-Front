const ErrorMessage = {
  NotLogin: 'Please sign in first',
  Unauthorized: 'Unauthorized', //未授权
  LessThanFee: 'Less than fee', //余额不足付手续费
  InsufficientBalance: 'Insufficient balance', //余额不足改变像素
  AllowedInsufficientBalance: 'Allowed insufficient balance, please retry after 30s', //授权的余额不足创建画布
  ExceedMaxNum: 'Exceed max num', //超过众创画布的最大数量
  NFTDrawOver: 'NFT draw over', //画布已经截止，不允许填充
  NotCreator: 'Not creator', //不是创建者
  AlreadyOver: 'Already over', //已经结束了
  NotAttachMinNum: 'Not attach min num', //没有达到最小像素量
  NotThreshold: 'Not threshold', //画布未截止，不能抽
  SetOwnerFail: 'Set owner fail', //抽幸运儿失败
  NotOwner: 'Not owner', //不是tokenindex NFT的拥有者
  NotFoundIndex: 'Not found index', //市场未找到该NFT
  AlreadyList: 'Already list', //已经挂单了
  NotNFT: 'Not NFT', //不是NFT:'',画布未截止
  SamePrice: 'Same price', //价格相同，修改挂单时，价格必须不一样
  NotOwnerOrNotApprove: 'Not owner or not approve',
  BlockError: 'Block error', //获取区块错误
  NotTransferType: 'Not transfer type', //不是转账类型
  NotRecharge: 'Not recharge', //不是充值给我们
  AlreadyMint: 'Already mint', //已经Mint过了
  LessThanMinBurnAmount: 'Less than min burn amount', //低于最小提币量
  InsufficientCycles: 'Insufficient Cycles', // cycle不足
  NotAllowBuySelf: 'Not allow buy self',
  PositionError: 'Position error', //传入的坐标错误
  NotAttachGapTime: 'Submitted too fast, please wait 30s and re-submit', //未达到间隔时间
  NotCanister: 'Not canister',
  BonusNotActive: 'Bonus not active', //奖金池未开放
  NotAllowTransferToSelf: 'Not allow transfer to self',
  ListOnMarketPlace: 'List on market place',
  NotBeInvited: 'Not be invited',
  Other: 'Other error' //其他错误
}
export default ErrorMessage
