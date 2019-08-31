<template>
  <b-container fluid class="m-0 p-0 h-100 d-flex flex-column overflow-hidden">
    <b-navbar
      toggleable="lg"
      type="dark"
      variant="info"
      sticky
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
    <div class=" overflow-auto h-100 clearfix">
      <transition>
        <keep-alive exclude="chartline">
          <router-view> </router-view>
        </keep-alive>
      </transition>
    </div>
    <b-nav fill class=" mt-auto bg-info">
      <b-nav-item :to="{ path: '/dev/ups' }">
        <span class="text-light">{{ lang.get("ups") }}</span>
      </b-nav-item>
      <b-nav-item :to="{ path: '/dev/ac' }">
        <span class="text-light">{{ lang.get("ac") }}</span>
      </b-nav-item>
      <b-nav-item :to="{ path: '/dev/power' }">
        <span class="text-light">{{ lang.get("power") }}</span>
      </b-nav-item>
      <b-nav-item :to="{ path: '/dev/io' }">
        <span class="text-light">{{ lang.get("io") }}</span>
      </b-nav-item>
      <b-nav-item :to="{ path: '/dev/th' }">
        <span class="text-light">{{ lang.get("th") }}</span>
      </b-nav-item>
    </b-nav>
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
}
.ber-m-3 {
  display: flex;
  flex-direction: column;
}
.nav-link {
  display: block;
  padding: 10px 0rem;
}
</style>
