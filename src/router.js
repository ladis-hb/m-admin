/* jshint esversion:8 */
import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
//import Login from "./views/login.vue";
//import Main from "./views/main.vue";
import Devs from "./views/devs.vue";
import Register from "./views/userRegister.vue";
import Reset from "./views/userReset.vue";
import Setting from "./views/Setting.vue";
import SetMain from "./views/Setting/SetMain.vue";
import SetUser from "./views/Setting/SetUser.vue";
import Alarm from "./views/Alarm.vue";
import chartline from "./views/chartline.vue";
import Root from "./views/root.vue";
//import OnLine from "./views/root/online.vue";
//import UserManage from "./views/root/UserManage.vue";
//import DeviceUPS from "./views/Device/UPS.vue";

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
          component: chartline
        },
        {
          path: "/Device/ups",
          name: "ups",
          component: () =>
            import(/* webpackChunkName: "Main" */ "./views/Device/UPS.vue")
        },
        {
          path: "/Device/power",
          name: "power",
          component: () =>
            import(/* webpackChunkName: "Main" */ "./views/Device/POWER.vue")
        },
        {
          path: "/Device/ac",
          name: "ac",
          component: () =>
            import(/* webpackChunkName: "Main" */ "./views/Device/AC.vue")
        },
        {
          path: "/Device/th",
          name: "th",
          component: () =>
            import(/* webpackChunkName: "Main" */ "./views/Device/TH.vue")
        },
        {
          path: "/Device/io",
          name: "io",
          component: () =>
            import(/* webpackChunkName: "Main" */ "./views/Device/IO.vue")
        }
      ]
    },
    /* login */
    {
      path: "/",
      name: "Login",
      component: () =>
        import(/* webpackChunkName: "Main" */ "./views/login.vue")
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
    },
    /* root */
    {
      path: "/root",
      name: "Root",
      component: Root,
      children: [
        {
          path: "/online",
          name: "OnLine",
          component: () =>
            import(/* webpackChunkName: "Main" */ "./views/root/online.vue")
        },
        {
          path: "/UserManage",
          name: "UserManage",
          component: () =>
            import(/* webpackChunkName: "Main" */ "./views/root/UserManage.vue")
        },
        {
          path: "/DeviceManage",
          name: "DeviceManage",
          component: () =>
            import(
              /* webpackChunkName: "Main" */ "./views/root/DeviceManage.vue"
            )
        }
      ]
    }
  ]
});
