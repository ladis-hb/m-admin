/* jshint esversion:8 */

let development = false;
let API_3000 = "http://127.0.0.1:3000/Api/";
let API_81 = "http://127.0.0.1:81/Api/";

module.exports = {
  dev_api: development ? `${API_3000}dev` : `${API_81}dev`,
  //
  Alarm_api: development ? `${API_3000}Alarm` : `${API_81}Alarm`,
  //
  port: 81,
  development_port: 3000,
  //
  dist: "../dist",
  //
  MGuri: "mongodb://localhost:27017",
  //
  MGDB: "ladis",
  //
  MGColltion: "",
  //通用加密密匙
  key: "7e1977739c748beac0c0fd14fd26a544",
  //

  DB_dev: "devs",
  DB_dev_class: {
    ac: "Dev_ac",
    io: "Dev_io",
    power: "Dev_power",
    th: "Dev_th",
    ups: "Dev_ups"
  },
  DB_dev_all: "Dev_all",

  DB_Alarm: "Dev_Alarm",

  DB_user_users: "users",
  DB_user_dev: "user_dev",

  DB_log_run: "log_run",
  DB_log_error: "log_error",
  DB_log_dev: "log_devs",
  DB_log_socket: "log_socket",
  DB_log_other: "log_other",

  //log
  log_loginSuccess: "loginSuccess",
  log_loginError: "loginError",
  log_registerError: "registerError",
  log_registerSuccess: "registerSuccess",
  log_resetpwSuccess: "resetpwSuccess",

  log_addDevid: "addDevid",
  log_delDevid: "delDevid"
};
