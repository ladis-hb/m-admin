/* jshint esversion:8 */
const event = require("../../event/index");
const { User_dev } = require("../../mongoose/user");
const { Dev_all, Dev_list } = require("../../mongoose/dev");
const formatResult = require("../../util/formatResult");

const Dev_all_info = async ctx => {
  let devArray = await User_dev.GetUserDevs(ctx.query.user);
  if (devArray) {
    let devs = {};
    //遍历user_dev表，汇总分类设备
    devArray.forEach(val => {
      if (!devs[val.type]) devs[val.type] = [];
      devs[val.type].push(val.devid);
    });

    for (let key in devs) {
      devs[key] = await ctx.db
        .collection(key)
        .find({ devid: { $in: devs[key] } }, { _id: 0 })
        .toArray();
    }
    ctx.body = formatResult(200, devs);
  } else {
    ctx.body = formatResult(204, ctx.query);
  }
};

const addDevid = async ctx => {
  let { devid, devType, user } = ctx.query;
  await User_dev.updateOne(
    { user },
    { $addToSet: { dev: { type: devType, devid, devName: devid } } },
    { upsert: true }
  ).then(res => {
    ctx.body = formatResult(201, res);
    event.emit("adddevs", { devid, devType, user });
  });
};

const Get_devid_list = async ctx => {
  await User_dev.findOne({ user: ctx.query.user }).then(res => {
    ctx.body = formatResult(202, res);
  });
};

const delete_Devid = async ctx => {
  let { devid, user } = ctx.query;
  await User_dev.updateOne({ user }, { $pull: { dev: { devid } } }).then(
    res => {
      ctx.body = formatResult(203, res);
      event.emit("deldevs", { devid, user });
    }
  );
};
//new
const Get_user_all_devs = async ctx => {
  let { user } = ctx.query;
  let result = await User_dev.GetUserDevs(user);
  ctx.body = formatResult(210, result);
};
const Modify_devName = async ctx => {
  let { user, devid, devName } = ctx.query;
  let result = await User_dev.updateOne(
    { user, "dev.devid": devid },
    { $set: { "dev.$.devName": devName } }
  );
  Dev_all.updateOne({ devid }, { "data.name": devName });
  ctx.body = formatResult(211, result);
};
//new phone
const Search_history_dev = async ctx => {
  let { date, devType, devid, attr } = ctx.query;
  let date_start = new Date(date);
  let date_start_stamp = new Date(date).getTime();
  let date_end = date_start.setDate(date_start.getDate() + 1);
  let result = await Dev_list[devType]
    .find({ devid })
    .where("DateTime")
    .gte(new Date(date_start_stamp))
    .lte(new Date(date_end))
    .select({ _id: 0, [attr]: 1, generateTime: 1 })
    .limit(100)
    .exec();

  ctx.body = formatResult(
    100,
    result,
    `获取${devType}设备${devid}::参数:${attr},日期${date}`
  );
};
//Get_devs_list_single
const Get_devs_list_single = async ctx => {
  let { devid } = ctx.query;
  let result = await Dev_all.findOne({ devid });
  ctx.body = formatResult(212, result);
};

module.exports = {
  Dev_all_info,
  addDevid,
  Get_devid_list,
  delete_Devid,
  Get_user_all_devs,
  Modify_devName,
  Search_history_dev,
  Get_devs_list_single
};
