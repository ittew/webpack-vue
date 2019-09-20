<template>
  <div class="me-groups-item" @click="goGroup">
    <div :class="item.isOpening == '77' ? 'me-groups-add-img' : item.isOpening == '22' ? 'me-groups-other-img' : item.isOpening == '44' ? 'me-groups-fail-img' :'me-groups-has-img'"></div>
    <p class="me-groups-title ellipsis" :class="item.isOpening == '22' ? 'me-groups-titleColor1' : ''" v-if="item.isOpening != '44'">{{item.groupName == '' || !item.groupName?'未命名':item.groupName}}</p>
    <div class="me-groups-title me-groups-title1" v-else >
      <span v-if="item.localtion == '1'">获取群组信息失败，请稍后再试</span>
      <div class="refresh" @click="refresh" v-if="item.localtion == '1'"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MeGroups',
  components: {},
  props: ['item'],
  data () {
    return {
    }
  },
  watch: {},
  mounted () {},
  methods: {
    goGroup() {
      this.$emit('goOneGroup', this.item)
    },
    refresh(e) {
      e.stopPropagation()
      this.$emit('refresh', this.item)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/familyIndex-sprite.scss';

.me-groups-item{
  width:25%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  .me-groups-other-img{
    @include sprite('groupsnopassed')
  }
  .me-groups-add-img{
    @include sprite('add-groups')
  }
  .me-groups-has-img{
    @include sprite('groupspassed')
  }
  .me-groups-fail-img{
    @include sprite('fail')
  }
  .me-groups-title{
    font-size: 24px;
    color:#333;
    line-height: 46px;
    width: 100%;
    text-align: center;
  }
  .me-groups-title1{
    display: flex;
    align-items: center;
    position: absolute;
    top: 128px;
    left: 50px;
    width: 750px;
    z-index: 998;
    .refresh{
      margin-left: 10px;
      @include sprite('refresh')
    }
  }
  .me-groups-titleColor1{
    color:#bbb;
  }
}
</style>
