<template>
  <b-container fluid class="d-flex flex-column h-100">
    <Header :title="$t('userReset.8qiebb')"></Header>
    <b-row class="h-75">
      <b-col
        cols="12"
        ref="loginBody"
        class="d-flex flex-column h-auto w-50 p-4"
      >
        <b-form>
          <b-form-group
            :label="$t('userReset.xrhvom')"
            label-for="mail"
            label-cols="12"
            label-cols-sm="3"
            v-show="!boolValidation"
          >
            <b-form-input
              id="mail"
              v-model.trim="mail"
              :placeholder="$t('userReset.f7dhuk')"
            ></b-form-input>
            <b-button variant="info" class=" mt-1" @click="GetMailValidation">{{
              $t("userReset.b2vyxw")
            }}</b-button>
          </b-form-group>
          <b-form-group
            :label="$t('userReset.wri8fr')"
            label-for="Validation"
            label-cols="12"
            label-cols-sm="3"
            :description="$t('userReset.kl6zyu')"
            v-show="boolValidation"
          >
            <b-form-input
              id="Validation"
              v-model.trim="Validation"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="$t('userReset.wjlttc')"
            label-for="passwd"
            label-cols="12"
            label-cols-sm="3"
            :description="$t('userReset.0z7jyr')"
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
            :label="$t('userReset.umca1s')"
            label-for="passwd2"
            label-cols="12"
            label-cols-sm="3"
            :description="$t('userReset.90fo75')"
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
              $t("userReset.8qiebb")
            }}</b-button>
          </b-form-group>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
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
      let getmailLoading = Loading.service({
        text: this.$t("userReset.7g996d")
      });
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
      if (Validation == "")
        return MessageBox.alert(this.$t("userReset.6kom8o"));
      if (passwd == "" || passwd2 == "")
        return MessageBox.alert(this.$t("userReset.ovan4l"));
      if (passwd !== passwd2)
        return MessageBox.alert(this.$t("userReset.kbavci"));
      let resetLoading = Loading.service({ text: this.$t("userReset.ghl67b") });
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
            MessageBox.confirm(this.$t("userReset.2jv9zj"), msg, {
              type: "success"
            }).then(() => {
              this.$router.push("/");
            });
          }, 1000);
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
