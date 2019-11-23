<template>
  <b-container fluid class=" d-flex flex-column mh-100 main-page">
    <b-row no-gutters class=" py-2">
      <b-col cols="4" class="text-center p-0">
        <switch-quantity
          title="烟感"
          :variantBg="devFirst(dev.io, 'smoke')"
        ></switch-quantity>
      </b-col>
      <b-col cols="4" class="text-center p-0">
        <switch-quantity
          title="漏水"
          :variantBg="devFirst(dev.io, 'leak')"
        ></switch-quantity>
      </b-col>
      <b-col cols="4" class="text-center p-0">
        <switch-quantity
          title="门磁"
          :variantBg="devFirst(dev.io, 'access_contral')"
        ></switch-quantity>
      </b-col>
    </b-row>
    <b-row
      no-gutters
      class=" flex-grow-1 alarm-content py-3 mh-100 overflow-hidden"
      ><b-col class=" overflow-auto mh-100">
        <b-list-group id="alarm-list">
          <b-list-group-item
            v-for="(val, key) in Alarm.Alarm_Data.slice(0, 20)"
            :key="key"
            v-b-toggle="'alarm' + key"
            to="Alarm"
          >
            <div>
              <b-badge
                class="mr-2"
                pill
                :variant="val.confirm ? 'success' : 'warning'"
                >{{ val.confirm ? "已确认" : "未确认" }}</b-badge
              >
              <b class="m-0">{{ val.Alarm_msg }}</b>
            </div>
            <small>{{ val.Alarm_time }}</small>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
    <b-row no-gutters class="border-top statu-padding">
      <b-col cols="6" sm="3">
        <span class="text-Critical">
          <i class="iconfont text-success">&#xe602;</i>
          UPS负载:{{ devFirst(dev.ups, "output_load") }}%
        </span>
      </b-col>
      <b-col cols="6" sm="3" class="m-0 p-0">
        <span class="text-Critical">
          <i class="iconfont text-primary ">&#xe600;</i>
          UPS功率:{{ devFirst(dev.ups, "output_frequency") }}%
        </span>
      </b-col>

      <b-col cols="6" sm="3" class="m-0 p-0">
        <span class="text-Critical">
          <i class="iconfont text-success">&#xe603;</i>
          电池电压:{{ devFirst(dev.ups, "battery_voltage") }}V
        </span>
      </b-col>
      <b-col cols="6" sm="3" class="m-0 p-0">
        <span class="text-Critical">
          <i class="iconfont text-info">&#xe605;</i>
          电池容量:{{ devFirst(dev.ups, "Battery capacity") }}Kw
        </span>
      </b-col>
      <b-col cols="6" sm="3" class="m-0 p-0">
        <span class="text-Critical">
          <i class="iconfont text-success">&#xe604;</i>
          冷通道温度:{{ devFirst(dev.th, "temperature") }}&#8451;
        </span>
      </b-col>
      <b-col cols="6" sm="3" class="m-0 p-0">
        <span class="text-Critical">
          <i class="iconfont text-primary">&#xe601;</i>
          冷通道湿度:{{ devFirst(dev.th, "humidity") }}%
        </span>
      </b-col>
      <b-col cols="6" sm="3" class="m-0 p-0">
        <span class="text-Critical">
          <i class="iconfont text-danger ">&#xe604;</i>
          热通道温度:{{ devFirst(dev.th, "temperature", 1) }}&#8451;
        </span>
      </b-col>
      <b-col cols="6" sm="3" class="m-0 p-0">
        <span class="text-Critical">
          <i class="iconfont text-warning ">&#xe601;</i>
          热通道湿度:{{ devFirst(dev.th, "humidity", 1) }}%
        </span>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { MessageBox } from "element-ui";
import SwitchQuantity from "../components/switchQuantity";
import { GetAlarms } from "../util/axios";
export default {
  components: {
    SwitchQuantity
  },
  computed: {
    ...mapState({ user: "user", token: "token", dev: "dev", Alarm: "Alarm" }),
    ...mapGetters(["lang", "unit"])
  },
  methods: {
    devFirst(value, key, n) {
      if (!value) return false;
      let valRow = Object.values(value)[n || 0];
      if (!valRow) return false;
      if (!key) return valRow;
      return valRow[key] || false;
    },
    to(key) {
      this.$router.push({ path: `/dev/${key}` });
    },
    /* GetAlarms */
    GetAlarms() {
      GetAlarms()
        .then(({ data: { code, data: result, msg } }) => {
          if (code != 200) return MessageBox(msg);
          this.$store.commit("setAlarm", result);
        })
        .catch(err => {
          MessageBox(err, "error_Alarm");
        });
    }
  },
  mounted() {
    this.$on("loginOut", () => this.$socket.client.emit("disconnect"));
    this.$nextTick()
      .then(() => {
        this.GetAlarms();
      })
      .catch(err => {
        MessageBox(err, "main error");
      });
  }
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .statu-padding {
    padding-bottom: 4.5rem;
    padding-top: 0.5rem;
  }
}
.text-Critical {
  font-size: 15px;
  text-align: center;
  white-space: nowrap;
  border-bottom: 1px solid #dee2e6;
}
@media screen and (max-height: 330px) {
  .main-page {
    max-height: calc(100vh - 136px);
  }
}
.main-page {
  max-height: calc(100vh - 96px);
}
</style>
