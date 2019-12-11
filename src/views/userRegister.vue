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
          >
            <b-form-input
              id="user"
              v-model.trim="user"
              :state="userState"
            ></b-form-input>
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
            <b-form-input
              id="mail"
              v-model.trim="mail"
              :state="MailState"
            ></b-form-input>
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
          </b-form-group>-->
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
            <b-button @click="register_submit" block variant="info">
              {{ $t("userRegister.c0u6wi") }}
            </b-button>
          </b-form-group>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { Loading } from "element-ui";
import { UserRegister } from "../util/axios";
import { btoa } from "../util/tool";
import Header from "../components/Header";
import gql from "graphql-tag";
export default {
  data() {
    return {
      name: "",
      user: "",
      passwd: "",
      passwd2: "",
      company: "",
      mail: "",
      tel: "",
      User: null,
      Mail: null
    };
  },
  components: {
    Header
  },
  computed: {
    userState() {
      return this.user == this.User ? false : true;
    },
    MailState() {
      return this.mail == this.Mail ? false : true;
    }
  },
  apollo: {
    User: {
      query: gql`
        query user($user: String) {
          User(user: $user) {
            user
          }
        }
      `,
      variables() {
        return { user: this.user };
      },
      update: data => (data.User == null ? null : data.User.user)
    },
    Mail: {
      query: gql`
        query mailStat($mail: String) {
          User(mail: $mail) {
            mail
          }
        }
      `,
      variables() {
        return {
          mail: this.mail
        };
      },
      update: data => (data.User == null ? null : data.User.mail)
    }
  },
  methods: {
    register_submit() {
      let { company, mail, passwd, passwd2, tel, user } = this.$data;
      if (user == "")
        return this.$MessageBox.alert(this.$t("userRegister.di0z0m"));
      if (passwd == "")
        return this.$MessageBox.alert(this.$t("userRegister.vl6hbl"));
      if (mail == "")
        return this.$MessageBox.alert(this.$t("userRegister.ln6jyb"));
      if (passwd !== passwd2)
        return this.$MessageBox.alert(this.$t("userRegister.t465uj"));
      let registerLoading = Loading.service({
        text: this.$t("userRegister.1lhcx9")
      });
      /* this.$apollo.mutate({
        mutation: gql`
          mutation userRegisterTo($arg: String) {
            userRegister(arg: $arg) {
              msg
              ok
            }
          }
        `,
        variables: {
          arg: JSON.stringify({ company, mail, passwd, passwd2, tel, user })
        }
      }); */
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
              return this.$MessageBox.alert(
                msg,
                this.$t("userRegister.b9rreb")
              );
            this.$MessageBox
              .confirm(this.$t("userRegister.kkmdbf"), msg, {
                type: "success"
              })
              .then(() => {
                this.$router.push("/");
              });
          }, 1000);
        })
        .catch(err => {
          registerLoading.close();
          this.$MessageBox.alert(err, "error");
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
