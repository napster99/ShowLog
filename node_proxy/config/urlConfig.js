'use strict';

module.exports.URLConfig = {
  noLogin : ['/main/auth/send_code', '/main/auth/login'],
  noAgent : ['/main/auth/info','/main/auth/send_code', '/main/auth/login', '/main/user/list','/main/user/delete','/main/user/banned','/main/user/add','/main/user/info','/main/user/create','/main/role/list', '/main/role/add', '/main/role/add_multi', '/main/role/get', '/main/role/banned', '/main/role/delete', '/main/role/priv_list', '/main/user/role_list','/main/role/region','/main/auth/logout']
}