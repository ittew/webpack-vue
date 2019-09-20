import { host_boss } from './host'
import fetch from './fetch'

const box = {
  cid: '0',
  clientID: '0',
  xk: '0',
  ak: '0',
  sn: '0',
  st: '0',
  sv: '0',
  version: '0',
  sp: '0',
  osType: '0',
  channel: '0',
  province: '0',
  city: '0',
  imei: '0',
  sb: '0',
  nt: '0',
  token: '0',
  phoneNumber: '0',
  loginProvince: '0',
  loginCity: '0'
}

const test_cb = function (obj) {
  /* eslint-disable yoda */
  if (null == obj || null == obj.RESULT || '' === obj.RESULT || null == obj.CODE || '' === obj.CODE) {
    return
  }
  if (obj.RESULT !== 'ok') {
    return
  }
}

 /*
 * find value by the key from url
 * @param {String} key
 */
function getQueryString (key) {
  const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
  const arr = window.location.search.substring(1).match(reg)
  if (arr === null) return null
  return decodeURIComponent(arr[2])
}

 /*
 * receive user info
 */
async function recvUserInfo () {
  try {
    const getUserStatus = () => {
      return new Promise((resolve, reject) => {
        /* eslint-disable no-undef */
        leadeon.userStatus({
          debug: false,
          success: data => {
            resolve(data)
          },
          error: data => {
            reject(data)
          }
        })
      })
    }
    const getUserInfo = () => {
      return new Promise((resolve, reject) => {
        leadeon.getUserInfo({
          debug: false,
          success: data => {
            resolve(data)
          },
          error: data => {
            reject(data)
          }
        })
      })
    }
    const userStatus = await getUserStatus()
    if (userStatus.status === 0) {      // unlogined
      leadeon.showLogin()
    } else {      // logined
      const userInfo = await getUserInfo()
      return userInfo
    }
  } catch (e) {
    return box
  }
}

 /*
 * getUserInfo
 */
async function getUserInfo (key) {
  try {
    return new Promise((resolve, reject) => {
      leadeon.getUserInfo({
        debug: false,
        success: data => {
          resolve(data)
        },
        error: data => {
          reject(data)
        }
      })
    })
  } catch (e) {
    return box
  }
}

 /*
 * getUserStatus
 */
async function getUserStatus () {
  return new Promise((resolve, reject) => {
    /* eslint-disable no-undef */
    leadeon.userStatus({
      debug: false,
      success: data => {
        resolve(data)
      },
      error: data => {
        reject(data)
      }
    })
  })
}

/**
 * encryptString
 */
async function encryptString (str) {
  return new Promise((resolve, reject) => {
    leadeon.encryptString({
      debug: false,
      str: str,
      success: res => {
        resolve(res.encryptString)
      },
      error: res => {
        reject(res)
      }
    })
  })
}

/**
 * 获取用户的通讯录
 */
async function getContacts () {
  return new Promise((resolve, reject) => {
    leadeon.getContacts({
      debug: false,
      success: res => {
        resolve(res)
      },
      error: res =>  {
        reject(res)
      }
    })
  })
}

/**
 * decodeURI and return a json
 */
function curParam () {
  const paramStr = decodeURIComponent(window.location.search.substring(1))
  const paramArr = paramStr.split('&')
  let box = {}
  paramArr.forEach((item, index) => {
    const idx = item.indexOf('=')
    const key = item.substring(0, idx)
    const value = item.substring(idx + 1)
    box[key] = value
  })
  return box
}

 /*
 * get max item in array
 * @param {Array} arr
 * no matter whether items in array are number or string
 */
function getMax (arr) {
  const maxInArr = Math.max.apply(Math, arr)
  return maxInArr
}

 /*
 * get min item in array
 * @param {Array} arr
 * no matter whether items in array are number or string
 */
function getMin (arr) {
  const minInArr = Math.min.apply(Math, arr)
  return minInArr
}

/**
 * 拉起客户端并且打开下载页面
 * @param {String} urls 需要在客户端内部打开的网址
 */
function pullAppDownload (targetUrl) {
  const u = navigator.userAgent
  const versions = {
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),    // ios系统
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1    // android终端或系统
  }
  if (versions.android) {
    if (undefined === targetUrl || targetUrl === '') {
      location.href = 'com.greenpoint://android.mc10086.activity'
    } else if (targetUrl.indexOf('functionCode') > -1) {
      location.href = 'com.greenpoint://android.mc10086.activity?' + targetUrl
    } else {
      location.href = 'com.greenpoint://android.mc10086.activity?url=' + targetUrl
    }
  } else if (versions.ios) {
    if (undefined === targetUrl || targetUrl === '') {
      location.href = 'cn.10086.app://'
    } else {
      location.href = 'cn.10086.app://' + targetUrl
    }
  }
  setTimeout(function () {
    window.location.href = 'http://www.10086.cn/cmccclient/download'
  }, 1000);
}

/**
 * 分享接口调用2.3版本修改
 * @param CONTENT 分享内容
 * @param TITLE 分享标题
 * @param IMAGE 分享图片URL
 * @param URL 点击后跳转链接
 */
function shareMsg (CONTENT, TITLE, IMAGE, URL) {
  var msg = {
    'CODE': 24,
    'BUSINESSNAME': 'shareMsg',
    'CONTENT': CONTENT,
    'TITLE': TITLE,
    'IMAGE': IMAGE,
    'URL': URL
  };
  fashion.invokeMobile(msg, test_cb);
}

/**
 * 分享显示和隐藏
 * @param {Object} BUSINESSNAME JS回调名称
 * @param {Object} ob int 类型，1 表示隐藏，0表示显示
 */
function shareStore (BUSINESSNAME, ob) {
  var msg = {
    'CODE': 16,
    'BUSINESSNAME': BUSINESSNAME,
    'FLAG': ob
  };
  fashion.invokeMobile(msg, test_cb);
}

/**
 * webview 分享按钮是否显示
 * @param {Boolean} show 是否分享，true 显示， false 不显示
 * @param {Object} shareObj 分享的内容对象 {title: 分享标题,
 *                                         link: 分享链接,
 *                                         imgUrl: 图片链接,
 *                                         content: 内容文本,
 *                                         type: 分享类型, （music、video、link，不写默认link）
 *                                         dataUrl: 数据连接 （type 为 music、video 才有此值， 默认为空）}
 */
function wvShare (show, shareObj) {
  leadeon.enableShared({
    debug: false,
    enable: show,  //
    shareObj: shareObj       // {title, link, imgUrl,}
  });
}

/**
 * h5 页面分享能力
 * @param {Object} shareObj 分享的内容对象 {title: 分享标题,
 *                                         link: 分享链接,
 *                                         imgUrl: 图片链接,
 *                                         content: 内容文本,
 *                                         type: 分享类型, （music、video、link，不写默认link）
 *                                         dataUrl: 数据连接 （type 为 music、video 才有此值， 默认为空）}
 */
function h5Share (shareObj) {
  leadeon.shareMessage({
    debug: false,
    title: shareObj.title || '',
    link: shareObj.link || '',
    imgUrl: shareObj.imgUrl || '',
    content: shareObj.content || '',
    type: shareObj.type || '',
    dataUrl: shareObj.dataUrl || ''
  })
}

/**
 * 打开新 webview 页面, 前三个参数都传才能触发显示客户端的分享按钮
 * @param {Object} pagObj 新页面的参数 { markID: 活动id,
 *                                      type: 分享类型(4.0 新增),
 *                                      funCode: 分享业务编码(4.0 新增),
 *                                      bizCode: 功能编码,
 *                                      url: 需要打开的 url}
 */
function openNewPage (pagObj) {
  console.log(pagObj)
  leadeon.newWebview({
    debug: false,
    markID: pagObj.markId || '',
    type: pagObj.type || '',
    funCode: pagObj.funCode || '',
    bizCode: pagObj.bizCode || '',
    url: pagObj.url || '',
    success: function(res) {},
    error: function(res) {}
  })
}

/**
 * 打开客户端本地功能
 * @param {String} bizCode 功能编码
 */
function goNativePage (bizCode) {
  leadeon.goNativePage({
    debug: false,
    bizCode: bizCode,
    success: function(res) {},
    error: function(res) {}
  })
}

/**
 * 跳转 插件化 页面 （only Android）
 * @param {String} packageName 插件包名
 * @param {String} pageName 插件页面名
 */
function startPlugin (packageName, pageName) {
  leadeon.startPlugin({
    debug: false,
    pluginPackageName: packageName,
    pluginPageName: pageName,
    success: function(res) {},
    error: function(res) {}
  })
}

/**
 * 客户端能力 拉起登录
 */
function showLogin () {
  leadeon.showLogin()
}

/**
 * 广告位点击统计
 * @param {Object} data 广告位置参数
 * @param {Object} userInfo 客户端基础信息
 */
function ADlog (data, userInfo) {
  let pushArr = []
  let ostype = ''
  if (userInfo.osType === 'ios') {
    ostype = '2'
  } else if (userInfo.osType === 'android') {
    ostype = '1'
  }
  let pushJson = {
    cellNum: userInfo.phoneNumber || '',
    clientVer: userInfo.version || '',
    sysType: ostype,
    provinceCode: userInfo.province || '',
    cityCode: userInfo.city || '',
    adverType: data.adverType || '',
    adverLocation: data.adverLocation || '',
    markId: data.markId || ''
  }
  pushArr.push(pushJson)
  userInfo.cv = userInfo.version || ''

  fetch({
    url: host_boss + 'SA/advertisingClickNew/printLog',
    data: {
      ...userInfo,
      reqBody: {
        'adverList': pushArr
      }
    },
    noLoading: true
  })
}

/**
 * Webtrends 插码
 * @param {Object} userInfo 客户端基础信息
 * @param {String} id 插码id
 * @param {Object} addObj 额外插码字段
 */
function setWebtrends (userInfo, id, addObj) {
  try {
    // 代码兼容
    let cid = (typeof userInfo.CID) == 'undefined' ? userInfo.cid : userInfo.CID;
    let cv = (typeof userInfo.VERSION) == 'undefined' ? userInfo.version : userInfo.VERSION;
    let channel = (typeof userInfo.CHANNEL) == 'undefined' ? userInfo.channel : userInfo.CHANNEL;
    let province = (typeof userInfo.PROVINCE) == 'undefined' ? userInfo.province : userInfo.PROVINCE;
    let city = (typeof userInfo.CITY) == 'undefined' ? userInfo.city : userInfo.CITY;
    let userphonenum = (typeof userInfo.USERPHONENUM) == 'undefined' ? userInfo.phoneNumber : userInfo.USERPHONENUM;
    let osType = (typeof userInfo.OSTYPE) == 'undefined' ? userInfo.osType : userInfo.OSTYPE;
    if (!!userInfo.ostype) {
      osType = userInfo.ostype
    }
    if ((typeof channel) != 'undefined' && channel != '') {
      let av = 'APP_' + osType + '_' + cv;
      let argsSet = {
        'WT.cid': cid,
        'WT.prov': province,
        'WT.city': city,
        'WT.mobile': userphonenum,
        'WT.channel': channel,
        'WT.aav': cv,
        'WT.av': av,
        'WT.event': id
      };
      if (undefined != addObj && '' != addObj) {
        for (let key in addObj) {
          argsSet[key] = addObj[key];
        }
      }
      Webtrends.multiTrack({
        args: argsSet
      });
    } else {
      channel = 'web';
      // 如果渠道号是web说明是在浏览器中，和杨杰协商的
      let argsSet = {'WT.channel': channel, 'WT.event': id};
      Webtrends.multiTrack({args:argsSet});
    }
  } catch (e) {
    console.log(e)
  }
}

/**
 * 功能点击量统计 polyfill
 * @param {Object} userInfo 客户端基础信息
 * @param {String} iconCode icon编码
 */
function functionClicks (userInfo, iconCode) {
  // 判断是否低版本
  if (parseFloat(userInfo.version.substring(0, 3)) < 4.1) {
    OfunctionClicks(userInfo, iconCode);
  } else {
    NfunctionClicks(iconCode.split('-')[0])
  }
}

/**
 * 新版本功能点击量统计
 * @param {String} iconCode icon编码
 */
function NfunctionClicks (iconCode) {
  leadeon.tollSingle({
    debug: false,
    bizCode: iconCode,
    success: function(res) {},
    error: function(res) {}
  })
}

/**
 * 老新版本功能点击量统计
 * @param {Object} userInfo 客户端基础信息
 * @param {String} iconCode icon编码
 */
function OfunctionClicks (userInfo, iconCode) {
  let userphonenum = 'undefined' == (typeof userInfo.USERPHONENUM) ? userInfo.phoneNumber : userInfo.USERPHONENUM;
  let province = 'undefined' == (typeof userInfo.PROVINCE) ? userInfo.province : userInfo.PROVINCE;
  let city = 'undefined' == (typeof userInfo.CITY) ? userInfo.city : userInfo.CITY;
  let channel = 'undefined' == (typeof userInfo.CHANNEL) ? userInfo.channel : userInfo.CHANNEL;
  //未登录状态下取不到用户手机号码，手动赋99999999999
  if ('undefined' == typeof userphonenum || 'null' == typeof userphonenum || 'object' == typeof userphonenum) {
    userphonenum = '99999999999';
  }
  if ('undefined' == typeof channel) {
    channel = '#';
  }
  let funcList = [];
  let funcListJson = {
    'businessCode': '#',
    'businessSteps': iconCode,
    'channel': channel,
    'provinceCode': province,
    'cityCode': city,
    'event': '#',
    'pageInfo': '#',
    'phoneNumber': userphonenum,
    'title': '#'
  };
  funcList.push(funcListJson);

  fetch({
    url: host_boss + 'SA/funcClickNew/printLog',
    data: {
      ...userInfo,
      reqBody: {
        'funcList': funcList
      }
    },
    noLoading: true
  })
}


/**
 * 公共跳转方法 包涵（H5、H5+传参、native、插件化） 这四种类型
 * 本方法集合了 wt插码、广告位插码、功能点击量插码
 * 本能力使用时需要 【格式化】跳转参数 跳转参数的key一定要和下边例子格式一样
 * {
 *    actionType: 1,  跳转类型
 *    verifyType: 1,  认证类型
 *    loginType: 1,   是否强制登录
 *    iconCode: 'CD20007', icon编码
 *    adverLocation: '21', 广告位置
 *    markId: '434',  活动id
 *    actionUrl: 'http://www.baidu.com', 跳转地址
 *    ssoUrlAddr: 'http://www.baidu.com', sso跳转地址
 *    packageName: '',  安卓插件化包名
 *    packagePage: '',  安卓插件化页面名
 *    paramList: [      sso跳转参数数组
 *     {paramId: 'tleNo'}  sso跳转参数
 *    ]
 * }
 * @param {Object} userInfo 客户端基础信息
 * @param {Object} data 跳转参数
 * @param {String} uid 登录用户uid
 * @param {String} encryptTel 登录用户加密手机号
 * @param {Object} logDatas 插码需要的参数们 {
 *                                              adverType: '60', 广告类型 详见客户端接口说明书:( biz-orange/SA/advertisingClickNew/printLog 接口编码： 40012)
 *                                              type: '6', 分享类型 详见客户端接口说明书:(biz-orange/DN/documentSharing/getDocumentSharingByFuncId 接口编码：30023)
 *                                              funCode: 'DF020', 分享业务编码 详见客户端接口说明书:(biz-orange/DN/documentSharing/getDocumentSharingByFuncId 接口编码：30023)
 *                                              wtCode: 'fx_lb_', wt插码前缀 详见html5插码列表
 *                                              pageCode: '-CT00002' 功能点击量插码后缀 详见客户端功能编码表
 *                                          }
 */
function powerJump (userInfo, data, uid, encryptTel, logDatas) {
  console.log(data)
  // 需要wt.markid把类型type放到数组中就可以
  let type = ['14']
  let wtadd = {'WT.markId': data.markId}
  // wt插码
  if (data.iconCode || data.adverLocation) {
    if (data.iconCode != '0') {
      if (type.includes(logDatas.type)) {
        setWebtrends(userInfo, logDatas.wtCode + data.iconCode, wtadd)
      } else {
        setWebtrends(userInfo, logDatas.wtCode + data.iconCode, '')
      }
      // 功能点击量
      if (parseFloat(userInfo.version.substring(0, 3)) < 4.1) {
        OfunctionClicks(userInfo, data.iconCode + logDatas.pageCode)
      }

    } else {
      if (type.includes(logDatas.type)) {
        setWebtrends(userInfo, logDatas.wtCode + data.adverLocation, wtadd)
      } else {
        setWebtrends(userInfo, logDatas.wtCode + data.adverLocation, '')
      }
    }
  }

  // 广告位点击插码
  if (logDatas.adverType) {
    ADlog({
      adverType: logDatas.adverType,
      adverLocation: data.adverLocation || '0',
      markId: data.markId || '0'
    }, userInfo)
  }

  // 跳转
  if (data.actionType == 1) {                               // 【跳转类型】h5
    if (data.isShare == 1){

      openNewPage({
        url: data.actionUrl,
        markId: data.markId,
        bizCode: data.iconCode || '',
        type: logDatas.type,
        funCode: logDatas.funCode
      })
    } else {
      openNewPage({url: data.actionUrl, markId: data.markId, bizCode: '', type: '', funCode: ''})
    }
  } else if (data.actionType == 2) {                        // 【跳转类型】h5 + 传参
    if (data.verifyType == 1) {                               // {登录认证方式}本地native
      if (data.isShare == 1){
        openNewPage({
          url: data.actionUrl,
          markId: data.markId,
          bizCode: data.iconCode || '',
          type: logDatas.type,
          funCode: logDatas.funCode
        })
      } else {
        openNewPage({url: data.actionUrl, markId: data.markId, bizCode: '', type: '', funCode: ''})
      }
    } else {                                                    // {登录认证方式}URL传参
      if (data.loginType == 1) {                                    // (是否强制登录)强制登录
        if (userInfo.phoneNumber) {
          checkHJump(userInfo, data, uid, encryptTel, logDatas.type, logDatas.funCode)
        } else {
          showLogin()
        }
      } else {                                                     // (是否强制登录)非强制登录
        checkHJump(userInfo, data, uid, encryptTel, logDatas.type, logDatas.funCode)
      }
    }
  } else if (data.actionType == 3) {                       // 【跳转类型】 native
    goNativePage(data.iconCode)
  } else if (data.actionType == 4) {                       // 【跳转类型】 Android 插件化
    if (data.iconCode && parseFloat(userInfo.version.substring(0, 3)) >= 4.1) {
      NfunctionClicks(data.iconCode)
    }
    startPlugin(data.packageName, data.packagePage)
  }
}

// H5 + 传参 跳转参数校验
function checkHJump (userInfo, data, uid, encryptTel, type, funCode) {
  let url = data.actionUrl
  let paramListData = structureParameter(userInfo, data.paramList, uid, encryptTel)

  if (data.isSso != 1 && url.indexOf('?') === -1) {
    url += '?'
  }

  if (data.loginType == 1 && data.isSso == 1) {
    url = data.ssoUrlAddr + url
    if (url.indexOf('&') === url.length - 1 || url.indexOf('?') === url.length - 1) {
      paramListData = paramListData.substring(1)
    }
    let timestamp = new Date().getTime()
    url = url + paramListData + '&timestamp=' + timestamp
  } else {
    if (url.indexOf('&') === url.length - 1 || url.indexOf('?') === url.length - 1) {
      paramListData = paramListData.substring(1)
    }
    url = url + paramListData
  }
  if (data.isShare == 1) {
    openNewPage({
      bizCode: data.iconCode || '',
      url: url,
      markId: data.markId || '',
      type,
      funCode
    })
  } else {
    openNewPage({bizCode: '', url: url, markId: data.markId, type, funCode})
  }

}

// 构造跳转参数
function structureParameter (userInfo, paramList, uid, encryptTel) {
  if (paramList && typeof paramList !== 'object') {
    paramList = paramList.split(',')
    let arr = []
    paramList.map(item => {
      arr.push({
        paramId: item
      })
    })
    paramList = arr
  }

  let url = ''
  for (let i = 0; i < paramList.length; i++) {
    let paramId = paramList[i].paramId
    if (paramId == 'UID') {
      url += '&' + uid
    } else if (paramId == 'provinceCode') {
      url += '&provinceCode=' + userInfo.province
    } else if (paramId == 'cityCode') {
      url += '&cityCode=' + userInfo.city
    } else if (paramId == 'clientVer') {
      url += '&clientVer=' + userInfo.version
    } else if (paramId == 'devType') {
      url += '&devType=' + userInfo.st
    } else if (paramId == 'clientId') {
      url += '&clientId=' + userInfo.clientID
    } else if (paramId == 'scnType') {
      url += '&scnType=' + userInfo.sp
    } else if (paramId == 'telNo') {
      url += '&telNo=' + encryptTel
    } else {
      url += '&' + paramId + '=no' // 每一项都没有那么都带上no
    }
  }
  return url
}


/**
 *加密字符串
 *
 * @param {*} message
 * @param {*} key
 * @returns
 */
function  encryptByDES (message, key) {
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}

/**
 *机密字符串
 *
 * @param {*} ciphertext
 * @param {*} key
 * @returns
 */
function decryptByDES (ciphertext, key) {
  var ciphertext = decodeURIComponent(ciphertext)
  var keyHex = CryptoJS.enc.Utf8.parse(key);
  var decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Base64.parse(ciphertext)
  }, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
/**
 * 请求体字符串转换
 *
 * @param {*} objJson  用户信息
 * @param {*} objPam  请求体
 * @returns
 */
function getFetchData (objJson, objPam) {
  //推送标识
  var cid = !!objJson.CID ? objJson.CID : objJson.cid;
  //加密级别
  var en = !!objJson.EN? objJson.EN : objJson.en;
  //会话信息
  var t = !!objJson.TOKEN? objJson.TOKEN : objJson.token;
  //设备型号
  var sn = !!objJson.SN ? objJson.SN : objJson.sn;
  //客户端版本号
  var cv = !!objJson.VERSION ? objJson.VERSION : objJson.version;
  //系统类型 int
  var st = !!objJson.ST ? objJson.ST : objJson.st;
  //系统版本号
  var sv = !!objJson.SV ? objJson.SV : objJson.sv;
  //屏幕分辨率
  var sp = !!objJson.SP ? objJson.SP : objJson.sp;
  //客户端安全ID
  var xk = !!objJson.XK ? objJson.XK : objJson.xk;
  //渠道编码
  var xc = !!objJson.CHANNEL ? objJson.CHANNEL : objJson.channel;
  var imei=!!objJson.imei? objJson.imei:"";
  //联网方式
  var nt=!!objJson.nt? objJson.nt:"";
  //手机品牌
  var sb=!!objJson.sb? objJson.sb:"";
  //选择的省编码
  var prov=!!objJson.PROVINCE? objJson.PROVINCE:objJson.province;
  //选择的城市编码
  var city=!!objJson.CITY? objJson.CITY:objJson.city;
  //登录手机号
  var tel=!!objJson.USERPHONENUM? objJson.USERPHONENUM:objJson.phoneNumber;
  return JSON.stringify({
    "cid": cid,
    "en": en,
    "t": t,
    "sn": sn,
    "cv": cv,
    "st": st,
    "sv": sv,
    "sp": sp,
    "xk": xk,
    "xc":xc,
    "imei":imei,
    "nt":nt,
    "sb":sb,
    "prov":prov,
    "city":city,
    "tel":tel,
    "reqBody": objPam
  })
}

function overTime () {
  leadeon.overTime({
    debug: false,
    success: function(res) {
    },
    error: function(err) {
    }
  })
}

export {
  getQueryString,  // 获取url参数
  recvUserInfo,  // 获取登录用户信息，如果没有登录就强制登录，如果在客户端外，返回默认数据
  getUserInfo,  // 获取用户信息，如果在客户端外，返回默认数据
  getUserStatus, // 获取用户登录状态
  encryptString, // 客户端加密
  curParam,  // 返回 url 上的参数对象
  getMax,  // 获取数组中最大数
  getMin,  // 获取数组中最小数
  pullAppDownload, // 拉起客户端并打开下载页面
  shareMsg,  // 老版本分享
  shareStore,  // 老版本显示分享按钮
  wvShare,  // 新版本显示分享按钮
  h5Share,  // 新版本H5分享
  openNewPage,  // 打开新webview
  goNativePage,  // 打开客户端本地功能
  startPlugin,  // 打开客户端插件 只有android用
  setWebtrends,  // webtrands 插码
  functionClicks,  // 功能点击量统计 polyfill
  OfunctionClicks,  // 老版本功能点击量统计
  NfunctionClicks,  // 新版本功能点击量统计
  showLogin,  // 拉起登录页
  ADlog,  // 广告位点击统计
  powerJump, // 强大的跳转方法，支持icon 和 各种营销位跳转 并且自动插码
  encryptByDES, // 加密字符串， 例如手机号
  decryptByDES, // 机密字符串
  getContacts, // 用户的通讯录
  getFetchData,  // 用户信息转换
  overTime  // 接口超时拉登陆
}

