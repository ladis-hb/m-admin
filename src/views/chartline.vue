<template>
  <b-container>
    <b-row
      v-if="chartData.rows.length && chartData.rows.length > 0"
      class=" mr-0"
    >
      <b-col cols="12" class="p-0">
        <separated
          :back="true"
          :title="language.get(dev.type) + '/' + dev.devid"
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
          :title="
            search_date +
              ',此次共检索数据条目数:' +
              search_chartData.rows.length
          "
        ></separated>
        <ve-line :data="search_chartData" :settings="chartSettings"></ve-line>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState } from "vuex";
import separated from "../components/separated.vue";
import { Search_history_dev } from "../util/axios";
import { MessageBox } from "element-ui";
export default {
  name: "chartline",
  data() {
    return {
      dev: {
        type: this.$route.query.type,
        devid: this.$route.query.devid,
        attr: this.$route.query.attr
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
    ...mapState(["devs"]),
    language() {
      return this.$store.getters.language(this.$i18n.locale);
    },
    chartSettings() {
      return {
        //控制显示key
        metrics: [this.dev.attr],
        //唯独指标
        dimension: ["generateTime"],
        //
        area: true,
        //别名
        labelMap: {
          [this.dev.attr]: this.language.get(this.dev.attr)
        }
      };
    },
    chartData() {
      let { type, devid, attr } = this.$data.dev;
      let attrVal = "";
      return {
        columns: ["generateTime", attr],
        rows: this.devs[type][devid]
          .filter(el => {
            if (el[attr] != attrVal) {
              attrVal = el[attr];
              return el;
            }
          })
          .map(el => {
            return {
              generateTime: this.$d(new Date(el.generateTime), "long"),
              [attr]: el[attr]
            };
          })
      };
    }
  },
  methods: {
    async Search_history_dev() {
      if (!this.search_date) return MessageBox("请选择日期", "tip");
      let { type: devType, devid, attr } = this.$data.dev;
      let hisData = await Search_history_dev({
        date: this.search_date,
        devType,
        devid,
        attr
      });
      let { code, msg, data } = hisData.data;
      if (code != 200) return MessageBox(msg, code);
      let attrVal = "";
      this.search_chartData.rows = data
        .filter(el => {
          if (el[attr] != attrVal) {
            attrVal = el[attr];
            return el;
          }
        })
        .map(el => {
          return {
            generateTime: this.$d(new Date(el.generateTime), "long"),
            [attr]: el[attr]
          };
        });
    }
  },
  components: {
    separated
  }
};
</script>

<style lang="scss" scoped></style>
