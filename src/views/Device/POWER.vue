<template>
  <b-container>
    <section class=" border-bottom d-flex flex-row p-2 px-3">
      <h4>{{ device.name || device.devid }}</h4>
      <strong class=" ml-auto text-center">{{ device.generateTime }}</strong>
    </section>
    <b-row class="w-100 my-2 px-2">
      <b-col cols="12">
        <span class=" power-text d-block d-flex flex-column">
          <div class=" d-flex flex-row justify-content-end power-body">
            <p class=" text-danger">{{ device.quantity[2] }}</p>
            <i class=" text-success">KW.h</i>
          </div>
          <b class=" text-dark mt-auto power-title">电表电量</b>
        </span>
      </b-col>
    </b-row>

    <b-row class="clearfix w-100">
      <b-col cols="12" md="3" v-for="(val, key) in core" :key="key">
        <div class=" border rounded-lg d-flex flex-column">
          <span class=" bg-info text-center d-block py-2 text-light">{{
            lang.get(key)
          }}</span>
          <span
            class=" bg-light border d-block d-inline p-2 pb-0"
            v-for="(v1, k1) in val"
            :key="k1"
          >
            <span>{{ lang.get(k1) }}</span
            ><span class=" float-right">
              <b-badge variant="info" pill
                >{{ v1[2] || 0 }} {{ unit.get(k1) }}</b-badge
              >
            </span>
            <b-progress
              :value="v1[2] || 0"
              :max="1000"
              class="mb-1"
              variant="success"
            ></b-progress>
          </span>
        </div>
      </b-col>
    </b-row>

    <b-row class=" w-100">
      <separated title="模拟量"></separated>
      <b-col cols="12">
        <b-table-lite
          responsive
          :items="filter_simulate"
          :fields="fields_simulate"
        >
          <template v-slot:cell(operate)="data">
            <b-button
              variant="info"
              @click="
                toline({
                  type: 'power',
                  devid: devid,
                  attr: data.item.name
                })
              "
              class=" block  px-1 py-0 pt-1"
              >趋势</b-button
            >
          </template>
        </b-table-lite>
      </b-col>
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
      simulate: new Set([
        "active_power",
        "input_current",
        "input_current_l1",
        "input_current_l2",
        "input_current_l3",
        "input_frequency",
        "input_frequency_l1",
        "input_frequency_l2",
        "input_frequency_l3",
        "input_voltage",
        "input_voltage_l1",
        "input_voltage_l2",
        "input_voltage_l3"
      ]),
      fields_simulate: [
        { names: "模拟量名称" },
        { top: "上门限" },
        { bottom: "下门限" },
        { value: "当前值" },
        { operate: "操作" }
      ]
    };
  },
  computed: {
    ...mapGetters(["lang", "unit"]),
    ...mapState(["dev"]),
    device() {
      //console.log(this.dev.power[this.devid]);
      return this.dev.power[this.devid];
    },
    core() {
      let {
        input_current_l1,
        input_current_l2,
        input_current_l3,
        input_frequency_l1,
        input_frequency_l2,
        input_frequency_l3,
        input_voltage_l1,
        input_voltage_l2,
        input_voltage_l3,
        active_power,
        reactive_power,
        power_factor
      } = this.device;
      return {
        Three_phaseInputVoltage: {
          input_voltage_l1,
          input_voltage_l2,
          input_voltage_l3
        },
        Three_phaseInputCurrent: {
          input_current_l1,
          input_current_l2,
          input_current_l3
        },
        Three_phaseActivePower: {
          input_frequency_l1,
          input_frequency_l2,
          input_frequency_l3
        },
        other: {
          active_power,
          reactive_power,
          power_factor
        }
      };
    },
    filter_simulate() {
      let core = [];
      for (let [key, val] of Object.entries(this.device)) {
        if (this.simulate.has(key)) {
          core.push({
            name: key,
            names: this.lang.get(key) || key,
            value: `${val[2] || 0} ${this.unit.get(key)}`,
            top: val[0] || 0,
            bottom: val[1] || 0
          });
        }
      }
      return core;
    }
  },
  components: {
    separated
  },
  methods: {
    toline({ type, devid, attr }) {
      this.$router.push({ name: `Line`, params: { type, devid, attr } });
    }
  }
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 375px) {
  .power-text {
    height: 72px;
    .power-title {
      margin-bottom: 2px;
      margin-left: 8px;
      font-size: 18px;
    }
    .power-body {
      margin-right: 15px;
      margin-top: 5px;
      i {
        margin-top: 12px;
        margin-left: 6px;
        font-size: 18px;
      }
      p {
        font-size: 28px;
        margin: 0;
      }
    }
  }
}
@media screen and (min-width: 375px) {
  .power-text {
    height: 88px;
    .power-title {
      margin-bottom: 2px;
      margin-left: 8px;
      font-size: 18px;
    }
    .power-body {
      margin-right: 15px;
      margin-top: 12px;
      i {
        margin-top: 12px;
        margin-left: 6px;
        font-size: 20px;
      }
      p {
        font-size: 32px;
        margin: 0;
      }
    }
  }
}
@media screen and (min-width: 675px) {
  .power-text {
    height: 140px;
    width: 80%;
    .power-title {
      margin-bottom: 2px;
      margin-left: 14px;
      font-size: 26px;
    }
    .power-body {
      margin-right: 20px;
      margin-top: 16px;
      i {
        margin-top: 28px;
        margin-left: 12px;
        font-size: 32px;
      }
      p {
        font-size: 60px;
        margin: 0;
      }
    }
  }
}
@media screen and (min-width: 975px) {
  .power-text {
    height: 190px;
    width: 60%;
    .power-title {
      margin-bottom: 12px;
      margin-left: 14px;
      font-size: 32px;
    }
    .power-body {
      margin-right: 32px;
      margin-top: 20px;
      i {
        margin-top: 36px;
        margin-left: 20px;
        font-size: 38px;
      }
      p {
        font-size: 72px;
        margin: 0;
      }
    }
  }
}
.row {
  margin-left: 0px;
}
.power-text {
  background-image: url("../../assets/image/power.png");
  background-size: cover;
}
</style>
