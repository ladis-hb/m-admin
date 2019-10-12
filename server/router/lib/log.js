/* jshint esversion:8 */
const { formartBody } = require("../../util/Format");
const {
  log_devs,
  log_error,
  log_run,
  log_socket
} = require("../../mongoose/log");

const Run_log_warring = async ctx => {
  let run = await log_run
    .find()
    .limit(50)
    .sort({ generateTime: -1 })
    .exec();
  ctx.body = formartBody("success", "run log find new date," + 50, run);
};

const Get_user_info = async ctx => {
  let { type, user } = ctx.query;
  let collection = "";
  let q = user == "admin" || user == "no record" ? {} : { user: user };
  switch (type) {
    case "runInfo":
      collection = log_run;
      break;
    case "errorInfo":
      collection = log_error;
      break;

    case "devInfo":
      collection = log_devs;
      break;

    case "socketInfo":
      collection = log_socket;
      break;
  }

  let run = await collection
    .find(q)
    .sort({ generateTime: -1 })
    .select("-query")
    .exec();

  ctx.body = formartBody("success", "", run);
};

module.exports = { Run_log_warring, Get_user_info };
