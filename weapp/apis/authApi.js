var { userServer } = require("../hosts/hosts");
var util = require("../utils/util");
var eventMgr = require("../common/eventMgr");
var baseApi = require("./baseApi");
var checkUrl = `${userServer}/auth/check`;
var loginUrl = `${userServer}/auth/login`;
var authorizeUrl = `${userServer}/auth/authorize`;
var HEADER_CODE = "X-WX-Code";

var login = (app, options, success) => {
  var retryTime = 0;
  var loginSuccess = () => {
    eventMgr.triggerEvent(eventMgr.eventNames.ON_LOGIN_SUCCESS);
    if (success && typeof success == "function") {
      success();
    }
  }
  var fail = () => {
    retryTime++;
    if (retryTime <= 3) {
      baseApi.log("login retryTime:", retryTime);
      doLogin(app, options, loginSuccess, fail);
    } else {
      util.showFail("登录失败，可能是网络错误或者服务器发生异常");
    }
  }
  doLogin(app, options, loginSuccess, fail);
};

var doLogin = (app, extParam, success, fail) => {
  if (app.globalData.logged) {
    if (success && typeof success == "function") {
      success();
    }
    return;
  }

  var systemInfo = JSON.stringify(app.globalData.systemInfo);
  var scene = app.globalData.scene;
  var extParamStr = "";
  try {
    if (extParam.share && typeof extParam.share == "string") {
      extParam.share = JSON.parse(decodeURIComponent(extParam.share));
    }
  } catch (error) {
    var desc = {
      reason: "parse share fail",
      options: extParam,
      error: error
    };
    console.error(desc);
  }
  try {
    extParamStr = JSON.stringify(extParam);
  } catch (error) {
    var desc = {
      reason: "stringify options fail",
      options: extParam,
      extParamStr: extParamStr,
      error: error
    };
    console.error(desc);
  }

  checkSession(
    app,
    () => {
      checkRequest(systemInfo, scene, extParamStr, app, success, fail);
    },
    () => {
      wxLogin(
        app,
        code => {
          loginRequest(
            code,
            systemInfo,
            scene,
            extParamStr,
            app,
            success,
            fail
          );
        },
        fail
      );
    }
  );
};

var check = (app, options, success) => {
  var retryTime = 0;
  var checkSuccess = () => {
    if (success && typeof success == "function") {
      success();
    }
  }
  var fail = () => {
    retryTime++;
    if (retryTime <= 3) {
      baseApi.log("check retryTime:", retryTime);
      doLogin(app, options, checkSuccess, fail);
    } else {
      console.error("check失败，可能是网络错误或者服务器发生异常");
    }
  }
  doCheck(app, options, checkSuccess, fail);
};

var doCheck = (app, extParam, success, fail) => {
  var systemInfo = JSON.stringify(app.globalData.systemInfo);
  var scene = app.globalData.scene;
  var extParamStr = "";
  try {
    if (extParam.share && typeof extParam.share == "string") {
      extParam.share = JSON.parse(decodeURIComponent(extParam.share));
    }
  } catch (error) {
    var desc = {
      reason: "parse share fail",
      options: extParam,
      error: error
    };
    console.error(desc);
  }
  try {
    extParamStr = JSON.stringify(extParam);
  } catch (error) {
    var desc = {
      reason: "stringify options fail",
      options: extParam,
      extParamStr: extParamStr,
      error: error
    };
    console.error(desc);
  }
  checkRequest(systemInfo, scene, extParamStr, app, success, fail);
};

var checkSession = (app, success, fail) => {
  var checkSessionStartTime = Date.now();
  wx.checkSession({
    success: res => {
      baseApi.log("checkSession success res:", res);
      saveDebugLog(
        app,
        "check_session_success",
        Date.now() - checkSessionStartTime + "ms",
        baseApi.getSession(),
        res
      );
      if (success && typeof success == "function") {
        success();
      }
    },

    fail: error => {
      baseApi.log("checkSession success error:", error);
      saveDebugLog(
        app,
        "check_session_fail",
        Date.now() - checkSessionStartTime + "ms",
        baseApi.getSession(),
        undefined,
        error
      );
      baseApi.clearSession();
      if (fail && typeof fail == "function") {
        fail();
      }
    }
  });
};

var wxLogin = (app, success, fail) => {
  var wxLoginStartTime = Date.now();
  wx.login({
    success: res => {
      saveDebugLog(
        app,
        "wx_login_success",
        Date.now() - wxLoginStartTime + "ms",
        undefined,
        res
      );
      if (success && typeof success == "function") {
        success(res.code);
      }
    },
    fail: function (error) {
      saveDebugLog(
        app,
        "wx_login_fail",
        Date.now() - wxLoginStartTime + "ms",
        undefined,
        undefined,
        error
      );
      if (fail && typeof fail == "function") {
        fail();
      }
    }
  });
};

var loginRequest = (code, system_info, via, ext_param, app, success, fail) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  header[HEADER_CODE] = code;
  var data = { system_info: system_info, via: via, ext_param: ext_param };
  var loginStartTime = Date.now();
  baseApi.request(
    loginUrl,
    data,
    header,
    "POST",
    response => {
      baseApi.log("loginRequest:", response);
      if (response.data.code == 0 && response.data.data.skey) {
        saveDebugLog(
          app,
          "login_success",
          Date.now() - loginStartTime + "ms",
          undefined,
          response
        );
        app.globalData.logged = true;
        app.globalData.session = response.data.data.session;
        app.globalData.userInfo = response.data.data.userinfo;
        baseApi.setSession(response.data.data.skey);
        baseApi.afterLogin();
        if (success && typeof success == "function") {
          success();
        }
      } else {
        saveDebugLog(
          app,
          "login_error",
          Date.now() - loginStartTime + "ms",
          undefined,
          response
        );
        util.showFail("登录失败，可能是网络错误或者服务器发生异常");
      }
    },
    error => {
      saveDebugLog(
        app,
        "login_fail",
        Date.now() - loginStartTime + "ms",
        undefined,
        undefined,
        error
      );
      if (fail && typeof fail == "function") {
        fail();
      }
    }
  );
};

var checkRequest = (system_info, via, ext_param, app, success, fail) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  var data = { via: via, ext_param: ext_param };
  var checkStartTime = Date.now();
  baseApi.request(
    checkUrl,
    data,
    header,
    "GET",
    response => {
      baseApi.log("check:", response);
      if (response.data.loginState) {
        saveDebugLog(
          app,
          "check_success",
          Date.now() - checkStartTime + "ms",
          undefined,
          response
        );
        app.globalData.logged = true;
        app.globalData.session = baseApi.getSession();
        app.globalData.userInfo = response.data.userinfo;
        baseApi.afterLogin();
        if (success && typeof success == "function") {
          success();
        }
      } else {
        saveDebugLog(
          app,
          "check_error",
          Date.now() - checkStartTime + "ms",
          undefined,
          response
        );
        wxLogin(app, code => {
          loginRequest(code, system_info, via, ext_param, app, success);
        });
      }
    },
    error => {
      saveDebugLog(
        app,
        "check_fail",
        Date.now() - checkStartTime + "ms",
        undefined,
        undefined,
        error
      );
      if (fail && typeof fail == "function") {
        fail();
      }
    }
  );
};

var authorize = (encryptedData, iv, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    authorizeUrl,
    { data: encryptedData, iv: iv },
    header,
    "POST",
    response => {
      baseApi.log("authorize:", response);
      var app = getApp();
      if (response.data.ret == 0) {
        var userInfo = response.data.userinfo;
        app.globalData.userInfo = userInfo;
        if (success && typeof success == "function") {
          success(userInfo);
        }
      } else if (response.data.ret == 1) {
        wxLogin(app, code => {
          loginRequest(
            code,
            JSON.stringify(app.globalData.systemInfo),
            app.globalData.scene,
            "{}",
            app
          );
        });
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var saveDebugLog = (app, logType, costTime, session, res, error) => {
  if (app && app.globalData.isDebugLogOn) {
    var debugLog = {
      logType: logType,
      costTime: costTime
    };
    if (session) {
      debugLog.session = session;
    }
    if (res) {
      debugLog.res = JSON.stringify(res);
    }
    if (error) {
      debugLog.error = JSON.stringify(error);
    }
    debugLog.date = util.formatTime();
    util.saveDebugLog(debugLog);
  }
};

module.exports = {
  loginUrl,
  login,
  check,
  authorize
};
