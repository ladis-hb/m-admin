<template>
  <b-container>
    <b-row>
      <separated :title="th ? th.name : '' || th.devid"></separated>
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
          <template v-slot:cell(operate)="data">
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
      devid: this.$route.query.devid,
      th_fiedls: [
        { names: this.$t("Device.UPS.l232l9") },
        { value: this.$t("Device.UPS.gf5kur") },
        { operate: this.$t("Device.UPS.68q9gs") }
      ],
      simulate: new Set(["temperature", "humidity"])
    };
  },
  computed: {
    language() {
      return this.$store.getters.language(this.$i18n.locale);
    },
    ...mapGetters(["unit"]),
    ...mapState(["dev"]),
    th() {
      return this.dev.th[this.devid];
    },
    items() {
      return Object.entries(this.th)
        .filter(([key]) => this.simulate.has(key))
        .map(([key, val]) => {
          return {
            name: key,
            names: this.language.get(key),
            value: `${val}${this.unit.get(key)}`
          };
        });
    }
  },
  methods: {
    toline({ type, devid, attr }) {
      this.$router.push({ path: `/line`, query: { type, devid, attr } });
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
