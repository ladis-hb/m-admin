<template>
  <b-row>
    <b-col cols="12">
      <separated :title="$t('root.online.6m5hai')"></separated>
      <b-table
        :items="root.infos"
        :fields="info_fields"
        hover
        borderless
        bordered
        head-variant="dark"
        sticky-header="400px"
      >
        <template v-slot:cell(generateTime)="data">
          <b>{{ $d(new Date(data.value), "long") }}</b>
        </template>
      </b-table>
    </b-col>
    <b-col cols="12">
      <separated :title="$t('root.online.3e0ggg')"></separated>
      <b-table
        :items="root.usersMap"
        :fields="users_fields"
        hover
        borderless
        bordered
        head-variant="dark"
        primary-key="generateTime"
        sticky-header="400px"
      ></b-table>
    </b-col>
    <b-col cols="12">
      <separated :title="$t('root.online.sc9ync')"></separated>
      <b-table
        :items="root.devsMap"
        :fields="devs_fields"
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
import separated from "../../components/separated.vue";
export default {
  data() {
    return {
      info_fields: [
        {
          key: "generateTime",
          label: this.$t("root.online.o0f7o4"),
          sortable: true
        },
        { key: "type", label: this.$t("root.online.icx6zc"), sortable: true },
        { key: "msg", label: "Message" },
        { key: "user", label: this.$t("root.online.qlqnkm"), sortable: true }
      ],
      devs_fields: [
        { key: "clientID", label: this.$t },
        { key: "users", label: this.$t("root.online.qlqnkm") }
      ],
      users_fields: [
        { key: "user", label: this.$t("root.online.qlqnkm"), sortable: true },
        { key: "socketID" }
      ]
    };
  },
  computed: {
    root() {
      let { usersMap, infos, devsMap } = this.$store.state.root;
      usersMap = [...usersMap.entries()].map(el => {
        return {
          user: el[0],
          socketID: el[1]
        };
      });
      devsMap = [...devsMap.entries()].map(el => {
        return {
          clientID: el[0],
          users: el[1]
        };
      });
      return { usersMap, infos, devsMap };
    }
  },
  components: {
    separated
  }
};
</script>

<style lang="scss" scoped></style>
