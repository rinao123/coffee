// pages/order/order.js
var orderApi = require("../../apis/orderApi");
var api = require("../../common/api");
var util = require("../../utils/util");
var defines = require("../../common/defines");
var app = getApp();

Page({

  data: {
    userInfo: null,
    makingOrders: [],
    unmakingOrders: [],
    orderListHeight: 0
  },

  onShow: function () {
    this.setData({ userInfo: app.globalData.userInfo });
    this.getOrderList();
  },

  onShareAppMessage: function () {
    return {
      title: "Have a good time in WeStore Café",
      path: "/pages/index/index",
      imageUrl: "/resources/images/share.jpg"
    }
  },

  getOrderList: function () {
    orderApi.getOrderList(null, 1, 50, (orders) => {
      let makingOrders = [];
      let unmakingOrders = [];
      for (let order of orders) {
        if (order.orderStatus > defines.ORDER_STATUS.UNPAID && order.orderStatus < defines.ORDER_STATUS.FINISH) {
          makingOrders.push(order);
        } else {
          unmakingOrders.push(order);
        }
      }
      this.setData({ makingOrders: makingOrders, unmakingOrders: unmakingOrders });
    });
  },

  // getOrderList: function () {
  //   api.request({
  //     url: api.getOrderListUrl,
  //     success: (response) => {
  //       console.log("getOrderList:", response);
  //       if(response.data.ret == 0){
  //         let makingOrders = [];
  //         let unmakingOrders = [];
  //         for (let order of response.data.orders) {
  //           if (order.orderStatus > defines.ORDER_STATUS.UNPAID && order.orderStatus < defines.ORDER_STATUS.FINISH) {
  //             makingOrders.push(order);
  //           } else {
  //             unmakingOrders.push(order);
  //           }
  //         }
  //         this.setData({ makingOrders: makingOrders, unmakingOrders: unmakingOrders });
  //       } else if (response.data.ret == 10000) {
  //         wx.showModal({
  //           title: "提示",
  //           content: "登录超时，点击确定重新登录",
  //           showCancel: false,
  //           success: (res) => {
  //             wx.reLaunch({ url: "/pages/login/login" });
  //           }
  //         });
  //       }else{
  //         util.showFail(response.data.msg);
  //       }
  //     },
  //     fail: () => {
  //       util.showFail("网络请求失败，请检查您的网络状态");
  //     }
  //   });
  // },

  setOrderListHeight: function () {
    let query = wx.createSelectorQuery();
    query.select(".card").boundingClientRect();
    query.exec((res) => {
      console.log("card:", res);
      let orderListHeight = app.globalData.systemInfo.windowHeight - res[0].height - util.translateRpxToPx(20);
      this.setData({ orderListHeight: orderListHeight });
    });
  },

  onOrderDetail: function (event) {
    for (let order of this.data.makingOrders){
      if(order.orderId == event.currentTarget.dataset.orderId){
        wx.navigateTo({ url: "../../pages/order_detail/order_detail?orderId=" + order.orderId });
        return;
      }
    }
    for (let order of this.data.unmakingOrders) {
      if (order.orderId == event.currentTarget.dataset.orderId) {
        wx.navigateTo({ url: "../../pages/order_detail/order_detail?orderId=" + order.orderId });
        return;
      }
    }
  },

  onBuyAgain: function (event) {
    api.request({
      url: api.buyAgainUrl,
      data: { orderId: event.currentTarget.dataset.orderId },
      success: (response) => {
        console.log("buyAgain:", response);
        if (response.data.ret == 0) {
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
        } else {
          util.showFail(response.data.msg);
        }
      },
      fail: () => {
        util.showFail("网络请求失败，请检查您的网络状态");
      }
    });
  },

  onPay: function (event) {
    api.request({
      url: api.payUrl,
      data: { orderId: event.currentTarget.dataset.orderId },
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
            },
            fail: (err) => {
              console.log("pay fail:", err);
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
  }
})