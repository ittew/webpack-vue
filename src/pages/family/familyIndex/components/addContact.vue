<template>
  <div class="addContact-container">
    <div class="addContact-top">
      <div class="add-top-phone">
        <input type="tel" maxlength="13" placeholder="请输入移动手机号码" @input="bianjiPhone" v-model="phone">
        <div class="add-top-phone-right">
          <span class="close" @click="deletePhone" v-if="closeFlag"></span>
          <span class="mailList" @click="getPeople"></span>
        </div>
      </div>
      <div class="add-top-nickName">
        <input type="text" maxlength="5" placeholder="输入昵称" v-model="nickName" @input="bianjiNickName">
        <span class="status">{{nickName.length}}/5</span>
      </div>
    </div>
    <div class="addContact-center">
      添加好友后，可以查询、代缴好友的话费， <br/>让你的父母、好友话费再也无忧！
    </div>
    <div class="addContact-bottom">
      <div class="addContact-bottom-cancel" @click="cancelAdd">取消</div>
      <div class="addContact-bottom-confirm" :class="(phoneFlag && nickNameFlag) ? 'addContact-bottom-confirmActive' : ''" @click = "addFriend1">立即添加</div>
    </div>
  </div>
</template>

<script>
import { getContacts, encryptString, overTime } from 'utils/common'
import { leadeon_MsgBox, leadeon_Toast } from 'utils/leadeon-ui'
import { addFriends } from '../getDate'

export default {
  name: 'AddContact',
  components: {},
  props: ['userInfo', 'friendObj'],
  data () {
    return {
      closeFlag: false, // 关闭按钮开关
      phoneFlag: false, // 手机号码校验开关
      nickNameFlag: false, // 昵称校验开关
      nickName: '', // 亲密联系人的昵称
      phone: '', // 亲密联系人的手机号码
    }
  },
  watch: {},
  mounted () {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      if (this.friendObj.nickName) {
        this.nickName = this.friendObj.nickName
        this.phone = this.friendObj.phoneNumber
        this.nickNameFlag = true
      } else {
        this.nickName = ''
        this.phone = ''
      }
    },
    // 点击添加好友
    async addFriend1() {
      var _this = this
      if (_this.phoneFlag && _this.nickNameFlag) {
        let cellNum = await encryptString(_this.userInfo.phoneNumber)
        let friendsCellNum = await encryptString(_this.phone.replace(/[^\d]/g, ''))
        let data = await addFriends(_this.userInfo, {
          cellNum: cellNum,
          friendsCellNum: friendsCellNum,
          nickName: _this.nickName,
          AddType: _this.friendObj.addType || 'N'
        })
        if (!!data && data.retCode == '000000') {
          var result = data.rspBody.result;
          if (result == 0) {
            leadeon_Toast("该号码已是您的亲密好友或正等待确认好友申请，不能重复添加");
          } else if(result == 1) {
            leadeon_Toast("好友申请已发送，请等待好友确认");
            let obj = {
              "friendsCellNum": _this.phone,
              "nickName": _this.nickName,
              "status": "0",
              "addType": _this.friendObj.addType || 'N'
            }
            _this.$emit('addFriend', obj)
          } else if (result == 2) {
            leadeon_Toast("添加失败");
          } else if (result == 3) {
            leadeon_Toast("不能添加本人号码为亲密付好友");
          }else if(result == 4) {
            leadeon_Toast("您添加的亲密好友达到上限，不能继续添加");
          } else {
            leadeon_Toast("仅支持添加移动号码");
          }
        } else if (data.retCode == '310004') {
          leadeon_Toast('仅支持添加移动号码')
        } else if (/^4\d{5}$/.test(data.retCode)) {
          overTime()
        } else {
          leadeon_MsgBox({
            msg: data.retDesc,
            confirmText: '知道了'
          })
        }
      }
    },
    // 获取通讯录好友
    async getPeople() {
      let _this = this
      let people = await getContacts()
      let peoplePhone = people.phoneNum.replace(/[^\d]/g, '')
      if(peoplePhone.substring(0, 2) == '86') {
        peoplePhone = peoplePhone.substring(2)
      } else if (peoplePhone.substring(0, 4) == '0086') {
        peoplePhone = peoplePhone.substring(4)
      }
      _this.nickName = people.userName.substring(0, 5)
      _this.phone = peoplePhone
      if (_this.nickName.length > 0) {
        _this.nickNameFlag = true
      }
      _this.bianjiPhone()
    },
    // 电话号码input事件
    bianjiPhone() {
      let str = this.formatTel(this.phone.replace(/[^\d]/g, ''))
      this.phone = str
      if (this.phone.length <= 0) {
        this.closeFlag = false
      } else {
        this.closeFlag = true
        if (this.phone.length >= 13) {
          this.phoneFlag = true
        } else {
          this.phoneFlag = false
        }
      }
    },
    // 昵称input事件
    bianjiNickName () {
      this.nickName = this.nickName.replace(/[`~!@#$%^&*()_+<>?:"{},./;'[\]]|\s/gim, '')
      if (this.nickName.length >= 1) {
        this.nickNameFlag = true
      } else {
        this.nickNameFlag = false
      }
    },
    // 电话号码344格式
    formatTel (tel) {
      let arr = tel.split('')
      let str = ''
      arr.forEach(function (value, ind) {
        if (ind === 3 || ind === 7) {
          str += ' '
        }
        str += value
      })
      return str
    },
    // 点击叉号清空输入电话号码
    deletePhone() {
      this.phone = ''
      this.closeFlag = false
      this.phoneFlag = false
    },
    // 取消添加好友弹窗
    cancelAdd() {
      this.$emit('cancelAdd')
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/familyIndex-sprite.scss';

.addContact-container{
  position: fixed;
  top: 200px;
  left: 0;
  right: 0;
  margin: auto;
  width: 600px;
	height: 533px;
	background-color: #ffffff;
  border-radius: 20px;
  padding: 60px 44px 0;
  z-index: 9998;
  .addContact-top{
    input{
      border:none;
      outline: none;
      width: 70%;
      height: 60px;
      line-height: 60px;
      font-size: 34px;
      padding-left: 8px;
    }
    input::-webkit-input-placeholder { /* WebKit, Blink, Edge */
      color: #bbbbbb;
      font-size: 34px;
    }
    input::-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: #bbbbbb;
      font-size: 34px
    }
    input::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #bbbbbb;
      font-size: 34px
    }
    input::-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: #bbbbbb;
      font-size: 34px
    }
    .add-top-phone,.add-top-nickName{
      width: 100%;
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e9e9e9;
    }
    .add-top-nickName{
      position: relative;
      .status{
        font-size: 18px;
        color: #bbbbbb;
        position: absolute;
        right: 0;
        bottom:  -36px;
      }
    }
    .add-top-phone-right{
      width: auto;
      height: auto;
      display: flex;
      .close{
        @include sprite('close');
        margin-right: 20px;
      }
      .mailList{
        @include sprite('mailList');
        margin-right: 6px;
      }
    }
  }
  .addContact-center{
    font-size: 24px;
    color: #bbbbbb;
    line-height: 36px;
    margin-top: 44px;
  }
  .addContact-bottom {
    margin-top: 30px;
    width:100%;
    height: 88px;
    display: flex;
    justify-content: space-between;
    .addContact-bottom-cancel,.addContact-bottom-confirm{
      width: 240px;
      height: 100%;
      line-height: 88px;
      text-align: center;
      font-size: 34px;
      color: #00a4ff;
      border-radius: 44px;
      background-color: #f2f5ff;
    }
    .addContact-bottom-confirm{
      background-image: linear-gradient(-90deg,
      #cccccc 1%,
      #dddddd 100%),
    linear-gradient(
      #ffffff,
      #ffffff);
      background-blend-mode: normal,
        normal;
      color: #fff;
    }
    .addContact-bottom-confirmActive{
      background-image: linear-gradient(-90deg,
        #8372ff 0%,
        #65cbff 100%),
      linear-gradient(
        #ffffff,
        #ffffff);
    }
  }
}
</style>
