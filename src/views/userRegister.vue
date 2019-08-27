<template>
  <b-container fluid class="d-flex flex-column h-100">
    <Header :title="lang.get('registered')"></Header>
    <b-row class="h-75">
      <b-col
        cols="12"
        ref="loginBody"
        class="d-flex flex-column h-auto w-50 p-4"
      >
        <b-form>
          <b-form-group
            :label="lang.get('name') + ':'"
            label-for="name"
            label-cols="12"
            label-cols-sm="3"
          >
            <b-form-input
              id="name"
              v-model.trim="name"
              placeholder="默认与账号同名"
            ></b-form-input>
          </b-form-group>
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
            description="您的组织"
          >
            <b-form-input
              id="company"
              v-model.trim="company"
              placeholder="Let us know your company"
            ></b-form-input>
          </b-form-group>
          <b-form-group class="p-3">
            <b-button @click="register_submit" block variant="info">{{
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
    register_submit() {
      let { company, mail, passwd, passwd2, tel, user } = this.$data;
      if (user == "") return MessageBox.alert("账号不能为空！");
      if (passwd == "") return MessageBox.alert("密码不能为空");
      if (mail == "") return MessageBox.alert("邮箱不能为空");
      if (passwd !== passwd2) return MessageBox.alert("两次密码必须一致");
      let registerLoading = Loading.service({ text: "正在注册" });
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
            if (code != 200) return MessageBox.alert(msg, "注册错误");
            MessageBox.confirm("注册成功，是否返回登录界面", msg, {
              /* confirmButtonText: 'confirm',
              cancelButtonText: 'cancel', */
              type: "success"
            }).then(() => {
              this.$router.push("/");
            });
          }, 3000);
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
