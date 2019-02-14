// pages/authorize/authorize.js
var authApi = require("../../apis/authApi");
var util = require("../../utils/util");
var config = require("../../config");
var app = getApp();

Page({
  data: {
    page: "",
    params: ""
  },

  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: config.appName });
    if (options.page === undefined) {
      util.showModal("提示", "无效参数，点击确定刷新", false, () => {
        wx.reLaunch({ url: "/pages/index/index" });
      });
      return;
    }
    let params = "";
    for (let key in options) {
      if (params != "") {
        params += "&";
      }
      if (key != "page") {
        params += key + "=" + options[key];
      }
    }
    this.setData({ page: options.page, params: params });
  },

  authorize: function (event) {
    console.log("bindgetuserinfo:", event);
    if (event.detail.encryptedData && event.detail.iv) {
      authApi.authorize(
        event.detail.encryptedData,
        event.detail.iv,
        userInfo => {
          app.globalData.userInfo = userInfo;
          this.goToPage();
        }
      );
    } else {
      if (event.detail.errMsg == "getUserInfo:fail auth deny") {
        console.log("用户拒绝授权");
      } else {
        let error = { msg: "authorize, encryptedData或iv为空", event: event }
        console.error(error);
      }
    }
  },

  goToPage: function () {
    let url = this.data.page;
    if (this.data.params) {
      url += "?" + this.data.params;
    }
    console.log("goToPage:", url);
    wx.reLaunch({ url: url });
  },

  onAgreementTap: function () {
    wx.navigateTo({ url: "/pages/webview/webview?url=" + config.agreementUrl });
  }
});
