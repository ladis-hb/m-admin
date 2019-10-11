/* jshint esversion:8 */
//const config = require("../../config");
const { Validation_root_Group } = require("../../util/Format");
const { Users, User_dev } = require("../../mongoose/user");
const { Dev_all } = require("../../mongoose/dev");
const formatResult = require("../../util/formatResult");
/*
const admin_get_info_list = async ctx => {
  let { index } = ctx.query;
  switch (index) {
    case "usersList":
      let users = await ctx.db
        .collection(config.DB_user_users)
        .find()
        .project({
          _id: 0,
          creatTime: 1,
          name: 1,
          mail: 1,
          tel: 1,
          address: 1,
          orgin: 1
        })
        .toArray();
      ctx.body = formartBody("success", "", users);
      ctx.log = { type: config.DB_log_run, msg: "获取所有用户列表" };
      break;
    case "ups":
    case "ac":
    case "power":
    case "io":
    case "th":
      let devs = await ctx.db
        .collection(index)
        .find()
        .project({ _id: 0, generateTime: 1, name: 1, devid: 1, brand: 1 })
        .toArray();
      let devs_Set = new Set();
      let devs_serize = [];
      devs.reverse().map(val => {
        if (!devs_Set.has(val.devid)) {
          devs_Set.add(val.devid);
          devs_serize.push(val);
        }
      });
      ctx.body = formartBody("success", "", devs_serize);
      ctx.log = { type: config.DB_log_run, msg: "获取所有设备列表" };
      break;
  } 
};
*/
const modify_user_info = async ctx => {
  let { mail, name, orgin, tel } = ctx.query;
  let result = await await Users.updateOne(
    { mail },
    { $set: { name, orgin, tel } },
    { upsert: true }
  );
  ctx.body = formatResult(500, result);
};
//new phone
const Get_User_list = async ctx => {
  let result = await Users.find()
    .select({ _id: 0, passwd: 0, token: 0 })
    .exec();
  ctx.body = formatResult(501, result);
};
//disable_select_user
const disable_select_user = async ctx => {
  let { selectUser, status } = ctx.query;

  if (await Validation_root_Group(ctx, selectUser))
    return (ctx.body = formatResult(0, "", "禁止修改管理组账户状态"));

  let result = await Users.updateOne(
    { user: selectUser },
    {
      $set: { status: JSON.parse(status), modifyTime: new Date() }
    }
  );
  ctx.body = formatResult(502, result);
};
//delete_select_user
const delete_select_user = async ctx => {
  let { selectUser } = ctx.query;
  if (await Validation_root_Group(ctx, selectUser))
    return (ctx.body = formatResult(0, "", "禁止修改管理组账户状态"));
  //console.log({ user: selectUser });
  let result = await Users.deleteOne({ user: selectUser });
  ctx.body = formatResult(503, result);
};
//modify_select_user
const modify_select_user = async ctx => {
  let { selectUsers } = ctx.query;
  let { user, mail, name, orgin, tel, userGroup } = JSON.parse(selectUsers);
  userGroup = userGroup == "user" ? userGroup : "user";
  if (await Validation_root_Group(ctx, user))
    return (ctx.body = formatResult(0, "", "禁止修改管理组账户状态"));
  let result = await Users.updateOne(
    { user },
    { $set: { mail, name, orgin, tel, userGroup, modifyTime: new Date() } }
  );
  ctx.body = formatResult(504, result);
};
//Get_devs_list
const Get_devs_list = async ctx => {
  let Devs_all = await Dev_all.find()
    .select({ _id: 0, data: 0 })
    .exec();
  let Devs_all_promise = Devs_all.map(async val => {
    let user = await User_dev.find({ "dev.devid": val.devid })
      .select("user")
      .exec();

    val.user = user.map(u => {
      return u.user;
    });
    return val;
  });
  let p = await Promise.all(Devs_all_promise);
  ctx.body = formatResult(505, p);
};

module.exports = {
  //admin_get_info_list,
  modify_user_info,
  Get_User_list,
  disable_select_user,
  delete_select_user,
  modify_select_user,
  Get_devs_list
};
