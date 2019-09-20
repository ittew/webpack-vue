<template>
  <div class="view-all" @click="goMore">
    <span>查看全部</span>
    <span class="view-all-img"></span>
  </div>
</template>

<script>
export default {
  name: 'ViewAll',
  components: {},
  props: ['item'],
  data () {
    return {
    }
  },
  watch: {},
  mounted () {},
  methods: {
    goMore() {
      this.$emit('goMoreClick', this.item)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../assets/familyIndex-sprite.scss';

.view-all{
  width: 156px;
  height: 40px;
  background-color: #f6f6f6;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  color:#bbb;
  .view-all-img{
    @include sprite('toright');
    margin-left:10px;
  }
}
</style>
