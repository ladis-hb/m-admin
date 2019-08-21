/* jshint esversion:8 */
const axios = require("axios");
//const config = require("../config.js");
//const axios_address = config.development ? config.remote_address : "";
//axios.defaults.baseURL = axios_address;

//登录请求
export const requestLogin = params => {
  return axios.get(`/Get/login`, { params }).then(res => res.data);
};
//register
export const UserRegister = params => {
  return axios.get(`/Get/register`, { params }).then(res => res.data);
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
export const addDevid = ({ devid, devType, user, token }) => {
  return axios.get("/Get/addDevid", {
    params: { devid, devType, user, token }
  });
};
//get devid_list
export const Get_devid_list = ({ user, token }) => {
  return axios.get("/Get/Get_devid_list", { params: { user, token } });
};
//del devid
export const delete_Devid = ({ user, token, devid }) => {
  return axios.get("/Get/delete_Devid", { params: { user, token, devid } });
};

//log info
export const Get_user_info = ({ type, user, token }) => {
  return axios.get("/Get/Get_user_info", { params: { type, user, token } });
};
//admin - user
export const admin_get_info_list = params => {
  return axios.get("/Get/admin_get_info_list", { params });
};

//admin modify_user_info
export const modify_user_info = params => {
  return axios.get("/Get/modify_user_info", { params });
};
/* 


*/
//phone pages
export const Get_user_all_devs = ({ user, token }) => {
  return axios.get("/Get/Get_user_all_devs", { params: { user, token } });
};

export const modify_user_info_one = ({
  user,
  token,
  modifyType,
  modifyVal
}) => {
  return axios.get("/Get/modify_user_info_one", {
    params: { user, token, modifyType, modifyVal }
  });
};

export const Get_user_info_one = ({ user, token }) => {
  return axios.get("/Get/Get_user_info_one", { params: { user, token } });
};
/* GetAlarms */
export const GetAlarms = ({ user, token }) => {
  return axios.get("/Get/GetAlarms", { params: { user, token } });
};
/* confirm_alarm */
export const confirm_alarm = ({ user, token, alarmId }) => {
  return axios.get("/Get/confirm_alarm", { params: { user, token, alarmId } });
};
