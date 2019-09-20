import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/groupList'
    }, {
      // 群组列表
      path: '/groupList',
      name: 'groupList',
      component: resolve => require(['../components/groupList.vue'], resolve) // vue按需加载
    }, {
      // 新建群组及编辑群组
      path: '/group',
      name: 'group',
      component: resolve => require(['../components/group.vue'], resolve) // vue按需加载
    }, {
      // 添加成员
      path: '/addMember',
      name: 'addMember',
      component: resolve => require(['../components/addMember.vue'], resolve) // vue按需加载
    }, {
      // 编辑成员
      path: '/editMember',
      name: 'editMember',
      component: resolve => require(['../components/editMember.vue'], resolve) // vue按需加载
    }
  ]
})
