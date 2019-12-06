const axios = require("axios");
const xml2js = require("xml2js");
const accont = {
  user: "languang",
  pwd: "languang123",
  chid: 17,
  SmsSendAddress: "http://dx.rs18.com/WebAPI/SmsAPI.asmx/SendSmsExt",
  SmsGetBalanceAddress: "http://dx.rs18.com/WebAPI/SmsAPI.asmx/GetBalance",
  SmsGetReportAddress: "http://dx.rs18.com/WebAPI/SmsAPI.asmx/GetReplay"
};

const SendSms = async ({ tel, content, sendtime }) => {
  tel = tel.trim();
  if (tel.length != 11 || content == "") return new Error("号码格式或内容出错");

  let obj = {
    user: accont.user,
    pwd: accont.pwd,
    mobiles: tel,
    content: content,
    chid: accont.chid,
    sendtime: sendtime ? formDate(sendtime) : ""
  };
  let result = await axios.post(accont.SmsSendAddress, obj);
  console.log(result);

  return await XmltoJs(result);
};

const GetBalance = async () => {
  let result = await axios.get(accont.SmsGetBalanceAddress, {
    params: { user: accont.user, pwd: accont.pwd }
  });
  console.log(result);

  return await XmltoJs(result);
};

const GetReport = async () => {
  let result = await axios.get(accont.SmsGetReportAddress, {
    params: { user: accont.user, pwd: accont.pwd }
  });
  console.log(result);

  return await XmltoJs(result);
};

const formDate = dates => {
  let time = new Date(dates || new Date());
  let year = time.getFullYear;
  let mouth = time.getMonth;
  let date = time.getDate;
  let hourse = time.getHours;
  let mi = time.getMinutes;
  let se = time.getSeconds;
  return [[year, mouth, date].join("-"), [hourse, mi, se].join(":")].join(" ");
};

const XmltoJs = xml => {
  return new Promise((res, rej) => {
    xml2js(xml, (err, result) => {
      if (err) rej(err);
      res(result);
    });
  });
};

//SendSms({ tel: "15337364316", content: "xml2js" });
module.exports = { GetBalance, GetReport, SendSms };
