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
            <b-button-group class=" px-3 pb-1">
              <b-button @click="oprate('StartUps')">{{
                $t("Device.UPS.hu1ydo")
              }}</b-button>
              <b-button @click="oprate('ShutdownUps')">{{
                $t("Device.UPS.6bq94d")
              }}</b-button>
              <b-button>{{ $t("Device.UPS.ffb8wz") }}</b-button>
            </b-button-group>

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
import { OprateUPS } from "../../util/axios";
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
      Object.entries;
      return this.dev.ups[this.devid];
    },
    betty_model() {
      let map = {
        L: require("../../assets/image/ups3.gif"),
        B: require("../../assets/image/ups1.gif"),
        Y: require("../../assets/image/ups2.gif"),
        P: require("../../assets/image/ups.gif"),
        S: require("../../assets/image/ups.gif")
      };
      return map[this.device["Ups Mode"].trim()];
    },
    filter_core() {
      //电池信息
      let cores = new Set([
        "DevType",
        "Ups Mode",
        "phase",
        "Battery group number",
        "Battery standard voltage per unit",
        "Battery remain time",
        "Battery piece number",
        "temperature",
        "residual_capacity",
        "battery_voltage"
      ]);

      return Object.entries(this.device)
        .filter(([key]) => cores.has(key))
        .map(([key, val]) => [key, val]);
    },
    filter_simulate() {
      //模拟量
      let simulate = new Set([
        "temperature",
        "output_load",
        "Battery capacity",
        "load_ratio",
        "output_frequency",
        "output_frequency",
        "output_load",
        "Nominal O/P Voltage",
        "Output power factor",
        "Nominal I/P Voltage",
        "Positive BUS voltage",
        "Negative BUS voltage",
        "Output voltage",
        "Rating Output Frequency",
        "Input voltage",
        "Rating Output Voltage",
        "Rating Output Current",
        "Input frequency",
        "P Battery voltage",
        "Output current",
        "Rating Voltage",
        "N Battery voltage"
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
      //状态量
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
    }
  },
  components: {
    argumentBlocktwo,
    separated
  },
  methods: {
    toline({ type, devid, attr }) {
      this.$router.push({ path: `/line`, query: { type, devid, attr } });
    },
    oprate(oprate) {
      OprateUPS({ oprate, devid: this.devid }).then(({ data }) => {
        this.$MessageBox(data.msg, "Tip");
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
