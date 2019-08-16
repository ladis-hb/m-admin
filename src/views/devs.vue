<template>
  <b-row>
    <b-col
      cols="12"
      v-for="(value, i0, key) in dev[id]"
      :key="key"
      class="mt-2"
    >
      <b-card class="my-2">
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
          <b-button
            variant="link"
            v-b-toggle="value.devid + 1"
            class="card-link float-right block el-icon-pie-chart"
            v-if="id != 'io'"
            >折线图</b-button
          >
        </b-card-body>
      </b-card>
      <b-collapse
        :id="value.devid"
        visible
        accordion="my-accordion"
        role="tabpanel"
      >
        <b-list-group>
          <b-list-group-item>
            <div v-for="(v1, i1, k1) in filter_key(value)" :key="k1">
              <strong>{{ lang.get(i1) }}:</strong>
              <span class="text-success ml-2">{{ v1 }}</span>
            </div>
          </b-list-group-item>
        </b-list-group>
      </b-collapse>
      <b-collapse
        :id="value.devid + 1"
        visible
        accordion="my-accordion"
        role="tabpanel"
        class="p-10"
        v-if="id != 'io'"
      >
        <v-line :devType="id" :devid="value.devid"></v-line>
      </b-collapse>
    </b-col>
  </b-row>
</template>

<script>
import vLine from "../components/vLine.vue";
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      card_img: require("../assets/25-600x300.jpg"),
      hidd_key: new Set(["generateTime", "name", "devid", "_id", "DateTime"])
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    ...mapState({ dev: "dev" }),
    ...mapGetters({ lang: "lang" })
  },

  filters: {},
  components: {
    vLine
  },
  methods: {
    filter_key(value) {
      let newValue = {};
      for (let key of Object.keys(value)) {
        if (!this.hidd_key.has(key)) newValue[key] = value[key];
      }
      return newValue;
    }
  }
};
</script>

<style lang="scss" scoped></style>
