<template>
  <li class="mb1-item" @click="commom" v-if="value.templetShowType == '2'">
    <img :src="value.imageUrl" alt="">
    <p class="mb1-title">{{value.markName}}</p>
  </li>
  <li class="mb1-item" @click="commom" v-else>
    <img :src="value.imageUrl" alt="">
  </li>
</template>

<script>
export default {
  name: 'Mb1',
  components: {},
  props: ['value'],
  data () {
    return {
    }
  },
  watch: {},
  mounted () {},
  methods: {
    commom() {
      this.$emit('commonClick', this.value)
    }
  }
}
</script>
<style lang="scss" scoped>
.mb1-item{
  width: 330px;
  height: 100%;
  margin: 10px 0 22px 30px;
  img{
    width: 330px;
    height: 160px;
    border-radius: 10px;
  }
  .mb1-title{
    color:#333;
    font-size: 28px;
    line-height: 60px;
    font-weight: 700;
    margin-left: 9px;
  }
}
.mb1-item:nth-child(2n + 1){
  margin-left: 0;
}
</style>
