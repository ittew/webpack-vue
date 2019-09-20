<template>
  <dix class="loading-box">
    <ul>
        <li></li>
        <li></li>
        <li></li>
    </ul>
  </dix>
</template>

<script>
export default {
  name: 'Loading',
  components: {},
  props: {},
  data () {
    return {
    }
  },
  watch: {},
  mounted () {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.loading-box{
  width: 42px;
  height: 16px;
  flex-shrink: 0;
  ul{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    li{
      width: 20px;
      height: 20px;
      background: rgba(204, 204, 204, 0.2);
      flex-shrink: 0;
      transform: scale(0.5);
      border-radius: 50%;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      animation: move1 1s linear 0.66s infinite;
    }
    li:nth-child(1){
      animation: move1 1s linear 1s infinite;
    }
    li:nth-child(2){
      animation: move1 1s linear 0.33s infinite;
    }
  }
}
@keyframes move1{
    0%{
        background: rgba(204, 204, 204, 0.2)
    }
    50%{
        background: rgba(204, 204, 204, 1)
    }
    100%{
        background: rgba(204, 204, 204, 0.2)
    }
}
</style>
