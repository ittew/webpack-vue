<template>
  <li class="mb2-item" @click="commom">
    <img :src="value.imageUrl" alt="">
  </li>
</template>

<script>
export default {
  name: 'Mb2',
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
.mb2-item, .mb2-item img{
  width: 100%;
  height: 162px;
  border-radius: 8px;
}
</style>
