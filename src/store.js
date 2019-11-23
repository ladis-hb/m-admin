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
      state.Alarm.Alarm_Data = payload;
    },
    confirm_alarm(state, payload) {
      let { key, confirm, confirm_user, confirm_time } = payload;
      state.Alarm.Alarm_Data[key] = Object.assign(state.Alarm.Alarm_Data[key], {
        confirm,
        confirm_user,
        confirm_time
      });
    }
  },
  actions: {
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
