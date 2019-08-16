<template>
  <b-container fluid class="d-flex flex-column h-100">
    <b-row>
      <b-col
        cols="12"
        ref="loginTitle"
        class="loginTitle bg-info d-flex flex-row align-items-center"
      >
        <span class="text-center text-light">Ladis Login pages</span>
      </b-col>
    </b-row>
    <b-row class="h-75">
      <b-col
        cols="12"
        ref="loginBody"
        class="d-flex align-items-center justify-content-center h-auto"
      >
        <b-card class="shadow">
          <div class="d-flex flex-row-reverse flex-nowrap mb-4">
            <b-link class="m-1 ml-2 text-info" to="Reset">reset</b-link>
            <b-link class="m-1  text-info" to="Register">register</b-link>
            <h4 class="text-success login-left">login</h4>
          </div>
          <b-form>
            <b-form-group
              label="user:"
              label-for="user"
              label-cols="12"
              label-cols-sm="3"
              :state="stateUser"
              :invalid-feedback="invalidFeedback"
            >
              <b-form-input
                id="user"
                v-model.trim="user"
                placeholder=""
              ></b-form-input>
            </b-form-group>
            <b-form-group
              label="Passwd:"
              label-for="passwd"
              label-cols="12"
              label-cols-sm="3"
              description
            >
              <b-form-input
                id="passwd"
                type="password"
                v-model.trim="passwd"
                placeholder=""
              ></b-form-input>
            </b-form-group>
            <b-form-group
              label="记住用户:"
              label-for="keep_passwd"
              label-cols="4"
            >
              <b-form-checkbox
                id="keep_passwd"
                v-model="keep_passwd"
                class="py-2"
              ></b-form-checkbox>
            </b-form-group>
            <b-form-group class="p-3">
              <b-button
                id="login_submit"
                @click="login_submit"
                block
                variant="info"
                >login<span></span
              ></b-button>
            </b-form-group>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { Loading, MessageBox /* , Message, Notification */ } from "element-ui";
import { requestLogin } from "../util/axios";
import { btoa } from "../util/tool";

export default {
  name: "",
  data() {
    return {
      user: "",
      passwd: "",
      keep_passwd: false
    };
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
    login_submit() {
      if (this.user == "" || this.passwd == "") {
        MessageBox.alert("用户名或密码不能为空", "tip", {
          confirmButtonText: "确定"
        });
        return;
      }
      let loginLoading = Loading.service();
      let loginParams = {
        username: this.user,
        password: btoa(this.passwd)
      };
      requestLogin(loginParams)
        .then(res => {
          loginLoading.close();
          let { msg, code } = res;
          if (code !== 200) {
            MessageBox.alert(msg, "tip", {
              confirmButtonText: "确定"
            });
          } else {
            let { route, token, user } = res.data;
            this.$store.commit("setUser", { user, token });
            sessionStorage.setItem("user", user);
            sessionStorage.setItem("token", token);
            if (this.keep_passwd) {
              localStorage.setItem("keep_passwd", "1");
              localStorage.setItem("user", user);
            }
            this.$router.push(route);
          }
        })
        .catch(err => {
          MessageBox.alert(err, "Error");
        });
    }
  },
  mounted() {
    if (localStorage.getItem("keep_passwd") == "1") {
      //console.log(localStorage.getItem("user"));
      this.user = localStorage.getItem("user");
      this.keep_passwd = true;
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
