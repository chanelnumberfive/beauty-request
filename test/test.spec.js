import BeautyRequest from './../index';
let state=null;
const beautyRequest=new BeautyRequest({
  on401:function(){
    state=401
  }
});
beautyRequest.init();
describe('beauty request', function () {
  beforeEach(function () {
    jasmine.Ajax.install();
  });

  afterEach(function () {
    jasmine.Ajax.uninstall();
  });

  it('应当请求成功并且vm的loading属性设置正确',function (done) {
    let vm={
      disabled:false,
      loading:{
        code:-1,
        message:''
      }
    };
    beautyRequest.beautyGet({
      url:'/foo',
      success:function(data){
        setTimeout(function () {
          expect(vm.loading.code).toEqual(200);
          expect(vm.loading.message).toEqual('');
          expect(vm.disabled).toEqual(false);
          done();
        },100);
      }
    },vm);
    expect(vm.loading.code).toEqual(-1);
    expect(vm.loading.message).toEqual('');
    expect(vm.disabled).toEqual(true);
    getAjaxRequest().then(function (request){
      request.respondWith({
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        responseText:`{
          "code":10000,
          "data":"ok",
          "msg":"ok!"
        }`
      });
    });
  });
  it('应当触发失败回调',function (done) {
    beautyRequest.beautyGet({
      url:'/foo',
      fail:function(data){
        setTimeout(function () {
          done();
        },100);
      }
    });
    getAjaxRequest().then(function (request){
      request.respondWith({
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        responseText:`{
          "code":10001,
          "data":"error",
          "msg":"error!"
        }`
      });
    });
  });
  it('应当请求失败并且vm的loading属性设置正确', function (done) {
    let vm={
      loading:{
        code:-1,
        message:''
      }
    };
    beautyRequest.beautyPost({
      url:'/foo',
      fail:function(){
        setTimeout(function () {
          expect(vm.loading.code).toEqual(404);
          expect(vm.loading.message).toEqual(404);
          expect(vm.disabled).toEqual(false);
          done();
        },100);
      }
    },vm);
    expect(vm.loading.code).toEqual(-1);
    expect(vm.loading.message).toEqual('');
    expect(vm.disabled).toEqual(true);
    getAjaxRequest().then(function (request){
      request.respondWith({
        status: 404
      });
    });
  });
  it('401', function (done) {
    state=100;
    beautyRequest.beautyPost({
      url:'/foo',
      fail:function(){
        setTimeout(function () {
          expect(state).toEqual(401);
          done();
        },100);
      }
    });
    getAjaxRequest().then(function (request){
      request.respondWith({
        status: 401
      });
    });
  });
  it('401', function (done) {
    state=100;
    beautyRequest.beautyPost({
      url:'/foo',
      on401:function(){
        setTimeout(function(){
          done()
        },100)
      }
    });
    getAjaxRequest().then(function (request){
      request.respondWith({
        status: 401
      });
    });
  });
  it('执行finally回调函数', function (done) {
    beautyRequest.beautyPost({
      url:'/foo',
      finally:function(){
        setTimeout(function(){
          done()
        },100)
      }
    });
    getAjaxRequest().then(function (request){
      request.respondWith({
        status:200
      });
    });
  });
  it('执行promise.then', function (done) {
    beautyRequest.beautyPost({
      url:'/foo'
    }).then(function(){
      setTimeout(function(){
        done()
      },100)
    });
    getAjaxRequest().then(function (request){
      request.respondWith({
        status:200
      });
    });
  });
  it('执行promise.catch', function (done) {
    beautyRequest.beautyPost({
      url:'/foo'
    }).catch(function(error){
      setTimeout(function(){
        expect(error).toEqual(404);
        done()
      },100)
    });
    getAjaxRequest().then(function (request){
      request.respondWith({
        status:404
      });
    });
  });
});