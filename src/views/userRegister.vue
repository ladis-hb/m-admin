<template>
  <b-container fluid class="d-flex flex-column h-100">
    <Header :title="$t('userRegister.c0u6wi')"></Header>
    <b-row class="h-75">
      <b-col
        cols="12"
        ref="loginBody"
        class="d-flex flex-column h-auto w-50 p-4"
      >
        <b-form>
          <b-form-group
            :label="$t('userRegister.1p5rbj')"
            label-for="name"
            label-cols="12"
            label-cols-sm="3"
          >
            <b-form-input
              id="name"
              v-model.trim="name"
              :placeholder="$t('userRegister.p56exu')"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="$t('userRegister.a0e9qc')"
            label-for="user"
            label-cols="12"
            label-cols-sm="3"
            :state="stateUser"
            :invalid-feedback="invalidFeedback"
          >
            <b-form-input id="user" v-model.trim="user"></b-form-input>
          </b-form-group>
          <b-form-group
            :label="$t('userRegister.w36psy')"
            label-for="passwd"
            label-cols="12"
            label-cols-sm="3"
            :description="$t('userRegister.v0u33p')"
          >
            <b-form-input
              id="passwd"
              type="password"
              v-model.trim="passwd"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="$t('userRegister.wpob65')"
            label-for="passwd2"
            label-cols="12"
            label-cols-sm="3"
            :description="$t('userRegister.4po0ur')"
          >
            <b-form-input
              id="passwd2"
              type="password"
              v-model.trim="passwd2"
              :placeholder="$t('userRegister.czkrmo')"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="$t('userRegister.4ncql6')"
            label-for="mail"
            label-cols="12"
            label-cols-sm="3"
            description=" $t('userRegister.8a6dev') "
          >
            <b-form-input id="mail" v-model.trim="mail"></b-form-input>
          </b-form-group>
          <!--  <b-form-group
            :label=" $t('userRegister.3yn9wn') "
            label-for="tel"
            label-cols="12"
            label-cols-sm="3"
          >
            <b-form-input
              id="tel"
              v-model.trim="tel"
              placeholder="Let us know your tel"
            ></b-form-input>
          </b-form-group> -->
          <b-form-group
            :label="$t('userRegister.qv34kf')"
            label-for="company"
            label-cols="12"
            label-cols-sm="3"
          >
            <b-form-input
              id="company"
              v-model.trim="company"
              placeholder="Let us know your company"
            ></b-form-input>
          </b-form-group>
          <b-form-group class="p-3">
            <b-button @click="register_submit" block variant="info">{{
              $t("userRegister.c0u6wi")
            }}</b-button>
          </b-form-group>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { MessageBox, Loading } from "element-ui";
import { UserRegister } from "../util/axios";
import { btoa } from "../util/tool";
import Header from "../components/Header";
export default {
  data() {
    return {
      name: "",
      user: "",
      passwd: "",
      passwd2: "",
      company: "",
      mail: "",
      tel: ""
    };
  },
  components: {
    Header
  },
  computed: {
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
    register_submit() {
      let { company, mail, passwd, passwd2, tel, user } = this.$data;
      if (user == "") return MessageBox.alert(this.$t("userRegister.di0z0m"));
      if (passwd == "") return MessageBox.alert(this.$t("userRegister.vl6hbl"));
      if (mail == "") return MessageBox.alert(this.$t("userRegister.ln6jyb"));
      if (passwd !== passwd2)
        return MessageBox.alert(this.$t("userRegister.t465uj"));
      let registerLoading = Loading.service({
        text: this.$t("userRegister.1lhcx9")
      });
      UserRegister({
        orgin: company,
        mail,
        passwd: String(btoa(passwd)),
        passwdck: String(btoa(passwd)),
        tel,
        name: String(name),
        user: String(user)
      })
        .then(({ code, msg }) => {
          setTimeout(() => {
            registerLoading.close();
            if (code != 200)
              return MessageBox.alert(msg, this.$t("userRegister.b9rreb"));
            MessageBox.confirm(this.$t("userRegister.kkmdbf"), msg, {
              type: "success"
            }).then(() => {
              this.$router.push("/");
            });
          }, 1000);
        })
        .catch(err => {
          registerLoading.close();
          MessageBox.alert(err, "error");
        });
    }
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
