<template>
  <b-container fluid class="m-0 p-0 h-100 d-flex flex-column">
    <b-row no-gutters style="height:56px">
      <b-navbar
        toggleable="lg"
        type="dark"
        variant="info"
        fixed="top"
        class=" align-items-start"
      >
        <b-navbar-brand :to="{ path: '/main' }">Ladis</b-navbar-brand>
        <div class="navber-m-2 ml-auto">
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
                <b-nav-item :to="{ path: '/alarm' }">
                  <span class="text-light text-wrap"
                    ><i></i>{{ lang.get("AM") }}</span
                  >
                </b-nav-item>
                <b-nav-item :to="{ path: '/SetMain' }">
                  <span class="text-light text-wrap"
                    ><i></i>{{ lang.get("DM") }}</span
                  >
                </b-nav-item>
                <b-nav-item :to="{ path: '/SetUser' }">
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
    </b-row>
    <b-row no-gutters class="main-default main-page h-100 overflow-auto">
      <transition>
        <keep-alive exclude="chartline">
          <router-view> </router-view>
        </keep-alive>
      </transition>
    </b-row>
    <b-row no-gutters>
      <b-nav fill class="bg-info w-100">
        <b-nav-item :to="{ path: '/dev/ups' }">
          <span class="text-light">{{ lang.get("ups") }}</span>
        </b-nav-item>
        <b-nav-item :to="{ path: '/dev/ac' }">
          <span class="text-light">{{ lang.get("ac") }}</span>
        </b-nav-item>
        <b-nav-item :to="{ path: '/dev/power' }">
          <span class="text-light">{{ lang.get("power") }}</span>
        </b-nav-item>
        <b-nav-item :to="{ path: '/Device/io' }">
          <span class="text-light">{{ lang.get("io") }}</span>
        </b-nav-item>
        <b-nav-item :to="{ path: '/dev/th' }">
          <span class="text-light">{{ lang.get("th") }}</span>
        </b-nav-item>
      </b-nav>
    </b-row>
  </b-container>
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
.main-default {
  flex: 1 0 auto;
}
@media screen and (max-height: 330px) {
  .main-page {
    max-height: calc(100vh - 136px);
  }
}
.main-page {
  max-height: calc(100vh - 96px);
}
</style>
