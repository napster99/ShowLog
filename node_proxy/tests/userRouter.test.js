'use strict';


module.exports.test = (app, request, should) => {
  describe('用户管理列表接口', () => {

    it('0(cid)##1(callback,sid)>>{"code":0,"list":[]}', function(done) {
      request(app).get('/main/user/list?sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":0,"list":[]}');
          done();
        });
    });

    it('1(callback,sid,cid=4)>>"code":0', function(done) {
      request(app).get('/main/user/list?cid=4&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('"code":0');
          done();
        });
    });

  });


  describe('添加用户－区域管理员接口', () => {

    it('0(user_id,phone)##1(callback,sid,role,name->napster)>>{"code":0,"msg":"参数不全"}', function(done) {
      request(app).get('/main/user/add?name=napster&role=1&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":1,"msg":"参数不全"}');
          done();
        });
    });

    it('0(user_id,name)##1(callback,phone,sid)>>{"code":0,"msg":"参数不全"}', function(done) {
      request(app).get('/main/user/add?phone=13322222222&role=1&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":1,"msg":"参数不全"}');
          done();
        });
    });

    it('0(user_id,role)##1(callback,phone,name,sid)>>{"code":0,"msg":"参数不全"}', function(done) {
      request(app).get('/main/user/add?phone=13322222222&name=napster&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":1,"msg":"参数不全"}');
          done();
        });
    });

    it('0(user_id)##1(callback,phone=13958111541,name,sid,role)>>{"code":1,"msg":"用户已存在"}', function(done) {
      request(app).get('/main/user/add?phone=13958111541&role=1&name=napster&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":1,"msg":"用户已存在"}');
          done();
        });
    });

    it.skip('0(user_id)##1(callback,phone=13958111544,name,sid,role)>>{"code":0,"msg":"添加成功"}', function(done) {
      request(app).get('/main/user/add?phone=13958111544&role=1&name=napster&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":0,"msg":"添加成功"}');
          done();
        });
    });

    it.skip('1(callback,phone=13958111544,name,sid,role,user_id)>>{"code":0,"msg":"修改成功"}', function(done) {
      request(app).get('/main/user/add?user_id=346&phone=13958111544&role=2&name=napsterxx&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":0,"msg":"修改成功"}');
          done();
        });
    });

    it('1(callback,phone=13958111541,name,sid,role,user_id)>>{"code":1,"msg":"用户已存在"}', function(done) {
      request(app).get('/main/user/add?user_id=346&phone=13958111541&role=2&name=napst2222rxx&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":1,"msg":"用户已存在"}');
          done();
        });
    });


  });


  describe('获取用户信息接口', () => {

    it('0(cid)##1(callback,sid)>>"code":0', function(done) {
      request(app).get('/main/user/role_list?sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('"code":0');
          done();
        });
    });

    it('1(callback,sid,cid=1)>>"code":0', function(done) {
      request(app).get('/main/user/role_list?cid=1&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('"code":0');
          done();
        });
    });

  });


  describe('删除用户接口', () => {

    it('0(user_id)##1(callback,sid)>>{"code":1,"msg":"请上传用户user_id"}', function(done) {
      request(app).get('/main/user/delete?sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":1,"msg":"请上传用户user_id"}');
          done();
        });
    });

    it.skip('1(callback,sid,user_id=346)>>"code":0', function(done) {
      request(app).get('/main/user/delete?user_id=346&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('"code":0');
          done();
        });
    });

  });

}
