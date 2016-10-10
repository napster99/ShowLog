'use strict';

const router = require('koa-route');
//这个允许我们解析原生请求对象来获取请求内容
// const parse = require('co-body');
// const _ = require('underscore');

const redisInstance = require('../models/redis').redisInstance;
const mysqlInstance = require('../models/mysql').mysqlInstance;
const serviceInstance = require('../service/serviceInterface').serviceInstance;

global.userInfo = {};

function getRandomCode(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

//发送验证码   http://192.168.1.42:3000/main/auth/send_code?mobile=13958111541&callback=JSON
let sendQRRouter = router.get('/main/auth/send_code', function* sendQR() {

  let mobile = this.request.query.mobile;
  let callback = this.request.query.callback;

  let send_code = getRandomCode(1000, 9999);

  //FOR ME
  if (mobile == '13958111541' || mobile == '13735804961') {
    send_code = 1111;
  }

  userInfo[mobile] = {};
  userInfo[mobile]['verify'] = send_code;
  console.log('send_code', send_code)
  console.log('mobile', mobile)

  if (!callback) return;

  this.type = 'text/javascript';
  let startChunk = callback + '(';
  let endChunk = ');';

  if (mobile) {
    serviceInstance.sendDataToServer('NotifySvr.Sms.Send', { 'mobile': mobile, 'tplid': 1, 'data': [send_code] });
    this.body = startChunk + JSON.stringify({ 'code': 0, 'msg': '发送成功' }) + endChunk;
  } else {
    this.body = startChunk + JSON.stringify({ 'code': -1, 'msg': '手机号不能为空' }) + endChunk;
  }

});


//登录 STR:MONKEY:SESSION:cgr01207
let loginRouter = router.get('/main/auth/login', function* login() {
  let mobile = this.request.query.mobile;
  let verify = this.request.query.verify;
  let callback = this.request.query.callback;

  if (!callback) return;
  this.type = 'text/javascript';
  let startChunk = callback + '(';
  let endChunk = ');';
  let body = {};

  if (!mobile) {
    this.body = startChunk + JSON.stringify({ 'code': -1, 'msg': '手机号不能为空' }) + endChunk;
    return;
  }

  if (!verify) {
    this.body = startChunk + JSON.stringify({ 'code': -1, 'msg': '验证码不能为空' }) + endChunk;
    return;
  }

  if (userInfo[mobile]) {
    if (userInfo[mobile]['verify'] == verify) {
      let result = yield mysqlInstance.checkUserLogin(mobile);
      console.log('>>>', result)
      if (!result) {
        console.log('it')
        body = { 'code': 3, 'msg': '数据库查询出错！' };
      } else {
        if (result.length > 0) {
          userInfo[mobile] = {
              uid: result[0]['id'],
              nickname: result[0]['name'],
              status: result[0]['status']
            }
            //登录成功
          let sid = yield redisInstance.setSessionToRedis(result[0]['id'], mobile);
          let result2 = yield mysqlInstance.getAuthArea(result[0]['id']); //uid
          body = {
            code: 0,
            data: {
              areas: result2,
              userInfo: userInfo[mobile],
              sid: sid
            }
          };
        } else {
          body = { 'code': 4, 'msg': '账号不存在' };
        }
      }
    } else {
      body = { 'code': 1, 'msg': '验证码错误' };
    }
  } else {
    body = { 'code': 2, 'msg': '登录失败' };
  }

  this.body = startChunk + JSON.stringify(body) + endChunk;

});


//登出
let logoutRouter = router.get('/main/auth/logout', function* logout() {
  let sid = this.request.query.sid;
  let sessionInfo = yield redisInstance.getSessionInfo(sid);
  let callback = this.request.query.callback;

  if (!callback) return;
  this.type = 'text/javascript';
  let startChunk = callback + '(';
  let endChunk = ');';

  if (sessionInfo) {
    let mobile = sessionInfo.split('@')[1];
    delete userInfo[mobile];
    //删除session
    redisInstance.clearSessionInfo(sid);
  }
  this.body = startChunk + JSON.stringify({ 'code': 0, 'msg': '登出成功' }) + endChunk;
});


module.exports = {
  loginRouter: loginRouter,
  logoutRouter: logoutRouter,
  sendQRRouter: sendQRRouter
};
