<template>
  <b-container fluid class="d-flex flex-column h-100">
    <Header :title="lang.get('reset')"></Header>
    <b-row class="h-75">
      <b-col
        cols="12"
        ref="loginBody"
        class="d-flex flex-column h-auto w-50 p-4"
      >
        <b-form>
          <b-form-group
            :label="lang.get('mail') + ':'"
            label-for="mail"
            label-cols="12"
            label-cols-sm="3"
            v-show="!boolValidation"
          >
            <b-form-input
              id="mail"
              v-model.trim="mail"
              placeholder="输入邮箱获取验证码"
            ></b-form-input>
            <b-button variant="info" class=" mt-1" @click="GetMailValidation"
              >点击获取验证码</b-button
            >
          </b-form-group>
          <b-form-group
            :label="lang.get('Validation') + ':'"
            label-for="Validation"
            label-cols="12"
            label-cols-sm="3"
            description="输入验证码"
            v-show="boolValidation"
          >
            <b-form-input
              id="Validation"
              v-model.trim="Validation"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="lang.get('password') + ':'"
            label-for="passwd"
            label-cols="12"
            label-cols-sm="3"
            description="输入密码 建议密码超过8个字符"
            v-show="boolValidation"
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
            v-show="boolValidation"
          >
            <b-form-input
              id="passwd2"
              type="password"
              v-model.trim="passwd2"
              placeholder="Let us know your passwd. again"
            ></b-form-input>
          </b-form-group>
          <b-form-group class="p-3" v-show="boolValidation">
            <b-button @click="reset_submit" block variant="info">{{
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
import { MessageBox, Loading } from "element-ui";
import { GetMailValidation, Resetpasswd } from "../util/axios";
import { btoa } from "../util/tool";
import Header from "../components/Header";
export default {
  data() {
    return {
      passwd: "",
      passwd2: "",
      boolValidation: false,
      Validation: "",
      mail: ""
    };
  },
  components: {
    Header
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
    GetMailValidation() {
      let getmailLoading = Loading.service({ text: "正在获取验证码" });
      GetMailValidation({ mail: this.mail, user: "" })
        .then(({ code, msg }) => {
          getmailLoading.close();
          if (code != 200) return MessageBox.alert(msg, "info");
          this.boolValidation = true;
        })
        .catch(err => {
          getmailLoading.close();
          MessageBox.alert(err, "error");
        });
    },
    reset_submit() {
      let { Validation, passwd, passwd2, mail } = this.$data;
      if (Validation == "") return MessageBox.alert("验证码不能为空");
      if (passwd == "" || passwd2 == "")
        return MessageBox.alert("密码不能为空");
      if (passwd !== passwd2) return MessageBox.alert("两次输入密码不一致");
      let resetLoading = Loading.service({ text: "正在提交修改" });
      Resetpasswd({
        Validation: String(Validation),
        mail,
        passwd: btoa(passwd),
        passwdck: btoa(passwd2)
      })
        .then(({ code, msg }) => {
          setTimeout(() => {
            resetLoading.close();
            if (code != 200) return MessageBox.alert(msg, "info");
            MessageBox.confirm("重置成功，是否返回登录界面", msg, {
              type: "success"
            }).then(() => {
              this.$router.push("/");
            });
          }, 3000);
        })
        .catch(err => {
          resetLoading.close();
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
