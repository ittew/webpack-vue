<template>
  <div>
    <div class="menu-box">
      <ul>
        <li class="onepx" v-if="curGroupInfo.memberType == 1 && curGroupInfo.groupSource == 1" @click.stop="unSubscribeBusiOrDelGroup('退订')">退订亲情网</li>
        <li class="onepx" v-if="curGroupInfo.memberType == 2 && curGroupInfo.groupSource == 1" @click.stop="unSubscribeBusiOrDelGroup('退订')">退出亲情网</li>
        <li class="onepx" v-if="curGroupInfo.memberType == 1" @click.stop="unSubscribeBusiOrDelGroup('解散')">解散群组</li>
        <li class="onepx" @click.stop="busiIntroduce">业务介绍</li>
        <li class="onepx" v-if="curGroupInfo.groupSource == 1" @click.stop="checkOrder">查询订单</li>
      </ul>
    </div>
    <div class="cfmDelMember-box" v-show="cfmDel" @click="cfmDel = false">
      <div class="cfmDelMember">
        <div class="cfmDelMember-top onepx">温馨提示</div>
        <div class="cfmDelMember-content">
          <div v-if="cfmType == 2">
            解散群组将退订亲情网业务，无法再共享亲情网成员间国内语音互打免费，确定要解散么？
          </div>
          <div v-if="cfmType == 1">您确定要解散群组么？</div>
          <div v-if="cfmType == 3">
            退订亲情网将无法享受成员间国内语音互打免费，确定要退订么？
          </div>
        </div>
        <div class="cfmDelMember-bottom" v-if="cfmType == 1 || cfmType == 2">
          <div class="cancel" @click="cfmDel = false">忽略</div>
          <div class="cfm" @click="dissolveGroup">解散</div>
        </div>
        <div class="cfmDelMember-bottom" v-if="cfmType == 3">
          <div class="cancel" @click="cfmDel = false">取消</div>
          <div class="cfm" @click="cfmUnSubscribe">确认</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { leadeon_Toast, leadeon_MsgBox } from 'utils/leadeon-ui'
import { delGroup, unSubscribeBusi } from '../getData'
import { openNewPage, showLogin, overTime } from 'utils/common'
export default {
  inject: ['reload'], // 注入App.vue提供的provide的reload以来
  props: ['curGroupInfo', 'userInfo'],
  data () {
    return {
      cfmDel: false, // 弹窗提示状态
      cfmType: 1     // 弹窗类型  1. 自建网解散群组  2. 亲情网解散群组  3. 退订亲情网
    }
  },
  created () {},
  methods: {
    unSubscribeBusiOrDelGroup (arg) { // 退订亲情网 或  解散群组
      this.cfmDel = true
      if (arg == '退订') { // 主卡退订亲情网
        this.cfmType = 3
      } else if(arg == '解散'){
        if (this.curGroupInfo.groupSource == 1) {
          this.cfmType = 2
        }
      }
    },
    cfmUnSubscribe () { // 确认退订亲情网
      this.cfmDel = false
      let reqBody = null
      // 主卡退订亲情网
      if (this.curGroupInfo.memberType == 1 && this.curGroupInfo.groupSource == 1) {
        reqBody = {
          cellNum: this.userInfo.phoneNumber,
          groupId: this.curGroupInfo.groupId,
          operatType: '1'
        }
      // 成员退订亲情网
      } else if (this.curGroupInfo.memberType == 2 && this.curGroupInfo.groupSource == 1) {
        reqBody = {
          cellNum: this.userInfo.phoneNumber,
          groupId: this.curGroupInfo.groupId,
          operatType: '2',
          memberCellNum: this.userInfo.phoneNumber
        }
      }
      this.unSubscribeBusiHandle(reqBody, '退订')
    },
    async unSubscribeBusiHandle(req, txt) {
      let data = await unSubscribeBusi(this.userInfo, req)
      if (data.retCode === '000000') {
        leadeon_Toast(txt + '成功')
        setTimeout(() => {
          location.reload()  // 刷新当前路由方式1
          // this.reload()   // 刷新当前路由方式2(推荐)
        }, 1000)
      } else if (/^4\d{5}$/.test(data.retCode)) {
        overTime()
      } else {
        leadeon_Toast(data.retDesc)
      }
    },
    dissolveGroup () { // 解散群组
      this.cfmDel = false
      let reqBody = {
        cellNum: this.userInfo.phoneNumber,
        groupId: this.curGroupInfo.groupId,
        operatType: '3'
      }
      this.unSubscribeBusiHandle(reqBody, '解散')
    },
    busiIntroduce () { // 业务介绍
      this.$emit('closeMenu') // 关闭菜单
      let pageUrl = '';
      // 已开通亲情网 跳转亲情网业务介绍页 并携带开通类型(全国版 自付版)
      if (!!this.curGroupInfo.busiType && (this.curGroupInfo.busiType == '1'|| this.curGroupInfo.busiType == '2')) {
        pageUrl = window.location.href.substr(0, window.location.href.indexOf('family')) + 'family/familyIntroduce.html?busiType=' + this.curGroupInfo.busiType + '&isOpen=1#/familynetwork'
      } else { // 未开通亲情网 跳转亲情网业务办理页面
        pageUrl = window.location.href.substr(0, window.location.href.indexOf('family')) + 'family/familyIntroduce.html?groupId=' + this.curGroupInfo.groupId + '#/familynetworkchoose'
      }
      openNewPage({url: pageUrl})
    },
    checkOrder () { //查询订单携带登录参数
      this.$emit('closeMenu') // 关闭菜单
      let jumpUrl = 'https://touch.10086.cn/i/mobile/familyorder.html?c=11&e=99',
              uid = this.userInfo.token.match(/UID=\w+/g)[0],
        timestamp = new Date().getTime(),
            urls  = "https://login.10086.cn/AppSSO.action?targetChannelID=12014&targetUrl="+encodeURIComponent(jumpUrl) + "&TransactionID=c1e133da84a0b4685571e2a1fb42eff5&" + uid + "&timestamp=" + timestamp;
      openNewPage({url: urls})
    }
  }
}
</script>
<style lang='scss'>
.menu-box{
  position: absolute;
  top: 48px;
  right:-18px;
  width: 276px;
  box-shadow: 0px 4px 24px 0px #e9e9e9;
  border-radius: 10px;
  background: #fff;
  padding: 0 44px;
  z-index: 101;
  li{
    font-size: 30px;
    color: #333;
    line-height: 88px;
    &::before{
      border-bottom: 1px solid #e9e9e9;
    }
    &:last-child{
      border-bottom: none;
    }
  }
  &::before{
    content: '';
    position: absolute;
    top: -11px;
    right: 34px;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid #fff;
    z-index: 10;
  }
  &::after{
    content: '';
    position: absolute;
    top: -12px;
    right: 34px;
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid #e9e9e9;
    z-index: 9;
    filter: blur(2px);
  }
}
.cfmDelMember-box{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 99999;
  background: rgba(0,0,0,.4);
  .cfmDelMember{
    width: 580px;
    padding: 56px 50px;
    background-color: #ffffff;
    border-radius: 20px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
  }
  .cfmDelMember-top{
    width: 100%;
    padding: 0 0 37px;
    font-size: 34px;
    color: #333;
    text-align: center;
    &::before{
      border-bottom: 1px solid #e9e9e9;
    }
  }
  .cfmDelMember-content{
    font-size: 30px;
    color: #999;
    line-height: 42px;
    padding: 40px 10px 50px;
  }
  .cfmDelMember-bottom{
    width: 100%;
    display: flex;
    justify-content: space-between;
    div{
      width: 202px;
      height: 80px;
      background-blend-mode: normal,normal;
      border-radius: 40px;
      font-size: 34px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .cancel{
      color: #00a4ff;
      background-image: linear-gradient(-90deg,rgba(131, 114, 255, 0.1) 0%,rgba(101, 203, 255, 0.1) 100%),linear-gradient(#f8fbff,#f8fbff);
    }
    .cfm{
      color: #fff;
      background-image: linear-gradient(-90deg,#8372ff 0%,#65cbff 100%),linear-gradient(#fff,#fff);
    }
  }
}
</style>
