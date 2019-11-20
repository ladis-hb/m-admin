/* jshint esversion:8 */
const { mongoose, Schema } = require("./index");

const Schema_Dev_Alarm = new Schema({
  DeviceId: String,
  Dev_name: String,
  Alarm_time: { type: Date, default: new Date() },
  Alarm_msg: String,
  Alarm_device: { type: String, enum: ["ups", "ac", "em", "io", "th"] },
  Alarm_level: { type: Number, enum: [0, 1, 2] },
  Alarm_type: { type: String }, //, enum: ["超下限", "告警恢复", "告警"] },
  DateTime: { type: Number, default: Date.now() },
  confirm: Boolean,
  confirm_user: { type: String, default: "" },
  confirm_time: { type: Date, default: null }
});

const Alarm = mongoose.model("dev_alarm", Schema_Dev_Alarm, "Dev_Alarm");

module.exports = { Alarm };
