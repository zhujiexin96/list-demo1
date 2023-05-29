import router from '@/router'
import store from '@/store'

let win = window,
  ls = localStorage,
  navSpeed = 300;

let render = (to, from, next) => {
  to.meta.metaInfo && store.commit("CAHNGE_META_INFO", to.meta.metaInfo)
  next()
  store.commit('SAVE_LAST_PAGE', to.name)
}

let setT = (to, from, next) => {
  win.pageTimer = setTimeout(() => {
    render(to, from, next)
    clearT(win.pageTimer)
    console.log(`终止在`, to.name);
  }, 1000);
}

let clearT = (timer) => {
  clearTimeout(timer)
  timer = null;
}

// 路由层面防抖和管理vuex
let routerGo = () => {
  router.beforeEach((to, from, next) => {
    clearT(win.pageTimer)

    let now = (new Date).getTime(),
      last = +ls.getItem('pageTimeStamp'),
      dis = now - last;

    if (dis < navSpeed) {
      setT(to, from, next)
      console.log(`点击太快`, to.name);
    } else {
      render(to, from, next)
      console.log(`正常渲染`, to.name);
    }
    ls.setItem('pageTimeStamp', now)
  })
}

export default routerGo