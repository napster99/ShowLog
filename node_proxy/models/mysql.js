var async = require('async');
var mysql = require('mysql');

var mysqlSettings = {
  port: 3306,
  host: '192.168.1.234',
  user: 'root',
  password: '123456',
  database: 'db_monkey'
}

if (process.env.APP_ENV == 'prerelease') {
  mysqlSettings = {
    port: 3306,
    host: 'rm-bp15at02275pq6sb4.mysql.rds.aliyuncs.com',
    user: 'superadmin',
    password: 'ka6aPciQ64qu',
    database: 'db_monkey'
  }
}


if (process.env.APP_ENV == 'master') { //线上
  mysqlSettings = {
    port: 3306,
    host: 'rm-bp1j90y022i6mc58m.mysql.rds.aliyuncs.com',
    user: 'navyuser',
    password: 'GVym4FDLt5cwgM6HvB',
    database: 'db_monkey'
  }
}

var mysqlInstance = null;


function handleDisconnect() {
  var clientObj = mysql.createConnection(mysqlSettings);
  clientObj.connect(function(err) {
    if (err) {
      console.log('error when connecting to db:', err);
      setTimeout(function() {
        mysqlInstance = new Mysql();
      }, 2000);
    }
  });

  clientObj.on('error', function(err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      mysqlInstance = new Mysql();
    } else {
      throw err;
    }
  });

  return clientObj;
}


function Mysql() {

  var clientObj = handleDisconnect();

  //登录验证
  this.checkUserLogin = function(mobile) {
    return new Promise(function(resolve, reject) {
      var sql = 'select * from user where phone = "' + mobile + '"';
      clientObj.query(sql, function(err, rows, fields) {
        if (err) {
          reject();
        } else {
          resolve(rows);
        }
      });
    });
  }

  //获取所有菜单列表
  this.getAuthMenuAll = function() {
    return new Promise((resolve, reject) => {
      var sql = 'select * from menu';
      clientObj.query(sql, (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  //获取菜单
  this.getAuthMenu = function(uid, cid) {
    return new Promise(function(resolve, reject) {
      var sql = 'select role from user where id=' + uid;
      clientObj.query(sql, function(err, rows, fields) {
        if (err) {
          reject(err);
        } else {
          var roleId = rows[0]['role'];
          sql = 'select operate_id from role where id=' + roleId + ' and cid=' + cid;
          console.log('getAuthMenu sql', sql)
          clientObj.query(sql, function(err, rows, fields) {
            if (err) {
              reject(err);
            } else {
              if (rows.length <= 0) {
                resolve([]);
                return;
              }
              //获取匹配的菜单名
              var operationIdArr = [];
              for (var i in rows) {
                operationIdArr.push(rows[i]['operate_id']);
              }
              sql = 'select * from menu where operation_id in (' + String(operationIdArr) + ')';
              clientObj.query(sql, function(err, rows, fields) {
                if (err) {
                  reject(err);
                } else {
                  resolve(rows);
                }
              });
            }
          });
        }
      });
    });
  }

  //获取地区列表
  this.getAuthArea = function(uid) {
    return new Promise(function(resolve, reject) {
      var sql = 'select role from user where id=' + uid;
      clientObj.query(sql, function(err, rows, fields) {
        if (err) {
          reject(err);
        } else {
          var roleId = rows[0]['role'];
          sql = 'select DISTINCT(cid) as cid, cname from role where id=' + roleId;
          clientObj.query(sql, function(err, rows, fields) {
            if (err) {
              reject(err);
            } else {
              resolve(rows);
            }
          });
        }
      });
    });
  }

  //角色列表
  this.getRoleList = function(pageNow, cid) {
    return new Promise((resolve, reject) => {
      var sql = 'select DISTINCT(id), name, `desc` from role where cid=' + cid;
      if (!cid) {
        sql = 'select DISTINCT(id), name, `desc` from role';
      }
      var pageSize = 20;

      var start = (pageNow - 1) * pageSize;
      var pageSql = sql + ' limit  ' + start + ' , ' + pageSize;

      clientObj.query(sql, (err, rows, fields) => {
        if (!err) {
          var total_page = Math.ceil(rows.length / pageSize);
          clientObj.query(pageSql, (err, rows, fields) => {
            if (err) {
              reject(err);
            } else {
              var obj = {
                'rows': rows,
                'total_page': total_page
              }
              resolve(obj);
            }
          });
        } else {
          reject(err);
        }
      });
    });
  }

  //权限表 operation
  this.getPrivList = function() {
    return new Promise((resolve, reject) => {
      var sql = 'select id, parent_id as pId, name from operation';
      clientObj.query(sql, (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  //通过roleid 获取操作权id
  this.getOperateIdsByRoleId = function(roleId) {
    return new Promise((resolve, reject) => {
      var sql = 'select operate_id from role where id = ' + roleId;
      clientObj.query(sql, (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      })
    });
  }

  //添加角色-区域管理员
  this.addRole = function(name, desc, cid, cname, operations) {
    operations = typeof operations === 'string' ? JSON.parse(operations) : operations;
    var genId = parseInt(Math.random() * 100000000);
    for (var i = 0; i < operations.length; i++) {
      var sql = 'INSERT INTO role (id, name, `desc`, cid, operate_id, cname) VALUES (' + genId + ', "' + name + '", "' + desc + '", ' + cid + ', ' + operations[i] + ', "' + cname + '")';
      clientObj.query(sql, (err, rows, fields) => {});
    }
  }

  //添加用户－区域管理员
  this.addUser = function(name, phone, role_id) {
    return new Promise((resolve, reject) => {
      var sql = 'select count(*) as len from user where phone=' + phone;
      clientObj.query(sql, (err, rows, fields) => {
        if (rows[0]['len'] > 0) {
          resolve('exits');
        } else {
          var sql = 'INSERT INTO user (name, phone, role) VALUES ("' + name + '", ' + phone + ', ' + role_id + ')';
          clientObj.query(sql, (err, rows, fields) => {});
          resolve();
        }
      });
    });
  }

  //添加角色-超级管理员
  this.addMultiRole = function(name, desc, operations) {
    operations = typeof operations === 'string' ? JSON.parse(operations) : operations;
    var genId = parseInt(Math.random() * 100000000);

    for (var i in operations) {
      var curIds = operations[i]['operate_ids'];
      var curCname = operations[i]['cname'];
      var curCid = i;
      for (var j = 0; j < curIds.length; j++) {
        var sql = 'INSERT INTO role (id, name, `desc`, cid, operate_id, cname) VALUES (' + genId + ', "' + name + '", "' + desc + '", ' + curCid + ', ' + curIds[j] + ', "' + curCname + '")';
        clientObj.query(sql, (err, rows, fields) => {});
      }
    }
  }

  //修改角色-区域管理员
  this.modiRole = function(name, desc, cid, cname, operations, role_id) {
    operations = typeof operations === 'string' ? JSON.parse(operations) : operations;
    var sql = 'delete from role where id=' + role_id;
    return new Promise((resolve, reject) => {
      clientObj.query(sql, (err, rows, fields) => {
        if (rows.affectedRows <= 0) {
          resolve(0);
        } else {
          for (var i = 0; i < operations.length; i++) {
            var sql = 'INSERT INTO role (id, name, `desc`, cid, operate_id, cname) VALUES (' + role_id + ', "' + name + '", "' + desc + '", ' + cid + ', ' + operations[i] + ', "' + cname + '")';
            clientObj.query(sql, (err, rows, fields) => {});
          }
          resolve(rows.affectedRows);
        }
      });
    })
  }

  //修改用户－区域管理员
  this.modiUser = function(name, phone, role_id, user_id) {
    var sql = 'update user set name="' + name + '", phone=' + phone + ', role=' + role_id + ' where id=' + user_id;
    clientObj.query(sql, (err, rows, fields) => {});
  }

  //修改角色-超级管理员
  this.modiMultiRole = function(name, desc, operations, role_id) {
    operations = typeof operations === 'string' ? JSON.parse(operations) : operations;
    var sql = 'delete from role where id=' + role_id;
    clientObj.query(sql, (err, rows, fields) => {
      for (var i in operations) {
        var curIds = operations[i]['operate_ids'];
        var curCname = operations[i]['cname'];
        var curCid = i;
        for (var j = 0; j < curIds.length; j++) {
          var sql = 'INSERT INTO role (id, name, `desc`, cid, operate_id, cname) VALUES (' + role_id + ', "' + name + '", "' + desc + '", ' + curCid + ', ' + curIds[j] + ', "' + curCname + '")';
          clientObj.query(sql, (err, rows, fields) => {});
        }
      }
    });
  }

  //获取角色信息
  this.getRoleInfo = function(roleId) {
    return new Promise((resolve, reject) => {
      var sql = 'select DISTINCT(id) as id,  name, `desc` from role where id=' + roleId;
      clientObj.query(sql, (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  //删除角色
  this.delRole = function(roleId) {
    var sql = 'delete from role where id=' + roleId;
    clientObj.query(sql, (err, rows, fields) => {
      sql = 'update user set role="" where role=' + roleId;
      clientObj.query(sql, (err, rows, fields) => {});
    });
  }

  //删除用户
  this.delUser = function(user_id) {
    var sql = 'delete from user where id=' + user_id;
    clientObj.query(sql, (err, rows, fields) => {});
  }

  //通过cid获取角色
  this.getRoleByCid = function(cid) {
    var curRolesArr = [];
    return new Promise((resolve, reject) => {
      var sql = 'select * from role  group by id, cid';
      clientObj.query(sql, (err, rows, fields) => {
        if (!err) {
          //过滤数据确保唯一
          var b = []
          for (var i = 0; i < rows.length; i++) {
            var same = false;
            for (j = 0; j < rows.length; j++) {
              if (rows[i]['id'] == rows[j]['id'] && i != j) {
                same = true;
                break;
              }
            }
            if (!same) {
              b.push(rows[i])
            }
          }
          for (var i = 0; i < b.length; i++) {
            if (b[i]['cid'] == cid) {
              curRolesArr.push(b[i])
            }
          }
          resolve(curRolesArr);
        } else {
          reject();
        }
      });
    });
  }

  //获取所有角色列表
  this.getRoleAll = function() {
    return new Promise((resolve, reject) => {
      var sql = 'select DISTINCT(id), name from role  group by id, cid';
      clientObj.query(sql, (err, rows, fields) => {
        if (!err) {
          resolve(rows);
        } else {
          reject();
        }
      });
    });
  }

  //用户列表
  this.getUserList = function(rolesArr) {
    return new Promise((resolve, reject) => {
      var sql = 'select * from user where role in (' + String(rolesArr) + ')';
      clientObj.query(sql, (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  //获取用户信息
  this.getUserInfo = function(user_id) {
    return new Promise((resolve, reject) => {
      var sql = 'select * from user where id=' + user_id;
      clientObj.query(sql, (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  //获取地区
  this.getRegion = function() {
    return new Promise((resolve, reject) => {
      var sql = 'select * from region';
      clientObj.query(sql, (err, rows, fields) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }


}


// function SQLdate_now() {
//   /* MySQL format */
//   var d = new Date();
//   var month = d.getMonth() + 1;
//   var day = d.getDate();
//   var hour = d.getHours();
//   var minute = d.getMinutes();
//   var second = d.getSeconds();
//   var output = d.getFullYear() + '-' +
//     (('' + month).length < 2 ? '0' : '') + month + '-' +
//     (('' + day).length < 2 ? '0' : '') + day + ' ' +
//     (('' + hour).length < 2 ? '0' : '') + hour + ':' +
//     (('' + minute).length < 2 ? '0' : '') + minute + ':' +
//     (('' + second).length < 2 ? '0' : '') + second;
//   return (output);
// };




mysqlInstance = new Mysql();

module.exports.mysqlInstance = mysqlInstance;
