import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let ls = localStorage,
  ss = sessionStorage;

export default new Vuex.Store({
  state: {
    metaInfo: {
      title: "页面缺省标题",
      keywords: "关键字",
      description: "描述",
      image: 'https://dummyimage.com//100x100',
      name: "name"
    },
  },
  mutations: {
    CAHNGE_META_INFO(state, metaInfo) {
      let _metaInfo = Object.assign(state.metaInfo, metaInfo);
      state.metaInfo = _metaInfo;
    },
    SAVE_LAST_PAGE(state, page) {
      state.lastPage = page
    },
  },
  actions: {

  },
  modules: {
  }
})
