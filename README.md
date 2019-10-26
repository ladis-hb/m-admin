# m-admin
# m-admin

# 技术栈为vue+vuex+vue-router+axios+bootstrapVue+vue-i18n

# 文档结构
├── public              //公共资源
│   ├── favicon.ico         
│   └── index.html      //主页模板
├── README.md
├── server              //server
│   ├── app.js              //server入口文件
│   ├── config.js           //server公共变量
│   ├── event               //event 事件
│   │   ├── event.js            //evnet监听器
│   │   └── index.js            //导出evnet实例，on方法，emit方法
│   ├── mongoose            //mongoose定义
│   │   ├── alarm.js            //告警
│   │   ├── dev.js              //设备相关
│   │   ├── index.js            //导出mongoose实例，schema
│   │   ├── log.js              //log日志相关
│   │   └── user.js             //用户操作
│   ├── router              //router
│   │   ├── Api.js              //接受环控客户端app上传的数据
│   │   ├── Get.js              //用户操作get请求入口，
│   │   ├── index.js            //router入口
│   │   └── lib                 //get分流处理函数集
│   │       ├── administrator.js    //管理后台操作
│   │       ├── alarm.js            //告警操作
│   │       ├── devs.js             //设备操作
│   │       ├── log.js              //日志操作
│   │       └── user.js             //登录，注册，重置操作
│   ├── socket                  //socket
│   │   ├── dev.js                  //响应socket接入，处理socket请求
│   │   └── index.js                //socket入口文件，导出socket。attach，on
│   ├── store.js                //vuex
│   ├── upload                  //
│   │   └── data.js                 //客户端函数定义
│   └── util                    //公用工具
│       ├── Alarm_Test_Data.js      //告警模拟测试工具
│       ├── Format.js               //对象格式化工具
│       ├── formatResult.js         //
│       ├── MailSend.js             //邮件发送程序，用于重置密码，计划用于告警邮件发送
│       ├── MongoDB.js              //弃用
│       ├── SaveLog.js              //日志保存中间件
│       ├── socket_update_dev_data.js //设备数据socket模拟测试工具
│       ├── test.js                 //
│       └── update_data.js          //设备数据http模拟测试工具
├── src                         //前台
│   ├── App.vue         
│   ├── assets                  //公用资源
│   ├── components              //公用组件
│   │   ├── alert.vue
│   │   ├── argumentBlock2.vue
│   │   ├── argumentBlock.vue
│   │   ├── ChartGuage.vue
│   │   ├── chartHistogram.vue
│   │   ├── Header.vue
│   │   ├── HelloWorld.vue
│   │   ├── separated.vue
│   │   └── switchQuantity.vue
│   ├── config.js               //公用变量
│   ├── main.js                 //入口文件
│   ├── router.js               //路由文件
│   ├── store.js                //vuex
│   ├── util                    //公用函数
│   │   ├── axios.js                //公用api
│   │   ├── language.js             //翻译
│   │   ├── socket.io-client.js     //socket。io
│   │   ├── tool.js
│   │   └── unit.js
│   └── views                   //页面组件
│       ├── About.vue               //
│       ├── Alarm.vue               //告警页面
│       ├── chartline.vue           //
│       ├── Device                  //设备页面
│       │   ├── AC.vue                  //ac
│       │   ├── IO.vue
│       │   ├── POWER.vue
│       │   ├── TH.vue
│       │   └── UPS.vue
│       ├── devs.vue                //设备主界面
│       ├── Home.vue                //home主页
│       ├── login.vue               //登录界面
│       ├── main.vue                //
│       ├── root                    //管理后台
│       │   ├── DeviceManage.vue        //设备管理
│       │   ├── online.vue              //在线设备，用户>>socket响应
│       │   └── UserManage.vue          //在线用户
│       ├── root.vue                //管理后台主页面
│       ├── Setting                 //客户配置
│       │   ├── SetMain.vue             //配置设备
│       │   └── SetUser.vue             //配置用户
│       ├── Setting.vue             //客户配置主页面
│       ├── userRegister.vue        //用户注册
│       └── userReset.vue           //用户重置密码
└── vue.config.js                   //vue-cli配置

# 官网主页 http://116.62.48.175:81
# 后台主页 用户已root组登录自动跳转到后台
# api {
#      /api/devs  //  设备 http接口
#      /api/Alarm     告警 http接口
#      devs socket 直接接入
# }


