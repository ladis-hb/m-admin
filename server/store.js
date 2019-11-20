/* jshint esversion:8 */

//存取所有设备devid:Set[user]
const devsMap = new Map();
//存取所有连接socket user:socket.id
const userMap = new Map();
//存取所有连接socket socket.id:user,方便删除使用
const socketIdMap = new Map();
//存储root用户
const rootSet = new Set();
//存储all客户端 clientID:socketID
const ClientSocketMap = new Map();
//存储所有环控设备 devID:clientID
const DevClientMap = new Map();

//HK-app
//存取所有连接socket user:socket.id
const AppUserMap = new Map();
//存取所有连接socket socket.id:user,方便删除使用
const AppSocketIdMap = new Map();

module.exports = {
  devsMap,
  userMap,
  socketIdMap,
  rootSet,
  ClientSocketMap,
  DevClientMap,
  AppSocketIdMap,
  AppUserMap
};
