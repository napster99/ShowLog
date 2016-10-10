"use strict";

var showLog = require('../lib/showLog');
new showLog({
  'category' : 'slog',
  'filename' : 'slog',
  'time' : 60 //60s
}).then(function(obj) {
    global.slog = obj.getLogger('slog');
    slog.trace('tracetracetracetrace');
    slog.debug('debugdebugdebugdebugdebug');
    slog.info('infoinfoinfoinfoinfoinfoinfo');
    slog.warn('warnwarnwarnwarnwarnwarnwarnwarn');
    slog.error('errorerrorerrorerrorerrorerrorerror');
    slog.fatal('fatalfatalfatalfatalfatalfatalfatal');
});


