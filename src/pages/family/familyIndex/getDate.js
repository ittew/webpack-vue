import fetch from 'utils/fetch'
import { host_boss } from 'utils/host'

// 获取亲情列表接口
export const getFamilyList = (userInfo, reqBody) => fetch({
  // url: 'https://www.easy-mock.com/mock/5c7399c90cf5d2150d52cc31/DH/friends/getFriendsList',
  // url: '/api/list.json',
  // method: 'GET',
  url: host_boss + 'DH/friends/getFriendsList?' + userInfo.token,
  data: {
    ...userInfo,
    reqBody
  }
})
// https://app.10086.cn/leadeon-cmcc-static/v2.0/pages/recharge/recharge.html?mobileNo=15029183538   跳转充值携带参数
// https://flow.clientaccess.10086.cn/leadeon-flow/pages/flow/payFlow.html?mobileNo=15029183538  跳转流量携带参数
// 获取亲密付好友的话费流量信息
export const getFriendChargeFlow = (userInfo, reqBody) => fetch({
  // url: 'https://www.easy-mock.com/mock/5c7399c90cf5d2150d52cc31/DH/friends/getFriendsInfo',
  // url: '/api/info.json',
  // method: 'GET',
  url: host_boss + 'DH/friends/getFriendsInfo?' + userInfo.token,
  data: {
    ...userInfo,
    reqBody
  },
  noLoading: true
})

// 获取我的社交群组接口
export const getMySocialGroups = (userInfo, reqBody) => fetch({
  // url: 'https://www.easy-mock.com/mock/5c7399c90cf5d2150d52cc31/DH/mySocial/getGroupInfo',
  // url: '/api/group.json',
  // method: 'GET',
  url: host_boss + 'DH/mySocial/getGroupInfo?' + userInfo.token,
  data: {
    ...userInfo,
    reqBody
  }
})

// 获取大众版的群组接口
export const getPublicGroups = (userInfo, reqBody) => fetch({
  url: host_boss + 'DH/mySocial/getBossGroupInfo?' + userInfo.token,
  data: {
    ...userInfo,
    reqBody
  }
})

// 获取内容管理接口
export const getContentMan = (userInfo, reqBody) => fetch({
  // url: 'https://www.easy-mock.com/mock/5c7399c90cf5d2150d52cc31/DH/familyArea/getFamilyAreaInfo',
  url: host_boss + 'DH/familyArea/getFamilyAreaInfo?' + userInfo.token,
  // url: '/api/main.json',
  // method: 'GET',
  data: {
    ...userInfo,
    reqBody
  }
})

// 修改昵称接口
export const modifyNickname = (userInfo, reqBody) => fetch({
  // url: 'https://www.easy-mock.com/mock/5c7399c90cf5d2150d52cc31/DH/friends/modifyFriendNick',
  url: host_boss + 'DH/friends/modifyFriendNick?' + userInfo.token,
  // url: '/api/nickName.json',
  // method: 'GET',
  data: {
    ...userInfo,
    reqBody
  }
})

// 添加好友接口
export const addFriends = (userInfo, reqBody) => fetch({
  // url: 'https://www.easy-mock.com/mock/5c7399c90cf5d2150d52cc31/DH/friends/addFriends',
  url: host_boss + 'DH/friends/addFriends?' + userInfo.token,
  // url: '/api/addFriend.json',
  // method: 'GET',
  data: {
    ...userInfo,
    reqBody
  }
})

// 删除好友接口
export const deleteFriends = (userInfo, reqBody) => fetch({
  url: host_boss + 'DH/friends/removeBinding?' + userInfo.token,
  data: {
    ...userInfo,
    reqBody
  }
})

// 获取客户端头像
export const getPhoto = (userInfo, reqBody) => fetch({
  url: host_boss + 'DN/headPhoto/photoConfig?' + userInfo.token,
  data: {
    ...userInfo,
    reqBody
  }
})
