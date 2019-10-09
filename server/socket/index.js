/* jshint esversion:8 */
const IO = require("koa-socket-2");
const io = new IO();

const event = require("../event/index");
const { ReceiveData } = require("../socket/dev");
const { userMap, socketIdMap } = require("../store");

module.exports = {
  io,
  attach: function(app) {
    io.attach(app);
    io.on("connection", async socket => {
      event.emit("onlien", {
        type: "onlien",
        msg: `新的Socket用户连接，Socket.id: ${socket.id}`
      });
      let socketID = socket.id;
      socket.on("register", data => {
        let { user } = data;
        userMap.set(user, socket.id);
        socketIdMap.set(socket.id, user);
        event.emit("onlien", {
          type: "register",
          msg: `Socket用户:（${user}）已连接，Socket.id: ${socket.id}`,
          user
        });
      });
      socket.on("disconnect", () => {
        let id = socket.id;
        let user = socketIdMap.get(socket.id);
        userMap.delete(socketIdMap.get(id));
        socketIdMap.delete(id);
        if (!user) return;
        event.emit("onlien", {
          type: "offlien",
          msg: `Socket用户:（${user}）已离线，Socket.id: ${id}`,
          user
        });
      });
      //设备注册，发送数据事件
      socket.on("receiveData", data => {
        ReceiveData({ data: data, socketid: socketID });
      });
    });
  }
};
