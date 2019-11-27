const development = false;
const testUri = "http://127.0.0.1:81";
const remoteUri = "http://116.62.48.175:81";
export const socket_address = development ? testUri : remoteUri;
export const axios_address = development ? testUri : remoteUri;
