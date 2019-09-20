<template>
  <div class="group-wrapper">
    <div class="group-box">
      <div class="inp-box onepx">
        <input type="tel" class="group-name" placeholder="输入移动手机号码"  autofocus v-focus
          v-model="memberTel" @input="checkTel" maxlength="13"/>
        <p class="contact" @click="contactHandle"></p>
      </div>
      <div class="inp-box onepx">
        <input type="text" class="group-name" placeholder="输入昵称" maxlength="6"
          v-model="memberName" @input="checkName"/>
      </div>
      <div class="text-num">{{memberName.length}}/6</div>
      <div class="operation" :class="{'active': isActive }" @click="addMemberHandle" >立即添加</div>
    </div>
  </div>
</template>
<script>
import { addMember, formatTel, remFormatTel, getContacts } from '../getData'
import { leadeon_Toast } from 'utils/leadeon-ui'
import { openNewPage, recvUserInfo, showLogin, overTime } from 'utils/common'
import { mapState, mapActions } from 'vuex'

let telReg = /^[1][3,4,5,7,8]\d{9}/ // 手机号码正则
export default {
  data () {
    return {
      memberName: '',       // 添加成员的昵称
      memberTel: '',        // 添加成员的手机号码
      isActive: false,      // 是否高亮
      telPost: false,       // 手机验证标识
      userInfo: null,       // 用户信息
      groupId: '',          //群组Id
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  },
  computed: {
    ...mapState(['editGroupInfo'])
  },
  created() {
    let _this = this
    setTimeout(async function(){
      _this.userInfo = await recvUserInfo()
    }, 400)
    this.groupId = this.editGroupInfo.groupId;
  },
  methods: {
    async addMemberHandle () {  // 添加群成员
      if (!!this.isActive) {
        let data = await addMember(this.userInfo, {
            cellNum: this.userInfo.phoneNumber,
            groupId: this.groupId,
            memberNum: remFormatTel(this.memberTel),
            memberName: this.memberName
          }, '')
        if (data.retCode === '000000') {
            if (data.rspBody.status === '000') {
              leadeon_Toast('添加成功!')
              setTimeout(() => {
                this.$router.push({
                  path: 'groupList',
                  query: {
                    groupId: this.groupId
                  }
                })
              }, 800)
            } else if(data.rspBody.status === '001'){
              leadeon_Toast('该成员已存在！')
            }
        } else if (/^4\d{5}$/.test(data.retCode)) {
          overTime()
        } else {
          leadeon_Toast(data.retDesc)
        }
      }
    },
    checkTel () { // 手机号码校验
      this.memberTel = formatTel(this.memberTel.replace(/[^\d]/g, ''));
      if (this.memberTel.length > 13) {
        leadeon_Toast('手机号码格式不正确!')
        this.memberTel = this.memberTel.substring(0, 13)
        this.telPost = false
      } else if (this.memberTel.length === 13 && !telReg.test(remFormatTel(this.memberTel))) {
        leadeon_Toast('手机号码格式不正确!')
      } else if(this.memberTel.length === 13 && telReg.test(remFormatTel(this.memberTel))) {
        this.telPost = true
      } else {
        this.telPost = false
      }
      this.checkIsActive()
    },
    checkName () { // 昵称校验
      this.memberName = this.memberName.replace(/^[^\u4e00-\u9fa5_a-zA-Z0-9]$/gim, '') // 数字及特殊字符替换
      this.checkIsActive()
    },
    checkIsActive () { // 是否高亮
      if (!!this.telPost && this.memberName != '') {
        this.isActive = true
      } else {
        this.isActive = false
      }
    },
    async contactHandle () { // 获取通讯录好友
      let contact = await getContacts()
      let peoplePhone = contact.phoneNum.replace(/[^\d]/g, '')
      if(peoplePhone.substring(0, 2) == '86') {
        peoplePhone = peoplePhone.substring(2)
      } else if (peoplePhone.substring(0, 4) == '0086') {
        peoplePhone = peoplePhone.substring(4)
      }
      this.memberTel = formatTel(peoplePhone)
      this.memberName = contact.userName.substring(0, 6)
      this.checkTel()
    }
  }
}
</script>
<style lang='scss'>
@import '../assets/mySocial-sprite.scss';
.group-wrapper {
  padding: 40px 30px 0;
  .group-box{
    padding: 64px 56px;
    background: #fff;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
	  border-radius: 20px;
    .inp-box{
      padding: 24px 0;
      position: relative;
      &::before{
        border-bottom: 1px solid #e9e9e9;
      }
    }
    .group-name{
      font-size: 34px;
      color: #333;
      border: none;
      outline: none;
      width: 460px;
    }
    .contact{
      position: absolute;
      right: 0;
      top: 25px;
      @include sprite('contact')
    }
    .text-num{
      margin: 9px 0 26px;
      text-align: right;
      font-size: 18px;
      color: #bbb;
    }
    .operation{
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
  }
}
</style>
