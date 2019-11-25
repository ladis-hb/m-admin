<template>
  <b-container class=" h-100" fluid>
    <Header :title="$t('Alarm.mevk0t')"></Header>
    <b-container>
      <b-row>
        <b-col cols="12">
          <separated :title="$t('Alarm.ps4cmm')"></separated>
          <b-pagination
            pills
            align
            v-model="currentPage"
            :total-rows="Alarms.length"
            :per-page="perPage"
          ></b-pagination>
          <b-list-group>
            <b-list-group-item
              v-for="(val, key) in Alarms.slice(
                currentPage * perPage - perPage,
                currentPage * perPage
              )"
              :key="key"
              v-b-toggle="'alarm' + key"
            >
              <div>
                <b-badge
                  v-if="val.confirm"
                  class="mr-2"
                  pill
                  variant="success"
                  >{{ $t("main.de85p8") }}</b-badge
                >
                <b-badge v-else class="mr-2" pill variant="warning">{{
                  $t("main.np09ab")
                }}</b-badge>
                <b class="m-0">
                  {{ val.Alarm_msg }}
                </b>
              </div>
              <small>{{
                val.Alarm_time ? $d(new Date(val.Alarm_time), "long") : ""
              }}</small>
              <b-collapse :id="'alarm' + key" visible accordion="my-accordion2">
                <separated :title="'DevId:' + val.DeviceId"></separated>
                <ul>
                  <li>{{ $t("Alarm.8dkiqp") }}:{{ val.Alarm_device }}</li>
                  <li>{{ $t("Alarm.44krmr") }}:{{ val.Alarm_msg }}</li>
                  <li>{{ $t("Alarm.rm5trk") }}:{{ val.Alarm_type }}</li>
                  <li>{{ $t("Alarm.aztpkq") }}:{{ val.Alarm_level }}</li>
                  <li>
                    {{ $t("Alarm.fbpszi") }}:{{
                      val.confirm ? $t("main.de85p8") : $t("main.np09ab")
                    }}
                  </li>
                  <li>{{ $t("Alarm.hk6dew") }}:{{ val.confirm_user }}</li>
                  <li>
                    {{
                      $t("Alarm.kljy5h") + val.confirm_time
                        ? $d(new Date(val.confirm_time), "long")
                        : ""
                    }}
                  </li>
                  <li class=" text-nowrap overflow-auto" v-show="!val.confirm">
                    {{ $t("Alarm.uiqua3") }}:{{ val._id }}
                  </li>
                </ul>
                <b-button
                  variant="info"
                  v-if="!val.confirm"
                  block
                  @click.prevent="
                    confirm_alarm(
                      val._id,
                      currentPage * perPage - perPage + key
                    )
                  "
                  >{{ $t("Alarm.5kxbeb") }}</b-button
                >
              </b-collapse>
            </b-list-group-item>
          </b-list-group>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>
import Header from "../components/Header.vue";
import separated from "../components/separated.vue";
import { confirm_alarm } from "../util/axios.js";
import { MessageBox, Message } from "element-ui";
export default {
  components: {
    Header,
    separated
  },
  data() {
    return {
      currentPage: 1,
      perPage: 10
    };
  },
  computed: {
    Alarms() {
      return this.$store.state.Alarm.Alarm_Data;
    }
  },
  methods: {
    confirm_alarm(alarmId, key) {
      confirm_alarm({ alarmId })
        .then(({ data }) => {
          Message(data.msg);
          this.$store.commit("confirm_alarm", { data, key: key });
        })
        .catch(err => {
          MessageBox(err, "error");
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
