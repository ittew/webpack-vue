<template>
  <div class="login-caontainer">
    <span class="login-text">立即登录，查看更多家庭专区活动</span>
    <div class="login-box" @click="showLogin">登录</div>
  </div>
</template>

<script>
import { showLogin } from 'utils/common'
export default {
  name: 'LoginBox',
  components: {},
  props: {},
  data () {
    return {
    }
  },
  watch: {},
  mounted () {},
  methods: {
    showLogin() {
      showLogin()
    }
  }
}
</script>
<style lang="scss" scoped>
.login-caontainer{
  width: 100%;
  height: 98px;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px 0 40px;
  position: fixed;
  bottom:0;
  left:0;
  z-index:99;
  .login-text,.login-box{
    font-size: 30px;
    color:#fff;
  }
  .login-box{
    width: 134px;
    height: 56px;
    line-height: 56px;
    text-align: center;
    background-image: linear-gradient(-90deg,
		#8372ff 0%,
		#65cbff 100%),
	  linear-gradient(
		#ffffff,
		#ffffff);
	  background-blend-mode: normal, normal;
    border-radius: 28px;
  }
}
</style>
