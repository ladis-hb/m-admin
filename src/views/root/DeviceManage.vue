<template>
  <b-row>
    <b-col cols="12">
      <separated :title="$t('root.DeviceManage.9z7eqt')"></separated>
      <b-table ref="devsListTable" :items="devs_items" :fields="devs_fields">
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
          <b-table-lite :items="[row.item]" stacked :fields="devTable_fields">
            <template v-slot:cell(AlarmSendSelect)="data">
              <b>{{ data.value ? "是" : "否" }}</b>
            </template>
          </b-table-lite>
          <b-table
            :items="row.item.devlistSrize"
            :fields="devlist_fields"
          ></b-table>
        </template>
      </b-table>
    </b-col>
    <b-col cols="12" md="6">
      <b-input-group>
        <b-form-input
          placeholder="输入字符搜索"
          v-model="search_str"
        ></b-form-input>
        <b-input-group-append>
          <b-button variant="info" @click="Search">Search</b-button>
          <b-button variant="primary" @click="Reset_items">Reset</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-col>
  </b-row>
</template>

<script>
import separated from "../../components/separated";
import { MessageBox, Loading } from "element-ui";
import { Get_devs_list } from "../../util/axios";
export default {
  name: "DeviceManage",
  data() {
    return {
      devs_items: [],
      devs_items_back: [],
      devs_fields: [
        { key: "clientID", label: "环控ID" },
        { key: "num", label: this.$t("root.DeviceManage.9kkdle") },
        { key: "users", label: "所属用户" },
        { key: "oprate", label: this.$t("root.DeviceManage.xju8cu") }
      ],
      devTable_fields: [
        { key: "mail", label: this.$t("Setting.SetMain.mgppih") },
        { key: "tel", label: this.$t("Setting.SetMain.jdlme9") },
        { key: "AlarmSendSelect", label: this.$t("Setting.SetMain.ft46db") },
        { key: "http_uri", label: "httpAPI" },
        { key: "websocket_uri", label: "SocketAPI" }
      ],
      devlist_fields: [
        { key: "devType", label: this.$t("Setting.SetMain.4sdrkr") },
        { key: "devid", label: this.$t("Setting.SetMain.0zc37b") },
        { key: "devName", label: this.$t("Setting.SetMain.umc5nc") }
      ],
      select_item: {},
      select_index: 0,
      search_str: ""
    };
  },
  components: { separated },
  methods: {
    onRowSelected(item, index) {
      this.select_item = item;
      this.select_index = index;
    },
    Reset_items() {
      this.devs_items = JSON.parse(JSON.stringify(this.devs_items_back));
    },
    Search() {
      let loading = Loading.service({ target: "#table_DM" });
      this.devs_items = this.devs_items.filter(val =>
        JSON.stringify(val).includes(this.search_str)
      );
      setTimeout(() => loading.close(), 1000);
    },
    Get_devs_list() {
      Get_devs_list()
        .then(({ data: { code, msg, data } }) => {
          if (code != 200) return MessageBox(msg, code);
          this.devs_items = data;
          //data深拷贝
          this.devs_items_back = JSON.parse(JSON.stringify(data));
        })
        .catch(err => {
          MessageBox(err, "error");
        });
    }
  },
  mounted() {
    this.Get_devs_list();
  }
};
</script>

<style lang="scss" scoped></style>
