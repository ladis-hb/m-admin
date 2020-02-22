<template>
  <b-container class="set-devs">
    <b-row>
      <separated :title="$t('Setting.SetMain.1t7pw2')"></separated>
      <b-col cols="12" sm="8">
        <b-form-group
          :label="$t('Setting.SetMain.4j7lu9')"
          label-for="Devid"
          label-cols="12"
          label-cols-sm="4"
        >
          <b-form-input id="Devid" v-model.trim="Devid"></b-form-input>
        </b-form-group>
      </b-col>

      <b-col cols="6" sm="2">
        <b-button variant="info" block @click="addDevid">{{
          $t("Setting.SetMain.dqz3fw")
        }}</b-button>
      </b-col>
      <b-col cols="6" sm="2">
        <b-button variant="dark" block @click="DeleteDevid">{{
          $t("Setting.SetMain.uy3sps")
        }}</b-button>
      </b-col>
    </b-row>
    <b-row>
      <separated :title="$t('Setting.SetMain.l767u9')"></separated>
      <b-col cols="12">
        <b-table :items="Dev_list" :fields="fields">
          <template v-slot:cell(num)="data">
            <b>{{ data.item.devlist.length }}</b>
          </template>
          <template v-slot:cell(oprate)="row">
            <b-button size="sm" @click="row.toggleDetails">{{
              row.detailsShowing
                ? $t("Setting.SetMain.wpe6tq")
                : $t("Setting.SetMain.ke826n")
            }}</b-button>
          </template>
          <template v-slot:row-details="row">
            <b-table-lite
              :items="[row.item.devTable]"
              stacked
              :fields="devTable_fields"
            >
              <template v-slot:cell(AlarmSendSelect)="data">
                <b>{{
                  data.value
                    ? $t("Setting.SetMain.dt8cjh")
                    : $t("Setting.SetMain.y8pfii")
                }}</b>
              </template>
            </b-table-lite>
            <b-table :items="row.item.devlistSrize" :fields="devlist_fields">
            </b-table>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import {
  addDevid,
  delete_Devid,
  //Modify_devName,
  Get_devid_list
} from "../../util/axios";
import { mapGetters, mapState } from "vuex";
import { MessageBox, Message } from "element-ui";
import separated from "../../components/separated";
export default {
  data() {
    return {
      Devid: "",
      Dev_list: [],
      fields: [
        { key: "clientID", label: this.$t("Setting.SetMain.bnt5u5") },
        { key: "num", label: this.$t("Setting.SetMain.5u7upj") },
        { key: "oprate", label: this.$t("Setting.SetMain.hb7eip") }
      ],
      devlist_fields: [
        //{ key: "devType", label: this.$t("Setting.SetMain.4sdrkr") },
        { key: "devid", label: this.$t("Setting.SetMain.0zc37b") },
        { key: "devName", label: this.$t("Setting.SetMain.umc5nc") }
        //{ key: "oprate", label: this.$t("Setting.SetMain.q4ah9g") }
      ],
      devTable_fields: [
        { key: "mail", label: this.$t("Setting.SetMain.mgppih") },
        { key: "tel", label: this.$t("Setting.SetMain.jdlme9") },
        { key: "AlarmSendSelect", label: this.$t("Setting.SetMain.ft46db") },
        { key: "SocketID", label: "SocketID" },
        { key: "http_uri", label: "httpAPI" },
        { key: "websocket_uri", label: "SocketAPI" }
      ]
    };
  },
  components: {
    separated
  },
  computed: {
    ...mapGetters(["lang"]),
    ...mapState(["user", "token"])
  },
  methods: {
    oprate(item) {
      // eslint-disable-next-line
      console.log(item);
    },
    addDevid() {
      if (this.Devid == "") return MessageBox.alert("参数不能为空");
      addDevid({
        devid: this.Devid
      })
        .then(({ data: { code, msg } }) => {
          if (code != 200) return MessageBox(msg, "tip");
          Message(msg);
          this.Devid = "";
          this.Get_user_all_devs();
        })
        .catch(err => {
          MessageBox(err, "error");
        });
    },
    DeleteDevid() {
      let { Devid } = this.$data;
      let all = this.Dev_list.map(el => {
        return el.clientID;
      });

      if (Devid == "" || !all.includes(Devid))
        return MessageBox.alert("参数不能为空或不存在的设备号");
      this.$MessageBox(`是否需要删除设备${Devid}?`, "Delete Device").then(
        () => {
          delete_Devid({
            devid: Devid
          }).then(({ data: { code, msg } }) => {
            if (code != 200) return MessageBox(msg, "tip");
            return this.$Message(msg);
          });
        }
      );
    },
    Get_user_all_devs() {
      Get_devid_list().then(result => {
        let { code, data } = result.data;
        if (code != 200) return;
        this.Dev_list = data;
      });
    }
  },

  mounted() {
    this.Get_user_all_devs();
  }
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 375px) {
  .set-devs {
    margin: 0px;
    padding: 0px;
  }
}
.table-mx {
  max-height: 400px;
}
</style>
