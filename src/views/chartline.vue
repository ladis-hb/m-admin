<template>
  <b-container>
    <b-row>
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
  </b-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import separated from "../components/separated.vue";
export default {
  name: "chartline",
  data() {
    return {
      dev: {
        type: "",
        devid: "",
        attr: ""
      }
    };
  },
  computed: {
    ...mapState(["devs", "devsSet"]),
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
  methods: {},
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
