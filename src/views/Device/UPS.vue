<template>
  <b-row class=" w-100 ml-0">
    <section class=" w-100 border-bottom d-flex flex-row p-2 px-3">
      <h4>{{ device.name || device.devid }}</h4>
      <strong class=" ml-auto text-center">{{
        $d(new Date(device.generateTime), "long")
      }}</strong>
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
                v-for="([keys, val], key) in filter_core"
                :keys="keys"
                :val="val"
                :key="key"
              ></argumentBlocktwo>
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="w-100 p-4">
      <separated :title="$t('Device.UPS.8lhbb5')"></separated>
      <b-col cols="12">
        <b-table-lite :items="filter_simulate" :fields="fields_simulate">
          <template v-slot:cell(operate)="data">
            <b-button
              variant="info"
              @click="
                toline({
                  type: 'ups',
                  devid,
                  attr: data.item.name
                })
              "
              class=" block el-icon-pie-chart  px-1 py-0 pt-1"
              >{{ $t("Device.UPS.vk17k4") }}</b-button
            >
          </template>
        </b-table-lite>
      </b-col>
    </b-row>
    <b-row class="w-100 p-4">
      <separated :title="$t('Device.UPS.trfyxs')"></separated>
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
      devid: this.$route.query.devid,

      fields_simulate: [
        { names: this.$t("Device.UPS.l232l9") },
        { value: this.$t("Device.UPS.gf5kur") },
        { operate: this.$t("Device.UPS.68q9gs") }
      ],

      fields_status: [
        { names: this.$t("Device.UPS.o46ipg") },
        { value: this.$t("Device.UPS.nuot3o") }
      ]
    };
  },
  computed: {
    language() {
      return this.$store.getters.language(this.$i18n.locale);
    },
    ...mapGetters(["lang", "unit"]),
    ...mapState(["dev"]),
    device() {
      return this.dev.ups[this.devid];
    },
    betty_model() {
      let { bypass_mode, grid_state } = this.device;
      if (bypass_mode) return require("../../assets/image/ups2.gif");
      if (grid_state) return require("../../assets/image/ups3.gif");
      return require("../../assets/image/ups1.gif");
    },
    filter_core() {
      let cores = new Set([
        "temperature",
        "residual_capacity",
        "battery_voltage",
        "load_ratio",
        "output_frequency",
        "output_load"
      ]);

      return Object.entries(this.device)
        .filter(([key]) => cores.has(key))
        .map(([key, val]) => [key, val]);
    },
    filter_simulate() {
      let simulate = new Set([
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
      ]);
      return Object.entries(this.device)
        .filter(([key]) => simulate.has(key))
        .map(([key, val]) => {
          return {
            name: key,
            names: this.language.get(key) || key,
            value: `${val} ${this.unit.get(key)}`
          };
        });
    },
    filter_status() {
      let status = new Set([
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
      ]);
      return Object.entries(this.device)
        .filter(([key]) => status.has(key))
        .map(([key, val]) => {
          return {
            name: key,
            names: this.language.get(key) || key,
            value: val
              ? this.$t("Device.UPS.lkdvcd")
              : this.$t("Device.UPS.2lnbvc")
          };
        });
      /* let core = [];
      for (let [key, val] of Object.entries(this.device)) {
        if (this.status.has(key)) {
          core.push({
            name: key,
            names: this.lang.get(key) || key,
            value: val ? "正常" : "异常"
          });
        }
      }
      return core; */
    }
  },
  components: {
    argumentBlocktwo,
    separated
  },
  methods: {
    toline({ type, devid, attr }) {
      this.$router.push({ path: `/line`, query: { type, devid, attr } });
    }
  }
};
</script>

<style lang="scss" scoped></style>
