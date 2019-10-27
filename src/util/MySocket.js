/* jshint esversion:8 */
export const io = require("socket.io-client")();
import { MessageBox, Message } from "element-ui";

export const MySocket = function(vue, { user, token }) {
  console.log("挂载socket服务。。。");

  let register = () => {
    io.emit("register", { user, token });
  };
  register();
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
  io.on("newDevs", data => {
    data.status = true;
    vue.$store.dispatch("newDevs", data);
  });
  io.on("Alarm", data => {
    //this.$store.commit("setAlarm", data);
    MessageBox.confirm(data.Alarm_msg, "新的告警消息", {
      confirmButtonText: "点击查看",
      cancelButtonText: "取消",
      type: "warning"
    }).then(() => {
      vue.$router.push({ name: "Alarm" });
    });
  });
  /* 
      注册监听，loginout
      */
  vue.$on("loginOut", () => {
    //console.log("loginOut");
    Message("loginout");
    io.emit("disconnect");
  });
};
