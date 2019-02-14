
const formatDate = date => {
  var date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return [year, month, day].map(formatNumber).join("/");
};

const formatTime = date => {
  var date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " + [hour, minute, second].map(formatNumber).join(":")
  );
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

// 显示繁忙提示
var showBusy = text =>
  wx.showToast({
    title: text,
    icon: "loading",
    duration: 10000
  });

// 显示成功提示
var showSuccess = text =>
  wx.showToast({
    title: text,
    icon: "success"
  });

// 显示失败提示
var showFail = text => {
  wx.hideToast();
  wx.hideLoading();

  wx.showModal({
    title: "提示",
    content: text,
    showCancel: false,
    confirmColor: "#FF6669"
  });
};

var showModal = (title, content, showCancel, success) => {
  wx.hideToast();

  wx.showModal({
    title: title,
    content: content,
    showCancel: showCancel,
    confirmColor: "#FF6669",
    success: success
  });
};

var getRemainTimeDHMS = remainTime => {
  let day = Math.floor(remainTime / (24 * 60 * 60));
  remainTime -= day * (24 * 60 * 60);
  let hour = Math.floor(remainTime / (60 * 60));
  remainTime -= hour * (60 * 60);
  let minute = Math.floor(remainTime / 60);
  remainTime -= minute * 60;
  let second = remainTime;
  return {
    day: day,
    hour: hour,
    minute: minute,
    second: second
  };
};

var getRemainTimeHMS = remainTime => {
  let hour = Math.floor(remainTime / (60 * 60));
  remainTime -= hour * (60 * 60);
  let minute = Math.floor(remainTime / 60);
  remainTime -= minute * 60;
  let second = remainTime;
  return {
    hour: hour,
    minute: minute,
    second: second
  };
};

var formatTwoNum = num => {
  num = num.toString();
  if (num.length < 2) {
    return "0" + num;
  } else {
    return num;
  }
};

var getLastSearchKeywords = () => {
  let value = wx.getStorageSync("search_keywords");
  if (value) {
    return JSON.parse(value);
  } else {
    return [];
  }
};

var storeLastSearchKeyword = keyword => {
  if (keyword.trim() == "") {
    return;
  }
  let value = wx.getStorageSync("search_keywords");
  let keywords = [];
  if (value) {
    keywords = JSON.parse(value);
  }
  for (let i in keywords) {
    let item = keywords[i];
    if (item == keyword) {
      keywords.splice(i, 1);
      break;
    }
  }
  keywords.push(keyword);
  if (keywords.length > 10) {
    keywords.pop();
  }
  wx.setStorage({
    key: "search_keywords",
    data: JSON.stringify(keywords)
  });
};

var clearLastSearchKeyword = () => {
  wx.removeStorageSync("search_keywords");
};

var removeFollow = uid => {
  wx.removeStorage({
    key: "follow_" + uid
  });
};

var getAllPrice = function (goodsList) {
  var price = 0;
  for (var i = 0; i < goodsList.length; i++) {
    price = price + goodsList[i].price * goodsList[i].num;
  }
  return price;
};

var formatString = function (format, ...rest) {
  let num = Math.min(format.match(/{\d+}/g).length, rest.length);
  for (let i = 0; i < num; i++) {
    format = format.replace("{" + i + "}", rest[i]);
  }
  return format;
};

var formatLongGoodsName = function (text, num) {
  return text.length > num ? text.substring(0, num) : text;
};

var getOrderDetailDesc = function (order) {
  if (order.order_status > 0 && order.store && order.store.store_id) {
    return "此订单为线下门店自提订单";
  }
  var goodstate = [
    "您的订单已提交，请在{0}时{1}分{2}秒内完成支付，超时订单自动取消",
    "物流信息：订单支付成功，等待仓库发货",
    "物流信息：{0}",
    "物流信息：订单交易成功",
    "订单关闭",
    "订单关闭",
    "",
    "",
    "",
    "",
    "您的订单已提交，请在{0}时{1}分{2}秒内组团成功，超时订单将会自动取消",
    "系统将为您退款，3个工作日内会退回您的微信账户，请及时查看哦",
    "退款已完成"
  ];
  return goodstate[order.order_status];
};

// 获得字符串实际长度，中文3，英文1
let stringLen = function (str) {
  var length = 0;

  if (!str) {
    return length;
  }

  for (var i = 0; i < str.length; i++) {
    var charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      length += 1;
    } else {
      length += 3;
    }
  }
  return length;
};

var translateSkuAttrValueItemsToObject = function (attrValueItemsStr) {
  let attrs = {};
  let items = attrValueItemsStr.split(";");
  if (items.length == 1 && items[0] == "") {
    items = [];
  }
  for (let item of items) {
    let values = item.split(":");
    if (values.length == 1 && values[0] == "") {
      values = [];
    }
    attrs[values[0]] = values[1];
  }
  return attrs;
};

var translateRpxToPx = function (rpx) {
  var app = getApp();
  return (app.globalData.systemInfo.screenWidth / 750) * rpx;
};

var getExpressCompanyName = function (code) {
  code = code.toUpperCase();
  return expressCompanyData.expressCompanyData[code];
};

var showComingSoon = function () {
  wx.showToast({
    title: "敬请期待！",
    icon: "none"
  });
};

var updateCartRedDot = function () {
  var app = getApp();
  if (app.globalData.cartInfo.length > 0) {
    wx.showTabBarRedDot({
      index: 2
    });
  } else {
    wx.hideTabBarRedDot({
      index: 2
    });
  }
};

var updateCartInfo = function (cartInfo) {
  var app = getApp();
  app.globalData.cartInfo = cartInfo;
  updateCartRedDot();
};

var checkNumber = function (str) {
  var reg = /^[0-9]+.?[0-9]*$/;
  if (reg.test(str)) {
    return true;
  }
  return false;
};

var checkMoney = function (str) {
  var reg = /^[0-9]+.?[0-9]{0,2}$/;
  if (reg.test(str)) {
    return true;
  }
  return false;
};

var checkMobile = function (str) {
  var reg = /^1[3|4|5|6|7|8][0-9]{9}$/;
  if (reg.test(str)) {
    return true;
  }
  return false;
};

var checkVCode = function (str) {
  var reg = /^[0-9]{4}$/;
  if (reg.test(str)) {
    return true;
  }
  return false;
};

var saveLeaveLiveData = function (liveId, isFan, duration) {
  wx.setStorage({
    key: "leave_live_data",
    data: {
      liveId: liveId,
      isFan: isFan,
      duration: duration
    }
  });
};

var formatPrice = function (price) {
  if (typeof price == "string") {
    price = parseFloat(price);
  }
  if (typeof price == "number") {
    return price.toFixed(2);
  } else {
    return price;
  }
};

var fission = function (shareData) {
  if (!getShareLevel()) {
    if (shareData.shareLevel) {
      setShareLevel(shareData.shareLevel + 1);
    } else {
      setShareLevel(1);
    }
  }
};

var goToSharePage = function (shareData, callback) {
  if (shareData.shareType == "webview") {
    let params = "";
    params += `url=${hosts.webServer}/${shareData.act}.html`;
    for (let key in shareData) {
      if (key != "act") {
        if (params != "") {
          params += "&";
        }
      }
      params += `${key}=${shareData[key]}`;
    }
    wx.navigateTo({
      url: "/pages/webview/webview" + "?" + params
    });
  } else {
    let path = "";
    if (shareData.shareType == "goods") {
      path = "/pages/goods_detail/goods_detail";
    } else if (shareData.shareType == "live") {
      path = "/pages/live/live";
    } else if (shareData.shareType == "coupon") {
      path = "/pages/coupon/coupon";
    } else if (shareData.shareType == "order_detail") {
      path = "/pages/order_detail/order_detail";
    } else if (shareData.shareType == "special") {
      path = "/pages/special/special";
    } else if (shareData.shareType == "newpacket") {
      path = "/pages/new_packet/new_packet";
    } else if (shareData.shareType == "contact") {
      path = "/pages/contact/contact";
    } else if (shareData.shareType == "category") {
      path = "/pages/category/category";
    } else if (shareData.shareType == "pintuan") {
      path = "/pages/pintuan/pintuan";
    } else if (shareData.shareType == "invite_gift") {
      path = "/pages/invite_gift/invite_gift";
    } else if (shareData.shareType == "receive_coupon") {
      path = "/pages/receive_coupon/receive_coupon";
    } else if (shareData.shareType == "vip") {
      path = "/pages/vip/vip";
    } else if (shareData.shareType == "post") {
      path = "/pages/posts_with_navigation/posts_with_navigation";
    } else if (shareData.shareType == "ticket") {
      path = "/pages/ticket/ticket";
    }

    let params = "";
    for (let key in shareData) {
      if (params != "") {
        params += "&";
      }
      params += `${key}=${shareData[key]}`;
    }
    let config = require("../config");
    let isTabBarPage = false;
    for (let page of config.tabBarPages) {
      if (shareData.shareType == page) {
        isTabBarPage = true;
        break;
      }
    }
    if (isTabBarPage) {
      wx.reLaunch({ url: path + "?" + params });
    } else {
      wx.navigateTo({ url: path + "?" + params });
    }
  }
  if (callback && typeof callback == "function") {
    callback();
  }
};

var getShareLevel = function () {
  return wx.getStorageSync("ga_share_level");
};

var setShareLevel = function (shareLevel) {
  wx.setStorageSync("ga_share_level", shareLevel);
};

var getChannelId = function () {
  return wx.getStorageSync("ga_channel_id");
};

var setChannelId = function (channelId) {
  wx.setStorageSync("ga_channel_id", channelId);
};

var getSubChannelId = function () {
  return wx.getStorageSync("ga_sub_channel_id");
};

var setSubChannelId = function (subChannelId) {
  wx.setStorageSync("ga_sub_channel_id", subChannelId);
};

var getFrom = function () {
  return wx.getStorageSync("ga_from");
};

var setFrom = function (from) {
  wx.setStorageSync("ga_from", from);
};

var saveShareData = function (options) {
  var shareLevel = getShareLevel();
  var channelId = 0;
  var subChannelId = 0;
  var from = 0;
  var shareData = options.share;
  if (options.share && typeof options.share == "string") {
    try {
      shareData = JSON.parse(decodeURIComponent(options.share));
    } catch (error) {
      console.error("saveShareData " + error);
    }
  }
  if (!shareLevel) {
    shareLevel = 1;
    if (shareData && shareData.shareLevel) {
      shareLevel = shareData.shareLevel + 1;
    }
    setShareLevel(shareLevel);
  }
  if (shareData && shareData.channelId) {
    channelId = shareData.channelId;
  }
  if (shareData && shareData.subChannelId) {
    subChannelId = shareData.subChannelId;
  }
  if (shareData && shareData.from) {
    from = shareData.from;
  }
  var app = getApp();
  app.globalData.shareLevel = shareLevel;
  app.globalData.channelId = channelId;
  app.globalData.subChannelId = subChannelId;
  app.globalData.from = from;
};

var checkSDKVersion = function (targetVersion) {
  try {
    var app = getApp();
    var systemInfo = JSON.parse(JSON.stringify(app.globalData.systemInfo));
    var version = systemInfo.SDKVersion.replace(/\./g, "");
    return parseInt(version) >= targetVersion;
  } catch (error) {
    return false;
  }
};

var compareVersion = function (v1, v2) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    } else if (num1 < num2) {
      return -1
    }
  }

  return 0
};

var formatNickName = function (nickname) {
  if (nickname.length == 1) {
    return nickname;
  } else if (nickname.length == 2) {
    for (var str of nickname) {
      return str + "*";
    }
  } else if (nickname.length == 3) {
    var name = "";
    var last = "";
    var count = 0;
    for (var str of nickname) {
      if (count == 0) {
        name += str + "*";
      } else {
        last = str;
      }
      count++;
    }
    name += last;
    return name;
  } else {
    var name = "";
    var last = "";
    var count = 0;
    for (var str of nickname) {
      if (count == 0) {
        name += str + "**";
      } else {
        last = str;
      }
      count++;
    }
    name += last;
    return name;
  }
};

var isDebugLogOn = function () {
  var isDebugLogOn = wx.getStorageSync("debug_log_on");
  if (isDebugLogOn === "") {
    isDebugLogOn = false;
  }
  return isDebugLogOn;
};

var saveDebugLogOn = function (isDebugLogOn) {
  wx.setStorageSync("debug_log_on", isDebugLogOn);
};

var getDebugLogs = function () {
  var debugLogs = wx.getStorageSync("debug_logs");
  debugLogs = debugLogs ? debugLogs : [];
  return debugLogs;
};

var saveDebugLog = function (debugLog) {
  var config = require("../config");
  var app = getApp();
  app.globalData.debugLogs.push(debugLog);
  if (app.globalData.debugLogs.length > config.debugLogMaxLength) {
    app.globalData.debugLogs.shift();
  }
  wx.setStorageSync("debug_logs", app.globalData.debugLogs);
};

var clearDebugLogs = function () {
  showModal("提示", "确定清空调试日志？", true, res => {
    if (res.confirm) {
      wx.removeStorageSync("debug_logs");
      wx.showToast({
        title: "清空成功"
      });
    }
  });
};

var goToAuthorize = function (page, options) {
  console.log("goToAuthorize:", options);
  var params = "";
  for (var key in options) {
    if (params != "") {
      params += "&";
    }
    if (typeof options[key] == "object") {
      options[key] = JSON.stringify(options[key]);
    }
    params += key + "=" + options[key];
  }
  console.log(params);
  wx.reLaunch({
    url: `../../pages/authorize/authorize?page=${page}&${params}`
  });
};

var retry = function (fn, args, retryTimes, interval) {
  retryTimes--;
  return new Promise((resolve, reject) => {
    return fn(...args)
      .then(() => resolve())
      .catch(err => {
        console.log("err:", err);
        return retryTimes > 0 ?
          setTimeout(
            () => retry(fn, args, retryTimes, interval).then(resolve, reject),
            interval
          ) :
          reject(err);
      });
  });
};

module.exports = {
  formatDate,
  formatTime,
  showBusy,
  showSuccess,
  showFail,
  showModal,
  getRemainTimeDHMS,
  getRemainTimeHMS,
  formatTwoNum,
  getLastSearchKeywords,
  storeLastSearchKeyword,
  clearLastSearchKeyword,
  removeFollow,
  getAllPrice,
  formatString,
  formatLongGoodsName,
  getOrderDetailDesc,
  stringLen,
  translateSkuAttrValueItemsToObject,
  translateRpxToPx,
  getExpressCompanyName,
  showComingSoon,
  updateCartRedDot,
  updateCartInfo,
  checkNumber,
  checkMoney,
  checkMobile,
  checkVCode,
  saveLeaveLiveData,
  formatPrice,
  goToSharePage,
  getShareLevel,
  setShareLevel,
  saveShareData,
  checkSDKVersion,
  compareVersion,
  formatNickName,
  isDebugLogOn,
  saveDebugLogOn,
  getDebugLogs,
  saveDebugLog,
  clearDebugLogs,
  goToAuthorize,
  retry
};