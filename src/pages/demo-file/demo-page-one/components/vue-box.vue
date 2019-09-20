<template>
  <div class="test">
    <img src="../assets/vue.PNG" class="logo">
    <div class="stars">
      <span class="star1"></span>
      <span class="star2"></span>
      <span class="star3"></span>
      <span class="star4"></span>
      <span class="star5"></span>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped lang="scss">
@import '../assets/demo-page-one-sprite.scss';

.test {
  width: 100%;
  img {
    width: 186px;
  }
  .stars {
    margin: 20px auto;
    span {
      display: inline-block;
    }
    .star1 {
      @include sprite('star1')
    }
    .star2 {
      @include sprite('star2')
    }
    .star3 {
      @include sprite('star3')
    }
    .star4 {
      @include sprite('star4')
    }
    .star5 {
      @include sprite('star5')
    }
  }
}
</style>
