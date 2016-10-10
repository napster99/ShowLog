'use strict';


module.exports.test = (app, request, should) => {

  describe('角色管理列表接口', () => {

    it('0(cid)##1(callback,sid,page)>>"code":0', function(done) {
      request(app).get('/main/role/list?page=1&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('"code":0');
          done();
        });
    });

    it('1(callback,sid,cid,page)>>"code":0', function(done) {
      request(app).get('/main/role/list?page=1&cid=1&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('"code":0');
          done();
        });
    });

  });


  describe('获取权限树接口', () => {

    it('0(role_id)##1(callback,sid)>>"code":0', function(done) {
      request(app).get('/main/role/priv_list?sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('"code":0');
          done();
        });
    });

    it('1(callback,sid,role_id)>>"code":0', function(done) {
      request(app).get('/main/role/priv_list?role_id=1&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('"code":0');
          done();
        });
    });

  });


  describe('获取地区列表接口', () => {

    it('1(callback,sid)>>"code":0', function(done) {
      request(app).get('/main/role/region?sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('"code":0');
          done();
        });
    });

  });


  describe('添加角色－区域管理员接口', () => {

    it('0(role_id,operations)##1(callback,sid,name->napster,desc->napsterxxxx,cid->1,cname->杭州)>>{"code":0,"msg":"参数不全"}', function(done) {
      request(app).get('/main/role/add?name=napster&desc=napsterxxxx~&cid=1&cname=杭州&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":1,"msg":"参数不全"}');
          done();
        });
    });

    it('0(role_id,name)##1(callback,sid,desc->napsterxxxx,cid->1,cname->杭州,operations=[304,305])>>{"code":0,"msg":"参数不全"}', function(done) {
      request(app).get('/main/role/add?operations=[304,305]&cid=1&cname=杭州&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":1,"msg":"参数不全"}');
          done();
        });
    });

    it('0(role_id,cid)##1(callback,sid,name->napster,desc->napsterxxxx,cname->杭州,operations=[304,305])>>{"code":0,"msg":"参数不全"}', function(done) {
      request(app).get('/main/role/add?operations=[304,305]&name=napster&desc=napsterxxxx&cname=杭州&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":1,"msg":"参数不全"}');
          done();
        });
    });

    it('0(role_id,cname)##1(callback,sid,name->napster,desc->napsterxxxx,cid>1,operations=[304,305])>>{"code":0,"msg":"参数不全"}', function(done) {
      request(app).get('/main/role/add?operations=[304,305]&name=napster&desc=napsterxxxx&cid=1&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":1,"msg":"参数不全"}');
          done();
        });
    });

    it.skip('0(role_id)##1(callback,sid,name->napster,desc->napsterxxxx,cid>1,cname=杭州,operations=[304,305])>>"code":0', function(done) {
      request(app).get('/main/role/add?operations=[304,305]&name=napster&desc=napsterxxxx&cid=1&cname=杭州&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('"code":0');
          done();
        });
    });

    it('1(callback,sid,name->napster,desc->napsterxxxx,cid>1,cname=杭州,operations=[304,305], role_id=2)>>"code":0', function(done) {
      request(app).get('/main/role/add?role_id=2&operations=[304,305]&name=napster&desc=napsterxxxx&cid=1&cname=杭州&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('"code":0');
          done();
        });
    });

    it('1(callback,sid,name->napster,desc->napsterxxxx,cid>1,cname=杭州,operations=[304,305], role_id=999)>>"code":1,"msg":"未知角色"', function(done) {
      request(app).get('/main/role/add?role_id=999&operations=[304,305]&name=napster&desc=napsterxxxx&cid=1&cname=杭州&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('"code":1,"msg":"未知角色"');
          done();
        });
    });

  });


  describe('获取角色信息接口', () => {

    it('0(id)##1(callback,sid)>>{"code":1,"msg":"请上传角色id"}', function(done) {
      request(app).get('/main/role/get?sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":1,"msg":"请上传角色id"}');
          done();
        });
    });

    it('1(callback,sid,id=1)>>"code":0', function(done) {
      request(app).get('/main/role/get?id=1&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('"code":0');
          done();
        });
    });

  });


  describe('删除角色接口', () => {

    it('0(id)##1(callback,sid)>>{"code":1,"msg":"请上传角色id"}', function(done) {
      request(app).get('/main/role/delete?sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('{"code":1,"msg":"请上传角色id"}');
          done();
        });
    });

    it.skip('1(callback,sid,id=44)>>"code":0', function(done) {
      request(app).get('/main/role/delete?id=44&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('"code":0');
          done();
        });
    });

  });




}
