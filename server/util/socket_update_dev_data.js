/* jshint esversion:8 */

/* 
简要描述：
   工控数据提交接口

请求URI：
    http://116.62.48.175:81  <socket格式>

请求类型：
    POST

参数：
    type:
        必选:true
        类型:String
        说明：设备类型说明
        可选项：['io', 'th', 'ac', 'ups','power']

    updateTime:
        必选:true
        类型:Date
        说明：数据生成时间


    data：
        必选:true
        类型:Object
        说明：数据正文

    Arg：
        必选:false
        类型:Object
        说明：预留参数
    

输入示例：
{ client: "4f08b4b8ae02f521be60", //环控客户端id
  data:{ //设备数据
    type: 'ups',
    data:{  
    generateTime: formatDate(),
    name: 'ups-007',
    devid: 1,
    brand: 'ladis',
    temperature: '25',

    status: 1,
    phase: 'd7',
    residual_capacity: getRndInteger(3),
    battery_voltage: getRndInteger(4),
    battery_voltage_negative: getRndInteger(9),
    smoke: false,
    access_contral: false,
    load_ratio: getRndInteger(21),
    output_frequency: getRndInteger(25),
    input_voltage_l1: getRndInteger(2),
    input_voltage_l2: getRndInteger(),
    input_voltage_l3: getRndInteger(),
    output_voltage_l1: getRndInteger(),
    output_voltage_l2: getRndInteger(),
    output_voltage_l3: getRndInteger()
  }  
}
}


*/
/* jshint esversion:8 */
const config = require("../config");
const io = require("socket.io-client")(config.socket_dev_api);
const { formatDate } = require("./Format");

var simulate_ups = () => {
  return {
    type: "ups",
    data: {
      generateTime: formatDate(),
      name: "ups-one",
      devid: "1a24d35sa",
      brand: "ladis",
      temperature: "25",

      status: 1,
      phase: "d73a52s",
      residual_capacity: getRndInteger(3),
      battery_voltage: getRndInteger(4),
      battery_voltage_negative: getRndInteger(9),

      load_ratio: getRndInteger(21),
      output_frequency: getRndInteger(25),
      input_voltage_l1: getRndInteger(2),
      input_voltage_l2: getRndInteger(),
      input_voltage_l3: getRndInteger(),
      output_voltage_l1: getRndInteger(),
      output_voltage_l2: getRndInteger(),
      output_voltage_l3: getRndInteger(),
      //输出负载
      output_load: getRndInteger(),
      //状态量
      smoke: true,
      access_contral: false,
      leak: true,
      shutdown_active: true,
      //	测试模式
      Test_mode: true,
      //电池测试
      Battery_test: true,
      //UPS工情
      UPS_work_situation: true,
      //	旁路模式
      bypass_mode: true,
      //电池电压状态
      Battery_voltage_state: true,
      //市电状态
      grid_state: true
    }
  };
};

var simulate_col = () => {
  return {
    type: "ac",
    data: {
      generateTime: formatDate(),
      name: "ac-one",
      devid: "21s5a8d41",
      brand: "ladis",
      refrigeration_temperature: getRndInteger(),
      humidity: getRndInteger(),
      mode: ["stand", "run", "stop"],
      refrigeration_stop_deviation: getRndInteger(),
      evaporation_start_temperature: getRndInteger(),
      air_change_time: getRndInteger(),
      opening_delay: getRndInteger(),
      high_temperature_alarm_point: getRndInteger(),
      return_air_temperature: getRndInteger(),
      coil_temperature: getRndInteger(),
      modified_return_air_temperature: getRndInteger(),
      Correct_air_outlet_temperature: getRndInteger(),
      defrosting_temperature_setting: getRndInteger(),
      heating_opening_deviation: getRndInteger(),
      heating_stop_deviation: getRndInteger(),
      refrigeration_start_deviation: getRndInteger(),
      air_outlet_temperature_deviation: getRndInteger(),
      Starting_temperature_setting: getRndInteger(),
      temperature_difference: getRndInteger(),
      air_supply_temperature: getRndInteger()
    }
  };
};

var simulate_io = () => {
  return {
    type: "io",
    updateTime: formatDate(),
    dataType: "One",
    data: {
      generateTime: formatDate(),
      name: "io-Control",
      devid: "15awx3233",
      brand: "ladis",
      power_status: true,
      input_status: false,
      //状态量
      smoke: false,
      access_contral: false,
      leak: true
    }
  };
};

var simulate_th = () => {
  return {
    type: "th",
    data: {
      generateTime: formatDate(),
      name: "th-First",
      devid: "csd654c5d6",
      brand: "ladis",
      temperature: getRndInteger(),
      humidity: getRndInteger()
    }
  };
};
var simulate_th2 = () => {
  return {
    type: "th",
    data: {
      generateTime: formatDate(),
      name: "th-second",
      devid: "thcasdfcsefcs",
      brand: "ladis",
      temperature: getRndInteger(),
      humidity: getRndInteger()
    }
  };
};

var simulate_power = () => {
  return {
    type: "power",
    data: {
      generateTime: formatDate(),
      name: "power-threed",
      devid: "9sdd",
      brand: "ladis",
      active_power: [10, 1, getRndInteger()],
      reactive_power: [100, 2, getRndInteger()],
      power_factor: [99, 3, getRndInteger()],
      quantity: [1, -1, getRndInteger()],
      input_voltage: [10, 1, getRndInteger()],
      input_voltage_l1: [10, 1, getRndInteger()],
      input_voltage_l2: [10, 1, getRndInteger()],
      input_voltage_l3: [10, 1, getRndInteger()],
      input_current: [10, 1, getRndInteger()],
      input_current_l1: [10, 1, getRndInteger()],
      input_current_l2: [10, 1, getRndInteger()],
      input_current_l3: [10, 1, getRndInteger()],
      input_frequency: [10, 1, getRndInteger()],
      input_frequency_l1: [10, 1, getRndInteger()],
      input_frequency_l2: [10, 1, getRndInteger()],
      input_frequency_l3: [10, 1, getRndInteger()]
    }
  };
};

function getRndInteger() {
  return Math.floor(Math.random() * (100 - 0)) + 0;
}

var simulate_dev = [
  simulate_col,
  simulate_io,
  simulate_power,
  simulate_th,
  simulate_th2,
  simulate_ups
];
maps();
setInterval(maps, 10000);

function maps() {
  console.log("setInterval 10000");
  simulate_dev.map(val => {
    io.emit("receiveData", { client: "4f08b4b8ae02f521be60", data: val() });
  });
}
