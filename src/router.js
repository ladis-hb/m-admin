/* jshint esversion:8 */
import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/login.vue";
//import Main from "./views/main.vue";
//import Devs from "./views/devs.vue";
//import Register from "./views/userRegister.vue";
//import Reset from "./views/userReset.vue";

Vue.use(Router);

export default new Router({
  routes: [
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
          component: () =>
            import(/* webpackChunkName: "Devs" */ "./views/devs.vue")
        }
      ]
    },
    {
      path: "/",
      name: "Login",
      component: Login
    },
    {
      path: "/register",
      name: "Register",
      component: () =>
        import(/* webpackChunkName: "Register" */ "./views/userRegister.vue")
    },
    {
      path: "/reset",
      name: "Reset",
      component: () =>
        import(/* webpackChunkName: "Reset" */ "./views/userReset.vue")
    },
    {
      path: "/setting",
      name: "Setting",
      component: () =>
        import(/* webpackChunkName: "Setting" */ "./views/Setting.vue"),
      children: [
        {
          path: "/SetMain",
          name: "SetMain",
          component: () =>
            import(
              /* webpackChunkName: "SetMain" */ "./views/Setting/SetMain.vue"
            )
        },
        {
          path: "/SetUser",
          name: "SetUser",
          component: () =>
            import(
              /* webpackChunkName: "SetMain" */
              "./views/Setting/SetUser.vue"
            )
        }
      ]
    }
  ]
});
