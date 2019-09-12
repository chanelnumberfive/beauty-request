import axios from 'axios';
import NProgress from 'nprogress';
const config = {
  getCode: function (data) {
    return data.code;
  },
  getMessage: function (data) {
    return data.msg;
  },
  message:function(message,type){
    alert(message)
  },
  on401:function(){},
  successCode: [10000]
};

function initParams(obj) {
  obj.loadingName = obj.loadingName || 'loading';
  obj.disabledName=obj.disabledName||'disabled';
}
// 请求构造函数
function BeautyRequest(_config) {
  _config = _config || {};
  Object.assign(this, config, _config);
  this.CancelToken = axios.CancelToken;
  this.source = this.CancelToken.source();
}
BeautyRequest.prototype.getType = function (data) {
  let type = Object.prototype.toString;
  BeautyRequest.prototype.getType = function (data) {
    return type.call(data).split(' ')[1].replace(']', '').toLowerCase();
  };
  return type.call(data).split(' ')[1].replace(']', '').toLowerCase();
};

function setPageState(page, code='error', message='error',obj={}){
  if (!page) return;
  page[obj.disabledName] = code == -1;
  page[obj.loadingName] = {
    code: code,
    message: message
  };
}
BeautyRequest.prototype.handleResponse = function (res, obj) {
  let data = res.data;
  let msg = this.getMessage(data);
  let code = this.getCode(data);
  if (this.successCode.indexOf(code) !== -1) {
    this.requestSuccess(data, obj);
  } else {
    this.requestFail(msg, obj);
  }
};
BeautyRequest.prototype.requestSuccess = function (data, obj) {
  if (obj.success) obj.success(data);
  if (obj.successTip) this.message(obj.successTip,'success');
};
BeautyRequest.prototype.requestFail = function (error, obj) {
  if (obj.fail) obj.fail(error);
  if (!obj.noTip) this.message(obj.failTip||error,'fail');
};
BeautyRequest.prototype.beautyRequest = function (obj, vm, method, ajaxId) {
  setPageState(vm, -1, '', obj);
  if(obj.progress) NProgress.start();
  return new Promise((resolve, reject) => {
    this.axiosInstance[method](obj.url, obj.params, ajaxId).then((res) => {
      this.handleResponse(res, obj);
      setPageState(vm,200,'', obj);
      resolve(res.data);
    }).catch((error) => {
      if(error===401) (obj.on401||this.on401)();
      setPageState(vm,error,error,obj);
      this.requestFail(error, obj);
      reject(error);
    }).finally(function () {
      if (obj.finally) obj.finally();
      if(obj.progress) NProgress.done();
    });
  });
};
['Get', 'Delete'].forEach(function (item) {
  BeautyRequest.prototype[`beauty${item}`] = function (obj, vm) {
    initParams(obj);
    obj.params = obj.params || {
      params: {}
    };
    obj.params.cancelToken = this.source.token;
    if (this.paramTemplate) Object.assign(obj.params.params||{}, this.paramTemplate);
    return this.beautyRequest(obj, vm, item.toLowerCase());
  };
});
['Post', 'Put'].forEach(function (item) {
  BeautyRequest.prototype[`beauty${item}`] = function (obj, vm) {
    initParams(obj);
    let ajaxId = {
      cancelToken: this.source.token
    };
    if (this.paramTemplate) Object.assign(obj.params, this.paramTemplate);
    return this.beautyRequest(obj, vm, item.toLowerCase(), ajaxId);
  };
});
// a funtion similar with Promise.all
BeautyRequest.prototype.beautyAll = function (obj, vm) {
  let that = this;
  initParams(obj);
  setPageState(vm, -1, '', obj);
  return new Promise(function (resolve, reject) {
    Promise.all(obj.params).then(function (datas) {
      setPageState(vm, 10000, '', obj);
      resolve(datas);
      for (let i = 0; i < datas.length; i++) {
        let data = datas[i];
        let msg = that.getMessage(data);
        let code = that.getCode(data);
        if (that.successCode.indexOf(code) === -1) {
          return that.requestFail(msg, obj);
        }
      }
      that.requestSuccess(datas, obj);
    }).catch(function (error) {
      if (obj.fail) obj.fail(error);
      that.requestFail(error.errMsg, obj);
      reject(error);
    }).finally(function () {
      if (obj.finally) obj.finally();
    });
  });
};
BeautyRequest.prototype.abort = function () {
  this.source.cancel();
  this.source = this.CancelToken.source();
};
// 请求构造函数的初始化
BeautyRequest.prototype.init = function (token, host, tokenKey) {
  let common = {};
  common[tokenKey || 'token'] = token;
  // 创建axios实例
  this.axiosInstance = axios.create(this.ajax || {
    timeout: 30000,
    headers: {
      post: {
        "Content-Type": "application/json"
      },
      common: common
    },
    withCredentials: token ? true : false,
    baseURL: host
  });

  // 当token过期时跳转首页登陆
  this.axiosInstance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    let status = error && error.response && error.response.status;
    status=status||error;
    return Promise.reject(status);
  });
};
export default BeautyRequest