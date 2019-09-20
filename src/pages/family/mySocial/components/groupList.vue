<template>
  <div class="main" v-if="isLoadEnd">
    <div class="group" v-if="groupInfo.length !== 0">
      <div class="item" v-for="(item, index) in groupInfo" :key="index">
        <div class="group-name-box">
          <div class="group-name">
            {{!item.groupName?'未命名':item.groupName}}
            <span class="edit" @click="groupHandle(item)"></span>
          </div>
        </div>
        <div class="group-categray" v-if="item.groupSource == 1">
          <span class="family categray">亲情网</span>
          <span class="major categray" v-if="item.memberType == 1">我是主号</span>
          <span class="member categray" v-if="item.memberType == 2">我是成员号</span>
        </div>
        <!-- 成员列表 -->
        <MemberList
          v-if="item.isOpen"
          :memberData="memberInfo"
          :curGroupInfo="item"
          :userInfo="userInfo"
          :userType="item.memberType"
          :groupMemberType="item.memberType">
        </MemberList>
        <div class="open" v-show="!item.isOpen" @click="switchAndGetMemberInfoData(item, 'open')"></div>
        <div class="menu" v-show="item.isOpen" @click="switchHandle(item, 'menu')">
          <!-- 操作菜单 -->
          <MenuBox
            @closeMenu="closeMenuHandle(item)"
            v-show="item.isShowMenu"
            :curGroupInfo='item'
            :userInfo="userInfo">
          </MenuBox>
        </div>
        <div class="retract" v-show="item.isOpen" @click="switchHandle(item, 'open')"></div>
      </div>
    </div>
    <div class="new-group" @click="groupHandle()">新建群组</div>
    <div class="mask" v-if="showMask" @click.stop="closeMask"></div>
  </div>
</template>

<script>
import MemberList from './memberList'
import MenuBox from './menuBox'
import { leadeon_Toast, leadeon_MsgBox } from 'utils/leadeon-ui'
import { recvUserInfo, showLogin, getQueryString, openNewPage, overTime } from 'utils/common'
import { getGroupInfo, getMemberInfo } from '../getData'
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      isLoadEnd: false,     // 是否请求完成
      groupInfo: [],        // 群组信息
      memberInfo: [],       // 成员信息
      curMemberInfo: null,  // 当前登录成员信息
      queryGroupId: '',     // 链接地址中的群组id
      showMask: false       // 是否显示遮罩
    }
  },
  components: {
    MemberList,
    MenuBox
  },
  computed: {
    ...mapState(['groupId', 'editGroupInfo', 'userInfo'])
  },
  mounted () {
    // console.log(this.userInfo)
  },
  created () {
    let _this = this
/*     leadeon.init = function () {
      _this.init()
    } */
    setTimeout(function(){
      _this.init()
    }, 400)
    console.warn(this.$route.query)
    if (!!getQueryString('groupId')) { // 家庭专区首页特定群组进入
      this.queryGroupId = getQueryString('groupId')
    } else if(this.$route.query.groupId){ // 用户操作后返回展开群组
      this.queryGroupId = this.$route.query.groupId
    }
  },
  methods: {
    ...mapActions(['editGroup']),
    async init () {
      let userInfoData = await recvUserInfo()
      this.$store.state.userInfo = userInfoData
      // console.log(this.userInfo);
      this.getGroupInfoData()
    },
    closeMask () { // 点击遮罩关闭遮罩和菜单menu
      this.showMask = false;
      this.groupInfo.map((item) => {
        if (!!item.isShowMenu) {
          item.isShowMenu = false
        }
      })
    },
    switchHandle (item, flag) { // 群组展开与菜单显示通用方法
      if (flag === 'open') {
        this.groupInfo.map((data) => {  // 关闭其他群组自己除外
          if (data.groupId !== item.groupId) {
            data.isOpen = false
          }
        })
        item.isOpen = !item.isOpen  // 群组展开与收起
        item.isShowMenu = false     // 收起群组同时关闭菜单menu
      } else if (flag === 'menu') {
        this.showMask = item.isShowMenu = !item.isShowMenu // 是否显示menu 和 遮罩
      }
    },
    async getGroupInfoData () {  // 获取群组信息
      let data = await getGroupInfo(this.userInfo, {cellNum: this.userInfo.phoneNumber});
      if (data.retCode === '000000') {
        this.isLoadEnd = true;
        this.groupInfo = data.rspBody.group
        this.groupInfo.map((item) => {
          this.$set(item, 'isOpen', false )      // 是否展开群组
          this.$set(item, 'isShowMenu', false)   // 是否显示菜单menu
          // 如果是家庭专区首页点击某个群组进入或在某个群组操作后 默认展开这个群组
          if (!!this.queryGroupId && this.queryGroupId == item.groupId || this.groupInfo.length === 1) {
            this.switchAndGetMemberInfoData(item, 'open')
          }
        })
      } else if (/^4\d{5}$/.test(data.retCode)) {
        overTime()
      } else {
        leadeon_Toast(data.retDesc)
      }
    },
    async switchAndGetMemberInfoData (item, flag) { // 获取群成员信息
      let reqBody = {
        cellNum: this.userInfo.phoneNumber,
        groupId: item.groupId
      }
      let memberInfoData = await getMemberInfo(this.userInfo,reqBody)
      if (memberInfoData.retCode === '000000') {
        this.memberInfo = memberInfoData.rspBody.memberInfo
        this.memberInfo.map(() => {
          if (this.userInfo.phoneNmuber = item.memberNum) {
            this.curMemberInfo = item
          }
        })
        this.switchHandle(item, flag)
        this.editGroup(item)
      } else if (/^4\d{5}$/.test(data.retCode)) {
        overTime()
      } else {
        leadeon_Toast(data.retDesc)
      }
    },
    groupHandle (item) { // 新建群组或编辑群组
      if (!!item) {
        this.editGroup(item)
      } else {
        this.editGroup(null)
      }
      this.$router.push({
        path: 'group'
      })
    },
    closeMenuHandle (item) { // 关闭menu菜单 和 遮罩
      this.showMask = item.isShowMenu = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/mySocial-sprite.scss';
.main {
  padding: 40px 30px 40px;
  .item{
    width: 100%;
    background: #fff;
    padding: 55px 42px 55px 38px;
    box-shadow: 0px 4px 16px 0px #e9e9e9;
    border-radius: 20px;
    position: relative;
    margin-bottom: 32px;
    .group-name-box{
      //  border: 1px solid #000;
      .group-name{
        font-size: 34px;
        color: #333;
        max-width: 512px;
      }
      .edit{
        display: inline-block;
        vertical-align: middle;
        margin-left: 18px;
        margin-top: -4px;
        @include sprite('edit')
      }
    }
    .open{
      position: absolute;
      right: 45px;
      top: 56px;
      @include sprite('open')
    }
    .retract{
      position: absolute;
      bottom:0;
      left: 50%;
      transform: translateX(-50%);
      @include sprite('retract')
    }
    .menu{
      position: absolute;
      right: 45px;
      top: 56px;
      z-index: 101;
      @include sprite('menu-icon')
    }
    .group-categray{
      margin-top: 24px;
      font-size: 0;
      .categray{
        height: 36px;
        border-radius: 18px;
        color: #fff;
        font-size: 24px;
        padding: 6px 19px 7px 18px;
        display: inline-block;
        margin-right: 24px;
      }
      .family{
        background-image: linear-gradient(-48deg,#ff5e5e 0%,#ffa068 100%),linear-gradient(#dddddd,#dddddd);
        background-blend-mode: normal,normal;
      }
      .major{
        background-image: linear-gradient(-48deg,#3a68ff 1%,#3b9cff 100%),linear-gradient(#dddddd,#dddddd);
        background-blend-mode: normal,normal;
      }
      .member{
        background-image: linear-gradient(-48deg,#625779 0%,#70748a 100%),linear-gradient(#dddddd,#dddddd);
        background-blend-mode: normal,normal;
      }
    }

  }
  .new-group{
    width: 100%;
    height: 100px;
    background-color: #ffffff;
    box-shadow: 0px 4px 16px 0px #e9e9e9;
    border-radius: 20px;
    line-height: 100px;
    text-align: center;
    color: #00a4ff;
    font-size: 34px;
  }
}
.mask{
  position: fixed;
  left:0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba(0, 0, 0, 0);
}
</style>
