'use strict';

let router = require('koa-route');
//这个允许我们解析原生请求对象来获取请求内容
// let parse      = require('co-body');
// let _          = require('underscore');

let mysqlInstance = require('../models/mysql').mysqlInstance;

let getAuthMenu = router.get('/main/auth/info', function* checkAuth() {
  let uid = this.request._uid;
  let cid = this.request.query.cid;

  console.log('uid>',uid, 'cid>',cid)

  let callback = this.request.query.callback;
  if (!callback || !cid) return;

  this.type = 'text/javascript';
  let startChunk = callback + '(';
  let endChunk = ');';

  let result = yield mysqlInstance.getAuthMenu(uid, cid);
  if(result.length <= 0) {
    this.body = startChunk + JSON.stringify({'code' : 0, 'data' : {}}) + endChunk;
    return;
  }
  let resultAll = yield mysqlInstance.getAuthMenuAll(),
    allMap = {};
  //格式组装
  let lastObj = { menu: {} },
    unitObj = {};
  for (let el of resultAll) {
    allMap[el['id']] = { 'name': el['name'], 'id': el['id'], 'pId': el['parent_id'], 'icon': el['icon_class'], 'ui_sref': el['sref'] }
  }

  for (let el of result) {
    var pid = el['parent_id'];
    var id = el['id'];
    if (!unitObj[pid]) {
      unitObj[pid] = allMap[pid];
    }
    if (!unitObj[id]) {
      unitObj[id] = allMap[id];
    }
  }

  //第一层组装
  for (let i in unitObj) {
    if (unitObj[i]['pId'] == 0) {
      lastObj['menu'][unitObj[i]['name']] = [];
      delete unitObj[i];
    }
  }

  //第二层组装
  for (let i in unitObj) {
    var curArr = lastObj['menu'][allMap[unitObj[i]['pId']]['name']];
    if (curArr instanceof Array) {
      curArr.push(unitObj[i]);
      delete unitObj[i];
    }
  }
  
  //第三层组装
  for (let i in unitObj) {
    var pid = unitObj[i]['pId'];
    var firstName = allMap[allMap[pid]['pId']]['name'];
    var curArr = lastObj['menu'][firstName];
    if (curArr instanceof Array) {
      for (let el of curArr) {
        if (el['id'] == pid) {
          if (!el['child']) {
            el['child'] = [];
          }
          el['child'].push(unitObj[i]);
          delete unitObj[i];
        }
      }
    }
  }
  
  this.body = startChunk + JSON.stringify({'code' : 0, 'data' : lastObj}) + endChunk;
});


module.exports = {
  getAuthMenu: getAuthMenu
};
