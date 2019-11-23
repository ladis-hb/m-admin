<template>
  <b-container class=" h-100" fluid>
    <Header :title="lang.get('alarm')"></Header>
    <b-row>
      <b-col cols="12" class=" h-100 overflow-auto">
        <separated :title="lang.get('AM')"></separated>

        <b-list-group class="alarm-list-mh" id="alarm-list">
          <b-list-group-item
            v-for="(val, key) in Alarms"
            :key="key"
            v-b-toggle="'alarm' + key"
          >
            <div>
              <b-badge
                class="mr-2"
                pill
                :variant="val.confirm ? 'success' : 'warning'"
                >{{ val.confirm ? "已确认" : "未确认" }}</b-badge
              >
              <b class="m-0">
                {{ val.Alarm_msg }}
              </b>
            </div>
            <small>{{ val.Alarm_time }}</small>
            <b-collapse
              :id="'alarm' + key"
              visible
              accordion="my-accordion2"
              role="tabpanel"
            >
              <separated :title="'设备Id:' + val.DeviceId"></separated>
              <ul>
                <li>报警设备:{{ val.Alarm_device }}</li>
                <li>告警信息:{{ val.Alarm_msg }}</li>
                <li>告警类型:{{ val.Alarm_type }}</li>
                <li>告警级别:{{ val.Alarm_level }}</li>
                <li>确认:{{ val.confirm ? "已确认" : "未确认" }}</li>
                <li>确认人:{{ val.confirm_user }}</li>
                <li>确认时间:{{ val.confirm_time }}</li>
                <li class=" text-nowrap overflow-auto" v-show="!val.confirm">
                  索引:{{ val._id }}
                </li>
              </ul>
              <b-button
                variant="info"
                v-show="!val.confirm"
                block
                @click.prevent="confirm_alarm(val._id, key)"
                >确认</b-button
              >
            </b-collapse>
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Header from "../components/Header.vue";
import separated from "../components/separated.vue";
import { mapGetters, mapState } from "vuex";
import { GetAlarms, confirm_alarm } from "../util/axios.js";
import { MessageBox, Loading, Message } from "element-ui";
export default {
  data() {
    return {
      Alarms: []
    };
  },
  components: {
    Header,
    separated
  },
  computed: {
    ...mapState(["user", "token"]),
    ...mapGetters(["lang"])
  },
  methods: {
    /* GetAlarms */
    GetAlarms() {
      let alarmLoading = Loading.service();
      GetAlarms({ user: this.user, token: this.token })
        .then(({ data: { code, data: result, msg } }) => {
          alarmLoading.close();
          if (code != 200) return MessageBox(msg);
          this.Alarms = result;
        })
        .catch(err => {
          alarmLoading.close();
          MessageBox(err, "error");
        });
    },
    /* confirm_alarm */
    confirm_alarm(alarmId, key) {
      confirm_alarm({ user: this.user, token: this.token, alarmId })
        .then(({ data }) => {
          Message(data.msg);
          this.Alarms[key].confirm = true;
          this.Alarms[key].confirm_user = this.user;
          this.Alarms[key].confirm_time = new Date();
        })
        .catch(err => {
          MessageBox(err, "error");
        });
    }
  },
  mounted() {
    this.GetAlarms();
  }
};
</script>

<style lang="scss" scoped>
.alarm-list-mh {
  max-height: 1000px;
}
</style>
