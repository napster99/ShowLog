'use strict';



module.exports.test = (app, request, should) => {

  describe('发送验证码接口', () => {

    it('0(mobile)##1(callback)>>{"code":-1,"msg":"手机号不能为空"}', function(done) {
      request(app).get('/main/auth/send_code?callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":-1,"msg":"手机号不能为空"}');
          done();
        });
    });

    it.skip('1(mobile,callback)>>{"code":0,"msg":"发送成功"}', function(done) {
      request(app).get('/main/auth/send_code?mobile=13958111541&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":0,"msg":"发送成功"}');
          done();
        });
    });

  });


  describe('登陆接口', () => {

    it('0(mobile, verify)##1(callback)>>{"code":-1,"msg":"手机号不能为空"}', function(done) {
      request(app).get('/main/auth/login?callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":-1,"msg":"手机号不能为空"}');
          done();
        });
    });

    it('0(verify)##1(mobile, callback)>>{"code":-1,"msg":"验证码不能为空"}', function(done) {
      request(app).get('/main/auth/login?mobile=13958111541&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":-1,"msg":"验证码不能为空"}');
          done();
        });
    });

    it.skip('1(mobile->13958111542, verify, callback)>>{"code":2,"msg":"未发送验证码"}', function(done) {
      request(app).get('/main/auth/login?mobile=13958111542&verify=1111&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":2,"msg":"未发送验证码"}');
          done();
        });
    });

    it('1(mobile->13511112222,callback)>>{"code":0,"msg":"发送成功"}', function(done) {
      request(app).get('/main/auth/send_code?mobile=13511112222&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":0,"msg":"发送成功"}');
          done();
        });
    });

    it('1(mobile->13511112222, verify->1111, callback)>>{"code":1,"msg":"验证码错误"}', function(done) {
      request(app).get('/main/auth/login?mobile=13511112222&verify=1111&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":1,"msg":"验证码错误"}');
          done();
        });
    });

    it('1(mobile->18888888888,callback)>>{"code":0,"msg":"发送成功"}', function(done) {
      request(app).get('/main/auth/send_code?mobile=18888888888&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":0,"msg":"发送成功"}');
          done();
        });
    });

    it.skip('1(mobile->18888888888, verify->1111, callback)>>{"code":4,"msg":"账号不存在"}', function(done) {
      request(app).get('/main/auth/login?mobile=18888888888&verify=1111&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":4,"msg":"账号不存在"}');
          done();
        });
    });

    it.skip('1(mobile, verify, callback)>>"code":0', function(done) {
      request(app).get('/main/auth/login?mobile=13958111541&verify=1111&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('"code":0');
          done();
        });
    });

  });


  describe('登出接口', () => {

    it('0(sid)##1(callback)>>{"code":888,"msg":"未传sid"}', function(done) {
      request(app).get('/main/auth/logout?callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":888,"msg":"未传sid"}');
          done();
        });
    });

    it.skip('1(sid->STR:MONKEY:SESSION:j267t13v, mobile,callback)>>{"code":0,"msg":"登出成功"}', function(done) {
      request(app).get('/main/auth/logout?mobile=13958111541&sid=STR:MONKEY:SESSION:j267t13v&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":0,"msg":"登出成功"}');
          done();
        });
    });

  });


}
