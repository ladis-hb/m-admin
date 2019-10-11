/* jshint esversion:8 */
const { ClientSocketMap, DevClientMap } = require("../store");
const event = require("../event/index");
const { devsMap } = require("../store");
const {
  Dev_all,
  Dev_ups,
  Dev_ac,
  Dev_power,
  Dev_io,
  Dev_th
} = require("../mongoose/dev");
const { User_dev, User_final } = require("../mongoose/user");
const { Alarm } = require("../mongoose/alarm");

const DevRegister = ({ data, socketid }) => {
  console.log(socketid);
  console.log(data);
};
//监听数据环控app socket Data
const ReceiveData = async ({ data, socketid }) => {
  let { client, data: devData } = data;
  let {
    type,
    //updateTime,
    data: { devid }
  } = devData;
  ClientSocketMap.set(client, socketid);
  DevClientMap.set(devid, client);
  //针对文档更新Array，$push or $addToSet
  {
    let deviceData = devData.data;
    // eslint-disable-next-line no-unused-vars
    let Devs = null;
    switch (type) {
      case "ups":
        Devs = new Dev_ups(deviceData);
        break;
      case "ac":
        Devs = new Dev_ac(deviceData);
        break;
      case "power":
        Devs = new Dev_power(deviceData);
        break;
      case "io":
        Devs = new Dev_io(deviceData);
        ValidationIO(deviceData);
        break;
      case "th":
        Devs = new Dev_th(deviceData);
        break;
    }
    if (!Devs) return;
    Devs.save();
    event.emit("devs", { devs: deviceData, type });
    Dev_all.updateOne(
      { devid: deviceData.devid, devType: type },
      { data: deviceData },
      { upsert: true }
    );
  }
};

module.exports = { DevRegister, ReceiveData };

async function ValidationIO(data) {
  /* 判断IO状态量，状态异常send Alarm */
  let { devid, smoke, leak, access_contral } = data;
  let userlist = await GetDeviceUser(devid);
  //console.log(userlist);

  userlist.forEach(async user => {
    let final = await User_final.findOne({ user })
      .select("smoke leak access_contral IO_alarm")
      .exec();
    if (!final) return;
    if (!final.IO_alarm) return;
    let Alarms = {
      DeviceId: devid,
      Alarm_msg: "",
      Alarm_device: "IO",
      Alarm_level: 3,
      Alarm_type: "状态异常",
      confirm: false
    };
    if (final.access_contral != access_contral) {
      Alarms.Alarm_msg = `门磁故障，设定门磁状态${
        final.access_contral ? "常开" : "常闭"
      },监控门磁状态${access_contral ? "打开" : "关闭"}`;
      event.emit("Alarm", Alarms);
      Alarm.insertOne(Alarms);
    }
    if (final.smoke != smoke) {
      Alarms.Alarm_msg = `烟感故障，设定烟感状态${
        final.smoke ? "常开" : "常闭"
      },监控烟感状态${smoke ? "打开" : "关闭"}`;
      event.emit("Alarm", Alarms);
      Alarm.insertOne(Alarms);
    }
    if (final.leak != leak) {
      Alarms.Alarm_msg = `漏水故障，设定漏水状态${
        final.leak ? "常开" : "常闭"
      },监控漏水状态${leak ? "打开" : "关闭"}`;
      event.emit("Alarm", Alarms);
      Alarm.insertOne(Alarms);
    }
  });
}

async function GetDeviceUser(devid) {
  let user = devsMap.get(devid);
  if (user) return user.user;
  let userObj = await User_dev.find({ "dev.devid": devid })
    .select("user")
    .exec();

  return userObj.map(el => {
    return el.user;
  });
}
