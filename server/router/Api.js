/* jshint esversion:8 */
/* 由于安卓端程序变更，api暂时弃用，测试用例位于../util/update_data.js + Alarm_Test_Data.js */

const event = require("../event/index");
const { Alarm } = require("../mongoose/alarm");
module.exports = async (ctx, next) => {
  let {
    params: { id }
  } = ctx;
  if (["dev", "Alarm"].includes(id)) {
    switch (id) {
      /* case "dev":
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
        }
         break;*/
      case "Alarm":
        {
          /* let {
            DeviceId,
            Alarm_msg,
            Alarm_type,
            Alarm_device,
            Alarm_level,
            Alarm_time
          } = ctx.request.body;
          let Alarms = {
            DeviceId,
            Alarm_time,
            Alarm_msg,
            Alarm_device,
            Alarm_level,
            Alarm_type,
            DateTime: Date.now(),
            confirm: false,
            confirm_user: "",
            confirm_time: null
          };
          // */
          let alarminfo = new Alarm(ctx.request.body);
          alarminfo.save((err, res) => {
            //console.log(res);
            event.emit("Alarm", res);
            ctx.body = {
              code: 200,
              msg: `Alarm submission successful`,
              req: res
            };
          });
        }
        break;
    }
  }
  await next();
};
