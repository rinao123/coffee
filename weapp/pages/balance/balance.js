// pages/balance/balance.js
const api = require("../../common/api");
const util = require("../../utils/util");
const defines = require("../../common/defines");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shippingType: defines.SHIPPING_TYPE.WAITING,
    point: 0,
    usePoint: false,
    carts: [],
    totalNum: 0,
    totalPrice: 0,
    payPrice: 0,
    isShowGoods: true,
    isShowTimePicker: false,
    datePickerValue: [],
    datePickerIndex: [],
    timePickerValue: [],
    timePickerIndex: [],
    addressPickerIndex: [],
    addressPickerValue: [],
    remark: "",
    mobile: "",
    shippingTime: 0,
    orderDateStr: "",
    orderTimeStr: "",
    deliveryTimeStr: "",
    addresses: [],
    addressValue: "",
    isIphoneX: false,
    isMobileError: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let model = app.globalData.systemInfo.model;
    model = model.toLowerCase();
    if (model.indexOf("iphone x") > -1) {
      this.setData({ isIphoneX: true });
    }
    let usePoint = app.globalData.userInfo.point > 0;
    let totalNum = 0;
    let totalPrice = 0;
    let payPrice = 0;
    for (let cart of app.globalData.carts){
      totalNum += parseInt(cart.num);
      totalPrice += parseFloat(cart.price * cart.num)
    }
    payPrice = totalPrice;
    if (usePoint){
      payPrice = Math.max(payPrice - app.globalData.userInfo.point * 0.1, 0);
    }
    this.setData({ 
      point: app.globalData.userInfo.point, 
      mobile: app.globalData.userInfo.userMobile,
      usePoint: usePoint, 
      carts: app.globalData.carts,
      totalNum: totalNum,
      totalPrice: totalPrice,
      payPrice: payPrice
    });
    this.initDatePicker();
    this.initTimePicker();
    this.initAddressPicker();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  onShareAppMessage: function () {
    return {
      title: "Have a good time in WeStore Café",
      path: "/pages/login/login",
      imageUrl: "/resources/images/share.jpg"
    }
  },

  getAddresses: function () {
    api.request({
      url: api.addressesUrl,
      success: (response) => {
        console.log("getAddresses:", response);
        this.setData({ addressPickerIndex: 0, addressPickerValue: response.data.addresses });
      },
      fail: () => {
        util.showFail("网络请求失败，请检查您的网络状态");
      }
    });
  },

  getDeliveryTime: function () {
    api.request({
      url: api.getDeliveryTimeUrl,
      success: (response) => {
        console.log("getDeliveryTime:", response);
        let date = new Date();
        date.setMinutes(date.getMinutes() + response.data.minutes);
        let deliveryTimeStr = `预计 ${util.formatTwoNum(date.getHours())}:${util.formatTwoNum(date.getMinutes())} 可取餐`;
        this.setData({ deliveryTimeStr: deliveryTimeStr });
      },
      fail: () => {
        util.showFail("网络请求失败，请检查您的网络状态");
      }
    });
  },

  pay: function (orderId, point) {
    api.request({
      url: api.payUrl,
      data: { orderId: orderId },
      success: (response) => {
        console.log("pay:", response);
        if(response.data.ret == 0){
          wx.requestPayment({
            timeStamp: response.data.orderInfo.timeStamp,
            nonceStr: response.data.orderInfo.nonceStr,
            package: response.data.orderInfo.package,
            signType: response.data.orderInfo.signType,
            paySign: response.data.orderInfo.paySign,
            success: (res) => {
              console.log("pay success:", res);
              app.globalData.userInfo.point -= point;
              wx.redirectTo({ url: "/pages/order_detail/order_detail?orderId=" + orderId });
            },
            fail: (err) => {
              console.log("pay fail:", err);
              if (err.errMsg == "requestPayment:fail cancel") {
                wx.switchTab({ url: "/pages/order/order" });
              }
            }
          });
        } else if (response.data.ret == 10000) {
          wx.showModal({
            title: "提示",
            content: "登录超时，点击确定重新登录",
            showCancel: false,
            success: (res) => {
              wx.reLaunch({ url: "/pages/login/login" });
            }
          });
        }else{
          util.showFail(response.data.msg);
        }
      },
      fail: () => {
        util.showFail("网络请求失败，请检查您的网络状态");
      }
    });
  },

  initDatePicker: function () {
    let days = [];
    let date = new Date();
    date.setDate(date.getDate() + 1);
    let tomorrow = `${date.getMonth() + 1}月${date.getDate()}日  明天`;
    days.push(tomorrow);
    date.setDate(date.getDate() + 1);
    let dayAfterTomorrow = `${date.getMonth() + 1}月${date.getDate()}日  后天`;
    days.push(dayAfterTomorrow);
    date.setDate(date.getDate() + 1);
    let twoDayAfterTomorrow = `${date.getMonth() + 1}月${date.getDate()}日  大后天`;
    days.push(twoDayAfterTomorrow);
    let datePickerValue = [days];
    let datePickerIndex = [0];
    this.setData({ datePickerValue: datePickerValue, datePickerIndex: datePickerIndex });
  },

  initTimePicker: function () {
    let hours = [];
    let minutes = [];
    let date = new Date();
    let minute = date.getMinutes();
    let hour = date.getHours();
    if (hour < 9 || hour > 21) {
      hour = 9;
      minute = 0;
    }
    for (let i = 9; i < 21; i++) {
      hours.push(util.formatTwoNum(i) + "时");
    }
    for (let i = 0; i < 60; i++) {
      minutes.push(util.formatTwoNum(i) + "分");
    }
    let timePickerValue = [hours, minutes];
    let timePickerIndex = [hour - 9, minute];
    this.setData({ timePickerValue: timePickerValue, timePickerIndex: timePickerIndex });
  },

  initAddressPicker: function () {
    this.getAddresses();
  },

  onShippingTypeTap: function (event) {
    if (event.currentTarget.dataset.shippingType == defines.SHIPPING_TYPE.DELIVERY && this.data.totalPrice < 8){
      return;
    }
    this.setData({ shippingType: event.currentTarget.dataset.shippingType});
    if (event.currentTarget.dataset.shippingType == defines.SHIPPING_TYPE.DELIVERY){
      this.getDeliveryTime();
    }
  },

  onUsePointTap: function () {
    let usePoint = !this.data.usePoint;
    let payPrice = this.data.totalPrice;
    if(usePoint){
      payPrice = Math.max(payPrice - app.globalData.userInfo.point * 0.1, 0);
    }
    this.setData({ usePoint: !this.data.usePoint, payPrice: payPrice });
  },

  onShowGoodsTap: function () {
    let isShowGoods = !this.data.isShowGoods;
    this.setData({ isShowGoods: isShowGoods });
  },

  onDatePickerChange: function (event) {
    let date = new Date();
    date.setDate(date.getDate() + event.detail.value[0] + 1);
    date.setHours(this.data.timePickerIndex[0] + 9);
    date.setMinutes(this.data.timePickerIndex[1]);
    date.setSeconds(0);
    let shippingTime = Math.floor(date.getTime() / 1000);
    let orderDateStr = this.data.datePickerValue[0][event.detail.value[0]];
    this.setData({
      datePickerIndex: event.detail.value,
      shippingTime: shippingTime,
      orderDateStr: orderDateStr
    });
  },

  onTimePickerChange: function (event) {
    let date = new Date();
    date.setDate(date.getDate() + this.data.datePickerIndex[0] + 1);
    date.setHours(event.detail.value[0] + 9);
    date.setMinutes(event.detail.value[1]);
    date.setSeconds(0);
    let shippingTime = Math.floor(date.getTime() / 1000);
    let hour = this.data.timePickerValue[0][event.detail.value[0]];
    let minute = this.data.timePickerValue[1][event.detail.value[1]];
    let orderTimeStr = hour + minute;
    this.setData({ 
      shippingType: defines.SHIPPING_TYPE.ORDER, 
      timePickerIndex: event.detail.value, 
      shippingTime: shippingTime,
      orderTimeStr: orderTimeStr 
    });
  },

  onAddressPickerChange: function (event) {
    this.setData({ addressPickerIndex: event.detail.value, addressValue: this.data.addressPickerValue[event.detail.value] });
  },

  onWarnTap: function () {
    wx.showModal({
      title: "",
      content: "该小程序仅限腾讯员工使用，请到指定办公楼层进行取。",
      showCancel: false,
      confirmText: "我知道了"
    });
  },

  onRemarkInput: function (event) {
    this.setData({ remark: event.detail.value });
  },

  onMobileInput: function (event) {
    this.setData({ mobile: event.detail.value });
  },

  onMobileBlur: function (event) {
    var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
    let isMobileError = !reg.test(event.detail.value);
    this.setData({ isMobileError: isMobileError });
  },

  onPayTap: function (event) {
    let shippingTime = this.data.shippingTime;
    let address = "腾讯B4 WeStore";
    if (this.data.shippingType == defines.SHIPPING_TYPE.WAITING){
      shippingTime = Math.floor(new Date().getTime() / 1000);
    } else if (this.data.shippingType == defines.SHIPPING_TYPE.ORDER){
      if(this.data.orderDateStr == "" || this.data.orderTimeStr == ""){
        wx.showToast({ title: "请选择预约时间", icon: "none" });
        return;
      }
    } else if (this.data.shippingType == defines.SHIPPING_TYPE.DELIVERY){
      address = this.data.addressValue;
      if(address == ""){
        wx.showToast({ title: "请选择办公楼层", icon: "none" });
        return;
      }
      if (this.data.mobile == "") {
        wx.showToast({ title: "请输入联系电话", icon: "none" });
        return;
      }
      if (this.data.isMobileError) {
        wx.showToast({ title: "请输入正确的联系电话", icon: "none" });
        return;
      }
    }
    wx.showLoading({ title: "正在生成订单", mask: true });
    api.request({
      url: api.createOrderUrl,
      data: {
        shippingType: this.data.shippingType,
        remark: this.data.remark,
        shippingTime: shippingTime,
        mobile: this.data.mobile,
        address: address,
        formId: event.detail.formId,
        usePoint: this.data.usePoint ? 1 : 0
      },
      success: (response) => {
        console.log("onPayTap:", response);
        if(response.data.ret == 0){
          if (response.data.order.payMoney > 0){
            this.pay(response.data.order.orderId, response.data.order.point);
          }else{
            app.globalData.userInfo.point -= response.data.order.point;
            wx.redirectTo({ url: "/pages/order_detail/order_detail?orderId=" + response.data.order.orderId });
          }
          if (this.data.shippingType == defines.SHIPPING_TYPE.DELIVERY){
            app.globalData.userInfo.userMobile = this.data.mobile;
          }
        } else if (response.data.ret == 10000) {
          wx.showModal({
            title: "提示",
            content: "登录超时，点击确定重新登录",
            showCancel: false,
            success: (res) => {
              wx.reLaunch({ url: "/pages/login/login" });
            }
          });
        }else{
          util.showFail(response.data.msg);
        }
      },
      fail: () => {
        util.showFail("网络请求失败，请检查您的网络状态");
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  onBackTap: function () {
    wx.navigateBack({ delta: 1 });
  }
})