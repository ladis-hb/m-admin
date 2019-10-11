/* jshint esversion:8 */
const { log_devs, log_other, log_error, log_run } = require("../mongoose/log");
module.exports = function() {
  return async (ctx, next) => {
    await next();
    if (!ctx.body.resultID) return;
    let { resultID } = ctx.body;
    console.log(resultID);

    let query = {
      status: ctx.body.stat,
      msg: ctx.body.msg,
      user: ctx.query.user || "null",
      query: ctx.body
    };

    if (resultID === 100) {
      let user_log = new log_other(query);
      user_log.save();
    }
    if (resultID > 100 && resultID < 200) {
      let user_log = new log_run(query);
      user_log.save();
    }
    if (resultID > 199 && resultID < 300) {
      let user_log = new log_devs(query);
      user_log.save();
    }
    if (resultID > 299 && resultID < 400) {
      let user_log = new log_run(query);
      user_log.save();
    }
    if (resultID > 399 && resultID < 500) {
      let user_log = new log_other(query);
      user_log.save();
    }
    if (resultID > 299 && resultID < 400) {
      let user_log = new log_run(query);
      user_log.save();
    }
    if (ctx.body.code === -1) {
      let user_log = new log_error(query);
      user_log.save();
    }
  };
};
