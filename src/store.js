/* jshint esversion:8 */
import Vue from "vue";
import Vuex from "vuex";
import { language } from "./util/language";
import { unit } from "./util/unit";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: sessionStorage.getItem("token") || "",
    user: sessionStorage.getItem("user") || "cairui",
    language,
    lang: "cn",
    unit,

    devs_line_length: 500,
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
    },
    devsSet: new Set(),
    Alarm: {
      Alarm_msg: "点击查看报警"
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
      let { devid, generateTime } = devs;
      //add dev
      if (!state.dev[devType][devid]) {
        state.devsSet.add(devid);
        Vue.set(state.dev[devType], devid, {});
        Vue.set(state.devs[devType], devid, {});
      }
      Object.entries(devs).map(val => {
        if (!state.dev[devType][devid][val[0]]) {
          Vue.set(state.dev[devType][devid], val[0], val[1]);
          Vue.set(state.devs[devType][devid], val[0], []);
        } else {
          state.dev[devType][devid][val[0]] = val[1];
          state.devs[devType][devid][val[0]].push({
            [val[0]]: val[1][2] || val[1],
            generateTime: generateTime.split(" ")[1]
          });
        }
      });
    },
    /* 配置Alarm */
    setAlarm(state, payload) {
      state.Alarm = payload;
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
    },
    unit: ({ unit }) => {
      var seunit = new Map();
      for (let [key, val] of Object.entries(unit)) {
        seunit.set(key, val);
      }
      return seunit;
    }
  }
});
