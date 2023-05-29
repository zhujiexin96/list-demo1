import Vue from 'vue'
import VueRouter from 'vue-router'

// 封装一个 _import, 便于splitChunks
const _import = require('./_import_' + process.env.NODE_ENV)

// 如果不需要splitChunks, 用同步组件
// const _import = require("./_import_development");

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/index',
      name: 'Home',
      component: _import('Home'),
      meta:{
        metaInfo: {
          title: "index",
          keywords: "index",
          description: "index",
          image: 'https://dummyimage.com//100x100',
          name: "name"
        },
      }
    },
    {
      path: '/about',
      name: 'About',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      component: _import('About'),
      meta: {
        metaInfo: {
          title: "about",
          keywords: "about",
          description: "about",
          image: 'https://dummyimage.com//100x100',
          name: "name"
        },
      }

    },
    {
      path:'/page2',
      name:'page2',
      component: _import('page2'),
      meta: {
        metaInfo: {
          title: "page2",
          keywords: "page2",
          description: "page2",
          image: 'https://dummyimage.com//100x100',
          name: "name"
        },
      }
    },
    {
      path: '/page3',
      name: 'page3',
      component: _import('page3'),
      meta: {
        metaInfo: {
          title: "page3",
          keywords: "page3",
          description: "page3",
          image: 'https://dummyimage.com//100x100',
          name: "name"
        },
      }
    },
    {
      path: "*",
      redirect: "/index"
    }
  ]
})

export default router
