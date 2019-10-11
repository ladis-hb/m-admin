/* jshint esversion:8 */
const { Users, User_final } = require("../../mongoose/user");
const {
  formartBody,
  formatPasswd,
  formatMD5,
  formatDate
} = require("../../util/Format");
const formatResult = require("../../util/formatResult");
const MailSend = require("../../util/MailSend");

const login = async ctx => {
  let { user: us, passwd: pw } = ctx.query;
  let u = await Users.findOne({ $or: [{ user: us }, { mail: us }] });
  if (u) {
    let { status, user, passwd, mail, userId, userGroup } = u;
    if ((user == us || mail == us) && passwd == formatMD5(formatPasswd(pw))) {
      if (!status) return (ctx.body = formartBody("warn", "此账户已被禁用"));
      //添加token
      let token = formatMD5(Date.now());
      await Users.updateOne(
        { user, mail },
        { $set: { token, address: ctx.ip.split(":").reverse()[0] } }
      );
      let body = new Promise(res => {
        setTimeout(() => {
          res(
            formatResult(101, {
              user,
              route: userGroup == "root" ? "/online" : "/main",
              token,
              userId: userId || "undefault"
            })
          );
        }, 1000);
      });
      ctx.body = await body;
    } else {
      ctx.body = formatResult(102, ctx.query);
    }
  } else {
    ctx.body = formatResult(102, ctx.query);
  }
};

const register = async ctx => {
  let { name, user, passwd, passwdck, mail, orgin, tel } = ctx.query;
  {
    if (typeof user != "string" || user.length > 20)
      ctx.body = formatResult(111, ctx.query);
    if (typeof passwd != "string" || passwd.length > 50)
      ctx.body = formatResult(112, ctx.query);
    if (passwd != passwdck) ctx.body = formatResult(113, ctx.query);
    for (let val of [mail, orgin, tel]) {
      if (typeof val != "string" || val.length > 40)
        ctx.body = formatResult(114, ctx.query);
    }
  }
  //register
  {
    let u = await Users.findOne({ $or: [{ user }, { mail }] });
    if (u) {
      ctx.body = formatResult(115, ctx.query);
    } else {
      let users = new Users({
        userId: formatMD5(Date.now() + passwd),
        name: name == "" ? user : name,
        user,
        passwd: formatMD5(formatPasswd(passwd)),
        mail,
        orgin,
        tel,
        address: ctx.ip.split(":").reverse()[0]
      });
      await users.save().then(res => {
        ctx.body = formatResult(115, res);
      });
    }
  }
};

const getmail_Verification_code = async ctx => {
  let { mail } = ctx.query;
  let u = await Users.findOne({ mail }, { mail: 1 });
  if (u) {
    let v_code = (Math.random() * 10000).toString().slice(0, 4);
    let sendID = await MailSend(mail, "Ladis", "重置密码", v_code);
    let messageId = sendID.messageId;
    await Users.updateOne(
      { mail },
      { $set: { messageId, v_code } },
      { upsert: true }
    ).then(() => {
      ctx.body = formatResult(120, { sendID });
    });
  } else {
    ctx.body = formatResult(121);
  }
};

const resetpasswd = async ctx => {
  let { Validation, mail, passwd, passwdck } = ctx.query;
  if (passwd == passwdck) {
    let pw = formatMD5(formatPasswd(passwd));
    await Users.updateOne(
      { mail, v_code: Validation },
      { $set: { passwd: pw, modifyTime: formatDate(), v_code: null } }
    ).then(() => {
      ctx.body = formatResult(130);
    });
  } else {
    ctx.body = formatResult(131, ctx.query);
  }
};

/* 
phone modify_user_info_one
*/
/*  */
const modify_user_info_one = async ctx => {
  let { user, modifyType, modifyVal } = ctx.query;
  if (!["mail", "orgin", "tel", "name"].includes(modifyType)) return;
  let SetVal = { [modifyType]: modifyVal };
  await Users.updateOne({ user }, { $set: SetVal }).then(res => {
    ctx.body = formatResult(100, {
      res,
      msg: `修改个人信息，${modifyVal}|${modifyType}`,
      user
    });
  });
};
/*  */
const Get_user_info_one = async ctx => {
  let { user } = ctx.query;
  await Users.find({ user })
    .select({ _id: 0, passwd: 0, modifyTime: 0, token: 0, userGroup: 0 })
    .exec()
    .then(result => {
      ctx.body = formatResult(100, result);
    });
};
/* 修改用户io常量 */
const Setfinal = async ctx => {
  let { user, final } = ctx.query;

  let { smoke, leak, access_contral, IO_alarm } = JSON.parse(final);
  await User_final.updateOne(
    { user },
    {
      $set: { smoke, leak, access_contral, IO_alarm, modifyTime: new Date() }
    },
    { upsert: true }
  ).then(res => {
    ctx.body = formatResult(100, res, "修改IO常量成功");
  });
};
/* Getfinal */
const Getfinal = async ctx => {
  let { user } = ctx.query;
  let res = await User_final.findOne({ user })
    .select({
      _id: 0,
      smoke: 1,
      leak: 1,
      access_contral: 1,
      IO_alarm: 1
    })
    .exec();
  ctx.body = formatResult(100, res, "获取io常量");
};
module.exports = {
  login,
  register,
  getmail_Verification_code,
  resetpasswd,
  modify_user_info_one,
  Get_user_info_one,
  Setfinal,
  Getfinal
};
