<template>
  <b-container fluid class="p-0 h-100">
    <b-navbar toggleable="lg" type="dark" variant="info" class="">
      <b-navbar-brand to="OnLine">工控后台管理</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="OnLine">Socket.IO状态</b-nav-item>
          <b-nav-item to="UserManage">用户管理</b-nav-item>
          <b-nav-item to="DeviceManage">设备管理</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item to="Main">主页</b-nav-item>

          <b-nav-item-dropdown :text="lang.get('user')" right>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item @click="loginout">{{
              lang.get("loginout")
            }}</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-row class=" d-flex flex-row w-100  m-0">
      <b-col cols="12">
        <b-container>
          <transition>
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </transition>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  computed: {
    ...mapState({ user: "user", token: "token" }),
    ...mapGetters({ lang: "lang" })
  },
  methods: {
    loginout() {
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      this.push({ name: "Login" });
    }
  }
};
</script>

<style lang="scss" scoped>
.main-h {
  position: absolute;
  width: 100%; //定位后脱离文档流   不自动继承父元素的宽高
  top: 56px;
  bottom: 0px;
}
</style>
