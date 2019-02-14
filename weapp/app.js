//app.js
var ald = require("./utils/ald-stat");
var indexApi = require("./apis/indexApi");
var authApi = require("./apis/authApi");
var util = require("./utils/util");


App({
  onLaunch: function (options) {
    console.log("onLaunch:", options);
    this.globalData.options = options;
    this.globalData.scene = options.scene;
    this.globalData.systemInfo = wx.getSystemInfoSync();
    console.log("systemInfo:", this.globalData.systemInfo);
    this.globalData.isIphoneX = this.globalData.systemInfo.model.toLowerCase().indexOf("iphone x") > -1;
    this.globalData.isDebugLogOn = util.isDebugLogOn();
    this.globalData.debugLogs = util.getDebugLogs();
    this.checkUpdate();
    // this.login();
    this.getAppConfig();
  },

  onShow: function (options) {
    console.log("onShow:", options);
    if (this.globalData.logged) {
      this.globalData.options = options;
      this.globalData.scene = options.scene;
      this.check();
    }
  },

  login: function () {
    this.globalData.logged = false;
    authApi.login(this, this.globalData.options.query);
  },

  check: function () {
    authApi.check(this, this.globalData.options.query);
  },

  getAppConfig: function () {
    indexApi.getAppConfig((appConfig) => {
      this.globalData.appConfig = appConfig;
    });
  },

  checkUpdate: function () {
    if (!wx.canIUse("getUpdateManager")) {
      return;
    }
    var updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(() => {
      util.showModal("提示", "发现新版本，点击确定更新", false, () => {
        updateManager.applyUpdate();
      });
    });
  },

  getSpm: function () {
    var spm = `${this.globalData.scene}.${this.globalData.channelId}.${this.globalData.from}`;
    console.log("spm:", spm);
    return spm;
  },

  globalData: {
    options: null,
    logged: false,
    session: null,
    systemInfo: null,
    userInfo: null,
    carts: [],
    appConfig: null,
    addressData: null,
    cartInfo: [],
    isIphoneX: false,
    scene: 0,
    shareLevel: 1,
    channelId: 0,
    subChannelId: 0,
    from: 0,
    isDebugLogOn: false,
    debugLogs: []
  }
})