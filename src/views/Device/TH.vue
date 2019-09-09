<template>
  <b-container>
    <b-row>
      <separated :title="th.name || th.devid"></separated>
      <b-col cols="6">
        <div class="ths">
          <i class=" iconfont text-success">&#xe604;</i
          ><b>{{ th.temperature }}&#8451;</b>
        </div>
      </b-col>
      <b-col cols="6">
        <div class="ths">
          <i class=" iconfont text-success">&#xe604;</i
          ><b>{{ th.humidity }}%</b>
        </div>
      </b-col>
      <b-col cols="12">
        <b-table :fields="th_fiedls" :items="items">
          <template slot="[operate]" slot-scope="data">
            <b-button
              variant="info"
              @click="
                toline({
                  type: 'th',
                  devid: devid,
                  attr: data.item.name
                })
              "
              class=" block  px-1 py-0 pt-1"
              >趋势</b-button
            >
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import separated from "../../components/separated";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      devid: this.$route.params.devid,
      th_fiedls: [
        { names: "模拟量名称" },
        { value: "值" },
        { operate: "操作" }
      ],
      simulate: new Set(["temperature", "humidity"])
    };
  },
  computed: {
    ...mapGetters(["lang", "unit"]),
    ...mapState(["dev"]),
    th() {
      return this.dev.th[this.devid];
    },
    items() {
      let item = [];
      Object.entries(this.th).forEach(([key, val]) => {
        if (this.simulate.has(key))
          item.push({
            name: key,
            names: this.lang.get(key),
            value: `${val}${this.unit.get(key)}`
          });
      });
      return item;
    }
  },
  methods: {
    toline({ type, devid, attr }) {
      this.$router.push({ name: `Line`, params: { type, devid, attr } });
    }
  },
  components: { separated }
};
</script>

<style lang="scss" scoped>
.ths {
  i,
  b {
    font-size: 3rem;
  }
}
</style>
