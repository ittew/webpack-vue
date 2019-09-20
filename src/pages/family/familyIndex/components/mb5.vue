<template>
  <!-- 上面一个下面俩个的模板 -->
  <div class="smartfamily">
      <div class="smart-top back">
        <div class="smartfamily-left"></div>
        <div class="smartfamily-right">
          <span class="smartfamily-qrCode" @click="qrCode"></span>
          <span class="smartfamily-buy" @click="buy"></span>
        </div>
      </div>
    </div>
</template>

<script>
import { openNewPage, goNativePage } from 'utils/common'
export default {
  name: 'Mb5',
  components: {},
  props: {},
  data () {
    return {
    }
  },
  watch: {},
  mounted () {},
  methods: {
    // 点击立即购买
    buy() {
      openNewPage({url: 'https://touch.10086.cn/hd/skin/413441/index.html'})
    },
    qrCode() {
      goNativePage('CF00600')
    }
  }
}
</script>
<style lang="scss" scoped>
.back{
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
body,h1,h2,h3,h4,h5,h6{
  line-height: 1;
}
.smartfamily{
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 0 30px 40px;
  background-color: #fff;
  .smart-top{
    width: 100%;
    height: 160px;
    background-image: url('../assets/meEquipment.png');
    display: flex;
    justify-content: space-between;
    .smartfamily-left{
      width: 50%;
    }
    .smartfamily-right{
      width: 230px;
      height: 100%;
      display: flex;
      margin-right: 30px;
      flex-wrap: wrap;
      .smartfamily-qrCode,.smartfamily-buy{
        width: 100%;
        height: 50%;
        flex-shrink: 0;
      }
    }
  }
}
</style>
