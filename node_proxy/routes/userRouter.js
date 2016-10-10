'use strict';

let router = require('koa-route');

let mysqlInstance = require('../models/mysql').mysqlInstance;

// let USER_DIS = ROOT_URL + 'main/user/banned?f=json&callback=JSON_CALLBACK';

// 用户管理列表
let getUserList = router.get('/main/user/list', function* getUserList() {
  let page = this.request.query.page || 1;
  let cid = this.request.query.cid;
  let callback = this.request.query.callback;

  let startChunk = callback + '(';
  let endChunk = ');';
  //1、先查出哪些角色是属于该平台下的
  let curRolesArr = yield mysqlInstance.getRoleByCid(cid),
    curRolesIdArr = [];
  for (let i of curRolesArr) {
    curRolesIdArr.push(i['id']);
  }
  //2、查出该角色下的用户列表
  if(curRolesIdArr.length <= 0) {
    this.body = startChunk + JSON.stringify({ 'code': 0, 'list': [] }) + endChunk;
    return;
  }
  let result = yield mysqlInstance.getUserList(curRolesIdArr);
  this.body = startChunk + JSON.stringify({ 'code': 0, 'list': result }) + endChunk;
});

// 添加用户－区域管理员
let addUser = router.get('/main/user/add', function* addUser() {
  let user_id = this.request.query.user_id; //修改
  let name = this.request.query.name;
  let phone = this.request.query.phone;
  let role_id = this.request.query.role;
  let callback = this.request.query.callback;

  let startChunk = callback + '(';
  let endChunk = ');';

  if(!name || !phone || !role_id) {
    this.body = startChunk + JSON.stringify({'code' : 1, 'msg' : '参数不全'}) + endChunk;
    return; 
  }

  if (user_id) {
    mysqlInstance.modiUser(name, phone, role_id, user_id);
    this.body = startChunk + JSON.stringify({ 'code': 0, 'msg': '修改成功' }) + endChunk;
  } else {
    var result = yield mysqlInstance.addUser(name, phone, role_id);
    if(result === 'exits') {
      this.body = startChunk + JSON.stringify({ 'code': 1, 'msg': '用户已存在' }) + endChunk;
    }else{
      this.body = startChunk + JSON.stringify({ 'code': 0, 'msg': '添加成功' }) + endChunk;
    }
  }

});

// 获取用户信息
let getUserInfo = router.get('/main/user/info', function* getUserInfo() {
  let user_id = this.request.query.user_id;
  let callback = this.request.query.callback;
  let startChunk = callback + '(';
  let endChunk = ');';
  let result = yield mysqlInstance.getUserInfo(user_id);
  this.body = startChunk + JSON.stringify({
    'code': 0,
    'user': {
      'name': result[0]['name'],
      'phone': result[0]['phone'],
      'role': result[0]['role']
    }
  }) + endChunk;
});

// 获取角色列表信息
let getUserRoleList = router.get('/main/user/role_list', function* getUserRoleList() {
  let cid = this.request.query.cid;
  let callback = this.request.query.callback;
  let startChunk = callback + '(';
  let endChunk = ');';
  let result = null;

  if (cid) { //局部
    result = yield mysqlInstance.getRoleByCid(cid);
  } else { //所有
    result = yield mysqlInstance.getRoleAll();
  }

  this.body = startChunk + JSON.stringify({ 'code': 0, 'list': result }) + endChunk;
});

// 删除用户
let delUser = router.get('/main/user/delete', function* delUser() {
  let user_id = this.request.query.user_id;
  let callback = this.request.query.callback;
  let startChunk = callback + '(';
  let endChunk = ');';

  if (!user_id) {
    this.body = startChunk + JSON.stringify({ 'code': 1, 'msg': '请上传用户user_id' }) + endChunk;
    return;
  }

  mysqlInstance.delUser(user_id);
  this.body = startChunk + JSON.stringify({ 'code': 0, 'msg': '删除成功!' }) + endChunk;
});


module.exports = {
  getUserList: getUserList,
  addUser: addUser,
  getUserInfo: getUserInfo,
  delUser: delUser,
  getUserRoleList: getUserRoleList
};
