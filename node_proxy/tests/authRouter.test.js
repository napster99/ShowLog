'use strict';


module.exports.test = (app, request, should) => {
  describe('获取菜单接口', () => {
    
    it('1(callback,sid, cid)>>"code":0', function(done) {
      request(app).get('/main/auth/info?cid=1&sid=STR:MONKEY:SESSION:tj56k052&callback=JSON')
        .expect(200, function(err, res) {
          should.not.exist(err);
          res.text.should.containEql('"code":0');
          done();
        });
    });

  });

}


