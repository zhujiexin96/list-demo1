import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import routerGo from './router/throttle.js'
import tool from "./utils/tool";
import AV from "./utils/AV"

Vue.prototype.$AV = AV;
Vue.prototype.$tool = tool
Vue.config.productionTip = false

// vue-meta
import VueMeta from 'vue-meta';
Vue.use(VueMeta);

import {
  Field,
  Picker,
  Popup,
  Button,
  Loading,
  List,
  Tab,
  Tabs,
  Cell,
} from 'vant';

Vue.use(Picker).use(Field).use(Popup).use(Button).use(Loading).use(List).use(Tab).use(Tabs).use(Cell);

// axios
import axios from 'axios'
axios.defaults.withCredentials = true
axios.defaults.timeout = 10000

const vp = Vue.prototype;
vp.$http = axios.create({
  headers: {
    // preset what you need
  }
})

let url = location.hash ? location.hash.split('#')[1] : location.href;
let urlData = tool.parseURL(url).params;
console.log("gUrlData", urlData);

// 已做节流处理
routerGo();

new Vue({
  router,
  store,
  metaInfo() {
    let metaInfo = this.$store.state.metaInfo;
    return {
      title: metaInfo.title,
      meta: [{
          name: "keywords",
          content: metaInfo.keywords
        },
        {
          name: "description",
          content: metaInfo.description
        },
        {
          itemprop: 'image',
          content: metaInfo.image
        },
        {
          itemprop: "name",
          content: metaInfo.name
        }
      ]
    }
  },
  render: h => h(App)
}).$mount('#app')