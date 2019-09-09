<template>
  <b-row class=" w-100 ml-0">
    <section class=" w-100 border-bottom d-flex flex-row p-2 px-3">
      <h4>{{ device.name || device.devid }}</h4>
      <strong class=" ml-auto text-center">{{ device.generateTime }}</strong>
    </section>

    <b-row class="m-0 w-100">
      <b-col cols="12">
        <b-row class="m-0">
          <b-col cols="12" md="8" class=" m-0 p-0 my-2">
            <b-card>
              <b-card-body>
                <b-img :src="betty_model" class=" mw-100"></b-img>
              </b-card-body>
            </b-card>
          </b-col>
          <b-col cols="12" md="4" class="m-0 p-0 my-2">
            <b-card>
              <argumentBlocktwo
                v-for="(val, key) in filter_core"
                :key="key"
                :val="val"
                :keys="key"
              ></argumentBlocktwo>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="w-100 p-4">
      <separated title="模拟量"></separated>
      <b-col cols="12">
        <b-table-lite :items="filter_simulate" :fields="fields_simulate">
          <template slot="[operate]" slot-scope="data">
            <b-button
              variant="info"
              @click="
                toline({
                  type: 'ups',
                  devid: devid,
                  attr: data.item.name
                })
              "
              class=" block el-icon-pie-chart  px-1 py-0 pt-1"
              >趋势</b-button
            >
          </template>
        </b-table-lite>
      </b-col>
    </b-row>
    <b-row class="w-100 p-4">
      <separated title="状态量"></separated>
      <b-col cols="12">
        <b-table-lite :items="filter_status" :fields="fields_status">
        </b-table-lite>
      </b-col>
    </b-row>
  </b-row>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import argumentBlocktwo from "../../components/argumentBlock2";
import separated from "../../components/separated";
export default {
  data() {
    return {
      devid: this.$route.params.devid,
      core: new Set([
        "temperature",
        "residual_capacity",
        "battery_voltage",
        "load_ratio",
        "output_frequency",
        "output_load"
      ]),
      simulate: new Set([
        "residual_capacity",
        "battery_voltage",
        "battery_voltage_negative",
        "load_ratio",
        "output_frequency",
        "input_voltage_l1",
        "input_voltage_l2",
        "input_voltage_l3",
        "output_voltage_l1",
        "output_voltage_l2",
        "output_voltage_l3",
        "output_load"
      ]),
      fields_simulate: [
        { names: "模拟量名称" },
        { value: "值" },
        { operate: "操作" }
      ],
      status: new Set([
        "smoke",
        "access_contral",
        "leak",
        "shutdown_active",
        "Test_mode",
        "Battery_test",
        "UPS_work_situation",
        "bypass_mode",
        "Battery_voltage_state",
        "grid_state"
      ]),
      fields_status: [{ names: "状态量名称" }, { value: "值" }]
    };
  },
  computed: {
    ...mapGetters(["lang", "unit"]),
    ...mapState(["dev"]),
    device() {
      console.log(this.dev.ups[this.devid]);

      return this.dev.ups[this.devid];
    },
    betty_model() {
      let { bypass_mode, grid_state } = this.device;
      if (bypass_mode) return require("../../assets/image/ups2.gif");
      if (grid_state) return require("../../assets/image/ups3.gif");
      return require("../../assets/image/ups1.gif");
    },
    filter_core() {
      let core = {};
      for (let [key, val] of Object.entries(this.device)) {
        if (this.core.has(key)) core[key] = val;
      }
      return core;
    },
    filter_simulate() {
      let core = [];
      for (let [key, val] of Object.entries(this.device)) {
        if (this.simulate.has(key)) {
          core.push({
            name: key,
            names: this.lang.get(key) || key,
            value: `${val} ${this.unit.get(key)}`
          });
        }
      }
      return core;
    },
    filter_status() {
      let core = [];
      for (let [key, val] of Object.entries(this.device)) {
        if (this.status.has(key)) {
          core.push({
            name: key,
            names: this.lang.get(key) || key,
            value: val ? "正常" : "异常"
          });
        }
      }
      return core;
    }
  },
  components: {
    argumentBlocktwo,
    separated
  },
  methods: {
    toline({ type, devid, attr }) {
      this.$router.push({ name: `Line`, params: { type, devid, attr } });
    }
  }
};
</script>

<style lang="scss" scoped></style>
