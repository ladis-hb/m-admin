/* jshint esversion:8 */
const event = require("../event/index");
const { Alarm } = require("../mongoose/alarm");
const DevMongo = require("../mongoose/dev");
module.exports = async (ctx, next) => {
  let { id } = ctx.params;
  let body = ctx.request.body;

  if (!["dev", "Alarm", "uploadSetting"].includes(id)) return;
  switch (id) {
    case "dev":
      {
        let { data, date, devType, deviceCode, name } = body;
        if (typeof data == "string") data = JSON.parse(data);
        let clientID = deviceCode.split("@")[0];
        if (!["io", "th", "ac", "ups", "em"].includes(devType)) return false;
        let result = { deviceCode, result: {}, msg: "success", stat: false };
        let TempData = {};
        switch (devType) {
          case "ups":
            {
              TempData = {
                generateTime: date,
                name,
                brand: data["Ups Model"],
                devid: deviceCode,
                temperature: data["Max Temperature of the detecting pointers"],
                phase: data["Phase"],
                battery_voltage: data["Battery voltage"],
                output_frequency: data["Output frequency"],
                output_load: data["Output load percent"],
                DateTime: new Date(date),
                "Battery group number": data["Battery group number"],
                "Battery standard voltage per unit":
                  data["Battery standard voltage per unit"],
                "Battery capacity": data["Battery capacity"],
                "Nominal O/P Voltage": data["Nominal O/P Voltage"],
                "Output power factor": data["Output power factor"],
                "Nominal I/P Voltage": data["Nominal I/P Voltage"],
                "Positive BUS voltage": data["Positive BUS voltage"],
                "Negative BUS voltage": data["Negative BUS voltage"],
                "Output voltage": data["Output voltage"],
                "Rating Output Frequency": data["Rating Output Frequency"],
                "Battery remain time": data["Battery remain time"],
                "Input voltage": data["Input voltage"],
                "Rating Output Voltage": data["Rating Output Voltage"],
                "Rating Output Current": data["Rating Output Current"],
                "Input frequency": data["Input frequency"],
                "Battery piece number": data["Battery piece number"],
                DevType: data["DevType"],
                "P Battery voltage": data["P Battery voltage"],
                "Output current": data["Output current"],
                "Ups Mode": data["Ups Mode"],
                "Rating Voltage": data["Rating Voltage"],
                "N Battery voltage": data["N Battery voltage"]
              };
              let ups = new DevMongo.Dev_ups(TempData);
              result.result = await ups.save();
            }
            break;
          case "th":
            {
              TempData = {
                generateTime: date,
                name: name,
                devid: deviceCode,
                temperature: [...data["Temperature"]]
                  .slice(0, [...data["Temperature"]].length - 1)
                  .join(""),
                humidity: [...data["Humidity"]]
                  .slice(0, [...data["Humidity"]].length - 3)
                  .join(""),
                DateTime: new Date(date)
              };
              let th = new DevMongo.Dev_th(TempData);
              result.result = await th.save();
            }
            break;

          case "em":
            {
              let EffectiveVoltage = [...data["EffectiveVoltage"]];
              EffectiveVoltage =
                EffectiveVoltage.slice(0, EffectiveVoltage.length - 1).join(
                  ""
                ) || 0;
              let ActivePower = [...data["ActivePower"]];
              ActivePower =
                ActivePower.slice(0, ActivePower.length - 2).join("") || 0;
              let EffectiveCurrent = [...data["EffectiveCurrent"]];
              EffectiveCurrent =
                EffectiveCurrent.slice(0, EffectiveCurrent - 1).join("") || 0;
              //
              TempData = {
                generateTime: date,
                name: name,
                devid: deviceCode,
                EffectiveVoltage,
                ActivePower,
                EffectiveCurrent,
                DateTime: new Date(date)
              };
              let em = new DevMongo.Dev_power(TempData);
              result.result = await em.save();
            }
            break;
          case "ac":
            break;
        }

        //所有数据写入dev_all
        DevMongo.Dev_all.findOneAndUpdate(
          {
            devType: devType,
            devid: deviceCode
          },
          { $set: { data: TempData } },
          { upsert: true }
        ).then(result => {
          event.emit("devUpdate", { clientID, result });
        });
        DevMongo.Dev_Table.updateOne(
          { clientID },
          { $addToSet: { devlist: deviceCode } },
          { upsert: true }
        ).then((res, err) => {
          if (err) console.log(err);
          if (res) console.log(res);
        });
        if (result.result._id) {
          result.stat = true;
          result.result = {};
        }
        ctx.body = result;
      }

      /* 
        {
          var { type, updateTime, data, dataType } = ctx.request.body;

          if (["io", "phase", "th", "ac", "ups", "power"].includes(type)) {
            switch (dataType) {
              case "One":
                {
                  //针对文档更新Array，$push or $addToSet
                  event.emit("devs", { devs: data, type });
                  data.DateTime = new Date();
                  ctx.db.collection(config.DB_dev_class[type]).insertOne(data);
                  ctx.db
                    .collection(config.DB_dev_all)
                    .updateOne(
                      { devid: data.devid, devType: type },
                      { $set: { updateTime, data } },
                      { upsert: true }
                    );

                  //let res = await ctx.db.collection(type).replaceOne({devid: data.devid},data,{upsert:true})
                  ctx.status = 200;
                  ctx.body = {
                    code: 200,
                    msg: `Data submission successful`
                  };
                }
                break;

              case "Many":
                {
                  //如果后期data为同一devid的数组，取消for,改语句为 ,
                  //updateOne({ devid: val.devid }, { $addToSet: { dataArray: {$each:[data]} } }, { upsert: true })
                  for (let val of data) {
                    val.DateTime = new Date();
                    event.emit("devs", { devs: val, type });
                    ctx.db.collection(config.DB_dev_class[type]).insertOne(val);
                    ctx.db
                      .collection(config.DB_dev_all)
                      .updateOne(
                        { devid: val.devid, devType: type },
                        { $set: { updateTime, data: val } },
                        { upsert: true }
                      );
                  }
                  //await ctx.db.collection(type).deleteMany({ devid: { $in: devid_list } })
                  //let res = await ctx.db.collection(type).insertMany(data)
                  ctx.status = 200;
                  ctx.body = {
                    code: 201,
                    msg: `Data submission successful`
                    //res: { insertedCount: res.insertedCount, insertedIds: res.insertedIds }
                  };
                  ctx.log = ctx.body;
                }
                break;

              default:
                {
                  ctx.status = 200;
                  ctx.body = {
                    code: 202,
                    msg: `dataType参数只接受/One/Many,区分大小写`,
                    req: ctx.request.body
                  };
                  ctx.log = ctx.body;
                }
                break;
            }
            // 判断IO状态量，状态异常send Alarm
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
          } else {
            ctx.status = 200;
            ctx.body = {
              code: 203,
              msg: `type参数只接受'io', 'phase', 'th', 'ac', 'ups',区分大小写`,
              req: ctx.request.body
            };
            ctx.log = ctx.body;
          }
        } */
      break;
    //接受告警信息
    case "Alarm":
      {
        let alarminfo = new Alarm(ctx.request.body);
        alarminfo.save((err, result) => {
          if (err) return console.log(err);
          event.emit("DevAlarm", {
            clientID: result["DeviceId"].split("@")[0],
            result
          });
          ctx.body = {
            code: 200,
            msg: `Alarm submission successful`,
            req: result
          };
        });
      }
      break;
    //接受客户个性化配置
    case "uploadSetting":
      {
        let {
          AlarmSendSelect,
          http_uri,
          mail,
          webConnect,
          main_query,
          MacStr,
          tel,
          handle_wait_slim,
          SocketID,
          websocket_uri
        } = body;
        DevMongo.Dev_Table.updateOne(
          { clientID: MacStr.split("@")[0] },
          {
            $set: {
              AlarmSendSelect,
              http_uri,
              mail,
              webConnect,
              main_query,
              tel,
              handle_wait_slim,
              SocketID,
              websocket_uri
            }
          },
          { upsert: true }
        ).then(/* res => {
          //console.log(res);
        }); */);
        ctx.body = {
          code: 200,
          msg: `Setting submission successful`,
          req: body
        };
      }
      break;
  }

  await next();
};
