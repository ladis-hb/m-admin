<template>
  <div>
    <div v-for="(item,key)  of filter_chartSet(chartSettings[devType])" :key="key">
      <ve-line :data="chartData()" :settings="item"></ve-line>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  name: "vLine",
  props: {
    devType: String,
    devid: String
  },
  data() {
    return {
      chartSettings: {
        power: {
          dimension: ["generateTime"], //指定date 为维度
          metrics: [
            "active_power",
            "reactive_power",
            "power_factor",
            "quantity",
            "input_voltage",
            "input_voltage_l1",
            "input_voltage_l2",
            "input_voltage_l3",
            "input_current",
            "input_current_l1",
            "input_current_l2",
            "input_current_l3",
            "input_frequency",
            "input_frequency_l1",
            "input_frequency_l2",
            "input_frequency_l3"
          ]
        },
        ups: {
          dimension: ["generateTime"], //指定date 为维度
          metrics: [
            "temperature",
            "residual_capacity",
            "battery_voltage",
            "battery_voltage_negative",
            "load_ratio",
            "output_frequency",
            "input_voltage",
            "output_voltage",
            "input_voltage_l1",
            "input_voltage_l2",
            "input_voltage_l3",
            "output_voltage_l1",
            "output_voltage_l2",
            "output_voltage_l3"
          ]
        },
        ac: {
          dimension: ["generateTime"], //指定date 为维度
          metrics: [
            "refrigeration_temperature",
            "refrigeration_stop_deviation",
            "evaporation_start_temperature",
            "air_change_time",
            "opening_delay",
            "high_temperature_alarm_point",
            "return_air_temperature",
            "coil_temperature",
            "modified_return_air_temperature",
            "Correct_air_outlet_temperature",
            "defrosting_temperature_setting",
            "heating_opening_deviation",
            "heating_stop_deviation",
            "refrigeration_start_deviation",
            "air_outlet_temperature_deviation",
            "Starting_temperature_setting",
            "temperature_difference",
            "air_supply_temperature"
          ]
        },
        th: {
          dimension: ["generateTime"], //指定date 为维度
          metrics: ["temperature", "humidity"]
        }
      }
    };
  },
  computed: {
    ...mapState({ dev: "dev", devs: "devs" }),
    ...mapGetters({ lang: "lang" })
  },

  methods: {
    chartData() {
      let columns = Object.keys(this.dev[this.devType][this.devid]);
      let rows = this.devs[this.devType][this.devid];
      return { columns, rows };
    },
    filter_chartSet({ dimension, metrics }) {
      let len = metrics.length;
      let setArr = [];
      if (len > 6) {
        if (len > 6 && len < 13) {
          setArr = [
            { dimension, metrics: metrics.slice(0, 6) },
            { dimension, metrics: metrics.slice(6, 12) }
          ];
        }
        if (len > 12 && len < 19) {
          setArr = [
            { dimension, metrics: metrics.slice(0, 6) },
            { dimension, metrics: metrics.slice(6, 12) },
            { dimension, metrics: metrics.slice(12, 18) }
          ];
        }
      } else {
        setArr = [{ dimension, metrics }];
      }

      let charts = [];
      for (let set of setArr) {
        set.labelMap = {};
        for (let key of set.metrics) {
          set.labelMap[key] = this.lang.get(key);
        }
        charts.push(set);
      }
      return charts;
    }
  }
};
</script>

<style lang='scss' scoped >
</style>
