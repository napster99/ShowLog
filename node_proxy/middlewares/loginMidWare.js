'use strict';

let URLConfig = require('../config/urlConfig').URLConfig;
let redisInstance = require('../models/redis').redisInstance;

let loginMidWare = function* loginMidWare(next) {
  let sid = this.request.query.sid;
  let path = this.request.path;
  
  let callback = this.request.query.callback;
  if (!callback) return;

  this.type = 'text/javascript';
  let startChunk = callback + '(';
  let endChunk = ');';

  if (URLConfig.noLogin.indexOf(path) > -1) {
    yield next;
  } else {
    if (!sid) {
      this.body = startChunk + JSON.stringify({ 'code': 888, 'msg': '未传sid' }) + endChunk;
      return;
    }
    var sessionInfo = yield redisInstance.getSessionInfo(sid);
    if (sessionInfo) {
      //解析uid，传递下去
      if(sessionInfo.split('@') instanceof Array) {
        this.request._uid = sessionInfo.split('@')[0];
      }
      yield next;
    } else {
      this.body = startChunk + JSON.stringify({ 'code': 3001, 'msg': '未登录' }) + endChunk;
    }
  }

}


module.exports = loginMidWare;
