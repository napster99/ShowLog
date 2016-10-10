"use strict";

let log4js = require('log4js');
let path = require('path');
let co = require('co');
let logFile = require('./logFile');


function ShowLog(opt) {
  let self = this;
  let time = opt['time'];
  let category = opt['category'];

  return co(function*() {
    let curRoot = yield logFile['getRootDir']();
    //1、检查是否存在配置文件
    let isExitCatalog = yield logFile['isExitFile'](curRoot, './logs');
    let content = self.getOptions(opt, curRoot);
    if (isExitCatalog) {
      let isExitFile = yield logFile['isExitFile'](curRoot, './logs/log-config.json');
      if (!isExitFile) {
        //如果不存在配置文件
        //新建配置文件
        logFile['createFile'](curRoot, './logs/log-config.json', content);
      }
    } else {
      //新建目录
      logFile['createCatalog'](curRoot, 'logs');
      //新建配置文件
      logFile['createFile'](curRoot, './logs/log-config.json', content);
    }

    let fileSrc = path.join(curRoot, './logs/log-config.json');
    let logsPath = path.join(curRoot, './logs');

    //初始化配置
    self.init(fileSrc, logsPath, time);

    return self;
  });

}

/**
 * init showLog.
 *
 * @param {string} fileSrc 
 * @param {string} path 
 * @param {number} time 
 * @returns {void} 
 * @private
 */
ShowLog.prototype.init = function(fileSrc, path, time) {
  this.loadConfig(fileSrc);
  this.filesCheck(path, time);
}

/**
 * get options for default.
 *
 * @param {object} opt 
 * @param {string} curRoot 
 * @returns {object} 
 * @private
 */
ShowLog.prototype.getOptions = function(opt, curRoot) {
  if (opt['filename']) {
    opt['filename'] = path.join(curRoot, 'logs', opt['filename'] + '.log');
  }
  if (opt['time']) {
    delete opt['time'];
  }
  let options = Object.assign({
    'type': 'file',
    'filename': path.join(curRoot, 'logs', 'logs.log'),
    'maxLogSize': 500 * 1024 , //500kb
    'backups': 2,
    'category': 'logs'
  }, opt);

  return {
    'appenders': [options]
  };
}

/**
 * load config of logs.
 *
 * @param {string} fileSrc 
 * @returns {void} 
 * @private
 */
ShowLog.prototype.loadConfig = function(fileSrc) {
  log4js.configure(fileSrc, { reloadSecs: 300 });
}

/**
 * get logger instance.
 *
 * @param {string} category 
 * @returns {void} 
 * @private
 */
ShowLog.prototype.getLogger = function(category) {
  return log4js.getLogger(category);
}

/**
 * Regularly check expired files.
 *
 * @param {string} path 
 * @param {string} time 
 * @returns {Boolean} 
 * @private
 */
ShowLog.prototype.filesCheck = function(path, time) {
  logFile.loopCheckFile(path, time);
}



module.exports = ShowLog;
