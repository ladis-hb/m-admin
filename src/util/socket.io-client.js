/* jshint esversion:8 */
const IO = require("socket.io-client");
//const config = require("../config.js");

//export const io = IO("http://localhost:81");
export const io = IO();

/**
 *
 *
 * @param {*} {user,token}
 */
export const socketConnect = async ({ user, token }) => {
  function register() {
    io.emit("register", { user, token });
  }
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
};

/**
 *
 *
 * @param {*} events 监听事件
 * @returns  事件结果
 */
export const onEvent = async events => {
  return new Promise(res => {
    io.on(events, data => {
      res(data);
    });
  });
};

/**
 *
 *
 * @param {*} events  触发事件
 * @param {*} params  触发参数
 */
export const emitEvent = async (events, params) => {
  io.emit(events, params);
};
