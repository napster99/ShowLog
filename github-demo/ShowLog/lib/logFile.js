"use strict";

let fs = require('fs');
let path = require('path');
let co = require('co');
let schedule = require("node-schedule");

let curDir = process.cwd();
let up = '../';


function logFile() {

}

/**
 * Check the File is exist or not.
 *
 * @param {string} src 
 * @param {string} fileName
 * @returns {Boolean} 
 * @private
 */
function isExitFile(src, fileName) {
  let curFile = path.join(src, fileName);
  return new Promise((resolve, reject) => {
    fs.exists(curFile, (exists) => {
      resolve(!!exists);
    });
  })
}

/**
 * Create Catlog when it is not exist.
 *
 * @param {string} src 
 * @param {string} fileName
 * @returns {Boolean} 
 * @private
 */
function createCatalog(src, fileName) {
  let curCatalog = path.join(src, fileName);
  fs.mkdirSync(curCatalog);
}

/**
 * Create File when it is not exist.
 *
 * @param {string} src 
 * @param {string} fileName
 * @returns {Boolean} 
 * @private
 */
function createFile(src, fileName, content) {
  let curFile = path.join(src, fileName);
  fs.writeFileSync(curFile, JSON.stringify(content));
}

/**
 * Delete files when it is out of time.
 *
 * @param {string} src 
 * @param {string} fileName
 * @returns {Boolean} 
 * @private
 */
function delFileByOutOfTime(src, fileName) {
  let fileSrc = src;
  if(fileName) {
    fileSrc = path.join(src, fileName);
  }
  fs.unlinkSync(fileSrc);
}

/**
 * Get the create time of files.
 *
 * @param {string} src 
 * @param {string} fileName
 * @returns {Date} 
 * @private
 */
function getCreateFileTime(src, fileName) {
  let fileSrc = src;
  if(fileName) {
    fileSrc = path.join(src, fileName);
  }
  return new Promise((resolve, reject) => {
    fs.stat(fileSrc, (err, info) => {
      if (!err) {
        resolve(info['ctime'])
      }
    });
  });
}

/**
 * check the create time.
 *
 * @param {string} createTime 
 * @returns {Boolean} 
 * @private
 */
function isOutOfTime(createTime, time) {
  var nowTime = parseInt(new Date().getTime() / 1000);
  var cTime = parseInt(new Date(createTime).getTime() / 1000);
  if (nowTime - cTime > time) {
    return true;
  }

  return false;
}

/**
 * check file for loop time.
 *
 * @param {string} catalogDir 
 * @param {string} time 
 * @returns {Boolean} 
 * @private
 */
function loopCheckFile(catalogDir, time) {
  let rule = new schedule.RecurrenceRule();
  rule.hour = 10;  //每天10点执行一次
  schedule.scheduleJob(rule, function() {
    let fileSrcArr = getFilesSrc(catalogDir);
    co(function*() {
      for(let i=0; i<fileSrcArr.length; i++) {
        let curCtime = yield getCreateFileTime(fileSrcArr[i]);
        let isOut = isOutOfTime(curCtime, time);
        if(isOut) {
          //delete file
          delFileByOutOfTime(fileSrcArr[i]);
        }
      }
    });
  });
  
  

}

/**
 * get the root dir.
 *
 * @returns {string} 
 * @private
 */
function getRootDir() {
  let rootDir = curDir;
  return co(function*() {
    while (true) {
      if (yield isExitFile(rootDir, 'package.json')) {
        break;
      }
      rootDir = path.join(rootDir, up);
    }
    return rootDir;
  })

}

/**
 * get the root dir.
 * 
 * @param {string} catalogDir 
 * @returns {string} 
 * @private
 */
function getFilesSrc(catalogDir) {
  let filesArr = fs.readdirSync(catalogDir);
  if(filesArr[0]) {
    filesArr.forEach((item, index) => {
      if(item === 'log-config.json') {
        filesArr[index] = null;
      }else{
        filesArr[index] = path.join(catalogDir, item);
      }
    });
  }
  filesArr = filesArr.filter(function(value) {
    return !!value;
  })
  return filesArr;
}



module.exports = {
  isExitFile: isExitFile,
  createCatalog: createCatalog,
  createFile: createFile,
  loopCheckFile: loopCheckFile,
  getRootDir: getRootDir
};
