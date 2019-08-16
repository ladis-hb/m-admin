<template>
  <b-container fluid class="d-flex flex-column h-100">
    <b-row>
      <b-col
        cols="12"
        ref="loginTitle"
        class="loginTitle bg-info d-flex flex-row align-items-center"
      >
        <span class="text-center text-light">{{ lang.get("registered") }}</span>
      </b-col>
    </b-row>
    <b-row class="h-75">
      <b-col
        cols="12"
        ref="loginBody"
        class="d-flex flex-column h-auto w-50 p-5"
      >
        <b-form>
          <b-form-group
            :label="lang.get('user') + ':'"
            label-for="user"
            label-cols="12"
            label-cols-sm="3"
            :state="stateUser"
            :invalid-feedback="invalidFeedback"
          >
            <b-form-input
              id="user"
              v-model.trim="user"
              placeholder="Let us know your name."
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="lang.get('password') + ':'"
            label-for="passwd"
            label-cols="12"
            label-cols-sm="3"
            description="输入密码 建议密码超过8个字符"
          >
            <b-form-input
              id="passwd"
              type="password"
              v-model.trim="passwd"
              placeholder="Let us know your passwd."
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="lang.get('password2') + ':'"
            label-for="passwd2"
            label-cols="12"
            label-cols-sm="3"
            description="再次输入密码"
          >
            <b-form-input
              id="passwd2"
              type="password"
              v-model.trim="passwd2"
              placeholder="Let us know your passwd. again"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="lang.get('mail') + ':'"
            label-for="mail"
            label-cols="12"
            label-cols-sm="3"
            description="邮箱将在找回密码，接受报警信息时使用"
          >
            <b-form-input
              id="mail"
              v-model.trim="mail"
              placeholder="Let us know your mail."
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="lang.get('tel') + ':'"
            label-for="tel"
            label-cols="12"
            label-cols-sm="3"
            description="将在报警时接收短信"
          >
            <b-form-input
              id="tel"
              v-model.trim="tel"
              placeholder="Let us know your tel"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="lang.get('company') + ':'"
            label-for="company"
            label-cols="12"
            label-cols-sm="3"
            description=""
          >
            <b-form-input
              id="company"
              v-model.trim="company"
              placeholder="Let us know your company"
            ></b-form-input>
          </b-form-group>
          <b-form-group class="p-3">
            <b-button @click="login_submit" block variant="info">{{
              lang.get("registered")
            }}</b-button>
          </b-form-group>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "",
  data() {
    return {
      user: "",
      passwd: "",
      passwd2: "",
      company: "",
      mail: "",
      tel: ""
    };
  },
  computed: {
    ...mapGetters(["lang"]),

    stateUser() {
      return false;
    },
    validFeedback() {
      return this.state === true ? "Thank you" : "";
    },
    invalidFeedback() {
      if (this.user.length > 4) {
        return "";
      } else if (this.user.length > 0) {
        return "Enter at least 4 characters";
      } else {
        return "Please enter something";
      }
    }
  },
  methods: {
    login_submit() {}
  }
};
</script>

<style lang="scss" scoped>
.loginTitle {
  height: 60px;
}
.login-left {
  margin-right: auto;
}
</style>
