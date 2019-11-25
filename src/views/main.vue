<template>
  <b-container fluid class=" d-flex flex-column mh-100 main-page">
    <b-row no-gutters class=" py-2">
      <b-col cols="4" class="text-center p-0">
        <switch-quantity
          :title="$t('main.qh3w9j')"
          :variantBg="devFirst(dev.io, 'smoke')"
        ></switch-quantity>
      </b-col>
      <b-col cols="4" class="text-center p-0">
        <switch-quantity
          :title="$t('main.4vlfuz')"
          :variantBg="devFirst(dev.io, 'leak')"
        ></switch-quantity>
      </b-col>
      <b-col cols="4" class="text-center p-0">
        <switch-quantity
          :title="$t('main.jalrtk')"
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
                >{{
                  val.confirm ? $t("main.de85p8") : $t("main.np09ab")
                }}</b-badge
              >
              <b class="m-0">{{ val.Alarm_msg }}</b>
            </div>
            <small>{{ $d(new Date(val.Alarm_time), "long") }}</small>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
    <b-row no-gutters class="border-top statu-padding">
      <b-col cols="6" sm="3">
        <span class="text-Critical">
          <i class="iconfont text-success">&#xe602;</i>
          {{ $t("main.kl4jme") }}:{{ devFirst(dev.ups, "output_load") }}%
        </span>
      </b-col>
      <b-col cols="6" sm="3" class="m-0 p-0">
        <span class="text-Critical">
          <i class="iconfont text-primary ">&#xe600;</i>
          {{ $t("main.ea1565") }}:{{ devFirst(dev.ups, "output_frequency") }}%
        </span>
      </b-col>

      <b-col cols="6" sm="3" class="m-0 p-0">
        <span class="text-Critical">
          <i class="iconfont text-success">&#xe603;</i>
          {{ $t("main.awsvap") }}:{{ devFirst(dev.ups, "battery_voltage") }}V
        </span>
      </b-col>
      <b-col cols="6" sm="3" class="m-0 p-0">
        <span class="text-Critical">
          <i class="iconfont text-info">&#xe605;</i>
          {{ $t("main.nq1tox") }}:{{ devFirst(dev.ups, "Battery capacity") }}Kw
        </span>
      </b-col>
      <b-col cols="6" sm="3" class="m-0 p-0">
        <span class="text-Critical">
          <i class="iconfont text-success">&#xe604;</i>
          {{ $t("main.6f21cg") }}:{{ devFirst(dev.th, "temperature") }}&#8451;
        </span>
      </b-col>
      <b-col cols="6" sm="3" class="m-0 p-0">
        <span class="text-Critical">
          <i class="iconfont text-primary">&#xe601;</i>
          {{ $t("main.j6ab1l") }}:{{ devFirst(dev.th, "humidity") }}%
        </span>
      </b-col>
      <b-col cols="6" sm="3" class="m-0 p-0">
        <span class="text-Critical">
          <i class="iconfont text-danger ">&#xe604;</i>
          {{ $t("main.5k5m1g") }}:{{
            devFirst(dev.th, "temperature", 1)
          }}&#8451;
        </span>
      </b-col>
      <b-col cols="6" sm="3" class="m-0 p-0">
        <span class="text-Critical">
          <i class="iconfont text-warning ">&#xe601;</i>
          {{ $t("main.473joa") }}:{{ devFirst(dev.th, "humidity", 1) }}%
        </span>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { MessageBox } from "element-ui";
import SwitchQuantity from "../components/switchQuantity";
export default {
  components: {
    SwitchQuantity
  },
  computed: {
    ...mapState({ dev: "dev", Alarm: "Alarm" }),
    ...mapGetters(["unit"])
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
    }
    /* GetAlarms */
  },
  mounted() {
    this.$nextTick()
      .then(() => {
        this.$store.dispatch("GetAlarms");
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
