<template>
  <b-container class=" h-100">
    <b-row id="ac_flow_chart">
      <b-col cols="12"
        ><separated :title="ac.name || ac.devid"></separated
      ></b-col>
      <b-col cols="12" class=" mb-4">
        <div class="py-3 px-2 bg-dark d-flex flex-row justify-content-center">
          <b-img :src="airFlow" class=" img-flow"></b-img>
          <div
            class=" d-flex flex-column justify-content-center align-items-center"
          >
            <span
              ><i class=" iconfont text-primary">&#xe604;</i
              ><b class=" text-light">{{ th[0].temperature }}&#8451;</b></span
            >
            <span
              ><i class=" iconfont text-primary">&#xe601;</i
              ><b class=" text-light">{{ th[0].humidity }}&#8451;</b></span
            >
            <br />
            <br />
            <br />
            <span
              ><i class=" iconfont text-warning">&#xe604;</i
              ><b class=" text-light">{{ th[1].temperature }}&#8451;</b></span
            >
            <span
              ><i class=" iconfont text-warning">&#xe601;</i
              ><b class=" text-light">{{ th[1].humidity }}&#8451;</b></span
            >
          </div>
        </div>
      </b-col>
      <b-col cols="12" md="5">
        <b-row class=" border-bottom py-3">
          <b-col cols="12" md="12" class=" text-center pb-3 d-flex flex-row">
            <div>
              <span class="temperature d-block"
                ><i class=" iconfont  " :class="temperatureColor">&#xe604;</i
                >{{ ac.refrigeration_temperature }}&#8451;</span
              >
              <b>{{ lang.get("temperature") }}</b>
            </div>
            <div class=" border rounded-lg ml-auto">
              <p class=" bg-info text-light p-1 m-0">设定制冷温度</p>
              <b>{{ ac.refrigeration_temperature }}&#8451;</b>
            </div>
          </b-col>
          <b-col cols="12" md="12" class=" text-center pb-3 d-flex flex-row">
            <div>
              <span class="temperature d-block"
                ><i class=" iconfont  " :class="humidityColor">&#xe601;</i
                >{{ ac.humidity }}%</span
              ><b>{{ lang.get("humidity") }}</b>
            </div>
            <div class=" border rounded-lg ml-auto">
              <p class=" bg-info text-light p-1 m-0">设定制冷湿度</p>
              <b>{{ ac.humidity }}%</b>
            </div>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="12" md="7">
        <b-row class="m-0">
          <b-col
            cols="6"
            md="4"
            class="py-1 px-2"
            v-for="(val, key) in core"
            :key="key"
          >
            <div
              class=" border rounded-lg d-flex flex-column align-items-center"
            >
              <i class=" bg-info d-inline w-100 p-1 text-center text-light ">{{
                val[0]
              }}</i>
              <b-img fluid :src="val[1]" alt="Card image" class=" p-1"></b-img>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row>
      <separated title="模拟量"></separated>
      <b-table :items="items" :fields="ac_fields">
        <template slot="[operate]" slot-scope="data">
          <b-button
            variant="info"
            @click="
              toline({
                type: 'ac',
                devid: devid,
                attr: data.item.name
              })
            "
            class=" block  px-1 py-0 pt-1"
            >趋势</b-button
          >
        </template>
      </b-table>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import separated from "../../components/separated";
export default {
  data() {
    return {
      devid: this.$route.params.devid,
      speedStop: require("../../assets/image/icons/fen_gray.gif"),
      speedRun: require("../../assets/image/icons/fen.gif"),
      hotStop: require("../../assets/image/icons/sun_gary.gif"),
      hotRun: require("../../assets/image/icons/sun.gif"),
      coolStop: require("../../assets/image/icons/cool_gary.png"),
      coolRun: require("../../assets/image/icons/cool.gif"),
      humidityStop: require("../../assets/image/icons/chushi_gray.png"),
      humidityRun: require("../../assets/image/icons/chushi.gif"),
      addHumidityStop: require("../../assets/image/icons/jiashi_gray.png"),
      addHumidityRun: require("../../assets/image/icons/jiashi.gif"),
      airFlow: require("../../assets/image/ac3.png"),
      ac_fields: [
        { names: "模拟量名称" },
        { value: "当前值" },
        { operate: "操作" }
      ],
      simulate: new Set([
        "refrigeration_temperature",
        "humidity",
        "mode",
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
      ])
    };
  },
  components: {
    separated
  },
  computed: {
    ...mapState(["dev"]),
    ...mapGetters(["lang", "unit"]),
    ac() {
      return this.dev.ac[this.devid];
    },
    th() {
      return Object.values(this.dev.th);
    },
    temperatureColor() {
      let color = [];
      if (this.ac.refrigeration_temperature < 40) color = ["text-primary"];
      else color = ["text-danger"];
      return color;
    },
    humidityColor() {
      let colors = [];
      if (this.ac.humidity < 70) colors = ["text-primary"];
      else colors = ["text-danger"];
      return colors;
    },
    core() {
      return {
        speed: ["风速", this.speedRun],
        hot: ["制热", this.hotRun],
        cool: ["制冷", this.coolRun],
        humidity: ["除湿", this.humidityRun],
        addHumidity: ["加湿", this.addHumidityRun]
      };
    },
    speed() {
      return this.speedRun;
    },
    items() {
      let item = [];
      Object.entries(this.ac).forEach(([key, val]) => {
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
  }
};
</script>

<style lang="scss" scoped>
@media screen and (min-width: 375px) {
  .temperature {
    font-size: 3rem;
    i {
      font-size: 5rem;
    }
  }
}
.temperature {
  font-size: 2rem;
  i {
    font-size: 3rem;
  }
}
.img-flow {
  max-width: 80%;
}
</style>
