<template>
  <b-container>
    <b-row class="m-0 overflow-auto">
      <b-col
        cols="12"
        v-for="(value, i0, key) in dev"
        :key="key"
        class=" mt-2 overflow-auto"
        @click="toDevice(value.devid)"
      >
        <b-card
          :title="$t('devs.xq1j6w') + value.name || value.devid"
          :sub-title="$t('devs.ao82ns') + value.devid"
        >
          <b-card-text>
            <i
              >{{ $t("devs.9x42hm") }}:{{
                $d(new Date(value.generateTime), "long")
              }}</i
            >
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { Get_user_all_devs, Get_devs_list_single } from "../util/axios";
export default {
  computed: {
    dev() {
      return this.$store.state.dev[this.$route.params.id] || {};
    }
  },
  methods: {
    //到device
    toDevice(devid) {
      this.$router.push({
        path: `/Device/${this.$route.params.id}`,
        query: { devid }
      });
    },
    //写入store，当有socket新数据传入会直接复写存档数据 */
    async check_offline_dev() {
      let online =
        Object.keys(this.dev).reduce((pre, cu) => {
          if (Array.isArray(pre)) return [...pre, cu];
          else return [pre, cu];
        }) || [];
      console.log(online);

      //获取用户所有设备
      let {
        data: { data: dev }
      } = await Get_user_all_devs();
      //刷选出不在线设备
      let dev_offline = dev.filter(id => {
        return !online.includes(id);
      });
      //获取所有不在线设备的数据单利
      dev_offline.forEach(async devid => {
        let {
          data: { data: singleInfo }
        } = await Get_devs_list_single({ devid });
        if (!singleInfo) return console.log(devid + "不存在");
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
