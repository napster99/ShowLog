'use strict';

let router = require('koa-route');

let mysqlInstance = require('../models/mysql').mysqlInstance;

// 角色管理列表
let getRoleList = router.get('/main/role/list', function *getRoleList() {
  let page = this.request.query.page || 1;
  let cid = this.request.query.cid;
  let callback = this.request.query.callback;

  let startChunk =  callback + '(';
  let endChunk =  ');';
  let result = yield mysqlInstance.getRoleList(page, cid);

  this.body = startChunk + JSON.stringify({'code' : 0, 'list' : result['rows'], 'total_page' : result['total_page']}) + endChunk;
});

// 获取权限树
let getPrivList = router.get('/main/role/priv_list',  function *getPrivList() {
  let role_id = this.request.query.role_id;
  let callback = this.request.query.callback;
  let startChunk =  callback + '(';
  let endChunk =  ');';
  
  let result = yield mysqlInstance.getPrivList();
  
  //对应的角色
  if(role_id) {
    //获取该角色下的operate_id
    let result2 = yield mysqlInstance.getOperateIdsByRoleId(role_id);
    let hasIdArr = []
    for(let i of result2) {
      hasIdArr.push(i['operate_id']);
    }
    for(let i of result) {
      if(hasIdArr.indexOf(i['id']) > -1) {
        i['checked'] = true;
      }else{
        i['checked'] = false;
      }
    }
  }else{
    for(let i of result) {
      i['checked'] = false;
    }
  }

  this.body = startChunk + JSON.stringify({'code' : 0, 'data' : result}) + endChunk;
});

// 获取地区列表
let getRegion = router.get('/main/role/region', function *getRegion() {
  let callback = this.request.query.callback;

  let startChunk =  callback + '(';
  let endChunk =  ');';
  
  let result = yield mysqlInstance.getRegion();
  this.body = startChunk + JSON.stringify({'code' : 0, 'data' : result}) + endChunk;
});

// 添加角色－区域管理员
let addRole = router.get('/main/role/add',  function *addRole() {
  let role_id = this.request.query.role_id; //修改
  let name = this.request.query.name;
  let desc = this.request.query.desc;
  let cid = this.request.query.cid;
  let cname = this.request.query.cname;
  let operations = this.request.query.operations;
  let callback = this.request.query.callback;

  let startChunk =  callback + '(';
  let endChunk =  ');';

  if(!name || !cid || !cname || !operations) {
    this.body = startChunk + JSON.stringify({'code' : 1, 'msg' : '参数不全'}) + endChunk;
    return; 
  }
  
  if(role_id) {
    var len = yield mysqlInstance.modiRole(name, desc, cid, cname, operations, role_id);
    if(len <= 0) {
      this.body = startChunk + JSON.stringify({'code' : 1, 'msg' : '未知角色'}) + endChunk;
    }else{
      this.body = startChunk + JSON.stringify({'code' : 0, 'msg' : '修改成功'}) + endChunk;
    }
  }else{
    mysqlInstance.addRole(name, desc, cid, cname, operations);
    this.body = startChunk + JSON.stringify({'code' : 0, 'msg' : '添加成功'}) + endChunk;
  }
  
});

// 添加角色－超级管理员
let addMultiRole = router.get('/main/role/add_multi',  function *addRole() {
  let role_id = this.request.query.role_id; //修改
  let name = this.request.query.name;
  let desc = this.request.query.desc;
  let callback = this.request.query.callback;
  let operations = this.request.query.operations;
  // operations = {
  //     10 : {'cname' : 'xx1', operate_ids : [1,2,3,4,5]},
  //     11 : {'cname' : 'xx2', operate_ids : [1,2,3]},
  //   }
  let startChunk =  callback + '(';
  let endChunk =  ');';
  
  if(!name || !operations) {
    this.body = startChunk + JSON.stringify({'code' : 1, 'msg' : '参数不全'}) + endChunk;
    return; 
  }
  
  if(role_id) {
    mysqlInstance.modiMultiRole(name, desc, operations, role_id);
    this.body = startChunk + JSON.stringify({'code' : 0, 'msg' : '修改成功'}) + endChunk;
  }else{
    mysqlInstance.addMultiRole(name, desc, operations);
    this.body = startChunk + JSON.stringify({'code' : 0, 'msg' : '添加成功'}) + endChunk;
  }
  
});

// 获取角色信息
let getRoleInfo = router.get('/main/role/get',  function *getRoleInfo() {
  let id = this.request.query.id;
  let callback = this.request.query.callback;
  let startChunk =  callback + '(';
  let endChunk =  ');';

  if(!id) {
    this.body = startChunk + JSON.stringify({'code' : 1, 'msg' : '请上传角色id'}) + endChunk;
    return;
  }

  let result = yield mysqlInstance.getRoleInfo(id);
  this.body = startChunk + JSON.stringify({'code' : 0, 'data' : result[0]}) + endChunk;
});

// 删除角色
let delRole = router.get('/main/role/delete', function *delRole() {
  let id = this.request.query.id;
  let callback = this.request.query.callback;
  let startChunk =  callback + '(';
  let endChunk =  ');';

  if(!id) {
    this.body = startChunk + JSON.stringify({'code' : 1, 'msg' : '请上传角色id'}) + endChunk;
    return;
  }

  mysqlInstance.delRole(id);
  this.body = startChunk + JSON.stringify({'code' : 0, 'msg' : '删除成功!'}) + endChunk;
});


module.exports = {
  getRoleList : getRoleList,
  getPrivList : getPrivList,
  addRole     : addRole,
  addMultiRole: addMultiRole,
  getRoleInfo : getRoleInfo,
  delRole     : delRole,
  getRegion   : getRegion
};

