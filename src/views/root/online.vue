<template>
  <b-row v-show="online">
    <b-col cols="12">
      <separated title="Socket info"></separated>
      <b-table
        :items="socket.info"
        :fields="socket.info_fields"
        hover
        borderless
        bordered
        head-variant="dark"
        primary-key="generateTime"
        sticky-header="400px"
      >
      </b-table>
    </b-col>
    <b-col cols="12">
      <separated title="Socket Online User"></separated>
      <b-table
        :items="socket.onlinelist_users"
        :fields="socket.users_fields"
        hover
        borderless
        bordered
        head-variant="dark"
        primary-key="generateTime"
        sticky-header="400px"
      >
      </b-table>
    </b-col>
    <b-col cols="12">
      <separated title="Socket Online Device"></separated>
      <b-table
        :items="socket.onlinelist_devs"
        :fields="socket.devs_fields"
        hover
        borderless
        bordered
        head-variant="dark"
        primary-key="generateTime"
        sticky-header="400px"
      >
      </b-table>
    </b-col>
  </b-row>
</template>

<script>
const io = require("socket.io-client")("http://localhost:81");
import { mapState, mapGetters } from "vuex";
import separated from "../../components/separated.vue";
export default {
  name: "OnLine",
  data() {
    return {
      socket: {
        info: [],
        info_fields: {
          generateTime: {
            label: "生成时间",
            sortable: true,

            variant: "primary"
          },
          type: {
            label: "消息类型",
            sortable: true
          },

          msg: {
            label: "Message"
          },
          user: {
            label: "用户",
            sortable: true
          }
        },
        onlinelist_devs: [],
        devs_fields: {
          devType: {
            label: "设备类型",
            sortable: "true"
          },
          devid: {
            label: "设备Id"
          },
          user: {
            label: "所属用户"
          }
        },
        onlinelist_users: [],
        users_fields: {
          user: {
            label: "用户",
            sortable: true
          }
        }
      },
      online: true
    };
  },
  computed: {
    ...mapState({ user: "user", token: "token" }),
    ...mapGetters({ lang: "lang" })
  },
  methods: {},
  components: {
    separated
  },
  mounted() {
    this.$nextTick().then(() => {
      {
        /*
      注册socket连接
      */ let register = () => {
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
        io.on("lineInfo", r => {
          let {
            type,
            result, //: { type, msg, user, generateTime },
            data
          } = r;
          //console.log(r);
          if (!["user", "dev"].includes(type)) return;
          this.socket.info.unshift(result);
          switch (type) {
            case "user":
              this.socket.onlinelist_users = data.map(([user, socketId]) => {
                return { user, socketId };
              });
              break;
            case "dev":
              this.socket.onlinelist_devs = data;
              break;
          }
        });
      }
      {
        /*
      获取用户所有设备列表
      */
      }
    });
  }
};
</script>

<style lang="scss" scoped></style>
