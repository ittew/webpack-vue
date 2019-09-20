<template>
  <li class="mb3-item" @click="commom" v-if="value.templetShowType == '2'">
    <h3 class="mb3-mainTitle ellipsis">{{value.markName}}</h3>
    <p class="mb3-subTitle ellipsis">支持打电话，发短信</p>
    <div class="mb3-price">&yen;<span class="mb3-relPrice">3700</span>起</div>
    <img :src="value.imageUrl" alt="">
  </li>
  <li class="mb3-item1" @click="commom" v-else>
    <img :src="value.imageUrl" alt="">
  </li>
</template>

<script>
export default {
  name: 'Mb3',
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
.mb3-item{
  width:220px;
  height: 276px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  .mb3-mainTitle{
    color:#333;
    font-size: 22px;
    font-weight: 700;
    line-height: 26px;
  }
  .mb3-subTitle{
    color:#959496;
    font-size: 16px;
    margin:10px 0;
    width: 100%;
    line-height: 20px;
    padding: 2px 0px;
    text-align: center;
  }
  .mb3-price{
    width: auto;
    height: auto;
    background-color: #fe486f;
    border-radius: 20px;
    font-size:20px;
    color:#fff;
    margin-bottom: 20px;
    padding:0 6px;
    .mb3-relPrice{
      font-size: 28px;
    }
  }
  img{
    width:116px;
    height: 134px;
  }
}
.mb3-item1, .mb3-item1 img{
  width: 220px;
  height: 276px;
  border-radius: 10px;
}
.mb3-item1{
  margin: 10px 0 22px 15px;
}
.mb3-item1:nth-child(3n + 1){
  margin-left: 0;
}
</style>
