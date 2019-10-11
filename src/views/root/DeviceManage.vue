<template>
  <b-row>
    <b-col cols="12">
      <separated :title="lang.get('DM')"></separated>
      <b-table
        id="table_DM"
        ref="devsListTable"
        :items="devs_items"
        :fields="devs_fields"
        hover
        head-variant="dark"
        primary-key="devid"
        sticky-header="700px"
        selectable
        selected-variant="primary"
        select-mode="single"
        @row-clicked="onRowSelected"
      >
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
import { mapGetters, mapState } from "vuex";
import { MessageBox, Loading } from "element-ui";
import { Get_devs_list } from "../../util/axios";
export default {
  name: "DeviceManage",
  data() {
    return {
      devs_items: [],
      devs_items_back: [],
      devs_fields: {},
      select_item: {},
      select_index: 0,
      search_str: ""
    };
  },
  components: { separated },
  computed: {
    ...mapGetters(["lang"]),
    ...mapState(["user", "token"])
  },
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
      let str = this.search_str;
      let items = [];
      this.devs_items.forEach(val => {
        let row = JSON.stringify(val);
        if (row.includes(str)) items.push(val);
      });
      setTimeout(() => {
        this.devs_items = items;
        loading.close();
      }, 2000);
    },
    Get_devs_list() {
      Get_devs_list({ user: this.user, token: this.token })
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
  },
  created() {
    this.devs_fields = [
      { key: "devid", label: this.lang.get("devid"), variant: "info" },
      { key: "devType", label: this.lang.get("devType"), sortable: true },
      { key: "updateTime", label: this.lang.get("generateTime") },
      { key: "user", label: "所属用户" }
    ];
  }
};
</script>

<style lang="scss" scoped></style>
