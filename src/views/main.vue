<template>
  <b-row id="main">
    <b-col cols="12" @click="toAlarm">
      <b-alert
        variant="warning"
        show
        class="m-1 p-2 overflow-auto text-nowrap"
        >{{ Alarm.Alarm_msg }}</b-alert
      >
    </b-col>
    <b-col
      cols="12"
      md="6"
      v-for="(key, id) in filter_devType(dev)"
      :key="id"
      :id="key"
    >
      <b-card
        class="my-2"
        :title="lang.get(key)"
        sub-title="所有设备"
        @click="to(key)"
      >
        <b-card-body class="px-0">
          <ul class="p-0">
            <li
              v-for="(val, id) in devs[key]"
              :key="id"
              class="el-icon-link w-100"
              v-b-tooltip.hover
              :title="id"
            >
              <span class="text-center">{{ val.name || id }}</span>
              <div class=" float-right ">
                <div v-show="val.online">
                  <span class="mr-2">已连接</span>
                  <b-spinner
                    variant="success"
                    type="grow"
                    label="Spinning"
                    small
                  ></b-spinner>
                </div>
                <div v-show="!val.online">
                  <span class="mr-2">尝试连接</span>
                  <b-spinner variant="info" label="Spinning" small></b-spinner>
                </div>
              </div>
            </li>
          </ul>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
const io = require("socket.io-client")("http://localhost:81");
import { mapState, mapGetters } from "vuex";
import { Get_user_all_devs } from "../util/axios";
import { Loading, MessageBox, Message /* Notification */ } from "element-ui";
export default {
  data() {
    return {
      devs: {
        ups: {},
        ac: {},
        power: {},
        io: {},
        th: {}
      }
    };
  },
  computed: {
    ...mapState({ user: "user", token: "token", dev: "dev", Alarm: "Alarm" }),
    ...mapGetters({ lang: "lang" })
  },
  methods: {
    filter_devType(dev) {
      return Object.keys(dev);
    },
    to(key) {
      this.$router.push({ path: `/dev/${key}` });
    },
    toAlarm() {
      this.$router.push({ path: "/alarm" });
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
            let {
              devType,
              devs: { devid, name, generateTime }
            } = data;
            let old = this.devs[devType][devid];
            this.devs[devType][devid] = Object.assign(old || {}, {
              name,
              generateTime,
              online: true
            });
          });
          io.on("Alarm", data => {
            this.$store.commit("setAlarm", data);
          });
        }
        {
          /* 
      获取用户所有设备列表
      */
          let main_page = Loading.service({ target: "#main" });
          Get_user_all_devs({
            user: this.user,
            token: this.token
          })
            .then(result => {
              main_page.close();
              let { code, msg, data } = result.data;
              if (code != 200) return;
              let dev = data[0].dev;
              for (let d of dev) {
                let { type, devid } = d;
                if (!this.devs[type][devid])
                  this.$set(this.devs[type], devid, {
                    devid,
                    online: false,
                    name,
                    generateTime: ""
                  });
              }
              console.log(msg);
              //Message(msg);
            })
            .catch(err => {
              Message(err);
              MessageBox.confirm(
                `您还没有绑定任何设备，请先添加设备使用`,
                "err"
              )
                .then(() => {
                  this.$router.push("/SetMain");
                })
                .catch(() => {
                  this.$router.push("/");
                });
            });
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

<style lang="scss" scoped></style>
