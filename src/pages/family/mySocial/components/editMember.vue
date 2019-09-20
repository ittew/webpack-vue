<template>
  <div class="member-wrapper">
    <div class="member-box">
      <div class="member-top">
        <div class="member-left">
          <div class="inp-box onepx" v-show="isEdit">
            <div class="text-num">{{!memberInfo.memberName?'0':memberInfo.memberName.length}}/6</div>
            <input type="text"
              class="member-name"
              placeholder="输入昵称"
              maxlength="6"
              v-model="memberInfo.memberName"
              @input="checkName" />
            <p class="clear" @click="clearHandle"></p>
          </div>
          <div class="inp-box onepx" v-show="!isEdit">
            <div class="text">
              <span>{{memberInfo.memberName}}</span>
              <p class="edit" @click="isEdit = true"></p>
            </div>
          </div>
          <div class="memberNum">
            <span>{{memberInfo.memberNum}}</span><span>{{location}}</span>
          </div>
        </div>
        <div class="member-right onepx">
          <div class="mem" v-if="editMemberInfo.memberType == 2 && editMemberInfo.memberFlag == 1" ></div>
          <div class="wait-member" v-else-if="editMemberInfo.memberType == 2 && editMemberInfo.memberFlag == 2" ></div>
          <div class="no-open" v-else></div>
        </div>
      </div>
      <div class="updateNick" :class="{'active': isActive}" @click="updateMemberName">修改昵称</div>
      <div class="opening" v-if="!isOpening && editGroupInfo.groupSource == 1 && editMemberInfo.memberFlag != 2" @click="bindMeberHandle">开通亲情网成员号业务</div>
    </div>
    <!-- 成员退订 -->
    <div class="unsubscribe btn" :class="{'gray':editMemberInfo.memberFlag == 2}" v-if="isOpening" @click="unSubscribeBusiness">退订亲情网成员号业务</div>
    <!-- 删除成员 -->
    <div class="delMember btn" :class="{'gray':editMemberInfo.memberFlag == 2}" @click="delMemHandle">删除成员</div>
    <!-- 确认删除提示 -->
    <div class="cfmDelMember-box" v-show="cfmDel">
      <div class="cfmDelMember">
        <div class="cfmDelMember-top onepx">温馨提示</div>
        <div class="cfmDelMember-content">
          <div v-if="cfmType == 1">删除该成员会同时退订TA的亲情网成员号业务，无法共享群内成员间国内语音互打免费，确认删除么？</div>
          <div v-else-if="cfmType == 2">您确认要删除该成员？</div>
          <div v-else-if="cfmType == 3">退订亲情网将无法享受成员间国内语音互打免费，确定要退订么？</div>
        </div>
        <div class="cfmDelMember-bottom">
          <div class="cancel" @click="cfmDel = false">取消</div>
          <div class="cfm" @click="unSubscribeBusinessHandle" v-if="cfmType == 3">确认</div>
          <div class="cfm" @click="delMemberHandle" v-else>确认</div>
        </div>
      </div>
    </div>
    <!-- 提交成功提示 -->
    <div class="submitSuccess-box" v-show="submitSuccess">
      <div class="submitSuccess">
        <div class="submitSuccess-top onepx">温馨提示</div>
        <div class="submitSuccess-content">
          <p>申请已提交成功。</p>
          <!-- <p>用户同意后才会进行扣费，</p> -->
          <p>办理结果以短信提醒为准。</p>
        </div>
        <div class="submitSuccess-bottom">
          <div class="cancel" @click="knowHandle">知道了</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getLocal, modifyGroupName, delMember, unSubscribeBusi, bindMeber } from '../getData'
import { leadeon_Toast } from 'utils/leadeon-ui'
import { mapState, mapActions } from 'vuex'
import { openNewPage, showLogin, overTime } from 'utils/common'
let telReg = /^[1][3,4,5,7,8]\d{9}/ // 手机号码正则
export default {
  inject: ['reload'], // 注入App.vue提供的provide的reload以来
  data () {
    return {
      isEdit: false,          // 是否可编辑
      memberInfo: '',         // 成员信息
      isOpening: false,       // 是否已开通
      cfmDel: false,          // 确认删除
      isActive: false,        // 是否高亮
      location: '',           // 归属地
      submitSuccess: false,   // 提交成功弹窗
      cfmType: 1,             // 删除框类型  1. 亲情网   2. 自建网
    }
  },
  computed: {
    ...mapState(['editMemberInfo', 'userInfo', 'editGroupInfo'])
  },
  async created () {
    this.memberInfo = this.editMemberInfo;
    if (!!this.editMemberInfo) { // 编辑成员信息
      if(this.editMemberInfo.memberFlag == 1) {
        this.isOpening = true
      }
    }
    // 成员号码归属地
    if (!!this.editMemberInfo.memberNum && this.editMemberInfo.memberNum !== '') {
      let LocationData =await getLocal(this.userInfo, {cellNum: this.editMemberInfo.memberNum})
      if (LocationData.retCode === '000000') {
        this.location = LocationData.rspBody.provinceName
      }
    }
    this.checkIsActive()
  },
  directives: { // 自动获焦
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  methods: {
    unSubscribeBusiness () { //退订亲情网
      if (this.editMemberInfo.memberFlag == 2) {
        return
      }
      if (this.editGroupInfo.groupSource == 1) {
        this.cfmType = 3
      }
      this.cfmDel = true
    },
    async unSubscribeBusinessHandle () { // 确认退订亲情网
      let reqBody = {
        cellNum: this.userInfo.phoneNumber,
        groupId: this.editGroupInfo.groupId,
        operatType: '2',
        memberCellNum: this.editMemberInfo.memberNum
      }
      let data = await unSubscribeBusi(this.userInfo, reqBody)
      if (data.retCode === '000000') {
        leadeon_Toast('退订成功')
        setTimeout(() => {
          this.backGroupList()
        }, 800)
      } else if (/^4\d{5}$/.test(data.retCode)) {
        overTime()
      } else {
        leadeon_Toast(data.retDesc)
      }
    },
    /* openFamilyNetwork () { // 开通亲情网
      // this.editGroupInfo.busiType = 1
      /* let pageUrl = window.location.href.substr(0, window.location.href.indexOf('family')) + 'family/familyIntroduce.html?busiType=' + this.editGroupInfo.busiType + '&groupId='+ this.editGroupInfo.groupId +'#/familynetwork'
      alert(pageUrl)
      openNewPage({url: pageUrl})
    }, */
    async delMemberHandle () { // 删除群成员
      let reqBody = {
        cellNum: this.userInfo.phoneNumber,
        groupId: this.editGroupInfo.groupId,
        delCellNum: this.memberInfo.memberNum
      }
      let data = await delMember(this.userInfo, reqBody)
      if (data.retCode === '000000') {
        leadeon_Toast('删除成功')
        setTimeout(() => {
          this.backGroupList()
        }, 1000)
      } else if (/^4\d{5}$/.test(data.retCode)) {
        overTime()
      } else {
        leadeon_Toast(data.retDesc)
      }
    },
    checkName () { // 昵称校验
      this.memberInfo.memberName = this.memberInfo.memberName.replace(/[`~!@#$%^&*()_+<>?:"{},./;'[\]]|\s/gim, '') // 数字及特殊字符替换
      this.checkIsActive()
    },
    checkIsActive () { // 设置高亮
      this.isActive = this.memberInfo.memberName && this.memberInfo.memberName.length > 0 ? true : false
    },
    clearHandle () { // 清空输入框
      this.memberInfo.memberName = ''
      this.checkIsActive()
    },
    async updateMemberName () { // 修改群成员昵称
      if (this.memberInfo.memberName === '') {
        leadeon_Toast('昵称不能为空!')
        return
      }
      let reqBody = {
        cellNum: this.userInfo.phoneNumber,
        groupId: this.editGroupInfo.groupId,
        operateType: 2,
        niceName: this.memberInfo.memberName,
        memberCellNum: this.memberInfo.memberNum
      }
      let data = await modifyGroupName(this.userInfo, reqBody)
      if (data.retCode === '000000') {
        leadeon_Toast('修改成功')
        setTimeout(() => {
          this.backGroupList()
        }, 1000)
      } else if (/^4\d{5}$/.test(data.retCode)) {
        overTime()
      } else {
        leadeon_Toast(data.retDesc)
      }
    },
    async bindMeberHandle () { // 绑定副卡
      let data = await bindMeber(this.userInfo, {
        cellNum: this.userInfo.phoneNumber,
        groupId: this.editGroupInfo.groupId,
        bindCellNums: this.memberInfo.memberNum
      });
      if (data.retCode === '000000') {
        this.submitSuccess = true
      } else if (/^4\d{5}$/.test(data.retCode)) {
        overTime()
      } else {
        leadeon_Toast(data.retDesc)
      }
    },
    knowHandle () { // 绑定副卡提示
      this.submitSuccess = false
      // this.reload()
      this.backGroupList()
    },
    delMemHandle () {
      if (this.editMemberInfo.memberFlag == 2) {
        return
      }
      if (this.editGroupInfo.groupSource == 2 || this.editMemberInfo.memberFlag == 3) {
        this.cfmType = 2
      }
      if (this.editGroupInfo.groupSource == 1 && this.editMemberInfo.memberFlag == 1) {
        this.cfmType = 1
      }
      this.cfmDel = true
    },
    backGroupList () {
      this.$router.push({
        path: 'groupList',
        query: {
            groupId: this.editGroupInfo.groupId
          }
      })
    }
  }
}
</script>
<style lang='scss'>
@import '../assets/mySocial-sprite.scss';
.member-wrapper {
  padding: 40px 30px 0;
  .member-box{
    padding: 64px 56px;
    background: #fff;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
	  border-radius: 20px;
  }
  .member-top{
    display: flex;
    margin-bottom: 50px;
  }
  .member-left{
    width: 400px;
    .inp-box{
      width: 320px;
      padding: 2px 10px 22px;
      position: relative;
      &::before {
        border-bottom: 1px solid #e9e9e9;
      }
      .member-name{
        border: none;
        outline: none;
        font-size: 32px;
        color: #333;
        padding: 1px 0;
        width: 250px;
      }
      .text-num{
        position: absolute;
        top: -30px;
        left: 10px;
        font-size: 18px;
        color: #bbb;
      }
      .clear{
        position: absolute;
        top: 0;
        right: 0;
        @include sprite('clear')
      }
      .text{
        font-size: 32px;
      }
      .edit{
        display: inline-block;
        margin-left: 14px;
        margin-top: -2px;
        vertical-align: middle;
        @include sprite('edit')
      }
    }
    .memberNum{
      margin-top: 30px;
      color: #999;
      font-size: 30px;
      span:first-child{
        margin-right: 20px;
      }
      span:last-child{
        font-size: 26px;
        position: relative;
        top: -2px;
      }
    }
  }
  .member-right{
    flex: 1;
    height: 108px;
    display: flex;
    justify-content: flex-end;
    &::before{
      border-left: 1px solid #e9e9e9;
    }
    .mem{
      margin-left: 58px;
      position: relative;
      top: -10px;
      @include sprite('member-open');
    }
    .wait-member{
      margin-left: 58px;
      position: relative;
      top: -10px;
      @include sprite('wait-member');
    }
    .no-open{
      margin-left: 58px;
      position: relative;
      top: -10px;
      @include sprite('member-noopen');
    }
  }
  .updateNick{
    width: 100%;
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-size: 34px;
    color: #fff;
    background-image: linear-gradient(-90deg,#cccccc 1%,#dddddd 100%),linear-gradient(#ffffff,#ffffff);
    background-blend-mode: normal,normal;
    border-radius: 44px;
    &.active{
      background-image: linear-gradient(-90deg,#8372ff 0%,#65cbff 100%),linear-gradient(#ffffff,#ffffff);
    }
  }
  .opening{
    width: 100%;
    height: 88px;
    line-height: 88px;
    text-align: center;
    font-size: 34px;
    color: #fff;
    margin-top: 50px;
    background-image: linear-gradient(-90deg,#ff5e5e 0%,#ffa068 100%),linear-gradient(#ffffff,#ffffff);
    background-blend-mode: normal,normal;
    border-radius: 44px;
  }
  .btn{
    position: absolute;
    bottom: 40px;
    left: 50%;
    margin-left: -289px;
    width: 578px;
    background-color: #ffffff;
    border-radius: 44px;
    font-size: 34px;
    color: #ff5555;
    padding: 27px 0;
    text-align: center;
    &.gray{
      color: #999;
      background-color: #ddd;
    }
  }
  .delMember{
    bottom: 40px;
  }
  .unsubscribe{
    bottom: 160px;
  }
}
.cfmDelMember-box{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 100;
  background: rgba(0,0,0,.4);
  display: flex;
  justify-content: center;
  align-items: center;
  .cfmDelMember{
    width: 580px;
    padding: 56px 50px;
    background-color: #ffffff;
    border-radius: 20px;
  }
  .cfmDelMember-top{
    width: 100%;
    padding: 0 0 37px;
    font-size: 34px;
    color: #333;
    text-align: center;
    &::before {
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
.submitSuccess-box{
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 100;
  background: rgba(0,0,0,.4);
  display: flex;
  justify-content: center;
  align-items: center;
  .submitSuccess{
    width: 510px;
    padding: 56px 65px;
    background-color: #ffffff;
    border-radius: 20px;
  }
  .submitSuccess-top{
    width: 100%;
    padding: 0 0 37px;
    font-size: 34px;
    color:#333;
    text-align: center;
    &::before {
      border-bottom: 1px solid #e9e9e9;
    }
  }
  .submitSuccess-content{
    font-size: 30px;
    color: #999;
    line-height: 42px;
    padding: 40px 19px 40px;
    p{white-space: nowrap;}
  }
  .submitSuccess-bottom{
    width: 100%;
    div{
      height: 80px;
      background-blend-mode: normal,normal;
      border-radius: 40px;
      font-size: 34px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .cancel{
      color: #fff;
      background-image: linear-gradient(-90deg,#8372ff 0%,#65cbff 100%),linear-gradient(#fff,#fff);
    }
  }
}
</style>
