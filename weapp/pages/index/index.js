// pages/index/index.js
var authApi = require("../../apis/authApi");
var util = require("../../utils/util");
var app = getApp();

Page({

  options: null,
  countDownTime: 1000,
  isCountDownFinish: false,
  isLogin: false,

  data: {

  },

  onLoad: function (options) {
    this.options = options;
    this.login();
    this.countDown();
  },

  login: function () {
    app.globalData.logged = false;
    authApi.login(app, this.options, () => {
      this.isLogin = true;
      this.redirect();
    });
  },

  countDown: function () {
    setTimeout(() => {
      this.isCountDownFinish = true;
      this.redirect();
    }, this.countDownTime);
  },

  redirect: function () {
    if (this.isCountDownFinish && this.isLogin) {
      if (app.globalData.userInfo.authorized) {
        let url = "/pages/home/home";
        let params = "";
        for (let key in this.options) {
          if (params != "") {
            params += "&";
          }
          if (typeof this.options[key] == "object") {
            this.options[key] = JSON.stringify(this.options[key]);
          }
          params += key + "=" + this.options[key];
        }
        if (params) {
          url += "?" + params;
        }
        wx.reLaunch({ url: url });
      } else {
        util.goToAuthorize("/pages/home/home", this.options);
      }
    }
  }
})