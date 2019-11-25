/* jshint esversion:8 */
import Vue from "vue";
import Vuex from "vuex";
import { GetAlarms } from "./util/axios";
import { language } from "./util/language";
import { unit } from "./util/unit";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
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
      Alarm_msg: "点击查看报警",
      Alarm_Data: []
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
    //添加新数据
    newDevs(state, payload) {
      let {
        result: { devType, devid, data },
        status
      } = payload;
      data.status = status || false;
      let dev = state.dev[devType][devid];
      if (!dev) Vue.set(state.dev[devType], devid, {});
      state.dev[devType][devid] = data;
      //
      let devs = state.devs[devType][devid];

      if (!devs) Vue.set(state.devs[devType], devid, []);
      if (devs.length > 200)
        state.devs[devType][devid] = state.devs[devType][devid].slice(
          50,
          devs.length - 1
        );
      state.devs[devType][devid].push(data);

      /* let { devType, devs, status } = payload;
      devs.status = status || false;
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
      }); */
    },
    /* 配置Alarm */
    setAlarm(state, payload) {
      state.Alarm.Alarm_Data.unshift(...payload);
    },
    confirm_alarm(state, payload) {
      let {
        key,
        data: { data }
      } = payload;
      Vue.set(state.Alarm.Alarm_Data[key], "confirm_time", data.confirm_time);
      Vue.set(state.Alarm.Alarm_Data[key], "confirm_user", data.confirm_user);
      Vue.set(state.Alarm.Alarm_Data[key], "confirm", data.confirm);
    }
  },
  actions: {
    //获取报警事件
    async GetAlarms({ commit, state }) {
      if (state.Alarm.Alarm_Data.length > 0) return;
      let {
        data: { code, data }
      } = await GetAlarms();
      if (code != 200) return;
      commit("setAlarm", data);
    },
    //socket监听设备接受数据
    async socket_devUpdate({ commit }, result) {
      commit("newDevs", Object.assign(result, { status: true }));
    },
    //监听socket连接事件，连接成功就注册设备
    async socket_connect({ state }) {
      if (!state.user || state.user == "") return;
      this._vm.$socket.client.emit("register", {
        user: state.user,
        token: state.token
      });
    },
    //socket监听报警事件
    async socket_DevAlarm({ _vm }, { result }) {
      console.log(result);

      _vm.$MessageBox
        .confirm(result.Alarm_msg, "新的告警消息", {
          confirmButtonText: "点击查看",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _vm.$router.push({ name: "Alarm" });
        });
    }
  },
  getters: {
    language: ({ language }) => lang => {
      if (lang != "en") lang = "cn";
      var selang = new Map();
      for (var [key, val] of Object.entries(language)) {
        selang.set(key, val[lang]);
      }
      return selang;
    },
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
