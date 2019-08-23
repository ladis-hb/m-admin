/* jshint esversion:8 */
import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/login.vue";
//import Main from "./views/main.vue";
import Devs from "./views/devs.vue";
import Register from "./views/userRegister.vue";
import Reset from "./views/userReset.vue";
import Setting from "./views/Setting.vue";
import SetMain from "./views/Setting/SetMain.vue";
import SetUser from "./views/Setting/SetUser.vue";
import Alarm from "./views/Alarm.vue";

Vue.use(Router);

export default new Router({
  routes: [
    /* Home */
    {
      path: "/home",
      name: "Home",
      component: Home,
      children: [
        {
          path: "/main",
          name: "Main",
          component: () =>
            import(/* webpackChunkName: "Main" */ "./views/main.vue")
        },
        {
          path: "/dev/:id",
          name: "Devs",
          component: Devs
        },
        {
          path: "/line",
          name: "Line",
          component: () =>
            import(/* webpackChunkName: "Main" */ "./views/chartline.vue")
        }
      ]
    },
    /* login */
    {
      path: "/",
      name: "Login",
      component: Login
    },
    /* register */
    {
      path: "/register",
      name: "Register",
      component: Register
    },
    /* reset */
    {
      path: "/reset",
      name: "Reset",
      component: Reset
    },
    /* setting */
    {
      path: "/setting",
      name: "Setting",
      component: Setting,
      children: [
        {
          path: "/SetMain",
          name: "SetMain",
          component: SetMain
        },
        {
          path: "/SetUser",
          name: "SetUser",
          component: SetUser
        }
      ]
    },
    /* Alarm */
    {
      path: "/alarm",
      name: "Alarm",
      component: Alarm
    }
  ]
});
