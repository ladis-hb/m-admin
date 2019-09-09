<template>
  <b-container>
    <b-row class="m-0 overflow-auto">
      <b-col
        cols="12"
        v-for="(value, i0, key) in dev[id]"
        :key="key"
        class=" mt-2 overflow-auto"
        @click="toDevice(id, value.devid)"
      >
        <b-card
          :title="'设备名称：' + value.name || value.devid"
          :sub-title="'设备ID：' + value.devid"
          ><b-card-body>
            <!-- <argument-block
              v-for="(val, key) of filter_show_value(value)"
              :val="val"
              :keys="key"
              :key="key"
              class=" d-block"
            ></argument-block> -->
          </b-card-body></b-card
        >
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { Get_user_all_devs, Get_devs_list_single } from "../util/axios";
//import argumentBlock from "../components/argumentBlock";
export default {
  data() {
    return {
      card_img: require("../assets/25-600x300.jpg"),
      hidd_key: new Set(["generateTime", "name", "devid", "_id", "DateTime"]),
      device: {
        ups: new Set([
          "generateTime",
          "brand",
          "temperature",
          "status",
          "phase",
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
        ac: new Set(["brand", "refrigeration_temperature", "humidity", "mode"]),
        power: new Set([
          "brand",
          "active_power",
          "reactive_power",
          "power_factor",
          "quantity"
        ]),
        io: new Set(["brand", "power_status", "input_status"]),
        th: new Set(["brand", "temperature", "humidity"])
      }
    };
  },
  components: {
    //argumentBlock
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    ...mapState(["dev", "user", "token"]),
    ...mapGetters(["lang", "unit"])
  },
  methods: {
    //刷选出要显示的字段
    filter_show_value(value) {
      let valueMap = {};
      for (let [key, val] of Object.entries(value)) {
        if (this.device[this.id].has(key)) valueMap[key] = val;
      }
      return valueMap;
    },
    //到device
    toDevice(id, devid) {
      if (id == "io") return;
      this.$router.push({ name: id, params: { devid } });
    },
    /* toline({ type, devid, attr }) {
      this.$router.push({ name: `Line`, params: { type, devid, attr } });
    },
    filter_key(value) {
      let newValue = {};
      for (let key of Object.keys(value)) {
        if (!this.hidd_key.has(key)) newValue[key] = value[key];
      }
      return newValue;
    },
    ArrayBool(val) {
      console.log(typeof val);
    }, */
    /* 检查哪些设备不在线，get获取数据库的存档，写入store，当有socket新数据传入会直接复写存档数据 */
    async check_offline_dev() {
      let dev_online = (() => {
        return Object.values(this.dev).map(val => {
          return Object.keys(val);
        });
      })();
      let online = [];
      dev_online.map(val => {
        online = [...online, ...val];
      });
      let { data: result } = await Get_user_all_devs({
        user: this.user,
        token: this.token
      });
      let { data } = result;
      let [{ dev }] = data;
      let dev_offline = [];
      dev.forEach(element => {
        if (!online.includes(element.devid)) dev_offline.push(element);
      });
      dev_offline.forEach(async single => {
        let {
          data: { data: singleInfo }
        } = await Get_devs_list_single({
          user: this.user,
          token: this.token,
          devid: single.devid
        });
        let payload = {
          devType: singleInfo.devType,
          devs: singleInfo.data,
          status: false
        };
        this.$store.dispatch("newDevs", payload);
      });
    }
  },
  filters: {
    chartValue(value) {
      let newValue = {};
      for (let [key, val] of Object.entries(value)) {
        if (typeof val != "boolean") newValue[key] = val;
      }
      return newValue;
    }
  },
  activated() {
    this.check_offline_dev();
  }
};
</script>

<style lang="scss" scoped></style>
