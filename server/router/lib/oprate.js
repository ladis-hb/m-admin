const event = require("../../event/index");
const formatResult = require("../../util/formatResult");
const OprateUPS = async ctx => {
  event.emit("OprateUPS", ctx.query);
  ctx.body = formatResult(600, null, "已发送操作指令");
};

module.exports = { OprateUPS };
