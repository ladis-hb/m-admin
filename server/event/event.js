/* jshint esversion:8 */
const { User_dev, Users } = require("../mongoose/user");
const { log_socket } = require("../mongoose/log");
const format = require("../util/Format");
const { devsMap, userMap, rootSet, AppUserMap } = require("../store");
const { io } = require("../socket/index");
const event = require("../event/index");

const on = () => {
  //监听API数据上传事件
  event.on("devUpdate", async ({ clientID, result }) => {
    let userArray = await DevsMapValue(clientID);
    userArray.forEach(async user => {
      if (userMap.has(user))
        io.to(userMap.get(user)).emit("devUpdate", { clientID, result });
    });
  });
  //监听连接事件，
  event.on("DevAlarm", async ({ clientID, result }) => {
    let userArray = await DevsMapValue(clientID);
    userArray.forEach(async user => {
      if (userMap.has(user))
        io.to(userMap.get(user)).emit("DevAlarm", { clientID, result });
    });
  });
  //监听用户添加环控主机
  event.on("UserAddClient", async ({ devid, user }) => {
    let userArray = await DevsMapValue(devid);
    if (![...userArray].includes(user))
      devsMap.set(devid, new Set([...userArray, user]));
  });
  //
  /*
  event.on("devs", async data => {
    let { devs, type } = data;
    let id = devs.devid;
    //判断设备map是否有此devid，有则判断usermap用户是否在线，在线则传输数据user
    if (devsMap.has(id)) {
      let { user, devType } = devsMap.get(id);
      user.forEach(async u => {
        if (userMap.has(u)) {
          io.to(userMap.get(u)).emit("newDevs", { devType, devs });
        }
      });
    } else {
      //设备map没有则连接数据库检索，set设备map
      let devs_list = await User_dev.find({ "dev.devid": id })
        .select("user")
        .exec();
      //user is array
      let user = devs_list.map(u => {
        return u.user;
      });
      devsMap.set(id, { devType: type, user: new Set(user) });
      event.emit("devs", data);
      event.emit("onlien", {
        type: "devOnlien",
        msg: `新的Socket设备连接，Devid: ${id}`,
        user: "sys"
      });
    }
  });

  event.on("adddevs", async data => {
    //console.log(`add设备::${JSON.stringify(data)}`);
    let { devid, devType, user } = data;
    let { user: devUser } = devsMap.get(devid);
    devUser.add(user);
    devsMap.set(devid, { devType, user: devUser });
    event.emit("onlien", {
      type: "addDevice",
      msg: `用户${user}添加设备${devType}，设备号:${devid}`,
      user
    });
  });

  event.on("deldevs", async data => {
    let { devid, user } = data;
    let D = devsMap.get(devid);
    if (!D) return console.log(`设备：${devid} 不在线，无需在devmap中删除`);
    let { user: devUser, devType } = D;
    devUser.delete(user);
    devsMap.set(devid, { devType, user: devUser });
    event.emit("onlien", {
      type: "deleteDevice",
      msg: `用户${user}删除设备${devType}，设备号:${devid}`,
      user
    });
  });*/
  //oprate devcice
  event.on("OprateUPS", async data => {
    let { oprate, devid } = data;
    let clientID = devid.split("@")[0];
    let clientSocket = AppUserMap.get(clientID + "@");
    console.log(clientSocket);

    io.to(clientSocket).emit("operate", {
      Type: "Operate",
      DeviceCode: devid,
      OptCode: oprate,
      OptType: "operate"
    });
  });

  //online

  event.on("onlien", async result => {
    await result;
    result.generateTime = format.formatDate();
    Save_log(result);
    let { type, user } = result;
    if (type == "register" && (await Get_root_user()).includes(user))
      rootSet.add(user);
    if (type == "offlien" && rootSet.has(user)) rootSet.delete(user);
    if (rootSet.size == 0) return;

    let sendInfo = { type: "", result };
    switch (type) {
      case "offlien":
      case "register":
      case "onlien":
        sendInfo.type = "user";
        sendInfo.data = [...userMap.entries()];
        break;
      case "devOnlien":
      case "deleteDevice":
      case "addDevice":
        sendInfo.type = "dev";
        sendInfo.data = [...devsMap.entries()].map(([devid, arg]) => [
          devid,
          Array.from(arg)
        ]);
        break;
    }
    rootSet.forEach(u => {
      if (userMap.has(u)) io.to(userMap.get(u)).emit("lineInfo", sendInfo);
    });
  });
  function Save_log({ type, msg, user, generateTime }) {
    console.log(msg);
    let log = new log_socket({
      status: type,
      msg,
      generateTime,
      user: user || "no record"
    });
    log.save();
  }
  async function Get_root_user() {
    let roots = await Users.find({ userGroup: "root" }).select("user");
    return roots.map(u => {
      return u.user;
    });
  }
  //获取devsmap key,如果没有key，set新key，value
  async function DevsMapValue(clientID) {
    //判断devsmap是否包含客户端id
    if (!devsMap.has(clientID)) {
      //获取含义clientid的用户
      let userArray = await User_dev.GetDevidUsers(clientID);
      if (!userArray && userArray.length < 1) return [];
      devsMap.set(clientID, new Set(userArray));
    }
    return devsMap.get(clientID);
  }
};

module.exports = { on };
