/* jshint */
const { mongoose, Schema } = require("./index");

const Schema_Dev_all = new Schema({
  devType: String,
  devid: String,
  data: "Mixed",
  DateTime: { type: Date, default: new Date() }
});

const Schema_Dev_ups = new Schema({
  generateTime: String,
  name: String,
  devid: String,
  brand: String,
  temperature: String,
  status: Number,
  phase: String,
  residual_capacity: Number,
  battery_voltage: Number,
  battery_voltage_negative: Number,
  load_ratio: Number,
  output_frequency: Number,
  input_voltage_l1: Number,
  input_voltage_l2: Number,
  input_voltage_l3: Number,
  output_voltage_l1: Number,
  output_voltage_l2: Number,
  output_voltage_l3: Number,
  output_load: Number,
  smoke: Boolean,
  access_contral: Boolean,
  leak: Boolean,
  shutdown_active: Boolean,
  Test_mode: Boolean,
  Battery_test: Boolean,
  UPS_work_situation: Boolean,
  bypass_mode: Boolean,
  Battery_voltage_state: Boolean,
  grid_state: Boolean,
  DateTime: { type: Date, default: new Date() }
});

const Schema_Dev_ac = new Schema({
  generateTime: String,
  name: String,
  devid: String,
  brand: String,
  refrigeration_temperature: Number,
  mode: [String],
  refrigeration_stop_deviation: Number,
  evaporation_start_temperature: Number,
  air_change_time: Number,
  opening_delay: Number,
  high_temperature_alarm_point: Number,
  return_air_temperature: Number,
  coil_temperature: Number,
  modified_return_air_temperature: Number,
  Correct_air_outlet_temperature: Number,
  defrosting_temperature_setting: Number,
  heating_opening_deviation: Number,
  heating_stop_deviation: Number,
  refrigeration_start_deviation: Number,
  air_outlet_temperature_deviation: Number,
  Starting_temperature_setting: Number,
  temperature_difference: Number,
  air_supply_temperature: Number,
  DateTime: { type: Date, default: new Date() }
});
const Schema_Dev_power = new Schema({
  generateTime: String,
  name: String,
  devid: String,
  brand: String,
  active_power: [Number],
  reactive_power: [Number],
  power_factor: [Number],
  quantity: [Number],
  input_voltage: [Number],
  input_voltage_l1: [Number],
  input_voltage_l2: [Number],
  input_voltage_l3: [Number],
  input_current: [Number],
  input_current_l1: [Number],
  input_current_l2: [Number],
  input_current_l3: [Number],
  input_frequency: [Number],
  input_frequency_l1: [Number],
  input_frequency_l2: [Number],
  input_frequency_l3: [Number],
  DateTime: { type: Date, default: new Date() }
});

const Schema_Dev_io = new Schema({
  generateTime: String,
  name: String,
  devid: String,
  brand: String,
  power_status: Boolean,
  input_status: Boolean,
  smoke: Boolean,
  access_contral: Boolean,
  leak: Boolean,
  DateTime: { type: Date, default: new Date() }
});
const Schema_Dev_th = new Schema({
  generateTime: String,
  name: String,
  devid: String,
  brand: String,
  temperature: Number,
  humidity: Number,
  DateTime: { type: Date, default: new Date() }
});
const Schema_Dev_Alarm = new Schema({
  DeviceId: String,
  Alarm_time: String,
  Alarm_msg: String,
  Alarm_device: String,
  Alarm_level: Number,
  Alarm_type: String,
  DateTime: Number,
  confirm: Boolean,
  confirm_user: { type: String, default: "" },
  confirm_time: { type: Date }
});
const Dev_all = mongoose.model("dev_all", Schema_Dev_all, "Dev_all");
const Dev_ups = mongoose.model("dev_ups", Schema_Dev_ups, "Dev_ups");
const Dev_ac = mongoose.model("dev_ac", Schema_Dev_ac, "Dev_ac");
const Dev_power = mongoose.model("dev_power", Schema_Dev_power, "Dev_power");
const Dev_io = mongoose.model("dev_io", Schema_Dev_io, "Dev_io");
const Dev_th = mongoose.model("dev_th", Schema_Dev_th, "Dev_th");
const Dev_Alarm = mongoose.model("dev_Alarm", Schema_Dev_Alarm, "Dev_Alarm");

const Dev_list = {
  ups: Dev_ups,
  ac: Dev_ac,
  power: Dev_power,
  io: Dev_io,
  th: Dev_th
};
module.exports = {
  Dev_all,
  Dev_ac,
  Dev_ups,
  Dev_power,
  Dev_io,
  Dev_th,
  Dev_Alarm,
  Dev_list
};
