<template>
  <b-row>
    <b-col
      cols="12"
      v-for="(value, i0, key) in dev[id]"
      :key="key"
      class="mt-2"
    >
      <section>
        <b-row>
          <b-col cols="12">
            <div class=" border rounded-sm mb-1 d-flex">
              <b-col
                cols="12"
                sm="4"
                md="2"
                v-b-toggle="value.devid"
                class="p-3 d-flex flex-column justify-content-center"
              >
                <h4>
                  {{ value.name
                  }}<b-spinner
                    v-if="value.status"
                    variant="success"
                    type="grow"
                    label="Spinning"
                  ></b-spinner>
                  <p class=" text-danger small" v-else>设备未上线</p>
                </h4>
                <strong>设备Id:{{ value.devid }}</strong>
                <!-- <b-button
                  variant="info"
                  v-b-toggle="value.devid"
                  class="card-link block el-icon-discover d-block mt-3"
                  >列表</b-button
                > -->
              </b-col>
              <b-col class=" mw-100 overflow-auto d-none d-sm-inline">
                <Chart-guage
                  :items="value | chartValue"
                  :devType="id"
                  v-if="['ups', 'power'].includes(id)"
                ></Chart-guage>
                <Chart-histogram :items="value | chartValue" v-else>
                </Chart-histogram>
              </b-col>
            </div>
          </b-col>
        </b-row>
      </section>
      <!-- <b-card class="my-2">
        <b-card-title class="clearfix">
          {{ value.name }}
          <b-spinner variant="success" type="grow" label="Spinning"></b-spinner>
        </b-card-title>
        <b-card-sub-title>设备Id:{{ value.devid }}</b-card-sub-title>

        <b-card-body>
          <b-button
            variant="link"
            v-b-toggle="value.devid"
            class="card-link float-left block el-icon-discover"
            >列表</b-button
          >
        </b-card-body>
      </b-card> -->
      <b-collapse
        :id="value.devid"
        visible
        accordion="my-accordion"
        role="tabpanel"
      >
        <b-list-group>
          <b-list-group-item>
            <section
              v-for="(v1, i1, k1) in filter_key(value)"
              :key="k1"
              class="my-2 border-bottom"
            >
              <div v-if="typeof v1 == 'object'">
                <strong>{{ lang.get(i1) }}:</strong>
                <span class=" d-none d-sm-inline"
                  ><small>上限值:</small
                  ><i class="text-success mx-1">{{ v1[0] }}</i
                  ><small>/下限值:</small
                  ><i class="text-success mx-1">{{ v1[1] }}</i
                  ><small>/当前值</small></span
                >
                <i class="text-success mx-1">{{ v1[2] }}</i>
                <small class="mx-1">{{
                  unit.has(i1) ? unit.get(i1) : ""
                }}</small>

                <b-button
                  variant="info"
                  @click="toline({ type: id, devid: value.devid, attr: i1 })"
                  class="card-link float-right block el-icon-pie-chart px-1 py-0 pt-1"
                  v-if="Number(v1[2])"
                  >趋势</b-button
                >
              </div>
              <div v-else>
                <strong>{{ lang.get(i1) }}:</strong>
                <i class="text-success mx-2">{{ v1 }}</i>
                <small>{{ unit.has(i1) ? unit.get(i1) : "" }}</small>
                <b-button
                  variant="info"
                  @click="toline({ type: id, devid: value.devid, attr: i1 })"
                  class="card-link float-right block el-icon-pie-chart  px-1 py-0 pt-1"
                  v-if="Number(v1)"
                  >趋势</b-button
                >
              </div>
            </section>
          </b-list-group-item>
        </b-list-group>
      </b-collapse>
      <!-- <b-collapse
        :id="value.devid + 1"
        visible
        accordion="my-accordion"
        role="tabpanel"
        class="p-10"
        v-if="id != 'io'"
      >
        <v-line :devType="id" :devid="value.devid"></v-line>
      </b-collapse> -->
    </b-col>
  </b-row>
</template>

<script>
import ChartGuage from "../components/ChartGuage";
import ChartHistogram from "../components/chartHistogram";
import { mapState, mapGetters } from "vuex";
import { Get_user_all_devs, Get_devs_list_single } from "../util/axios";
export default {
  data() {
    return {
      card_img: require("../assets/25-600x300.jpg"),
      hidd_key: new Set(["generateTime", "name", "devid", "_id", "DateTime"])
    };
  },
  components: {
    ChartGuage,
    ChartHistogram
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    ...mapState(["dev", "user", "token"]),
    ...mapGetters(["lang", "unit"])
  },
  methods: {
    toline({ type, devid, attr }) {
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
    },
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
