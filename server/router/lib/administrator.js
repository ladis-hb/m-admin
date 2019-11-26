/* jshint esversion:8 */
const { Validation_root_Group } = require("../../util/Format");
const { Users, User_dev } = require("../../mongoose/user");
const { Dev_Table } = require("../../mongoose/dev");
const formatResult = require("../../util/formatResult");

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
  let allDevs = await Dev_Table.find();
  allDevs = allDevs.map(async el => {
    el.user = await User_dev.GetDevidUsers(el.clientID);
    return el;
  });
  /* let Devs_all = await Dev_all.find()
    .select({ _id: 0, data: 0 })
    .exec();
  let Devs_all_promise = Devs_all.map(async val => {
    val.user = await User_dev.GetDevidUsers(val.devid);
    return val;
  });
  let p = await Promise.all(Devs_all_promise); */
  ctx.body = formatResult(505, await Promise.all(allDevs));
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
