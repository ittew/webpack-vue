import { host_boss } from 'utils/host'
import fetch from 'utils/fetch'

// 格式化号码xxx xxxx xxxx格式
export const formatTel = (tel) => {
  let arr = tel.split('')
  let str = ''
  arr.forEach(function (value, ind) {
    if (ind === 3 || ind === 7) {
      str += ' '
    }
    str += value
  })
  return str
}

// 取消号码xxx xxxx xxxx格式（去除了空格）
export const remFormatTel = (formatNum) => {
  if (/[ ]/.test(formatNum)) {
    return formatNum.replace(/[ ]/g, '')
  } else {
    return formatNum
  }
}

// 调用手机通讯录
export const getContacts = () => {
  return new Promise((resolve, reject) => {
    leadeon.getContacts({
      success: data => {
        resolve(data)
      },
      error: data => {
        reject(data)
      }
    })
  })
}

// Html5号码归属地查询
export const getLocal = (userInfo, reqBody, storageName) => fetch({
  url: host_boss + 'DA/local/getLocal?',
  data: {
    ...userInfo,
    reqBody
  },
  storageName
})

// 获取群组信息
export const getGroupInfo = (userinfo, reqBody, storageName) => fetch({
  url: host_boss + 'DH/mySocial/getGroupInfo?' + userinfo.token,
  // method: 'GET',
  // url: '/api/groupInfo.json',
  data: {
    ...userinfo,
    reqBody
  },
  storageName
})

// 获取群成员信息
export const getMemberInfo = (userinfo, reqBody, storageName) => fetch({
  // method: 'GET',
  // url: '/api/groupMemberInfo.json',
  url: host_boss + 'DH/mySocial/getMemberInfo?' + userinfo.token,
  data: {
    ...userinfo,
    reqBody
  },
  storageName
})

// 新建群组
export const newGroup = (userinfo, reqBody, storageName) => fetch({
  url: host_boss + 'DH/mySocial/newGroup?' + userinfo.token,
  data: {
    ...userinfo,
    reqBody
  },
  storageName
})

// 修改群组名称
export const modifyGroupName = (userinfo, reqBody, storageName) => fetch({
  url: host_boss + 'DH/mySocial/modifyName?' + userinfo.token,
  data: {
    ...userinfo,
    reqBody
  },
  storageName
})

// 退订亲情网
export const unSubscribeBusi = (userinfo, reqBody, storageName) => fetch({
  url: host_boss + 'DH/mySocial/unsubscribeBusi?' + userinfo.token,
  data: {
    ...userinfo,
    reqBody
  },
  storageName
})

// 删除群成员
export const delMember = (userinfo, reqBody, storageName) => fetch({
  url: host_boss + 'DH/mySocial/delMember?' + userinfo.token,
  data: {
    ...userinfo,
    reqBody
  },
  storageName
})

// 解散群组
export const delGroup = (userinfo, reqBody, storageName) => fetch({
  url: host_boss + 'DH/mySocial/delGroup?' + userinfo.token,
  data: {
    ...userinfo,
    reqBody
  },
  storageName
})


// 添加群成员
export const addMember = (userinfo, reqBody, storageName) => fetch({
  url: host_boss + 'DH/mySocial/newMember?' + userinfo.token,
  data: {
    ...userinfo,
    reqBody
  },
  storageName
})

// 绑定副卡
export const bindMeber = (userinfo, reqBody, storageName) => fetch({
  url: host_boss + 'DH/mySocial/bindMeber?' + userinfo.token,
  data: {
    ...userinfo,
    reqBody
  },
  storageName
})
