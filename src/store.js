/* jshint esversion:8 */
import Vue from "vue";
import Vuex from "vuex";
import { language } from "./util/language";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: sessionStorage.getItem("token") || "",
    user: sessionStorage.getItem("user") || "cairui",
    language,
    lang: "cn",

    devs_line_length: 10,
    dev: {
      ups: {},
      ac: {},
      power: {},
      io: {},
      th: {}
    },
    devs: {
      ups: {},
      ac: {},
      power: {},
      io: {},
      th: {}
    }
  },
  mutations: {
    //退出登录，注销state
    loginOut(state) {
      state.token = sessionStorage.getItem("token") || "";
      state.user = sessionStorage.getItem("user") || "";
    },
    //设置用户，token
    setUser(state, payload) {
      let { user, token } = payload;
      state.user = user;
      state.token = token;
    },
    newDevs(state, payload) {
      let { devType, devs } = payload;
      let { devid } = devs;
      if (!state.dev[devType][devid]) Vue.set(state.dev[devType], devid, {});
      state.dev[devType][devid] = devs;

      if (!state.devs[devType][devid]) Vue.set(state.devs[devType], devid, []);
      if (state.devs[devType][devid].length > state.devs_line_length)
        state.devs[devType][devid].shift();

      if (devType != "power") {
        state.devs[devType][devid].push(devs);
      } else {
        let power = JSON.parse(JSON.stringify(devs));
        let metrics = [
          "active_power",
          "reactive_power",
          "power_factor",
          "quantity",
          "input_voltage",
          "input_voltage_l1",
          "input_voltage_l2",
          "input_voltage_l3",
          "input_current",
          "input_current_l1",
          "input_current_l2",
          "input_current_l3",
          "input_frequency",
          "input_frequency_l1",
          "input_frequency_l2",
          "input_frequency_l3"
        ];

        metrics.forEach(key => {
          devs[key] = power[key][2] || 0;
        });
        state.devs[devType][devid].push(devs);
      }

      console.log(1);
    }
  },
  actions: {
    async newDevs({ commit }, payload) {
      commit("newDevs", await payload);
    },
    async infoStream(/* { commit }, payload */) {}
  },
  getters: {
    lang: ({ lang, language }) => {
      var selang = new Map();
      for (var [key, val] of Object.entries(language)) {
        selang.set(key, val[lang]);
      }
      return selang;
    }
  }
});
