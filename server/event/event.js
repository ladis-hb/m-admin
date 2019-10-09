/* jshint esversion:8 */
const MongoClient = require("mongodb").MongoClient;
const Client = MongoClient.connect("mongodb://localhost:27017/devs", {
  useNewUrlParser: true
});
const format = require("../util/Format");
const config = require("../config");
const { devsMap, userMap, rootSet } = require("../store");
const io = require("../socket/index");
const event = require("../event/index");

const on = () => {
  //监听连接事件，

  event.on("Alarm", async data => {
    if (!devsMap.get(data.DeviceId)) return false;
    let { user } = devsMap.get(data.DeviceId) || null;
    if (!user) return;
    user.forEach(u => {
      io.io.to(userMap.get(u)).emit("Alarm", data);
    });
  });
  //
  event.on("devs", async data => {
    let { devs, type } = data;
    let id = devs.devid;
    //判断设备map是否有此devid，有则判断usermap用户是否在线，在线则传输数据user
    if (devsMap.has(id)) {
      let { user, devType } = devsMap.get(id);
      user.forEach(async u => {
        if (userMap.has(u)) {
          io.io.to(userMap.get(u)).emit("newDevs", { devType, devs });
        }
      });
    } else {
      //设备map没有则连接数据库检索，set设备map
      let db = await Client;
      let devs_list = await db
        .db(config.DB_dev)
        .collection(config.DB_user_dev)
        .find({ "dev.devid": id })
        .project({ _id: 0, user: 1 })
        .toArray();
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
  });

  //online
  event.on("onlien", async result => {
    await result;
    result.generateTime = format.formatDate();
    Save_log(result);
    let { type, user } = result;
    if (type == "register") {
      if ((await Get_root_user()).includes(user)) rootSet.add(user);
    }
    if (type == "offlien") {
      if (rootSet.has(user)) rootSet.delete(user);
    }
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
        //sendInfo.data = [...devsMap.entries()];
        sendInfo.data = [...devsMap.entries()].map(([devid, arg]) => {
          let { devType, user } = arg;
          return { devid, devType, user: Array.from(user).join("|") };
        });
        break;
    }
    rootSet.forEach(u => {
      if (userMap.has(u)) {
        io.io.to(userMap.get(u)).emit("lineInfo", sendInfo);
      }
    });
  });
  function Save_log({ type, msg, user, generateTime }) {
    console.log(msg);
    Client.then(db => {
      db.db("devs")
        .collection(config.DB_log_socket)
        .insertOne({
          line: type,
          msg,
          generateTime,
          user: user || "no record"
        });
    }).catch(err => {
      console.log(err);
    });
  }
  function Get_root_user() {
    return Client.then(async db => {
      let user = await db
        .db("devs")
        .collection(config.DB_user_users)
        .find({ userGroup: "root" })
        .project({ _id: 0, user: 1 })
        .toArray();
      return user.map(u => {
        return u.user;
      });
    }).catch(err => {
      console.log(err);
    });
  }
};

module.exports = { on };
