var util = require("../utils/util");
var HEADER_SKEY = "X-WX-Skey";
var SESSION_KEY = "weapp_session_F2C224D4-2BCE-4C64-AF9F-A6D872000D1A";
var APPKEY = "35a88f5faa0fd0614ce12eef92c656f9";
var isShowLog = true;
var needLoginRequests = [];

var log = (tag, content) => {
  if (isShowLog) {
    console.log(tag, content);
  }
};

var getSession = () => {
  return wx.getStorageSync(SESSION_KEY) || null;
};

var setSession = session => {
  wx.setStorageSync(SESSION_KEY, session);
};

var clearSession = () => {
  wx.removeStorageSync(SESSION_KEY);
};

var addNeedLoginRequest = (
  url,
  data,
  header,
  method,
  success,
  fail,
  complete,
  needLogin
) => {
  wx.showToast({ title: "正在加载", icon: "loading", duration: 10000, mask: true });
  needLoginRequests.push({
    url: url,
    data: data,
    header: header,
    method: method,
    success: success,
    fail: fail,
    complete: complete,
    needLogin
  });
};

var addSessionToHeader = header => {
  var app = getApp();
  if (!header) {
    header = {};
  }
  header[HEADER_SKEY] =
    app && app.globalData.session ? app.globalData.session : getSession();
  return header;
};

var requestFailDefault = () => {
  util.showFail("网络请求失败，请检查您的网络状态");
};

var requestCompleteDefault = () => {};

var requestSuccess = (response, url, header, method, data, success) => {
  if (response.statusCode != 200) {
    saveDebugLog(
      "request_error",
      url,
      header,
      method,
      data,
      response.data.error
    );
    if (response.statusCode == 401) {
      showLoginTimeOut();
    } else {
      util.showFail("抱歉，服务器繁忙，请稍后再试");
      logClientSwerrRequestError(url, header, method, data, response.statusCode, response.data.error);
    }
  } else {
    if (typeof response.data !== "object") {
      util.showFail("数据异常，请联系客服处理");
    } else {
      success(response);
    }
  }
};

var uploadSuccess = (response, url, filePath, success) => {
  if (response.statusCode != 200) {
    util.showFail("抱歉，服务器繁忙，请稍后再试");
    logClientSwerrUploadError(
      url,
      filePath,
      response.statusCode,
      response.data.error
    );
  } else {
    success(response);
  }
};

var showLoginTimeOut = () => {
  util.showModal("提示", "登录超时，点击确定重新登录", false, res => {
    var app = getApp();
    app.login();
    wx.reLaunch({ url: "/pages/index/index" });
  });
};

var logClientSwerrRequestError = (url, header, method, data, statusCode, error) => {
  var errorData = {
    url: url,
    header: header,
    method: method,
    data: data,
    statusCode: statusCode,
    error: error
  };
  console.error(errorData);
};

var logClientSwerrUploadError = (url, filePath, statusCode, error) => {
  var errorData = {
    url: url,
    filePath: filePath,
    name: "file",
    statusCode: statusCode,
    error: error
  };
  console.error(errorData);
};

var saveDebugLog = (logType, url, header, method, data, error) => {
  var app = getApp();
  if (app && app.globalData.isDebugLogOn) {
    var debugLog = {
      logType: logType,
      url: url,
      header: JSON.stringify(header),
      method: method,
      data: JSON.stringify(data),
      error: JSON.stringify(error),
      date: util.formatTime()
    };
    util.saveDebugLog(debugLog);
  }
};

var request = (
  url,
  data,
  header,
  method,
  success,
  fail,
  complete,
  needLogin
) => {
  var app = getApp();
  header['appkey'] = APPKEY;
  if (needLogin && (!app || !app.globalData.logged)) {
    addNeedLoginRequest(
      url,
      data,
      header,
      method,
      success,
      fail,
      complete,
      needLogin
    );
    return;
  }
  log("request url:", url);
  var requestFail = error => {
    log(
      "url:" + url,
      "error:" + JSON.stringify(error) + " data:" + JSON.stringify(data)
    );
    saveDebugLog("request_fail", url, header, method, data, error);
    fail = fail || requestFailDefault;
    fail();
  };
  var requestComplete = complete || requestCompleteDefault;

  header = addSessionToHeader(header);

  wx.request({
    url: url,
    header: header,
    data: data,
    method: method,
    success: response => {
      requestSuccess(response, url, header, method, data, success);
    },
    fail: requestFail,
    complete: requestComplete
  });
};

var upload = (url, filePath, success, fail, complete) => {
  log("upload url:", url);
  var requestFail = error => {
    log(
      "url:" + url,
      "error:" + JSON.stringify(error) + " filePath:" + filePath
    );
    saveDebugLog(
      "upload_fail",
      url,
      {},
      undefined,
      { filePath: filePath },
      error
    );
    fail = fail || requestFailDefault;
  };
  var requestComplete = complete || requestCompleteDefault;
  wx.uploadFile({
    url: url,
    filePath: filePath,
    name: "file",
    success: response => {
      uploadSuccess(response, url, filePath, success);
    },
    fail: requestFail,
    complete: requestComplete
  });
};

var download = (url, success, fail, complete) => {
  log("download url:", url);
  var requestFail = error => {
    log("url:" + url, "error:" + JSON.stringify(error));
    saveDebugLog("download_fail", url, {}, undefined, {}, error);
    fail = fail || requestFailDefault;
  };
  var requestComplete = complete || requestCompleteDefault;
  wx.downloadFile({
    url: url,
    success: response => {
      success(response);
    },
    fail: requestFail,
    complete: requestComplete
  });
};

var afterLogin = () => {
  if (needLoginRequests.length > 0) {
    for (var needLoginRequest of needLoginRequests) {
      request(
        needLoginRequest.url,
        needLoginRequest.data,
        needLoginRequest.header,
        needLoginRequest.method,
        needLoginRequest.success,
        needLoginRequest.fail,
        needLoginRequest.complete,
        needLoginRequest.needLogin
      );
    }
    needLoginRequests = [];
    wx.hideToast();
  }
};

module.exports = {
  log,
  getSession,
  setSession,
  clearSession,
  request,
  upload,
  download,
  afterLogin
};
