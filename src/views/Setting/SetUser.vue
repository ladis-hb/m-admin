<template>
  <b-container>
    <b-row>
      <b-col cols="12" sm="6">
        <separated title="user info"></separated>
        <b-form>
          <b-form-group
            label="user:"
            label-cols="4"
            label-align="right"
            label-text-align="center"
          >
            <b-form-input
              disabled
              id="user"
              v-model="accont.user"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="mail:"
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
            label="tel:"
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
            label="compony:"
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
            label="address:"
            label-for="address"
            label-cols="4"
            label-cols-sm="4"
            label-align="right"
          >
            <b-form-input
              disabled
              id="address"
              v-model="accont.address"
            ></b-form-input>
          </b-form-group>
          <b-form-group
            label="creatTime:"
            label-for="creatTime"
            label-cols="4"
            label-cols-sm="4"
            label-align="right"
          >
            <b-form-input
              disabled
              id="creatTime"
              v-model="accont.creatTime"
            ></b-form-input>
          </b-form-group>
        </b-form>
      </b-col>
      <b-col cols="12">
        <separated title="user login info"></separated>
        <b-table
          :items="User_log"
          :fields="fields"
          hover
          sticky-header
          head-variant="dark"
          Borderless
        >
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
        mail: "xds",
        tel: "",
        compony: "",
        address: "",
        creatTime: ""
      },
      User_log: [],
      fields: {
        generateTime: {
          label: "生成时间",
          sortable: true
        },
        status: {
          label: "登录状态",
          sortable: true
        },
        msg: {
          label: "登录信息"
        }
      }
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
          let { address, creatTime, mail, name, orgin, tel } = data.data[0];
          this.accont.user = name;
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
          console.log(this.User_log);
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
