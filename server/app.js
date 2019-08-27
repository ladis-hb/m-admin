/* jshint esversion:8 */
const Koa = require("koa");
const IO = require("koa-socket-2");
const KoaStatic = require("koa-static");
const path = require("path");
const Logger = require("koa-logger");
const mongo = require("koa-mongo");
const MongoClient = require("mongodb").MongoClient;
const body = require("koa-body");
const error = require("koa-error");
const EventEmitter = require("events").EventEmitter;

const config = require("./config");
const router = require("./router/index");
const saveLog = require("./util/SaveLog");
const format = require("./util/Format");

const app = new Koa();
const io = new IO();
const event = new EventEmitter();
const Client = MongoClient.connect("mongodb://localhost:27017/devs", {
  useNewUrlParser: true
});

//存取所有设备devid:Set[user]
const devsMap = new Map();
//存取所有连接socket user:socket.id
const userMap = new Map();
//存取所有连接socket socket.id:user,方便删除使用
const socketIdMap = new Map();
//存储root用户
const rootSet = new Set();

app.context.event = event;
/* 
最后拦截error
*/
app.use(error());

app.use(saveLog());
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  await next();
});
//app.use(Logger());
app.use(mongo({ db: config.DB_dev }));
app.use(body());

/* 
Socket.io
*/
io.attach(app);
/* 
监听连接事件，
*/
app.io.on("connection", async socket => {
  event.emit("onlien", {
    type: "onlien",
    msg: `新的Socket用户连接，Socket.id: ${socket.id}`
  });

  socket.on("register", data => {
    let { user, token } = data;
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
});

//
event.on("Alarm", async data => {
  if (!devsMap.get(data.DeviceId)) return false;
  let { user } = devsMap.get(data.DeviceId) || null;
  if (!user) return;
  user.forEach(u => {
    io.to(userMap.get(u)).emit("Alarm", data);
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
        io.to(userMap.get(u)).emit("newDevs", { devType, devs });
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
      io.to(userMap.get(u)).emit("lineInfo", sendInfo);
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
/* async function infoStream(infoType, line, msg, toID) {
  infoType = ["Device", "Socket"][infoType];
  let generateTime = format.formatDate();
  //console.log(`Socket.IO  ${generateTime}   ${infoType}  ${line}  ${msg}`);

  let db = await cm.Connect();
  db.db(config.DB_log)
    .collection(config.DB_log_socket)
    .insertOne({
      infoType,
      line,
      msg,
      generateTime,
      user: toID || "no record"
    });
  if (rootSet.size == 0) {
    let rootUser = await db
      .db(config.DB_dev)
      .collection(config.DB_user_users)
      .find({ userGroup: "root" })
      .project({ _id: 0, user: 1 })
      .toArray();
    rootUser.forEach(val => {
      rootSet.add(val.user);
    });
  }
  rootSet.forEach(u => {
    if (userMap.has(u)) {
      let online_user = [];
      userMap.forEach((val, key) => {
        online_user.push({ user: key, socketId: val });
      });
      let online_devs = [];
      devsMap.forEach((val, key) => {
        online_devs.push({
          devid: key,
          devType: val.devType,
          user: val.user.join("/")
        });
      });
      io.to(userMap.get(u)).emit("infoStream", {
        info: { infoType, line, msg, generateTime },
        onlinelist: {
          devs: online_devs,
          user: online_user
        }
      });
    }
  }); */
/* 

 */
/* 
挂载路由
*/
app.use(router.routes()).use(router.allowedMethods());

/* 
SPA网站挂载
*/
app.use(KoaStatic(path.join(__dirname, config.dist)));

let port = config.development ? config.development_port : config.port;
console.log(`static is run port:${port}`);

app.listen(port, () => {
  console.log(`App listening on http:\/\/127.0.0.1:${port}`);
  console.log("App listening on router /api!");
  console.log("App listening on router /get");
  console.log("App listening on static");
});
