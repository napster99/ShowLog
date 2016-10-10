'use strict';

//转发代理
let URLConfig     = require('../config/urlConfig').URLConfig;
let redisInstance = require('../models/redis').redisInstance;
let request       = require('request');
let crypto        = require('crypto');


function* agentUrlMidWare(next) {
  let path = this.request.path;
  let callback = this.request.query.callback;
  
  let startChunk = callback + '(';
  let endChunk = ');';

  if (URLConfig.noAgent.indexOf(path) < 0) {
    let innerArgs = this.request.query;
    
    let outerArgs = {
      _args      : innerArgs,
      _router    : path,
      _timestamp : parseInt(+new Date()/1000)
    };
    
    let curURL = 'http://api.monkey.dev.shanggou.la/proxy/api';
    let sessionInfo = yield redisInstance.getSessionInfo(innerArgs['sid']);
    if(sessionInfo && sessionInfo.split('@') instanceof Array) {
      outerArgs['_uid'] = sessionInfo.split('@')[0];
    }
    delete outerArgs['_args']['sid'];
    
    //转发
    let result = yield agentPost(curURL, outerArgs);
    console.log('result>', result);
    if (result) {
      this.body = startChunk + JSON.stringify(result) + endChunk;
    } else {
      this.body = startChunk + JSON.stringify({ 'code': 555, 'msg': '请求出错' }) + endChunk;
    }
  } else {
    yield next;
  }
}

function agentPost(curURL, outerArgs) {
  let argsAfterStr = wrapArgs(outerArgs), innerArgs = {};
  outerArgs['sign'] = argsAfterStr;
  return new Promise((resolve, reject) => {
    request.post({ url: curURL, form: outerArgs }, (err, httpResponse, body) => {
      console.log(err, body)
      if (err) {
        reject();
      } else {
        resolve(body);
      }
    });
  })
}

function wrapArgs(outerArgs) {
  let text = '', _text = '', hasher = null;
  outerArgs['_args'] = JSON.stringify(outerArgs['_args']);
  for(let i in outerArgs) {
   text += i+'='+outerArgs[i]+'&'
  }
  _text = text + '_key=861f55ddc498aae4517ff2ab75faa062';
  hasher = crypto.createHash("md5");
  hasher.update(_text);
  let hashmsg = hasher.digest('hex').toUpperCase(); //hashmsg为加密之后的数据
  return hashmsg;
}


module.exports = agentUrlMidWare;
