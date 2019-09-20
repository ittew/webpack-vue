<template>
  <li class="mb4-item" @click="commom">
    <img :src="value.imageUrl" alt="">
    <p class="mb4-title ellipsis">{{value.markName}}</p>
  </li>
</template>

<script>
export default {
  name: 'Mb4',
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
.mb4-item{
  width: 100%;
  margin-bottom: 20px;
  img{
    width: 100%;
    height: 162px;
    border-radius: 10px;
  }
  .mb4-title{
    font-size: 28px;
    color: #333;
    line-height: 60px;
  }
}
</style>
