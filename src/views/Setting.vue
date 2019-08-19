<template>
  <b-container fluid class="d-flex flex-column h-100">
    <Header :title="lang.get('setting')"></Header>
    <b-row class="h-75">
      <b-col
        cols="12"
        ref="loginBody"
        class="d-flex flex-column h-auto w-50 p-4"
      >
        <router-view></router-view>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import Header from "../components/Header";
export default {
  data() {
    return {};
  },
  components: {
    Header
  },
  computed: {
    ...mapGetters(["lang"])
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.login-left {
  margin-right: auto;
}
</style>
