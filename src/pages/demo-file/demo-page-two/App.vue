<template>
  <div id="app">
    <logo></logo>
    <h6>v{{ version }}</h6>
    <h1>{{ mas }}</h1>
    <vscode></vscode>
    <webpackBox></webpackBox>
    <vueBox></vueBox>
  </div>
</template>

<script>
import logo from '@/components/logo'
import vscode from '@/components/vscode'
import webpackBox from './components/webpack-box'
import vueBox from './components/vue-box'

import { host_boss } from 'utils/host'


export default {
  name: 'App',
  components: {
    logo,
    vscode,
    webpackBox,
    vueBox
  },
  data () {
    return {
      version: '1.0.0',
      mas: 'hello world'
    }
  },
  mounted() {
    console.log(host_boss)
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  h6 {
    font-size: 30px;
  }
  h1 {
    font-size: 50px;
  }
}
</style>
