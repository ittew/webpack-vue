<template>
  <div class="family-container" :class="loginFlag ? 'family-containernoLogin' : ''">
    <header class="addPay-container back">
      <div class="addPay-center">
        <div class="addPayChild-top">
          <div class="addPayChild-me">
            <img :src="photoImg" alt="" class="addPayChild-me-img">
            <p class="addPayChild-me-word">我</p>
          </div>
          <swiper :options="swiperOption" ref="mySwiper" v-if="!loginFlag">
            <swiper-slide v-for="(item, index) in familyLists" :key="index">
              <div class="addPayChild-other" v-for="(it, ind) in item" :key="ind" @click = displaydetails(it,ind,index)>
                <div :class="it.status == '1'? 'addPayChild-has-img' : it.status == '0' ? 'addPayChild-wait-img' : it.status == '77' || !Number(it.friendsCellNum) ? 'addPayChild-add-img' : 'addPayChild-other-img'"></div>
                <p class="addPayChild-other-word ellipsis" :class="it.status == '1' || it.status == '77'? '' : 'addPayChild-other-wordColor1'">{{it.nickName}}</p>
              </div>
            </swiper-slide>
            <div class="swiper-pagination" :class="familyLists.length > 1 ? '': 'hidden'"  slot="pagination"></div>
          </swiper>
          <swiper :options="swiperOption" ref="mySwiper" v-else>
            <swiper-slide v-for="(item, index) in familyLists" :key="index">
              <div class="addPayChild-other" v-for="(it, ind) in item" :key="ind" @click = displaydetails(it,ind,index)>
                <div class="addPayChild-add-img"></div>
                <p class=" addPayChild-other-word ellipsis" :class="it.status == '77'? '' : 'addPayChild-other-wordColor1'">{{it.nickName}}</p>
              </div>
            </swiper-slide>
          </swiper>
          <div class="mask" v-if = "maskFlag" @click = "cancelInfo">
          </div>
          <AddContact v-if = "addFriendsFlag" :userInfo="userInfo" :friendObj="friendObj" @cancelAdd="cancelAdd" @addFriend="addqinmiPeople"></AddContact>
          <div class="edit-container" v-show = "infoFlag">
            <div class="trange"></div>
            <div class="edit-top"  v-if = "editFlag">
              <div class="left">
                <span class="edit-nickname ellipsis">{{friendObj.nickName}}</span>
                <span class="edit-sign" @click="editNickName"></span>
                <span class="delete-sign" @click="deleteEditBox"></span>
              </div>
              <span class="edit-phone">{{friendObj.phoneNumber | formatPhone}}</span>
            </div>
            <div class="edit-top"  v-if = "!editFlag">
              <div class="edit-left">
                <input type="text" maxlength="5" v-model='friendObj.nickName' placeholder="输入昵称" @input="judgeNickName">
                <span>{{friendObj.nickName.length}}/5</span>
              </div>
              <div class="edit-right">
                <span class="edit-quxiao" @click="quxiaoEditNickName">取消</span>
                <span class="line"></span>
                <span :class="xiugaiFlag ? 'edit-xiugaiActive' : ''" class="edit-xiugai" @click="xiugaiClick">修改</span>
              </div>
            </div>
            <div class="edit-bottom">
              <div class="edit-bottom-left">
                <p class="edit-bottom-left-title">TA的余额</p>
                <div class="edit-bottom-left-amount" v-if="!loadingFlag">
                  <div v-if="friendObj.money != '' && !!friendObj.money"><span :class="Number(friendObj.money) < 10 ? 'orangeNum' : ''" class="num">{{friendObj.money}}</span><span class="unit" :class="Number(friendObj.money) < 10 ? 'orangeNum' : ''">元</span></div>
                  <div v-else class="abnormal" @click="displaydetails(headInfo.obj, headInfo.index, headInfo.friendIndex)">--</div>
                </div>
                <Loading v-if="loadingFlag"></Loading>
                <div class="edit-bottom-left-btn" @click="goChongMoney">为TA充话费</div>
              </div>
              <div class="edit-bottom-right">
                <p class="edit-bottom-left-title">通用流量剩余</p>
                <div class="edit-bottom-left-amount edit-bottom-right-amount" v-if="!loadingFlag">
                  <div v-if="friendObj.flow != '' && !!friendObj.flow"><span class="num">{{friendObj.flow | formatFlow}}</span><span class="unit">{{friendObj.flow | formatFlowUnit}}</span></div>
                  <div v-else class="abnormal" @click="displaydetails(headInfo.obj, headInfo.index, headInfo.friendIndex)">--</div>
                </div>
                <Loading v-if="loadingFlag"></Loading>
                <div class="edit-bottom-left-btn" @click="goChongFlow">为TA充流量</div>
              </div>
            </div>
          </div>
        </div>

        <div class="addPayChild-bottom">添加家人，查询、代缴TA的话费和流量！</div>
      </div>
    </header>
    <div class="me-groups">
      <div class="me-groups-top">
        <h3 class="me-groups-title">我的群组</h3>
        <div class="me-groups-more" @click="goAllGroups"><span>查看全部社交群组</span><span class="me-groups-toright"></span></div>
      </div>
      <div class="me-groups-bottom">
        <div class="me-groups-list">
          <swiper :options="swiperOption" ref="mySwiper1" v-if="!loginFlag">
            <swiper-slide v-for="(item, index) in groupsLists" :key="index">
              <MeGroups v-for="(it, ind) in item" :key="ind" :item="it" @goOneGroup="goOneGroup" @refresh="refreshGroups"></MeGroups>
            </swiper-slide>
            <div class="swiper-pagination" :class="groupsLists.length > 1 ? '' : 'hidden'"  slot="pagination"></div>
          </swiper>
          <swiper :options="swiperOption" ref="mySwiper1" v-else>
            <swiper-slide v-for="(item, index) in groupsLists" :key="index">
              <MeGroups v-for="(it, ind) in item" :key="ind" :item="it" @goOneGroup="goOneGroup"></MeGroups>
            </swiper-slide>
          </swiper>
          <div class="me-groups-info"></div>
        </div>
      </div>
      <main class="main-container">
        <div class="main-mb" v-for="(item,index) in mainContent" :key="index">
          <div class="mb-top" v-if="item.isShow == '1'">
            <h3 class="mb-title">{{item.areaName}}</h3>
            <ViewAll v-if="item.isMore == '1'" :item="item" @goMoreClick="goMoreClick"></ViewAll>
          </div>
          <Mb5 v-if="item.areaName == '智慧家庭' && parseFloat(userInfo.version) >= 5.5"></Mb5>
          <div class="mb-bottom" v-for="(val,ind) in item.floorList" :key="ind">
            <ul class="mb1" v-if="val.templetCode == '1'">
              <Mb1 v-for="(value, i) in val.adverList" :key="i" :value="value" @commonClick = "commonClick"></Mb1>
            </ul>
            <ul class="mb3" v-if="val.templetCode == '2'">
              <Mb3 v-for="(value, i) in val.adverList" :key="i" :value="value" @commonClick = "commonClick"></Mb3>
            </ul>
            <div v-if="val.templetCode == '3'">
              <ul class="mb2" v-if="val.templetShowType == '1'">
                <Mb2 v-for="(value, i) in val.adverList" :key="i" :value="value" @commonClick = "commonClick"></Mb2>
              </ul>
              <ul class="mb4" v-if="val.templetShowType == '2'">
                <Mb4 v-for="(value, i) in val.adverList" :key="i" :value="value" @commonClick = "commonClick"></Mb4>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
    <LoginBox v-if="loginFlag"></LoginBox>
  </div>
</template>

<script>
import MeGroups from './components/meGroups.vue'
import ViewAll from './components/viewAll.vue'
import Mb1 from './components/mb1.vue'
import Mb2 from './components/mb2.vue'
import Mb3 from './components/mb3.vue'
import Mb4 from './components/mb4.vue'
import Mb5 from './components/mb5.vue'
import AddContact from './components/addContact.vue'
import LoginBox from './components/login.vue'
import Loading from './components/loading'
import { Swiper, Slide } from 'vue-swiper-component'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

import { leadeon_MsgBox, leadeon_Toast } from 'utils/leadeon-ui'
import { getUserStatus, getUserInfo, encryptString, showLogin, openNewPage, powerJump, overTime, getQueryString } from 'utils/common'
import { getFamilyList, getMySocialGroups, getPublicGroups, getContentMan, getFriendChargeFlow, modifyNickname, deleteFriends, getPhoto } from './getDate'
export default {
  components: {
    ViewAll,
    MeGroups,
    Mb1,
    Mb2,
    Mb3,
    Mb4,
    Mb5,
    AddContact,
    LoginBox,
    Loading,
    swiper, swiperSlide
  },
  props: {},
  data () {
    return {
      userInfo: {}, // 用户的会话信息
      editFlag: true, // 用户的编辑input按钮
      infoFlag: false, // 用户的流量话费信息弹窗
      maskFlag: false, // 遮罩按钮
      xiugaiFlag: false, // 修改的按钮
      nickNameFlag: false, // 昵称修改的匹配
      addFriendsFlag:  false, // 不是好友的时候点击匹配
      loginFlag: false,   // 登陆弹窗是否显示
      displayLeaderGroupFlag: false, // 群组区域显示  1代表领导版 2代表大众版且配置在二级页面 其他表示在大众版在一级页面
      loadingFlag: true,    // 用户流量话费信息的等待效果开关
      phoneNumber: '', // 用户的登陆手机号码
      photoImg: '../public/images/100.png', // 用户自己的客户端头像
      familyLists: [[
        {'nickName': '老爸','status': ""},
        {'nickName': '老妈','status': ""},
        {'nickName': '宝贝','status': ""},
        {'nickName': '添加','status': "77"}
      ]], // 好友亲密关系数据 二维数组
      familyArr: [], // 好友亲密关系数据 一维数组
      groupsLists: [[
        {'groupName': '家庭群组', 'groupSource': '1'},
        {'groupName': '群组', 'isOpening': '22'},
        {'groupName': '群组', 'isOpening': '22'},
        {'groupName': '添加群组', 'isOpening': '77'}
      ]], // 群组的数据
      friendObj: {}, // 流量话费信息弹窗的对象
      lastNickName: '', // 提交前的nickName
      mainContent: '', // 页面的主要数据
      telNo: null, // 加密的手机号
      UID: null, // uid
      headInfo: '', // 用户的头像信息
      swiperOption: {
        notNextTick: true,
        autoplay: false,
        observer: true,
        observeParents:true,
        pagination: {
          el: '.swiper-pagination'
        }
      },
      defaultArray: [
        {
          "groupName": "群组",
          "groupSource": "mr",
          "isOpening": "22",
        },
        {
          "groupName": "添加群组",
          "groupSource": "TT",
          "isOpening": "77",
        },
        {
          "groupSource": "mr",
          "isOpening": "44",
          "localtion": '1'
        },
        {
          "groupSource": "mr",
          "isOpening": "44",
        }
      ]
    }
  },
  watch: {},
  filters: {
    formatFlow(flowNum) {
      let num = flowNum
      if (flowNum == '') {
        return '--'
      }
      if (Number(flowNum) > 1024) {
        num = (Number(flowNum) / 1024).toFixed(2)
      }
      return num
    },
    formatFlowUnit(flowNum) {
      if (Number(flowNum) > 1024) {
        return 'G'
      } else {
        return 'MB'
      }
    },
    formatPhone(phone) {
      return String(phone).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }
  },
  mounted() {
    let _this = this
    leadeon.init = function() {
      _this.init()
    }
    // this.getFamilyLists()
    // this.getFamilygroups()
    // this.getMainContent()
  },
  methods: {
    // 初始化
    async init() {
      this.judgeGroupsArea()
      let res = await getUserStatus()
      this.userInfo = await getUserInfo()
      this.getMainContent()
      if (res.status == 0) {
        this.loginFlag = true
      } else {
        this.loginFlag = false
        this.telNo = await encryptString(this.userInfo.phoneNumber)
        this.phoneNumber = this.userInfo.phoneNumber
        this.UID = this.userInfo.token.match(/UID=\w+/g)[0]
        this.getFamilyLists()
        this.getSelfPhoto()
        this.refreshGroups()
      }
    },
    // 是否展示我的群组区域 1代表领导版 2代表大众版且配置在二级页面 其他表示在大众版在一级页面
    judgeGroupsArea() {
      if (getQueryString('groupsAreaIsshow') == '1') {
         this.displayLeaderGroupFlag = '1'
      } else if (getQueryString('groupsAreaIsshow') == '2') {
         this.displayLeaderGroupFlag = '2'
      }
    },
    // 接口失败刷新群组接口
    refreshGroups() {
      if (this.displayLeaderGroupFlag == '1') {
        this.getFamilygroups()
      } else {
        this.getFamilyPublicGroups()
      }
    },
    // 获取亲密人列表
    async getFamilyLists() {
      let _this = this
      let data = await getFamilyList(_this.userInfo, {
        cellNum: _this.telNo
      })
      if (!!data && data.retCode == '000000' ) {
        let list =  data.rspBody.friendsList
        list.push({
          "friendsCellNum": "添加好友",
          "nickName": "添加",
          "status": "77",
          "addType": "TT"})
        // let length = Math.ceil(Number(list.length) / 4)
        // for (let i = 0; i < length; i ++) {
        //   let arr = new Array()
        //   arr = list.slice(i * 4, (i + 1) * 4)
        //   this.familyLists.push(arr)
        // }
        _this.familyArr = list
        _this.familyLists = this.getArray(list)
      } else if (/^4\d{5}$/.test(data.retCode)) {
        overTime()
      } else {
        leadeon_MsgBox({
          msg: data.retDesc,
          confirmText: '知道了'
        })
      }
    },
    // 获取二维数组
    getArray (arr) {
      let newArr = []
      var length = Math.ceil(Number(arr.length) / 4)
      for (let i = 0; i < length; i ++) {
        let arr2 = new Array()
        arr2 = arr.slice(i * 4, (i + 1) * 4)
        newArr.push(arr2)
      }
      return newArr
    },
    // 公共的群组列表处理
    commonGroups(arr) {
      let list =  arr
      if (list.length <= 0) {
        list.push(this.defaultArray[0], this.defaultArray[0], this.defaultArray[0])
      } else if (list.length == 1){
        list.push(this.defaultArray[0], this.defaultArray[0])
      } else if (list.length == 2){
        list.push(this.defaultArray[0])
      }
      return list
    },
    // 群组获取失败展示
    failGetGroups() {
      let arr = []
      arr.push(this.defaultArray[2], this.defaultArray[3], this.defaultArray[3], this.defaultArray[1])
      this.groupsLists = this.getArray(arr)
    },
    // 获取自身头像
    async getSelfPhoto () {
      var _this = this
      let data = await getPhoto(_this.userInfo, {
        cellNum: _this.phoneNumber || '9999',
        confType: '2',
        photoCode: '100'
      })
      if (!!data && data.retCode == '000000') {
        if (!!data.rspBody.photoCode && data.rspBody.photoCode != '') {
          _this.photoImg = '../public/images/' + data.rspBody.photoCode + '.png'
        }
      } else if (/^4\d{5}$/.test(data.retCode)) {
        overTime()
      } else {
        leadeon_MsgBox({
          msg: data.retDesc,
          confirmText: '知道了'
        })
      }
    },
    // 获取群组接口
    async getFamilygroups() {
      let _this = this
      let data = await getMySocialGroups(_this.userInfo, {
        cellNum: _this.phoneNumber
      })
      if (!!data && data.retCode == '000000' ) {
        let list1 = _this.commonGroups(data.rspBody.group)
        list1.push(_this.defaultArray[1])
        _this.groupsLists = _this.getArray(list1)
      } else if (/^4\d{5}$/.test(data.retCode)) {
        overTime()
      } else {
        _this.failGetGroups()
        // leadeon_MsgBox({
        //   msg: data.retDesc,
        //   confirmText: '知道了'
        // })
      }
    },
    // 获取大众版的群组接口
    async getFamilyPublicGroups() {
      let _this = this
      let data = await getPublicGroups(_this.userInfo, {
        cellNum: _this.phoneNumber
      })
      if (!!data && data.retCode == '000000') {
        let list2 = _this.commonGroups(data.rspBody.group)
        if (data.rspBody.group.length <= 20) {
          list2.push(_this.defaultArray[1])
        }
        _this.groupsLists = _this.getArray(list2)
      } else if (/^4\d{5}$/.test(data.retCode)) {
        overTime()
      } else {
        _this.failGetGroups()
        // leadeon_MsgBox({
        //   msg: data.retDesc,
        //   confirmText: '知道了'
        // })
      }
    },
    // 获取亲密人流量与话费
    async getChargeFlow(obj, index, friendIndex) {
      let _this = this
      _this.loadingFlag = true
      _this.friendObj = {
        nickName: obj.nickName,
        addType: obj.addType,
        code: obj.code,
        phoneNumber: obj.friendsCellNum,
        index: index,
        friendIndex: friendIndex,
        oldNickName: obj.nickName
      }
      let phoneNumber = await encryptString(obj.friendsCellNum)
      let data = await getFriendChargeFlow(_this.userInfo, {
        cellNum: _this.telNo,
        friendsCellNum: phoneNumber,
        isSendSms: obj.isSendSms,
        channelCode: _this.userInfo.channel,
        imei: _this.userInfo.imei
      })
      if (!!data && data.retCode == '000000') {
        let body1 = data.rspBody.firendsInfo
        _this.loadingFlag = false
        _this.$set(_this.friendObj, 'money', body1.feeBalance)
        _this.$set(_this.friendObj, 'flow', body1.flowBalance)
      } else if (/^4\d{5}$/.test(data.retCode)) {
        overTime()
      } else {
        _this.loadingFlag = false
        leadeon_MsgBox({
          msg: data.retDesc,
          confirmText: '知道了'
        })
      }
    },
    // 修改亲密人信息
    async xiugaiNickMing() {
      let _this = this
      let phoneNumber = await encryptString(_this.friendObj.phoneNumber)
      let data = await modifyNickname(_this.userInfo, {
        cellNum: _this.telNo,
        friendsCellNum: phoneNumber,
        nickName: _this.friendObj.nickName,
        code: _this.friendObj.code,
        AddType: _this.friendObj.addType
      })
      if (!!data && data.retCode == '000000') {
        if (data.rspBody.result == '1') {
          leadeon_Toast('修改成功')
          _this.familyLists[_this.friendObj.friendIndex][this.friendObj.index].nickName = _this.friendObj.nickName
          _this.infoFlag = false
          _this.maskFlag = false
        } else {
          leadeon_Toast('修改失败')
        }
      } else if (/^4\d{5}$/.test(data.retCode)) {
        overTime()
      } else {
        leadeon_MsgBox({
          msg: data.retDesc,
          confirmText: '知道了'
        })
      }
    },
    // 删除亲密人的接口
    async deleteFriend() {
      let _this = this
      let phoneNumber = await encryptString(_this.friendObj.phoneNumber)
      let data = await deleteFriends(_this.userInfo, {
        cellNum: _this.telNo,
        friendsCellNum: phoneNumber,
        flag: "1",
        AddType: _this.friendObj.addType
      })
      if (!!data && data.retCode == '000000') {
        _this.deleteContact()
      } else if (/^4\d{5}$/.test(data.retCode)) {
        overTime()
      } else {
        leadeon_MsgBox({
          msg: data.retDesc,
          confirmText: '知道了'
        })
      }
    },
    // 获取页面的主要内容
    async getMainContent() {
      let _this = this
      let data = await getContentMan(_this.userInfo, {
        provinceCode: _this.userInfo.province || '9999',
        cityCode: _this.userInfo.city || '0000',
        pageType: '1'
      })
      if (!!data && data.retCode == '000000') {
        _this.mainContent = data.rspBody.areaList
      } else if (/^4\d{5}$/.test(data.retCode)) {
        overTime()
      } else {
        leadeon_MsgBox({
          msg: data.retDesc,
          confirmText: '知道了'
        })
      }
    },
    // 添加好友
    addqinmiPeople (obj) {
      this.cancelAdd()
      this.familyArr.unshift(obj)
      this.familyLists = this.getArray(this.familyArr)
    },
    // 主页的信息跳转
    commonClick(obj) {
      // 空对像为插码的数据，还没提供
      powerJump(this.userInfo, obj, this.UID, this.telNo, {
        adverType: '516',
        type: '',
        funCode: '',
        wtCode: '',
        pageCode: ''
      })
    },
    // 点击亲密付头像展示明细
    displaydetails(obj, index, friendIndex) {
      let _this = this
      if (_this.loginFlag) {
        showLogin()
        return
      }
      _this.editFlag = true
      if (obj.status != '77') {
        if (obj.status != '0') {
          if (index % 4 == 0) {
            document.querySelector('.trange').style.left = '4.202667rem'
          } else if (index % 4 == 1) {
            console.log(document.querySelector('.trange'))
            document.querySelector('.trange').style.left = '6.72rem'
          }  else if (index % 4 == 2) {
            document.querySelector('.trange').style.left = '9.237333rem'
          }  else if (index % 4 == 3) {
            document.querySelector('.trange').style.left = '11.754667rem'
          }
          if (obj.status == '1') {
            _this.infoFlag = true
            _this.maskFlag = true
            _this.headInfo = {
              obj: obj,
              index: index,
              friendIndex: friendIndex
            }
            _this.getChargeFlow(obj, index, friendIndex)
          } else {
            _this.maskFlag = true
            _this.addFriendsFlag = true
            _this.friendObj = {
              nickName: obj.nickName,
              phoneNumber: (/[\d]{11}/gi).test(obj.friendsCellNum) ? obj.friendsCellNum : '',
              addType: obj.addType,
              code: obj.code
            }
          }
        }
      } else {
        _this.maskFlag = true
        _this.addFriendsFlag = true
        _this.friendObj = {}
      }
    },
    // 点击遮罩
    cancelInfo() {
      this.infoFlag = false
      this.maskFlag = false
      this.addFriendsFlag = false
    },
    // 编辑图标点击
    editNickName() {
      this.editFlag = false
      this.lastNickName = this.friendObj.nickName
      if (this.friendObj.nickName.length > 0) {
        this.xiugaiFlag = true
      }
    },
    // 修改昵称点击取消事件
    quxiaoEditNickName() {
      this.editFlag = true
      this.friendObj.nickName = this.friendObj.oldNickName
    },
    // 修改昵称失去焦点
    xiugaiNickName() {
      let Symbol = /^[\u4e00-\u9fa5a-zA-Z0-9`~!@#$%^&*()_+<>?:"{},.\/;'[\]]+$/g;
      if (symbol.test(_this.friendObj.nickName) && this.friendObj.nickName.length > 0) {
        this.nickNameFlag = true
      } else {
        if (this.friendObj.nickName.length <= 0) {
          leadeon_Toast('昵称不能为空')
        } else {
          leadeon_Toast('昵称有特殊字符')
        }
      }
    },
    // 修改昵称input事件
    judgeNickName() {
      this.friendObj.nickName = this.friendObj.nickName.replace(/[`~!@#$%^&*()_+<>?:"{},./;'[\]]|\s/gim, '')
      if (this.friendObj.nickName.length > 0) {
        this.xiugaiFlag = true
      } else {
        this.xiugaiFlag = false
      }
    },
    // 修改按钮点击
    xiugaiClick() {
      if (this.xiugaiFlag && this.friendObj.nickName != this.lastNickName) {
        this.xiugaiNickMing()
      } else {
        if (this.friendObj.nickName.length <= 0) {
          leadeon_Toast('昵称不能为空')
        } else {
          leadeon_Toast('昵称未修改')
        }
      }
    },
    // 点击为他冲流量
    goChongFlow() {
      let _this = this
      openNewPage({url: 'https://app.10086.cn/leadeon-flow/pages/flow/payFlow.html?mobileNo=' + _this.friendObj.phoneNumber})
    },
    // 点击为他冲话费
    goChongMoney() {
      let _this = this
      openNewPage({url: 'https://app.10086.cn/leadeon-cmcc-static/v2.0/pages/recharge/recharge.html?mobileNo=' + _this.friendObj.phoneNumber})
    },
    // 点击查看全部群组
    goAllGroups() {
      if (this.loginFlag) {
        showLogin()
        return
      }
      let pageUrl = ''
      let timestamp = new Date().getTime()
      if (this.displayLeaderGroupFlag == '1') {
        pageUrl = window.location.href.substr(0, window.location.href.indexOf('family')) + 'family/mySocial.html'
      } else {
        let listUrl = 'http://touch.10086.cn/hd/qgqqw/' + this.userInfo.loginProvince + '.html'
        let targetChannelID = '12012'
        if (window.location.href.indexOf('-test') > -1) {
          listUrl = 'http://m.mall.178.139.com/hd/qgqqw/' + this.userInfo.loginProvince + '.html'
          targetChannelID = '12010'
        }
        pageUrl = 'https://login.10086.cn/AppSSO.action?targetChannelID=' + targetChannelID + '&TransactionID=1563643634916939496&' + this.userInfo.token.match(/UID=\w+/g)[0] + '&targetUrl=' + encodeURIComponent(listUrl) + '&timeStamp=' + timestamp
      }
      if (this.displayLeaderGroupFlag == '1' || this.displayLeaderGroupFlag == '2') {
        window.location.href = pageUrl
      } else {
        openNewPage({url: pageUrl})
      }
    },
    // 点击查看某一个群组
    goOneGroup(item) {
      console.log(item)
      if (this.loginFlag) {
        showLogin()
        return
      }
      if (this.displayLeaderGroupFlag == '1') {
        let targetUrl = window.location.href.substr(0, window.location.href.indexOf('family')) + 'family/mySocial.html'
        if (item.isOpening != '22' && item.isOpening != '44') {
          if (item.isOpening == '77') {
            targetUrl += '?groupId=add&key=' + encodeURIComponent(window.location.href) + '#/group'
          } else {
            targetUrl += '?groupId=' + item.groupId + '#/groupList'
          }
          window.location.href = targetUrl
        }
      } else {
        let timestamp = new Date().getTime()
        let createUrl = 'http://touch.10086.cn/hd/qgqqw/create.html'
        let jumpUrl = 'http://touch.10086.cn/hd/qgqqw/handle.html?group_id=' + item.groupId
        let targetChannelID = '12012'
        if (window.location.href.indexOf('-test') > -1) {
          createUrl = 'http://m.mall.178.139.com/hd/qgqqw/create.html'
          jumpUrl = 'http://m.mall.178.139.com/hd/qgqqw/handle.html?group_id=' + item.groupId
          targetChannelID = '12010'
        }
        let ssoUrl = 'https://login.10086.cn/AppSSO.action?targetChannelID=' + targetChannelID + '&TransactionID=1563643634916939496&' + this.userInfo.token.match(/UID=\w+/g)[0] + '&targetUrl='
        if (item.isOpening != '22' && item.isOpening != '44') {
          if (item.isOpening == '77') {
            ssoUrl += encodeURIComponent(createUrl) + '&timestamp=' + timestamp
          } else {
            ssoUrl += encodeURIComponent(jumpUrl) + '&timestamp=' + timestamp
          }
          if (this.displayLeaderGroupFlag == '2') {
            window.location.href = ssoUrl
          } else {
            openNewPage({url: ssoUrl})
          }
        }
      }
    },
    // 点击查看更多
    async goMoreClick(item) {
      if (item.isMoreType == '1') {
        openNewPage({url: item.skipUrl})
      } else if (item.isMoreType == '2') {
        let res = await getUserStatus()
        if (item.isMoreLoginType == '1') { //强制登录
          if (res.status == 0) { //未登录
            showLogin(); //拉起登录
          } else { //已登录
            this.areaListJump(item, item.isMoreLoginType, item.skipUrl); //进行跳转前的逻辑处理
          }
        } else if (item.isMoreLoginType == '2') { //非强制登录
          this.areaListJump(item, item.isMoreLoginType, item.skipUrl); //进行跳转前的逻辑处理
        }
      }
    },
    areaListJump(item, loginType, URL) {
      let isSso = item.isMoreIsSso; //是否SSO 1：是；0：否
      let ssoUrl = item.isMoreSsoUrlAddr; //URL传参地址
      let paramList = this.getParamList(item.isMoreParamList); //参数列表
      let questionMarkIndex = URL.indexOf("?"); //？首次出现的位置
      let paramListUrl = this.getParamListUrl(paramList, userInfo); //参数拼接
      if (isSso == 0) { //非sso再进行这个操作
          //判断URL有没有问号，若没有则第一个参数前为？，若有则是&
        if (questionMarkIndex == -1) { //没有问号
            URL += '?'; //加上问号
            paramListUrl = paramListUrl.substring(1); //去掉前面的&
        } else if (URL.substring(questionMarkIndex) == '?') {
            paramListUrl = paramListUrl.substring(1); //去掉前面的&
        }
      }
      if (loginType == 1) { //强制登录
        if (isSso == 1) { //已登录并且是SSO，SSO地址+正常地址+参数+时间戳
          let timestamp = new Date().getTime(); //若是sso跳转，则要加上时间戳
          let URL1 = ssoUrl + URL + paramListUrl + "&timestamp=" + timestamp;
        } else { //已登录且不是SSO，正常地址+参数
          let URL1 = URL + paramListUrl;
        }
      } else if (loginType == 2) { //非强制登录，正常地址+参数
        let URL1 = URL + paramListUrl;
      }
      if (URL != '') {
        openNewPage({url: URL1}) //打开新页面,busiType:2,funCode:DF016
      }
    },
    /**
     * 转换参数
     */
    getParamList(data) {
        var string = '';
        for (var i = data.length - 1; i >= 0; i--) {
            string += data[i].paramId + '-';
        }
        string = string.substring(0, string.length - 1);
        return string;
    },
    /**
     * 拼装url参数
     * @param {Object} paramList  //处理后的url需要拼接的参数集合
     * @param {Object} clientInfo  //客户端json对象
     */
    getParamListUrl(paramList, clientInfo) {
      let arr = paramList.split('-');
      let paramListUrl = '';
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == 'UID') {
          paramListUrl += '&' + clientPage.uid;
        } else if (arr[i] == 'provinceCode') {
          paramListUrl += '&provinceCode=' + clientInfo.province;
        } else if (arr[i] == 'cityCode') {
          paramListUrl += '&cityCode=' + clientInfo.city;
        } else if (arr[i] == 'clientVer') {
          paramListUrl += '&clientVer=' + clientInfo.version;
        } else if (arr[i] == 'devType') {
          paramListUrl += '&devType=' + clientInfo.st;
        } else if (arr[i] == 'clientId') {
          paramListUrl += '&clientId=' + clientInfo.clientID;
        } else if (arr[i] == 'scnType') {
          paramListUrl += '&scnType=' + clientInfo.sp;
        } else if (arr[i] == 'telNo') {
          paramListUrl += '&telNo=' + clientPage.telNo;
        } else {
          paramListUrl += '&' + arr[i] + '=no' //每一项都没有那么都带上no
        }
      }
      return paramListUrl;
    },
    // 删除亲密人
    deleteEditBox() {
      // 'msg', 'confirmText', 'showCancelBtn', 'cancelText', 'cancelFn', 'confirmFn'
      let _this = this
      leadeon_MsgBox({
        msg: '确定要解除与该号码的好友关系吗',
        confirmText: '删除',
        showCancelBtn: true,
        cancelText: '取消',
        confirmFn: _this.deleteFriend
      })
    },
    // 删除事件
    deleteContact() {
      this.familyLists[this.friendObj.friendIndex].splice(this.friendObj.index, 1)
      let list1 = []
      let length1 = ''
      for (let i = 0; i < this.familyLists.length; i ++) {
        list1.push(...this.familyLists[i])
      }
      this.familyLists = []
      length1 = Math.ceil(Number(list1.length) / 4)
      for (let j = 0; j < length1; j ++) {
        let arr = new Array()
        arr = list1.slice(j * 4, (j + 1) * 4)
        this.familyLists.push(arr)
      }
      console.log(this.familyLists)
      this.infoFlag = false
      this.maskFlag = false
    },
    // 添加亲密付联系人取消
    cancelAdd() {
      this.maskFlag = false
      this.addFriendsFlag = false
    }
  }
}
</script>
<style lang="scss">
@import 'swiper/dist/css/swiper.css';
@import './assets/familyIndex-sprite.scss';


@font-face{
  font-family: 'DINCondensed-Bold';
  src : url('./assets/font/ParaType-DINCondensed.otf');
}
.back{
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
body,h1,h2,h3,h4,h5,h6{
  line-height: 1;
}
.hidden{
  display: none!important;
}
.family-container{
  width: 100%;
  height: auto;
  box-sizing: border-box;
  background-color: #f6f6f6;
  .addPay-container{
    width: 100%;
    height: 310px;
    background-image: url('./assets/header_bg.png');
    padding-top: 88px;
    .addPay-center{
      width: 690px;
      height: 184px;
      border-radius: 20px;
      box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.08);
      background-color: #fff;
      margin: 0 auto;
      position: relative;
      .addPayChild-top{
        width:100%;
        height: 180px;
        display: flex;
        padding: 0 20px 0 30px;
        position: absolute;
        top: -70px;
        left: 0;
        .addPayChild-me{
          height: auto;
          text-align: center;
          margin-right: 30px;
          .addPayChild-me-img{
            width: 144px;
            height: 144px;
          }
          .addPayChild-me-word{
            line-height: 36px;
          }
        }
        .wh_content{
          height: 278px;
          .wh_indicator{
            width: 750px;
            left: -216px;
          }
        }
        .addPayChild-other{
          width: 112px;
          height: auto;
          text-align: center;
          position: relative;
          margin-right: 6px;
          margin-top: 32px;
          .addPayChild-other-img{
            @include sprite('other');
          }
          .addPayChild-add-img{
            @include sprite('add-people');
          }
          .addPayChild-has-img{
            @include sprite('has');
          }
          .addPayChild-wait-img{
            @include sprite('wait');
          }
        }
        .addPayChild-other:nth-child(4n) {
          margin-right: 0;
        }
        .addPayChild-me-word,.addPayChild-other-word{
          font-size: 24px;
          color:#333;
          line-height: 36px;
        }
        .addPayChild-other-wordColor1{
          color:#bbb;
        }
        .mask{
          position: fixed;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          top:0;
          left:0;
          z-index: 9996;
        }
        .edit-container{
          width: 600px;
          height: 433px;
          position: absolute;
          left: 45px;
          top: 198px;
          border-radius: 18px;
          padding: 0 44px;
          background-color: #fff;
          z-index: 9998;
          .trange{
            position: absolute;
            width:0px;
            height: 0px;
            border-left:18px solid transparent;
            border-right:18px solid transparent;
            border-bottom: 18px solid #fff;
            top: -18px;
            left: 197px;
          }
          .trange:after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            border-left: 18px solid transparent;
            border-right: 18px solid transparent;
            border-bottom: 18px solid #fff;
            position: absolute;
            margin-left: -18px;
            z-index: -1;
            filter: blur(1px);
          }
          .left, .edit-top{
            display: flex;
            align-items:center;
            justify-content: space-between;
            height:118px;
          }
          .edit-top{
            width: 100%;
            height: 118px;
            border-bottom: 1px solid #e9e9e9;
            .edit-nickname,.edit-phone{
              color: #333;
              font-size: 30px;
            }
            .edit-nickname{
              font-size: 34px;
              max-width: 220px;
              padding:5px 0px;
            }
            .edit-sign{
              @include sprite('edit');
              margin: 0 8px 0 16px;
            }
            .delete-sign{
              @include sprite('delete');
            }
            .edit-left{
              display: flex;
              flex-direction: column;
              align-self: flex-end;
              margin-bottom: 10px;
              padding-left: 6px;
              input{
                max-width: 220px;
                height: auto;
                font-size: 34px;
                color:#333;
                outline: none;
                border:none;
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
              span{
                font-size: 18px;
                color: #bbbbbb;
                margin-top:6px;
              }
            }
            .edit-right{
              font-size: 30px;
              color: #dddddd;
              display: flex;
              align-items: center;
              margin-top: 5px;
              .edit-quxiao{
                height: 100%;
                color:#00a4ff;
              }
              .edit-xiugai{
                height: 100%;
              }
              .edit-xiugaiActive{
                color:#00a4ff;
              }
              .line{
                width: 1PX;
                height: 24px;
                background: #7fd1ff;
                margin:0 20px;
              }
            }
          }
          .edit-bottom{
            width:100%;
            height: 315px;
            display: flex;
            .edit-bottom-left,.edit-bottom-right{
              width:50%;
              height: 100%;
              padding-top:48px;
              padding-bottom:56px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              .edit-bottom-left-title{
                color:#999999;
                font-size: 24px;
              }
              .edit-bottom-left-amount{
                color: #333;
                margin: 28px 0 38px;
                flex-shrink: 0;
                .num{
                  font-size: 52px;
                  font-family: 'DINCondensed-Bold';
                  color: #333;
                }
                .unit{
                  font-size: 26px;
                  font-family: 'DINCondensed-Bold';
                  color: #333;
                }
                .orangeNum {
                  color: #ff8172;
                  font-family: 'DINCondensed-Bold';
                }
                .abnormal{
                  font-size:56px;
                  color:#333;
                }
              }
              .edit-bottom-right-amount{
                color: #333;
              }
              .edit-bottom-left-btn{
                width: 184px;
                height: 56px;
                background-image: linear-gradient(0deg,
                  #2892ff 0%,
                  #53c4ff 100%),
                linear-gradient(
                  #00a4ff,
                  #00a4ff);
                background-blend-mode: normal,
                  normal;
                border-radius: 28px;
                line-height: 56px;
                text-align: center;
                color: #f6f6f6;
                font-size: 24px;
              }
            }
          }
        }
      }
      .addPayChild-bottom{
        width:600px;
        height: 36px;
        background-color: #f9f9f9;
        border-radius: 18px;
        line-height: 36px;
        font-size: 24px;
        color:#bbb;
        text-align: center;
        position: absolute;
        bottom:20px;
        left:45px;
      }
    }
  }
  .me-groups{
    width:100%;
    height: auto;
    .me-groups-top{
      width: 100%;
      height: 74px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px 0 40px;
      background-color: #fff;
      .me-groups-title{
        font-size: 34px;
        color: #333333;
        font-weight: 700;
      }
      .me-groups-more{
        width: 256px;
        height: 40px;
        justify-content: center;
        align-items: center;
        display: flex;
        background-color: #f6f6f6;
        border-radius: 20px;
        color:#bbbbbb;
        font-size: 24px;
        .me-groups-toright{
          @include sprite('toright');
          margin-left: 10px;
        }
      }
    }
    .me-groups-bottom{
      width:100%;
      height: 280px;
      background-color: #fff;
      position: relative;
      .me-groups-list{
        height: 100%;
      }
      .me-groups-info{
        @include sprite('groupInfo');
        margin:0 auto;
        position: absolute;
        bottom: 38px;
        left: 51px;
      }
    }
  }
  .main-container{
    width:100%;
    height: auto;
    .main-mb{
      width:100%;
      height: auto;
      margin-top: 20px;
      padding-top: 20px;
      padding-bottom: 30px;
      background: #fff;
      .mb-top{
        height: 74px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0 30px 0 40px;
        background-color: #fff;
        .mb-title{
          font-weight: 700;
          font-size: 34px;
          color: #333333;
          letter-spacing: -0.6px;
        }
      }
      .mb-bottom{
        width: 100%;
        height: auto;
      }
      .mb1{
        display: flex;
        background-color: #fff;
        // justify-content: space-between;
        flex-wrap: wrap;
      }
      .mb2{
        background-color: #fff;
      }
      .mb3{
        width: 100%;
        height: auto;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        background-color: #fff;
      }
      .mb4{
        width: 100%;
        height: auto;
        background-color: #fff;
      }
      .mb2, .mb4{
        padding: 10px 30px 22px;
      }
      .mb1, .mb3{
        padding: 0px 30px;
      }
    }
    .main-mb:last-child{
      padding-bottom:0px;
    }
    .main-mb:first-child{
      margin-top: 0px;
      padding-top: 0px;
    }
  }
}
.family-containernoLogin{
  padding-bottom: 98px;
  background: #fff;
}
.swiper-container{
  width: 100%;
  height: 280px;
  .swiper-slide{
    display: flex;
  }
  .swiper-pagination{
    height: 4px;
    width: 750px;
    display: flex;
    justify-content: center;
    bottom: 16px;
    left: -234px;
    .swiper-pagination-bullet{
      width: 16px;
      height: 100%;
      border-radius: 2px;
      background-color: #bbbbbb;
      margin: 4px;
    }
    .swiper-pagination-bullet-active{
        background-color: #00a4ff;
    }
  }
}
.me-groups-list .swiper-container{
  height: 100%;
  width: 100%;
  .swiper-pagination{
    left:0;
    bottom:20px;
  }
}
.mar20{
  margin-top: 20px;
  padding-top: 30px;
  background: #fff;
}
</style>
