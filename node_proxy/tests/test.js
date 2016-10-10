var request = require('supertest');
var should = require('should');
var app = require('../app');

var authRouter = require('./authRouter.test');
var loginRouter = require('./loginRouter.test');
var roleRouter = require('./roleRouter.test');
var userRouter = require('./userRouter.test');

app.address = () => {
  return { port: 3000 }
}

loginRouter.test(app, request, should);
authRouter.test(app, request, should);
roleRouter.test(app, request, should);
userRouter.test(app, request, should);
