/* jshint esversion:8 */
import { socket_address } from "./config";
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
import VueApollo from "vue-apollo";
import ApolloClient from "apollo-boost";

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: "http://localhost:81/graphql"
});

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "./assets/theme-chalk/message-box.css";
import "./assets/theme-chalk/icon.css";
import "./assets/icon/iconfont.css";
//socket.io
Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient
});

const socket = io(socket_address);
Vue.use(VueSocketIOExt, socket, { store });

Vue.use(BootstrapVue);
Vue.component(VeLine.name, VeLine);
Vue.component(VeGuage.name, VeGuage);
//Vue.component(VeHistogram.name, VeHistogram);
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: "zh",
  messages: {
    en: require("./locales/en.json"),
    zh: require("./locales/zh.json")
  },
  //date本地化
  dateTimeFormats: require("./locales/dateTimeFormats")
});

Vue.prototype.$Message = Message;
Vue.prototype.$MessageBox = MessageBox;

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  let localUser = sessionStorage.getItem("user");
  if (to.name != "Login" && !localUser) next({ path: "/" });

  if (to.name == "Root") {
    if (localUser != "root" || !sessionStorage.getItem("token")) next();
  }
  next();
});
new Vue({
  i18n,
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount("#app");
