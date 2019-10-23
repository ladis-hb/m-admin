/* jshint esversion:8 */
module.exports = (code, body, msg) => {
  let result = {
    code: 200,
    resultID: code,
    msg: msg || "success",
    stat: "success",
    data: body || null
  };
  switch (code) {
    case 0:
      result.stat = "warn";
      break;
    //login
    case 101:
      result.msg = "登录成功";
      result.stat = "login success";
      break;
    case 102:
      result.msg = "用户名或密码错误";
      result.stat = "login warn";
      break;
    case 103:
      result.msg = "用户登录失败-没有检索到用户名";
      result.stat = "login warn";
      break;
    //register
    case 110:
      result.msg = "注册成功";
      result.stat = "register success";
      break;
    case 111:
      result.msg = "注册账号格式错误";
      result.stat = "register warn";
      break;
    case 112:
      result.msg = "注册密码格式错误";
      result.stat = "register warn";
      break;
    case 113:
      result.msg = "注册密码不一致";
      result.stat = "register warn";
      break;
    case 114:
      result.msg = "参数字数超过限制值>20";
      result.stat = "register warn";
      break;
    case 115:
      result.msg = "账号或邮箱已被注册，请使用未被注册的用户";
      result.stat = "register warn";
      break;
    //getmail_Verification
    case 120:
      result.msg = "验证码已发送，请打开邮件查看";
      result.stat = "getmail_Verification success";
      break;
    case 121:
      result.msg = "此邮箱未注册";
      result.stat = "getmail_Verification warn";
      break;
    //resetpasswd
    case 130:
      result.msg = "密码已完成修改，请自主选择下一步操作";
      result.stat = "resetpasswd  success";
      break;
    case 131:
      result.msg = "二次输入密码不一致，请核对密码";
      result.stat = "resetpasswd warn";
      break;
    //devs
    case 200:
      result.msg = "获取用户所有设备";
      result.stat = "Get_Device_info success";
      break;
    case 201:
      result.msg = "用户添加数据完成";
      result.stat = "addDevid success";
      break;
    case 202:
      result.msg = "用户获取设备列表";
      result.stat = "Get_devid_list success";
      break;
    case 203:
      result.msg = "用户删除设备";
      result.stat = "delete_Devid success";
      break;
    case 204:
      result.msg = "用户没有设备";
      result.stat = "addDevid warn";
      break;
    case 210:
      result.msg = "new 用户获取所有设备";
      result.stat = "Get_user_all_devs success";
      break;
    case 211:
      result.msg = "用户修改设备别名";
      result.stat = "Modify_devName success";
      break;
    case 212:
      result.msg = "获取设备列表单例";
      result.stat = "Get_devs_list_single success";
      break;
    case 400:
      result.msg = "获取用户告警列表，新旧排序";
      result.stat = "GetAlarms success";
      break;
    case 401:
      result.msg = "获取用户告警列表，新旧排序";
      result.stat = "GetAlarms success";
      break;
    case 402:
      result.msg = "确认用户告警";
      result.stat = "confirm_alarm success";
      break;
    case 500:
      result.msg = "修改用户自己信息";
      result.stat = "modify_user_info success";
      break;
    case 501:
      result.msg = "获取所有用户信息";
      result.stat = "Get_User_list success";
      break;
    case 502:
      result.msg = "禁用/启用用户";
      result.stat = "disable_select_user success";
      break;
    case 503:
      result.msg = "删除用户";
      result.stat = "delete_select_user success";
      break;
    case 504:
      result.msg = "管理员修改用户信息";
      result.stat = "modify_select_user success";
      break;
    case 505:
      result.msg = "管理员获取所有设备列表";
      result.stat = "Get_devs_list success";
      break;
  }
  if (!result.stat.includes("success")) result.code = -1;
  return result;
};
