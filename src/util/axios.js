/* jshint esversion:8 */
const axios = require("axios");
//登录请求
export const requestLogin = ({ user, passwd }) => {
  return axios
    .get(`/Get/login`, { params: { user, passwd } })
    .then(res => res.data);
};
//register
export const UserRegister = ({
  orgin,
  mail,
  passwd,
  passwdck,
  tel,
  user,
  name
}) => {
  return axios
    .get(`/Get/register`, {
      params: { orgin, mail, passwd, passwdck, tel, user, name }
    })
    .then(res => res.data);
};
//重置密码
export const Resetpasswd = params => {
  return axios.get(`/Get/resetpasswd`, { params }).then(res => res.data);
};
//获取验证码
export const GetMailValidation = params => {
  return axios
    .get(`/Get/getmail_Verification_code`, { params })
    .then(res => res.data);
};

//获取用户信息
export const getUserInfo = params => {
  return axios.get("/Get/getUserInfo", { params });
};

//get 设备概览
export const getDevInfo = params => {
  return axios.get(`/Get/Dev_all_info`, { params });
};
//get 错误信息
export const getWarringInfo = params => {
  return axios.get(`/Get/Run_log_warring`, { params });
};
//get 日志
export const getLog = params => {
  return axios.get(`/Get/Run_log_info`, { params });
};

//add devid
export const addDevid = ({ devid }) => {
  return axios.get("/Get/addDevid", assginArgument({ devid }));
};
//get devid_list
export const Get_devid_list = () => {
  return axios.get("/Get/Get_devid_list", assginArgument());
};
//del devid
export const delete_Devid = ({ devid }) => {
  return axios.get("/Get/delete_Devid", assginArgument({ devid }));
};

//log info
export const Get_user_info = ({ type }) => {
  return axios.get("/Get/Get_user_info", assginArgument({ type }));
};
//admin - user
export const admin_get_info_list = params => {
  return axios.get("/Get/admin_get_info_list", { params });
};
//
export const Get_User_list = () => {
  return axios.get("/Get/Get_User_list", assginArgument());
};
//admin modify_user_info
export const admin_modify_user_info = params => {
  return axios.get("/Get/modify_user_info", { params });
};
/* 


*/
//phone pages
export const Modify_devName = ({ devid, devName }) => {
  return axios.get("/Get/Modify_devName", assginArgument({ devid, devName }));
};
export const Get_user_all_devs = () => {
  return axios.get("/Get/Get_user_all_devs", assginArgument());
};

export const modify_user_info_one = ({ modifyType, modifyVal }) => {
  return axios.get(
    "/Get/modify_user_info_one",
    assginArgument({ modifyType, modifyVal })
  );
};

export const Get_user_info_one = () => {
  return axios.get("/Get/Get_user_info_one", assginArgument());
};
/* GetAlarms */
export const GetAlarms = () => {
  return axios.get("/Get/GetAlarms", assginArgument());
};
/* confirm_alarm */
export const confirm_alarm = ({ alarmId }) => {
  return axios.get("/Get/confirm_alarm", assginArgument({ alarmId }));
};
//disable_select_user
export const disable_select_user = ({ selectUser, status }) => {
  return axios.get(
    "/Get/disable_select_user",
    assginArgument({ selectUser, status })
  );
};
//delete_select_user
export const delete_select_user = ({ selectUser }) => {
  return axios.get(
    "/Get/delete_select_user",
    assginArgument({ selectUser: selectUser })
  );
};
//modify_select_user
export const modify_select_user = ({ selectUsers }) => {
  return axios.get(
    "/Get/modify_select_user",
    assginArgument({ selectUsers: JSON.stringify(selectUsers) })
  );
};
//Get_devs_list
export const Get_devs_list = () => {
  return axios.get("/Get/Get_devs_list", assginArgument());
};
//Get_devs_list_single
export const Get_devs_list_single = ({ devid }) => {
  return axios.get("/Get/Get_devs_list_single", assginArgument({ devid }));
};

/* Search_history_dev */
export const Search_history_dev = ({ date, devType, devid, attr }) => {
  return axios.get(
    "/Get/Search_history_dev",
    assginArgument({ date, devType, devid, attr })
  );
};
/* 
配置IO状态常量
*/
export const Setfinal = ({ final }) => {
  return axios.get(
    "/Get/Setfinal",
    assginArgument({ final: JSON.stringify(final) })
  );
};
export const Getfinal = () => {
  return axios.get("/Get/Getfinal", assginArgument());
};

//设备操作区
//ups oprate
export const OprateUPS = ({ oprate, devid }) => {
  return axios.get("/Get/OprateUPS", assginArgument({ oprate, devid }));
};

/**
 *
 *
 * @param {*} [arg={}]
 * @returns
 */
function assginArgument(arg = {}) {
  let token = sessionStorage.getItem("token") || "";
  let user = sessionStorage.getItem("user") || "cairui";
  return { params: Object.assign({ token, user }, arg) };
}
