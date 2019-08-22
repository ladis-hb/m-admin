/* jshint esversion:8 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BootstrapVue from "bootstrap-vue";
import VeLine from "v-charts/lib/line";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "element-ui/lib/theme-chalk/message-box.css";
import "element-ui/lib/theme-chalk/icon.css";

Vue.use(BootstrapVue);
Vue.component(VeLine.name, VeLine);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  //console.log(to);
  //console.log(from);
  let localUser = sessionStorage.getItem("user");
  //console.log(localUser);
  if (to.name != "Login" && !localUser) {
    next({ path: "/" });
  }
  if (to.name == "Devs" && !from.name) {
    next({ path: "/main" });
  }
  next();
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
