<template>
  <div>
    <div class="tips" @click="tipsHandle">
      <p v-if="childGroupSource == 1" class="bigtips">
        添加成员后邀请TA加入亲情网，成功开通业务后享受成员间国内语音互打免费<span class="double"></span>
      </p>
      <p v-if="childGroupSource == 2">
        开通亲情网业务,享受成员间国内语音互打免费<span class="double"></span>
      </p>
      <p v-if="childGroupSource == 0" @click.stop="cancelSelected" class="bigtips">
        勾选头像右下方<span class="no-check"></span>选择需要加入亲情网的成员。
      </p>
      <p v-if="childGroupSource == 3">
        享受成员间国内语音互打免费
      </p>
    </div>
    <div class="member-list">
      <div class="member-item" v-for='(item, index) in memberData' :key="index">
        <!-- 头像 -->
        <div @click="editMemberHandle(item)">
          <template v-if="item.memberSource == 1">
            <!-- 主号 -->
            <div class="main-member" v-if="item.memberType == 1"></div>
            <!-- 登录的群成员 -->
            <div class="my-member" v-else-if="item.memberType == 2 && item.memberFlag == 1 && (userInfo.phoneNumber == item.memberNum)"></div>
            <!-- 群成员 -->
            <div class="mem-member" v-else-if="item.memberType == 2 && item.memberFlag == 1"></div>
            <!-- 等待中成员 -->
            <div class="wait-member" v-else-if="item.memberType == 2 && item.memberFlag == 2 && groupMemberType == 1"></div>
          </template>
          <template v-if="item.memberSource == 2">
            <!-- 群主未开通 -->
            <div class="group-owner" v-if="item.memberType == 1"></div>
            <!-- 未开通的群成员 -->
            <div class="no-open" :class="item.selectedStatus" v-else-if="groupMemberType == 1" @click.stop="switchSelected(item)"></div>
          </template>
        </div>
        <!-- 昵称 -->
        <div class="nickname" v-if="groupMemberType == 1">
          <!-- 已开通群主昵称 -->
          <span v-if="item.memberType == 1 && item.memberSource == 1" class="black">我</span>
          <!-- 未开通群主昵称 -->
          <span v-else-if="item.memberType == 1">我</span>
          <!-- 已开通成员号昵称 -->
          <span v-else-if="item.memberSource == 1 && item.memberFlag == 1" class="black">{{item.memberName}}</span>
          <!-- 等待中或未开通昵称 -->
          <span v-else>{{item.memberName}}</span>
        </div>
        <!-- 手机号码 -->
        <!-- 我是主号 -->
        <template v-if="groupMemberType == 1">
          <div class="tel" @click="callPhone(item)">
            <i class="tel-icon" v-if="item.memberFlag == 1 && userInfo.phoneNumber !== item.memberNum"></i><span>{{item.memberNum}}</span>
          </div>
        </template>
        <!-- 我是成员号 -->
        <template v-if="groupMemberType == 2">
          <div class="tel" @click="callPhone(item)" v-if="item.memberFlag == 1">
            <i class="tel-icon" v-if="item.memberFlag == 1 && userInfo.phoneNumber !== item.memberNum"></i><span>{{item.memberNum}}</span>
          </div>
        </template>
      </div>
      <!-- 只有主卡才可以添加成员 -->
      <div class="member-item" @click.stop="addMember" v-if="groupMemberType != 2">
        <div class="add-member"></div>
        <div class="nickname"><span class="black">添加成员</span></div>
      </div>
    </div>
    <div class="submitBtn" :class="{'active':submitActive}" v-show="isAddMember" @click="submitHandle">提交</div>
    <!-- 开通提示 -->
    <!-- <div class="reminder-box" v-show="isShowReminder">
      <div class="reminder">
        <div class="reminder-top onepx">温馨提示</div>
        <div class="reminder-content">全国亲情网（自付版）基本功能费5元，由主号支付，群组内最多可另行添加18张成员号，添加一张成员号收成员费2元/张，由成员号自行支付，成员间国内语音互打免费，确认添加成员么？ </div>
        <div class="reminder-bottom">
          <div class="cancel" @click="isShowReminder = isAddMember = false">取消</div>
          <div class="cfm" @click="cfmOpening">确认开通</div>
        </div>
      </div>
    </div> -->
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
          <div class="cancel" @click="kownHandle">知道了</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { leadeon_Toast, leadeon_MsgBox } from 'utils/leadeon-ui'
import { mapState, mapActions } from 'vuex'
import { getQueryString, openNewPage, overTime } from 'utils/common'
import { bindMeber } from '../getData'

export default {
  inject: ['reload'], // 注入App.vue提供的provide的reload以来
  props: ['memberData', 'curGroupInfo', 'userInfo', 'groupMemberType'],
  data () {
    return {
      childGroupSource: 0,      // 群组来源
      isAddMember: false,       // 添加状态
      // isShowReminder: false, // 温馨提示
      submitSuccess: false,     // 提交提示
      submitActive: false       // 提交是否高亮
    }
  },
  computed: {
    ...mapState(['editMemberInfo', 'userInfo'])
  },
  created () {
    this.childGroupSource = this.curGroupInfo.groupSource;
    let isAllOpening = this.memberData.every((item) => { // 是否全部开通
      return item.memberFlag == 1
    })
    this.setSelected('')
    if ((!!isAllOpening && this.memberData.length != 1) || this.groupMemberType == 2) { // 成员号或者全部开通
      this.childGroupSource = 3;
    }
  },
  methods: {
    ...mapActions(['editMember', 'editGroup']),
    addMember () { // 添加成员
      this.$router.push({
        path: 'addMember'
      })
    },
    setSelected (state) { // 设置成员编辑状态 '' 无  'no-select' 未勾选  'selected' 选中
      // 给所有成员添加编辑的标识
      this.memberData.map((item) => {
        this.$set(item, 'selectedStatus', state)
      })
    },
    editMemberHandle (item) { // 编辑成员
      if (!this.isAddMember) { // 只有在不是添加副卡状态下才跳转编辑成员页面
        if (this.groupMemberType != 2 && this.userInfo.phoneNumber !== item.memberNum ) {
          this.editMember(item)
          this.editGroup(this.curGroupInfo)
          this.$router.push({
            path: 'editMember'
          })
        }
      }
    },
    tipsHandle () { // 提示信息
      if (this.childGroupSource == 1) { // 已开通亲情网业务
        if (this.memberData.length !== 1) {
          let isNoOpen = this.memberData.some((item) => {
            return item.memberFlag == 3
          })
          if (!!isNoOpen) { // 是否有未开通成员
            this.isAddMember = true
            this.childGroupSource = 0
            this.setSelected('no-select')
          } else {
            leadeon_Toast('请先添加成员，添加后才能邀请TA加入亲情网')
          }
        } else {
          leadeon_Toast('请先添加成员，添加后才能邀请TA加入亲情网')
        }
      }
      if (this.childGroupSource == 2) { // 未开通亲情网业务
        if (this.curGroupInfo.isOpening === '1') { // 办理中
          leadeon_Toast('业务已受理，请等待具体结果以短信为准')
        } else { // 去开通
          let pageUrl = window.location.href.substr(0, window.location.href.indexOf('family')) + 'family/familyIntroduce.html?groupId=' + this.curGroupInfo.groupId + '#/familynetworkchoose'
          openNewPage({url: pageUrl})
        }
      }
    },
    switchSelected (item) { // 选中状态切换
      if (!!this.isAddMember) {
        item.selectedStatus = item.selectedStatus == 'no-select' ? "selected" : "no-select"
        let selectedArr = this.memberData.filter((item) => {
          return item.selectedStatus === 'selected'
        })
        this.submitActive = selectedArr.length > 0 ? true : false
      } else {
        this.editMemberHandle(item)
      }
    },
    submitHandle () { // 开通副卡提交
      if (!!this.submitActive) {
        // 想要添加为副卡的成员集合
        let selectedArr = this.memberData.filter((item) => {
          return item.selectedStatus === 'selected'
        })
        let tempArr = []
        selectedArr.map((item) => {
          tempArr.push(item.memberNum)
        })
        // 选中的所有副卡手机号，逗号隔开
        this.bindMeberHandle(tempArr.join(','))
      }
    },
   /*  cfmOpening () { // 确认开通
      this.submitSuccess = true
      this.isShowReminder = false
    }, */
    callPhone (item) { // 拨打电话
      if (item.memberFlag == 1 && this.userInfo.phoneNumber !== item.memberNum) {
        leadeon.callPhone({
          phoneNum: item.memberNum,
          success: function(res) {},
          error: function(res) {}
        });
      }
    },
    async bindMeberHandle (cellNum) { // 绑定副卡
      let data = await bindMeber(this.userInfo, {
        cellNum: this.userInfo.phoneNumber,
        groupId: this.curGroupInfo.groupId,
        bindCellNums: cellNum
      });
      if (data.retCode === '000000') {
        this.submitSuccess = true
      } else if (/^4\d{5}$/.test(data.retCode)) {
        overTime()
      } else {
        leadeon_Toast(data.retDesc)
      }
    },
    kownHandle () { // 成功提示点击
      this.submitSuccess = this.isAddMember = false
      location.reload()
      // this.reload() // 提交成功刷新当前路由
    },
    cancelSelected () { // 取消添加副卡
      this.setSelected('')
      this.isAddMember = false;
      this.childGroupSource = 1;
      this.submitActive = false;
    }
  }
}
</script>
<style lang='scss'>
@import '../assets/mySocial-sprite.scss';
.tips{
  font-size: 28px;
  color: #8aa2af;
  background: #f6f8fa;
  border-radius: 10px;
  padding: 30px 45px;
  border: dashed 2px #8aa2af;
  margin: 48px 0;
  line-height: 1.3;
  .bigtips{
    height: 65px;
  }
  .double{
    display: inline-block;
    vertical-align: unset;
    margin-left: 14px;
    @include sprite('double')
  }
  .no-check{
    display: inline-block;
    margin: 0 6px;
    transform: translateY(4px);
    @include sprite('gou')
  }
}
.member-list{
  display: flex;
  flex-wrap: wrap;
  .member-item{
    width: 33.3333%;
    text-align: center;
    margin-bottom: 48px;
    .main-member{
      margin: 0 auto;
      position: relative;
      @include sprite('main');
    }
    .group-owner{
      margin: 0 auto;
      position: relative;
      @include sprite('owner');
    }
    .mem-member{
      margin: 0 auto;
      position: relative;
      @include sprite('member-open');
    }
    .wait-member{
      margin: 0 auto;
      position: relative;
      @include sprite('wait-member');
    }
    .my-member{
      margin: 0 auto;
      position: relative;
      @include sprite('my-member');
    }
    .no-open{
      margin: 0 auto;
      position: relative;
      box-sizing: border-box;
      @include sprite('member-noopen');
      &.no-select{
        transform: translateY(-1.4px);
        @include sprite('select-no')
      }
      &.selected{
        transform: translateY(-1.4px);
        @include sprite('selected')
      }
    }
    .add-member{
      margin: 0 auto;
      @include sprite('add-member')
    }
    .nickname{
      margin: 10px 0;
      color: #bbb;
      font-size: 24px;
      .black{
        color: #333;
      }
    }

    .tel{
      font-size: 22px;
      color: #bbb;
      .tel-icon{
        display: inline-block;
        margin-right: 5px;
        @include sprite('tel-icon')
      }
    }
  }

}
.submitBtn{
	width: 578px;
  font-size: 34px;
  padding: 27px 0 28px;
  color: #fff;
  text-align: center;
	background-image: linear-gradient(-90deg,#cccccc 1%,#dddddd 100%),linear-gradient(#ffffff,#ffffff);
	background-blend-mode: normal,normal;
	border-radius: 44px;
  margin: 12px auto 54px;
  &.active{
    background-image: linear-gradient(-90deg,#ff5e5e 0%,#ffa068 100%),linear-gradient(#ffffff,#ffffff);
  }
}
.reminder-box{
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
  .reminder{
    width: 580px;
    padding: 56px 50px;
    background-color: #ffffff;
    border-radius: 20px;
  }
  .reminder-top{
    width: 100%;
    padding: 0 0 37px;
    font-size: 34px;
    color: #333;
    text-align: center;
    &::before{
      border-bottom: 1px solid #e9e9e9;
    }
  }
  .reminder-content{
    font-size: 30px;
    color: #999;
    line-height: 42px;
    padding: 40px 10px 50px;
  }
  .reminder-bottom{
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
      color: #ff5555;
      background-image: linear-gradient(-90deg,rgba(255, 94, 94, 0.1) 0%,rgba(255, 160, 104, 0.1) 100%),linear-gradient(rgba(255, 255, 255, 0.1),rgba(255, 255, 255, 0.1));
    }
    .cfm{
      color: #fff;
      background-image: linear-gradient(-90deg,#ff5e5e 0%,#ffa068 100%),linear-gradient(#fff,#fff);
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
    color: #333;
    text-align: center;
    &::before{
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
