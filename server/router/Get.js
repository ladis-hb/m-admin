/* jshint esversion:8 */
const { formartBody, Validation_user } = require("../util/Format");
//userfunction
const {
  login,
  register,
  getmail_Verification_code,
  resetpasswd,
  modify_user_info_one,
  Get_user_info_one,
  Setfinal,
  Getfinal
} = require("./lib/user");

//devs fun
const {
  Dev_all_info,
  getUserInfo,
  addDevid,
  Get_devid_list,
  delete_Devid,
  Get_user_all_devs,
  Modify_devName,
  Search_history_dev,
  Get_devs_list_single
} = require("./lib/devs");

//log fun
const { Run_log_warring, Get_user_info } = require("./lib/log");

//admin fun
const {
  admin_get_info_list,
  modify_user_info,
  Get_User_list,
  disable_select_user,
  delete_select_user,
  modify_select_user,
  Get_devs_list
} = require("./lib/administrator");

//Alarm
const { GetAlarms, confirm_alarm } = require("./lib/alarm");

module.exports = async (ctx, next) => {
  let { params, query } = ctx;
  let { token, user } = query;
  console.log(params.id);

  if (!token) {
    switch (params.id) {
      case "login":
        console.log("login");
        await login(ctx);
        break;
      case "register":
        await register(ctx);
        break;
      case "getmail_Verification_code":
        await getmail_Verification_code(ctx);
        break;
      case "resetpasswd":
        await resetpasswd(ctx);
        break;
    }
  } else {
    //效验token是否有效
    let { status, u } = await Validation_user(ctx, { token, user });
    if (!status) {
      ctx.body = formartBody("error", "Token已失效，请重新登录刷新Token");
    } else {
      switch (params.id) {
        case "getUserInfo":
          await getUserInfo(ctx, u);
          break;
        case "Dev_all_info":
          await Dev_all_info(ctx, u);
          break;

        case "Run_log_warring":
          await Run_log_warring(ctx);
          break;
        case "Get_user_info":
          await Get_user_info(ctx);
          break;

        case "addDevid":
          await addDevid(ctx, u);
          break;

        case "Get_devid_list":
          await Get_devid_list(ctx, u);
          break;

        case "delete_Devid":
          await delete_Devid(ctx, u);
          break;

        case "admin_get_info_list":
          await admin_get_info_list(ctx);
          break;
        case "admin_modify_user_info":
          await modify_user_info(ctx, u);
          break;

        //phone pages only
        case "Get_user_all_devs":
          await Get_user_all_devs(ctx);
          break;
        case "modify_user_info_one":
          await modify_user_info_one(ctx);
          break;
        case "Get_user_info_one":
          await Get_user_info_one(ctx);
          break;
        case "GetAlarms":
          await GetAlarms(ctx);
          break;
        case "confirm_alarm":
          await confirm_alarm(ctx);
          break;
        case "Modify_devName":
          await Modify_devName(ctx);
          break;
        case "Get_User_list":
          await Get_User_list(ctx);
          break;
        case "disable_select_user":
          await disable_select_user(ctx);
          break;
        case "delete_select_user":
          await delete_select_user(ctx);
          break;
        case "modify_select_user":
          await modify_select_user(ctx);
          break;
        case "Get_devs_list":
          await Get_devs_list(ctx);
          break;
        //Search_history_dev
        case "Search_history_dev":
          await Search_history_dev(ctx);
          break;
        //Get_devs_list_single
        case "Get_devs_list_single":
          await Get_devs_list_single(ctx);
          break;
        case "Setfinal":
          await Setfinal(ctx);
          break;
        case "Getfinal":
          await Getfinal(ctx);
          break;
      }
    }
  }
  await next();
};
