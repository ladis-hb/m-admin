/* jshint esversion:8 */
const config = require("../../config");
const { formartBody, Validation_root_Group } = require("../../util/Format");

const admin_get_info_list = async ctx => {
  /* let { index } = ctx.query;
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
  } */
};

const modify_user_info = async (ctx, u) => {
  let { mail, name, orgin, tel } = ctx.query;
  let result = await await ctx.db
    .collection(config.DB_user_users)
    .updateOne({ mail }, { $set: { name, orgin, tel } }, { upsert: true });
  ctx.body = formartBody("success", "", result);
  ctx.log = { type: config.DB_log_run, msg: "修改用户信息" };
};
//new phone
const Get_User_list = async ctx => {
  let result = await ctx.db
    .collection(config.DB_user_users)
    .find()
    .project({ _id: 0, passwd: 0, token: 0 })
    .toArray();
  ctx.body = formartBody("success", "已获取所有设备数据", result);
};
//disable_select_user
const disable_select_user = async ctx => {
  let { selectUser, status } = ctx.query;

  if (await Validation_root_Group(ctx, selectUser))
    return (ctx.body = formartBody("warn", "禁止修改管理组账户状态"));

  let result = await ctx.db.collection(config.DB_user_users).updateOne(
    { user: selectUser },
    {
      $set: { status: JSON.parse(status), userGroup, modifyTime: new Date() }
    }
  );
  ctx.body = formartBody(
    "success",
    `已${!status ? "启用" : "禁用"}/${selectUser}用户账户`,
    result.result
  );
  ctx.log = {
    type: config.DB_log_run,
    msg: `已${!status ? "启用" : "禁用"}/${selectUser}用户账户`
  };
};
//delete_select_user
const delete_select_user = async ctx => {
  let { selectUser } = ctx.query;

  if (await Validation_root_Group(ctx, selectUser))
    return (ctx.body = formartBody("warn", "禁止操作管理组账户状态"));

  let result = await ctx.db
    .collection(config.DB_user_users)
    .deleteOne({ user: selectUser });
  ctx.body = formartBody(
    "success",
    `已删除用户${selectUser}账户`,
    result.result
  );
  ctx.log = {
    type: config.DB_log_run,
    msg: `已删除用户${selectUser}账户`
  };
};
//modify_select_user
const modify_select_user = async ctx => {
  let { selectUsers } = ctx.query;
  let { user, mail, name, orgin, tel, userGroup } = JSON.parse(selectUsers);
  userGroup = userGroup == "user" ? userGroup : "user";
  if (await Validation_root_Group(ctx, user))
    return (ctx.body = formartBody("warn", "禁止操作管理组账户状态"));
  let result = await ctx.db
    .collection(config.DB_user_users)
    .updateOne(
      { user },
      { $set: { mail, name, orgin, tel, userGroup, modifyTime: new Date() } }
    );
  ctx.body = formartBody("success", `已修改用户${user}账户`, result.result);
  ctx.log = {
    type: config.DB_log_run,
    msg: `已修改用户${user}账户`
  };
};
//Get_devs_list
const Get_devs_list = async ctx => {
  let Devs_all = await ctx.db
    .collection(config.DB_dev_all)
    .find()
    .project({ _id: 0, data: 0 })
    .toArray();
  let Devs_all_promise = Devs_all.map(async (val, key) => {
    let user = await ctx.db
      .collection(config.DB_user_dev)
      .find({ "dev.devid": val.devid })
      .project({ _id: 0, user: 1 })
      .toArray();
    val.user = user.map(u => {
      return u.user;
    });
    return val;
  });
  let p = await Promise.all(Devs_all_promise);
  ctx.body = formartBody("success", `获取所有devid=user,此操作为长查询，`, p);
};

module.exports = {
  admin_get_info_list,
  modify_user_info,
  Get_User_list,
  disable_select_user,
  delete_select_user,
  modify_select_user,
  Get_devs_list
};
