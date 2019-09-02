<template>
  <b-container>
    <b-row
      v-if="chartData.rows.length && chartData.rows.length > 0"
      class=" mr-0"
    >
      <b-col cols="12" class="p-0">
        <separated
          :back="true"
          :title="lang.get(dev.type) + '/' + dev.devid"
        ></separated>
      </b-col>
      <b-col cols="12" class="p-0">
        <ve-line :data="chartData" :settings="chartSettings"></ve-line>
      </b-col>
    </b-row>
    <b-row class="mb-4 mt-1 mr-0">
      <b-col cols="12" md="6">
        <b-button @click="show_search = !show_search" v-show="!show_search"
          >查询历史记录</b-button
        >
        <b-input-group v-show="show_search">
          <b-form-input type="date" v-model="search_date"></b-form-input>
          <b-input-group-addon>
            <b-button @click="Search_history_dev" variant="info"
              >Search</b-button
            >
          </b-input-group-addon>
        </b-input-group>
      </b-col>

      <b-col cols="12" class="p-0" v-if="search_date">
        <separated
          :back="true"
          :title="dev.devid + '/' + search_date"
        ></separated>
        <ve-line :data="search_chartData" :settings="chartSettings"></ve-line>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import separated from "../components/separated.vue";
import { Search_history_dev } from "../util/axios";
import { MessageBox } from "element-ui";
export default {
  name: "chartline",
  data() {
    return {
      dev: {
        type: "",
        devid: "",
        attr: ""
      },
      show_search: false,
      search_date: null,
      search_chartData: {
        columns: ["generateTime", this.attr],
        rows: []
      }
    };
  },
  computed: {
    ...mapState(["devs", "devsSet", "user", "token"]),
    ...mapGetters(["lang"]),
    chartSettings() {
      return {
        metrics: [this.dev.attr],
        dimension: ["generateTime"],
        area: true,
        labelMap: {
          [this.dev.attr]: this.lang.get(this.dev.attr)
        }
      };
    },
    chartData() {
      let {
        dev: { type, devid, attr }
      } = this.$data;
      let rows = this.devsSet.has(devid)
        ? this.devs[type][devid][attr]
        : [{ generateTime: "", [attr]: 0 }];

      return {
        columns: ["generateTime", attr],
        rows
      };
    }
  },
  methods: {
    Search_history_dev() {
      if (!this.search_date) return MessageBox("请选择日期", "tip");
      let { type: devType, devid, attr } = this.$data.dev;

      Search_history_dev({
        user: this.user,
        token: this.token,
        date: this.search_date,
        devType,
        devid,
        attr
      })
        .then(({ data: { code, msg, data } }) => {
          if (code != 200) return MessageBox(msg, code);
          let len = data.length - 1;
          data = data.slice(len - 200, len);
          if (devType == "power") {
            data.forEach((dev, key) => {
              data[key][attr] = dev[attr][2];
            });
          }
          this.search_chartData.rows = data;
          //console.log(this.search_chartData.rows);
        })
        .catch(err => {
          MessageBox(err, "error");
        });
    }
  },
  components: {
    separated
  },
  mounted() {
    {
      let { type, devid, attr } = this.$route.params;
      this.dev.type = type;
      this.dev.devid = devid;
      this.dev.attr = attr;
    }
  }
};
</script>

<style lang="scss" scoped></style>
