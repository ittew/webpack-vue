<template>
  <div class="group-wrapper">
    <div class="group-box">
      <div class="inp-box onepx">
        <input type="text" class="group-name" placeholder="输入群组名称" maxlength="12" autofocus v-focus
        v-model="groupName" @input="checkName"/>
        <p class="clear" @click="groupName = ''" v-show="groupName.length >= 1" ></p>
      </div>
      <div class="text-num">{{groupName.length}}/12</div>
      <div class="operation" :class="{'active': this.groupName.length >= 1 }" @click="createGroup" >{{operationText}}</div>
    </div>
  </div>
</template>
<script>
import { newGroup, modifyGroupName } from '../getData'
import { mapState, mapActions } from 'vuex'
import { leadeon_MsgBox, leadeon_Toast } from 'utils/leadeon-ui'
import { getQueryString, openNewPage, recvUserInfo, overTime } from 'utils/common'
export default {
  data () {
    return {
      groupName: '',          // 群组名称
      initGroupInfo: null,    // 修改的群组信息
      operationText: '创建',  // 操作按钮文字
      userInfo: null,         // 用户信息
      homeEnter: false,       // 是否从家庭专区首页进入
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
  created () {
    // 获取需要编辑的群组信息
    if (!!this.editGroupInfo) {
      this.groupName = !this.editGroupInfo.groupName ? '未命名' : this.editGroupInfo.groupName;
      this.groupId = this.editGroupInfo.groupId;
      this.operationText = '修改'
    }
    // 获取用户信息
    let _this = this
    setTimeout(async function(){
      _this.userInfo = await recvUserInfo()
    }, 400)
    // 是否从家庭专区首页进入
    if (!!getQueryString('groupId') && getQueryString('groupId') === 'add') {
      this.homeEnter = true
    }
  },
  methods: {
    async createGroup () {  // 新建或修改群组
      // console.log(this.userInfo, '+++++++++++++++++++++')
      if (this.groupName.length >= 1) {
        let reqBody = null;
        let result = null;
        if (this.operationText === '创建') {
          reqBody = {
            cellNum: this.userInfo.phoneNumber,
            groupName: this.groupName
          }
          result =  await newGroup(this.userInfo, reqBody)
        } else {
          reqBody = {
            cellNum: this.userInfo.phoneNumber,
            niceName: this.groupName,
            groupId: this.editGroupInfo.groupId,
            operateType: '1'
          }
          result =  await modifyGroupName(this.userInfo, reqBody)
        }
        if (result.retCode === '000000') {
          if (this.operationText === '创建') {
             leadeon_Toast('创建成功')
          } else {
             leadeon_Toast('修改成功')
          }
          setTimeout(() => {
            if (!!this.homeEnter) { // 首页进入新建群组返回
              let pageUrl = decodeURIComponent(getQueryString('key'))
              openNewPage({url: pageUrl})
            } else if(this.editGroupInfo){ // 编辑群组后返回展开群组标识
              this.$router.push({
                path: 'groupList',
                query: {
                  groupId: this.editGroupInfo.groupId
                }
              })
            } else { // 新建群组
              this.$router.push({
                path: 'groupList'
              })
            }
          },800)
        } else if (/^4\d{5}$/.test(result.retCode)) {
          overTime()
        } else {
          leadeon_Toast(result.retDesc)
        }
      }
    },
    checkName () { // 群组名称校验
      this.groupName = this.groupName.replace(/[^\u4e00-\u9fa5_a-zA-Z0-9]+/gim, '') // 数字及特殊字符替换
    }
  }
}
</script>
<style lang='scss'>
@import '../assets/mySocial-sprite.scss';
.group-wrapper {
  padding: 40px 30px 0;
  .group-box{
    padding: 65px 56px;
    background: #fff;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.05);
	  border-radius: 20px;
    .inp-box{
      padding: 24px 0;
      &::before{
        border-bottom: 1px solid #e9e9e9;
      }
      position: relative;
    }
    .group-name{
      font-size: 34px;
      color: #333;
      border: none;
      outline: none;
      width: 460px;
    }
    .clear{
      position: absolute;
      right: 0;
      top: 26px;
      @include sprite('clear')
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
