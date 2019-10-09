/* jshint esversion:8 */
const { ClientSocketMap, DevClientMap } = require("../store");
const config = require("../config");
const event = require("../event/index");
//const { io } = require("../socket/index");

const DevRegister = ({ data, socketid }) => {
  console.log(socketid);
  console.log(data);
};
const ReceiveData = async ({ data, socketid }) => {
  let { client, data: devData } = data;
  let {
    type,
    updateTime,
    data: { devid }
  } = devData;
  ClientSocketMap.set(client, socketid);
  DevClientMap.set(devid, client);
  //
  if (!["io", "phase", "th", "ac", "ups", "power"].includes(type)) return;
  //针对文档更新Array，$push or $addToSet
  {
    let deviceData = devData.data;
    event.emit("devs", { devs: deviceData, type });
    deviceData.DateTime = new Date();
    ctx.db.collection(config.DB_dev_class[type]).insertOne(deviceData);
    ctx.db
      .collection(config.DB_dev_all)
      .updateOne(
        { devid: data.devid, devType: type },
        { $set: { updateTime, data } },
        { upsert: true }
      );
  }
  {
    /* 判断IO状态量，状态异常send Alarm */
    if (type == "io") {
      let { devid, smoke, leak, access_contral } = data;
      let userlist = await ctx.db
        .collection(config.DB_user_dev)
        .find({ "dev.devid": devid })
        .project({ _id: 0, user: 1 })
        .toArray();

      if (!userlist || userlist.length == 0) return;
      userlist.map(async ({ user }) => {
        let [final] = await ctx.db
          .collection(config.DB_user_final)
          .find({ user })
          .project({
            _id: 0,
            smoke: 1,
            leak: 1,
            access_contral: 1,
            IO_alarm: 1
          })
          .toArray();
        if (!final) return;
        if (!final.IO_alarm) return;
        let Alarms = {
          DeviceId: devid,
          Alarm_time: new Date(),
          Alarm_msg: "",
          Alarm_device: "IO",
          Alarm_level: 3,
          Alarm_type: "状态异常",
          DateTime: Date.now(),
          confirm: false,
          confirm_user: "",
          confirm_time: null
        };
        if (final.access_contral != access_contral) {
          Alarms.Alarm_msg = `门磁故障，设定门磁状态${
            final.access_contral ? "常开" : "常闭"
          },监控门磁状态${access_contral ? "打开" : "关闭"}`;
          ctx.event.emit("Alarm", Alarms);
          await ctx.db.collection(config.DB_Alarm).insertOne(Alarms);
        }
        if (final.smoke != smoke) {
          Alarms.Alarm_msg = `门磁故障，设定门磁状态${
            final.smoke ? "常开" : "常闭"
          },监控门磁状态${smoke ? "打开" : "关闭"}`;
          ctx.event.emit("Alarm", Alarms);
          await ctx.db.collection(config.DB_Alarm).insertOne(Alarms);
        }
        if (final.leak != leak) {
          Alarms.Alarm_msg = `门磁故障，设定门磁状态${
            final.leak ? "常开" : "常闭"
          },监控门磁状态${leak ? "打开" : "关闭"}`;
          ctx.event.emit("Alarm", Alarms);
          await ctx.db.collection(config.DB_Alarm).insertOne(Alarms);
        }
      });
    }
  }
};

module.exports = { DevRegister, ReceiveData };
