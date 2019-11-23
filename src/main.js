/* jshint esversion:8 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BootstrapVue from "bootstrap-vue";
import VeLine from "v-charts/lib/line";
import VeGuage from "v-charts/lib/gauge";
import VueI18n from "vue-i18n";
import VueSocketIOExt from "vue-socket.io-extended";
import io from "socket.io-client";
import { Message, MessageBox } from "element-ui";
//import VeHistogram from "v-charts/lib/histogram";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/theme-chalk/message-box.css";
import "./assets/theme-chalk/icon.css";
import "./assets/icon/iconfont.css";
//socket.io
const socket = io("http://192.168.1.119:81");
Vue.use(VueSocketIOExt, socket, { store });

Vue.use(BootstrapVue);
Vue.component(VeLine.name, VeLine);
Vue.component(VeGuage.name, VeGuage);
//Vue.component(VeHistogram.name, VeHistogram);
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: "en",
  messages: {
    en: require("./locales/en.json"),
    zh: require("./locales/zh.json")
  }
});

Vue.prototype.$Message = Message;
Vue.prototype.$MessageBox = MessageBox;

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  /* console.log(to);
  console.log(from); */
  let localUser = sessionStorage.getItem("user");
  //console.log(localUser);
  if (to.name != "Login" && !localUser) {
    next({ path: "/" });
  }
  let r = ["ups", "power", "ac", "th", "Devs", "Line", "io"];
  if (r.includes(to.name) && !from.name) {
    next({ path: "/main" });
  }
  if (to.name == "Root") {
    if (localUser != "root" || !sessionStorage.getItem("token")) next();
  }
  next();
});
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount("#app");
