/**
 * x 西安
 * t 灰度
 * p 生产
 * l 本地
 */
import env from './env'

let host_boss

let host_boss1

 /**
 * v2.2西安外网地址：http://111.20.119.234:9080/biz-orange/
 * v2.2灰度地址：https://app.10086.cn/biz-V2.2/
 * v2.2正式地址：https://app.10086.cn/biz-orange/
 */
switch (env) {
  case 'x':
    host_boss = 'http://111.20.119.234:9080/biz-orange/'
    host_boss1 = 'http://111.20.119.234:9080/leadeon-abilityopen-biz-test/'
    break
  case 't':
    host_boss = 'https://app.10086.cn/biz-V2.2/'
    // host_boss = 'http://192.168.6.26:8787/biz-V2.2/'
    host_boss1 = 'https://app.10086.cn/leadeon-abilityopen-biz-gray/'
    break
  case 'p':
    host_boss = 'https://app.10086.cn/biz-orange/'
    host_boss1 = 'https://app.10086.cn/leadeon-abilityopen-biz/'
    break
  case 'l':
    host_boss = '/biz-orange/'
    host_boss1 = '/leadeon-abilityopen-biz-test/'
}

export {
  host_boss, host_boss1
}
