/* jshint esversion:8 */
const { mongoose, Schema } = require("./index");

const Schema_log_devs = new Schema({
  generateTime: { type: Date, default: new Date() },
  status: String,
  msg: String,
  query: "Mixed",
  user: String
});

const log_devs = mongoose.model("log_devs", Schema_log_devs, "log_devs");
const log_error = mongoose.model("log_error", Schema_log_devs, "log_error");
const log_other = mongoose.model("log_other", Schema_log_devs, "log_other");
const log_run = mongoose.model("log_run", Schema_log_devs, "log_run");
const log_socket = mongoose.model("log_socket", Schema_log_devs, "log_socket");

module.exports = { log_devs, log_error, log_other, log_run, log_socket };
