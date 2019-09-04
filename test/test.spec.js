import BeautyRequest from './../index';
const beautyRequest=new BeautyRequest();
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
});