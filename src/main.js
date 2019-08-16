/* jshint esversion:8 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import BootstrapVue from "bootstrap-vue";
import VeLine from "v-charts/lib/line";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "element-ui/lib/theme-chalk/notification.css";
import "element-ui/lib/theme-chalk/loading.css";
import "element-ui/lib/theme-chalk/message-box.css";
import "element-ui/lib/theme-chalk/message.css";
import "element-ui/lib/theme-chalk/icon.css";

Vue.use(BootstrapVue);
Vue.component(VeLine.name, VeLine);

Vue.config.productionTip = false;
/* 
router.beforeEach((to, from, next) => {
  console.log(to);
  console.log(from);
  let localUser = sessionStorage.getItem("user");

  if (to.name == "Login" || to.name == "Register" || to.name == "Reset") {
    next();
  }
  if (to.name == "Main" && localUser) {
    console.log("to main");
    next();
  }
  if (to.name != "Main" && !from.name && !localUser) {
    next({ path: "/main" });
  }
});
 */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
