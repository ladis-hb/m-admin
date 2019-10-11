/* jshint esversion:8 */ /* 
const config = require("../../config");
const { formartBody, ObjectId } = require("../../util/Format"); */
const { User_dev } = require("../../mongoose/user");
const { Alarm } = require("../../mongoose/alarm");
const formatResult = require("../../util/formatResult");
const GetAlarms = async ctx => {
  let { user } = ctx.query;
  /* get user`s all devs */
  let { dev } = await User_dev.findOne({ user });

  let userDevs = dev.map(val => {
    return val.devid;
  });
  let result = await Alarm.find({ DeviceId: { $in: userDevs } })
    .sort({ _id: -1 })
    .limit(200)
    .exec();
  ctx.body = formatResult(400, result);
};
/* confirm_alarm */
const confirm_alarm = async ctx => {
  let { user, alarmId } = ctx.query;
  let result = await Alarm.findByIdAndUpdate(
    { _id: alarmId },
    { $set: { confirm: true, confirm_user: user, confirm_time: new Date() } }
  );
  ctx.body = formatResult(402, result);
};

module.exports = { GetAlarms, confirm_alarm };
