/* jshint esversion:8 */
const Koa = require("koa");
const KoaStatic = require("koa-static");
const path = require("path");
const Logger = require("koa-logger");
//const mongo = require("koa-mongo");
const body = require("koa-body");
const error = require("koa-error");
const ApolloServer = require("./apollo");

const config = require("./config");
const router = require("./router/index");
const saveLog = require("./util/SaveLog");

const app = new Koa();
app.use(error());
app.use(saveLog());
app.use(Logger());
//app.use(mongo({ db: config.DB_dev }));
app.use(body());
app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  await next();
});
//引入socket实例，socket实例已暴露io实例，attach挂载方法
const { attach } = require("./socket/index");
attach(app);
//emit监听器，挂载在app主进程上面，公用event实例
const { on } = require("./event/event");
on();

ApolloServer.applyMiddleware({ app, path: "/graphql" });

app.use(router.routes()).use(router.allowedMethods());

app.use(KoaStatic(path.join(__dirname, config.dist)));

let port = config.development ? config.development_port : config.port;
console.log(`static is run port:${port}`);

app.listen(port, () => {
  console.log(`App listening on http://127.0.0.1:${port}`);
  console.log("App listening on router /api!");
  console.log("App listening on router /get");
  console.log("App listening on static");
});
