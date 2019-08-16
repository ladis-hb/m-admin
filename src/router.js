/* jshint esversion:8 */
import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/login.vue";
import Main from "./views/main.vue";
import Devs from "./views/devs.vue";
import Register from "./views/userRegister.vue";
import Reset from "./views/userReset.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      children: [
        { path: "/main", name: "Main", component: Main },
        { path: "/dev/:id", name: "Devs", component: Devs }
      ]
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/register",
      name: "Register",
      component: Register
    },
    {
      path: "/reset",
      name: "Reset",
      component: Reset
    }
  ]
});
