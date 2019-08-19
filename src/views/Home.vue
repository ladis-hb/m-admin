<template>
  <div>
    <b-navbar
      toggleable="lg"
      type="dark"
      variant="info"
      sticky
      class="navbar-m"
    >
      <b-navbar-brand :to="{ path: '/main' }" class="d-block"
        >Ladis</b-navbar-brand
      >
      <div class="navber-m-2">
        <div class="min-vw">
          <b-navbar-nav class="head-list overflow-auto">
            <b-nav-item :to="{ path: '/dev/ups' }" class="mr-3">
              <span class="text-light">{{ lang.get("ups") }}</span>
            </b-nav-item>
            <b-nav-item :to="{ path: '/dev/ac' }" class="mr-3">
              <span class="text-light">{{ lang.get("ac") }}</span>
            </b-nav-item>
            <b-nav-item :to="{ path: '/dev/power' }" class="mr-3">
              <span class="text-light">{{ lang.get("power") }}</span>
            </b-nav-item>
            <b-nav-item :to="{ path: '/dev/io' }" class="mr-3">
              <span class="text-light">{{ lang.get("io") }}</span>
            </b-nav-item>
            <b-nav-item :to="{ path: '/dev/th' }" class="mr-3">
              <span class="text-light">{{ lang.get("th") }}</span>
            </b-nav-item>
          </b-navbar-nav>
        </div>

        <div
          class="navber-m-3 float-right d-inline-flex flex-column head-right"
        >
          <b-navbar-toggle
            target="nav-collapse"
            class="float-right head-btn"
          ></b-navbar-toggle>
          <b-collapse id="nav-collapse" is-nav class="float-rigth mr-1">
            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto text-nowrap">
              <b-nav-item to="SetMain">
                <span class="text-light text-wrap"
                  ><i></i>{{ lang.get("DM") }}</span
                >
              </b-nav-item>
              <b-nav-item to="SetUser">
                <span class="text-light text-wrap"
                  ><i></i>{{ lang.get("UM") }}</span
                >
              </b-nav-item>
              <b-nav-item :to="{ path: '/reset' }">
                <span class="text-light">{{ lang.get("modify_pw") }}</span>
              </b-nav-item>
              <b-nav-item @click="loginOut">
                <span class="text-light">{{ lang.get("loginout") }}</span>
              </b-nav-item>
            </b-navbar-nav>
          </b-collapse>
        </div>
      </div>
    </b-navbar>
    <b-container>
      <keep-alive>
        <router-view> </router-view>
      </keep-alive>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { MessageBox } from "element-ui";
export default {
  computed: {
    ...mapState({ user: "user", token: "token" }),
    ...mapGetters({ lang: "lang" })
  },
  methods: {
    loginOut() {
      MessageBox.confirm("确定要退出登录吗？", "loginOut", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$emit("loginOut");
        this.$store.commit("loginOut");
        this.$router.push("/");
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .navbar-m {
    flex-direction: column;
  }
}
@media screen and (max-width: 375px) {
  .min-vw {
    max-width: 220px;
  }
}
.head-list {
  flex-direction: row;
  overflow: auto;
  white-space: nowrap;
}
.head-right {
  margin-left: auto;
}
.head-btn {
  max-width: 56px;
  margin-left: auto;
}
.navber-m-2 {
  display: flex;
  width: 100%;
}
.ber-m-3 {
  display: flex;
  flex-direction: column;
}
</style>
