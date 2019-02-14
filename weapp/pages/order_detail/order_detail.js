// pages/order_detail/order_detail.js
const api = require("../../common/api");
const util = require("../../utils/util");
const defines = require("../../common/defines");
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,
    order: null,
    isShowOrderDetail: true,
    totalNum: 0,
    orderDate: "",
    orderTime: "",
    shippingDate: "",
    shippingTime: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let isIphoneX = false;
    let model = app.globalData.systemInfo.model;
    model = model.toLowerCase();
    if (model.indexOf("iphone x") > -1) {
      isIphoneX = true;
    }
    this.setData({ orderId: options.orderId, isIphoneX: isIphoneX });
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
    this.getOrderDetail(this.startTimer);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },

  onShareAppMessage: function () {
    return {
      title: "Have a good time in WeStore Café",
      path: "/pages/login/login",
      imageUrl: "/images/share.jpg"
    }
  },

  getOrderDetail: function (callback) {
    api.request({
      url: api.getOrderDetailUrl,
      data: { orderId: this.data.orderId },
      success: (response) => {
        console.log("getOrderDetail:", response);
        if(response.data.ret == 0){
          let date = new Date(response.data.order.createTime * 1000);
          let orderDate = `${date.getFullYear()}-${util.keepTwoNum(date.getMonth() + 1)}-${util.keepTwoNum(date.getDate())}`;
          let orderTime = `${util.keepTwoNum(date.getHours())}:${util.keepTwoNum(date.getMinutes())}:${util.keepTwoNum(date.getSeconds())}`;
          let date2 = new Date(response.data.order.shippingTime * 1000);
          let shippingDate = `${date2.getFullYear()}-${util.keepTwoNum(date2.getMonth() + 1)}-${util.keepTwoNum(date2.getDate())}`;
          let shippingTime = `${util.keepTwoNum(date2.getHours())}:${util.keepTwoNum(date2.getMinutes())}:${util.keepTwoNum(date2.getSeconds())}`;
          let totalNum = 0;
          for (let goods of response.data.order.goodsList) {
            totalNum += goods.num;
          }
          this.setData({
            order: response.data.order,
            totalNum: totalNum,
            orderDate: orderDate,
            orderTime: orderTime,
            shippingDate: shippingDate,
            shippingTime: shippingTime
          });
          if (callback && typeof callback == "function") {
            callback();
          }
        } else if (response.data.ret == 10000){
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

  buyAgain: function () {
    api.request({
      url: api.buyAgainUrl,
      data: { orderId: this.data.orderId },
      success: (response) => {
        console.log("buyAgain:", response);
        if(response.data.ret == 0){
          app.globalData.carts = response.data.carts;
          wx.navigateTo({ url: "/pages/balance/balance" });
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

  startTimer: function () {
    if(this.timer){
      clearInterval(this.timer);
    }
    if (this.data.order.orderStatus < defines.ORDER_STATUS.FINISH){
      this.timer = setInterval(this.getOrderDetail, 5000);
    }
  },

  onShowOrderDetailTap: function () {
    if (this.data.order.orderStatus < defines.ORDER_STATUS.FINISH){
      this.setData({ isShowOrderDetail: !this.data.isShowOrderDetail });
    }
  },

  onBackTap: function () {
    wx.navigateBack({ delta: 1 });
  }
})