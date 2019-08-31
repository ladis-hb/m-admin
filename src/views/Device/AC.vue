<template>
  <b-container class=" h-100">
    <b-row id="ac_flow_chart">
      <b-col cols="12"><separated :title="ac.name"></separated></b-col>
      <b-col cols="12" md="4">{{ ac }}</b-col>
      <b-col cols="12" md="2"></b-col>
      <b-col cols="12" md="3"></b-col>
      <b-col cols="12" md="3"></b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import separated from "../../components/separated";
export default {
  data() {
    return {
      devid: this.$route.params.devid
    };
  },
  components: {
    separated
  },
  computed: {
    ...mapState(["dev"]),
    ...mapGetters(["lang", "unit"]),
    ac() {
      return this.dev.ac[this.devid];
    }
  }
};
</script>

<style lang="scss" scoped></style>
