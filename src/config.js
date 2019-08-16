module.exports = {
  development: true,
  remote_address: "http://116.62.48.175:81",
  //remote_address: "http://127.0.0.1:81",
  socket_address: this.development ? this.remote_address : ""
};
