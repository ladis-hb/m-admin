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
      ></b-table>
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
      ></b-table>
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
      ></b-table>
    </b-col>
  </b-row>
</template>

<script>
import { io } from "../../util/MySocket";
import { mapState, mapGetters } from "vuex";
import separated from "../../components/separated.vue";
export default {
  name: "OnLine",
  data() {
    return {
      socket: {
        info: [],
        info_fields: [
          {
            key: "generateTime",
            label: "生成时间",
            sortable: true,

            variant: "primary"
          },
          { key: "type", label: "消息类型", sortable: true },

          { key: "msg", label: "Message" },
          { key: "user", label: "用户", sortable: true }
        ],
        onlinelist_devs: [],
        devs_fields: [
          { key: "devType", label: "设备类型", sortable: "true" },
          { key: "devid", label: "设备Id" },
          { key: "user", label: "所属用户" }
        ],
        onlinelist_users: [],
        users_fields: [{ key: "user", label: "用户", sortable: true }]
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
        io.on("lineInfo", r => {
          let {
            type,
            result, //: { type, msg, user, generateTime },
            data
          } = r;
          ////console.log(r);
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
