const constants = require("../libs/wafer2-client-sdk/lib/constants");
const app = getApp();

const apiUrl = "https://coffeebar.ext.pinquest.cn/api";
// const apiUrl = "http://192.168.31.76/api";

var api = {
  loginUrl: `${apiUrl}/user/login`,
  checkUrl: `${apiUrl}/user/check`,
  authorizeUrl: `${apiUrl}/user/authorize`,
  categoriesUrl: `${apiUrl}/category/get_list`,
  goodsListUrl: `${apiUrl}/category/goods_list`,
  goodsDetailUrl: `${apiUrl}/goods/detail`,
  cartsUrl: `${apiUrl}/cart/carts`,
  updateCartsUrl: `${apiUrl}/cart/update_carts`,
  clearCartsUrl: `${apiUrl}/cart/clear_carts`,
  addressesUrl: `${apiUrl}/address/get_list`,
  createOrderUrl: `${apiUrl}/order/create`,
  payUrl: `${apiUrl}/order/pay`,
  getOrderListUrl: `${apiUrl}/order/get_list`,
  getOrderDetailUrl: `${apiUrl}/order/detail`,
  getOrderHistoriesUrl: `${apiUrl}/order/history`,
  buyHistoryUrl: `${apiUrl}/order/buy_history`,
  getDeliveryTimeUrl: `${apiUrl}/order/delivery_time`,
  buyAgainUrl: `${apiUrl}/order/buy_again`,
  isBusyUrl: `${apiUrl}/order/is_busy`,
  request: (options) => {
    options.header = options.header ? options.header : {};
    options.header[constants.WX_HEADER_SKEY] = app.globalData.skey;
    wx.request(options);
  }
};

module.exports = api;