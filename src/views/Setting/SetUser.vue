<template>
  <b-container>
    <b-row>
      <b-col cols="12" sm="6">
        <separated :title="$t('Setting.SetUser.psn9e9')"></separated>
        <b-form>
          <b-form-group
            :label="$t('Setting.SetUser.1ia5ax')"
            label-cols="4"
            label-align="right"
            label-text-align="center"
          >
            <b-form-input
              plaintext
              id="user"
              v-model="accont.user"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="$t('Setting.SetUser.l01jlt')"
            label-cols="4"
            label-align="right"
            label-text-align="center"
          >
            <b-form-input
              id="name"
              v-model="accont.name"
              @click="modify_user_info('name')"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="$t('Setting.SetUser.yargs3')"
            label-cols="4"
            label-align="right"
            label-text-align="center"
          >
            <b-form-input
              id="mail"
              v-model="accont.mail"
              @click="modify_user_info('mail')"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="$t('Setting.SetUser.dfu5fs')"
            label-cols="4"
            label-cols-sm="4"
            label-align="right"
          >
            <b-form-input
              id="tel"
              v-model="accont.tel"
              @click="modify_user_info('tel')"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="$t('Setting.SetUser.tj9tp4')"
            label-cols="4"
            label-cols-sm="4"
            label-align="right"
          >
            <b-form-input
              id="compony"
              v-model="accont.compony"
              @click="modify_user_info('compony')"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="$t('Setting.SetUser.o4ur3n')"
            label-for="address"
            label-cols="4"
            label-cols-sm="4"
            label-align="right"
          >
            <b-form-input
              plaintext
              id="address"
              :placeholder="accont.address"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            :label="$t('Setting.SetUser.8b0j0t')"
            label-for="creatTime"
            label-cols="4"
            label-cols-sm="4"
            label-align="right"
          >
            <b-form-input
              plaintext
              id="creatTime"
              :placeholder="$d(new Date(accont.creatTime), 'long')"
            ></b-form-input>
          </b-form-group>
        </b-form>
      </b-col>
      <b-col cols="12">
        <separated :title="$t('Setting.SetUser.lig3vv')"></separated>
        <b-table
          :items="User_log"
          :fields="fields"
          hover
          sticky-header
          head-variant="dark"
          Borderless
        >
          <template v-slot:cell(generateTime)="data">
            <b>{{ $d(new Date(data.value), "long") }}</b>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { MessageBox, Message } from "element-ui";
import separated from "../../components/separated";
import {
  Get_user_info_one,
  modify_user_info_one,
  Get_user_info
} from "../../util/axios";

export default {
  data() {
    return {
      accont: {
        user: "xdsc",
        name: "",
        mail: "xds",
        tel: "",
        compony: "",
        address: "",
        creatTime: ""
      },
      User_log: [],
      fields: [
        {
          key: "generateTime",
          label: this.$t("Setting.SetUser.eal2be"),
          sortable: true
        },
        {
          key: "status",
          label: this.$t("Setting.SetUser.qamubu"),
          sortable: true
        },
        { key: "msg", label: this.$t("Setting.SetUser.ld2nvi") }
      ]
    };
  },
  components: {
    separated
  },
  computed: {
    ...mapState(["user", "token"]),
    ...mapGetters(["lang"])
  },

  methods: {
    modify_user_info(modifyType) {
      let modifyVal = this.$data.accont[modifyType];
      MessageBox.prompt(modifyType, "modifyVal", {
        inputValue: modifyVal
      }).then(({ value }) => {
        if (modifyType == "user") modifyType = "name";
        if (modifyType == "compony") modifyType = "orgin";
        modify_user_info_one({
          user: this.user,
          token: this.token,
          modifyType,
          modifyVal: value
        })
          .then(({ data: result }) => {
            let { code, msg } = result;
            if (code != 200) MessageBox.alert(msg, "tip");
            Message(msg);
            this.Get_user_info_one();
          })
          .catch(err => {
            MessageBox(err, "error");
          });
      });
    },
    Get_user_info_one() {
      Get_user_info_one({ user: this.user, token: this.token })
        .then(({ data }) => {
          let {
            address,
            creatTime,
            mail,
            user,
            name,
            orgin,
            tel
          } = data.data[0];
          this.accont.user = user;
          this.accont.name = name;
          this.accont.mail = mail;
          this.accont.tel = tel;
          this.accont.compony = orgin;
          this.accont.address = address;
          this.accont.creatTime = creatTime;
        })
        .catch(err => {
          MessageBox.alert(err, "error");
        });
    },
    Get_User_log() {
      Get_user_info({ type: "runInfo", user: this.user, token: this.token })
        .then(({ data: result }) => {
          this.User_log = result.data;
        })
        .catch(err => {
          MessageBox(err, "User error");
        });
    }
  },
  mounted() {
    this.Get_user_info_one();
    this.Get_User_log();
  }
};
</script>

<style lang="scss" scoped>
.user-text {
  height: 100%;
  display: flex;
  align-items: center;
}
</style>
