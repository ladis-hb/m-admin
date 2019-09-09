<template>
  <b-container class=" bg-light d-flex flex-column h-100">
    <b-row id="homePage">
      <b-col id="Switch_quantity" cols="12" class=" border-bottom ">
        <b-row class="p-2">
          <b-col cols="4" class=" text-center p-0">
            <switch-quantity
              title="烟感"
              :variantBg="devFirst(dev.io, 'smoke')"
            ></switch-quantity>
          </b-col>
          <b-col cols="4" class=" text-center p-0">
            <switch-quantity
              title="漏水"
              :variantBg="devFirst(dev.io, 'leak')"
            ></switch-quantity>
          </b-col>
          <b-col cols="4" class=" text-center p-0">
            <switch-quantity
              title="门磁"
              :variantBg="devFirst(dev.io, 'access_contral')"
            ></switch-quantity>
          </b-col>
        </b-row>
      </b-col>
    </b-row>

    <b-row class=" overflow-hidden Alarm">
      <div id="Alarm" class=" overflow-auto mh-100 w-100">
        <b-list-group class="alarm-list-mh overflow-auto " id="alarm-list">
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
              <b class="m-0">
                {{ val.Alarm_msg }}
              </b>
            </div>
            <small>{{ val.Alarm_time }}</small>
            <!-- <b-collapse
              :id="'alarm' + key"
              accordion="my-accordion2"
              role="tabpanel"
              class=" alarm-collapse"
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
            </b-collapse> -->
          </b-list-group-item>
        </b-list-group>
      </div>
    </b-row>
    <b-row id="Critical" class=" m-0  border-top mt-auto">
      <b-col cols="6" md="3" class="m-0 p-0">
        <span class="text-Critical"
          ><i class="iconfont text-success">&#xe602;</i>UPS负载:{{
            devFirst(dev.ups, "output_load")
          }}%</span
        >
      </b-col>
      <b-col cols="6" md="3" class="m-0 p-0">
        <span class="text-Critical"
          ><i class="iconfont text-primary">&#xe600;</i>UPS功率:{{
            devFirst(dev.ups, "output_frequency")
          }}%</span
        >
      </b-col>

      <b-col cols="6" md="3" class="m-0 p-0">
        <span class="text-Critical"
          ><i class="iconfont text-success">&#xe603;</i>电池电压:{{
            devFirst(dev.ups, "battery_voltage")
          }}V</span
        >
      </b-col>
      <b-col cols="6" md="3" class="m-0 p-0">
        <span class="text-Critical"
          ><i class="iconfont text-info">&#xe605;</i>电池容量:{{
            devFirst(dev.ups, "output_load")
          }}Kw</span
        >
      </b-col>
      <b-col cols="6" md="3" class="m-0 p-0">
        <span class="text-Critical"
          ><i class="iconfont text-success">&#xe604;</i>冷通道温度:{{
            devFirst(dev.th, "temperature")
          }}&#8451;</span
        >
      </b-col>
      <b-col cols="6" md="3" class="m-0 p-0">
        <span class="text-Critical"
          ><i class="iconfont text-primary">&#xe601;</i>冷通道湿度:{{
            devFirst(dev.th, "humidity")
          }}%</span
        >
      </b-col>
      <b-col cols="6" md="3" class="m-0 p-0">
        <span class="text-Critical"
          ><i class="iconfont text-danger">&#xe604;</i>热通道温度:{{
            devFirst(dev.th, "temperature", 1)
          }}&#8451;</span
        >
      </b-col>
      <b-col cols="6" md="3" class="m-0 p-0">
        <span class="text-Critical"
          ><i class="iconfont text-warning">&#xe601;</i>热通道湿度:{{
            devFirst(dev.th, "humidity", 1)
          }}%</span
        >
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
const io = require("socket.io-client")(); //("http://localhost:81");
import { mapState, mapGetters } from "vuex";
import { Message, MessageBox } from "element-ui";
import SwitchQuantity from "../components/switchQuantity";
//import separated from "../components/separated";
import { GetAlarms, confirm_alarm } from "../util/axios";
export default {
  components: {
    SwitchQuantity
    //separated
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
      GetAlarms({ user: this.user, token: this.token })
        .then(({ data: { code, data: result, msg } }) => {
          if (code != 200) return MessageBox(msg);
          this.$store.commit("setAlarm", result);
        })
        .catch(err => {
          MessageBox(err, "error_Alarm");
        });
    },
    confirm_alarm(alarmId, key) {
      confirm_alarm({ user: this.user, token: this.token, alarmId })
        .then(({ data }) => {
          Message(data.msg);
          this.$store.commit("confirm_alarm", {
            key: key,
            confirm: true,
            confirm_user: this.user,
            confirm_time: new Date()
          });
        })
        .catch(err => {
          MessageBox(err, "error");
        });
    }
  },
  mounted() {
    this.$nextTick()
      .then(() => {
        {
          let register = () => {
            io.emit("register", { user: this.user, token: this.token });
          };
          io.on("connect", () => {
            console.log(`${Date()}:::Socket connect`);
            register();
          });
          io.on("reconnect", () => {
            console.log(`${Date()}:::Socket reconnect`);
            register();
          });
          io.on("disconnect", () => {
            console.log(`${Date()}:::Socket disconnect`);
          });
          io.on("newDevs", data => {
            data.status = true;
            this.$store.dispatch("newDevs", data);
          });
          io.on("Alarm", data => {
            //this.$store.commit("setAlarm", data);
            MessageBox.confirm(data.Alarm_msg, "新的告警消息", {
              confirmButtonText: "点击查看",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.$router.push({ name: "Alarm" });
            });
          });
        }
        {
          this.GetAlarms();
        }
        {
          /* 
      注册监听，loginout
      */
          this.$on("loginOut", () => {
            console.log("loginOut");
            Message("loginout");
            io.emit("disconnect");
          });
        }
      })
      .catch(err => {
        MessageBox(err, "main error");
      });
  }
};
</script>

<style lang="scss" scoped>
.text-Critical {
  font-size: 15px;
  text-align: center;
  white-space: nowrap;
}
@media screen and (max-width: 375px) {
  .Alarm {
    max-height: 180px;
  }
}
</style>
