var { frontServer } = require("../hosts/hosts");
var baseApi = require("./baseApi");
var util = require("../utils/util");
var checkCouponUrl = `${frontServer}/activity/coupon/check`;
var drawCouponUrl = `${frontServer}/activity/coupon/draw`;
var getCouponListUrl = `${frontServer}/activity/coupon/list`;
var getCouponInfoUrl = `${frontServer}/activity/coupon/info`;
var getDrawableCouponsUrl = `${frontServer}/activity/coupon/drawable_coupons`;

var checkCoupon = (types, success) => {
  baseApi.request(`${checkCouponUrl}?${types}`, {}, {}, "GET", (response) => {
    baseApi.log("checkCoupon:", response);
    if (success && typeof success == "function") {
      success(response.data.result);
    }
  }, undefined, undefined, true);
};

var drawCoupon = (type, success, fail) => {
  baseApi.request(
    drawCouponUrl,
    { type: type },
    {},
    "GET",
    response => {
      baseApi.log("drawCoupon:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success();
        }
      } else {
        if (response.data.ret == 1) {
          wx.showToast({ title: "您已经领过优惠券", icon: "none" });
        } else if (response.data.ret == 2) {
          wx.showToast({ title: "优惠券已领完", icon: "none" });
        } else if (response.data.ret == 3) {
          wx.showToast({ title: "活动已过期", icon: "none" });
        } else if (response.data.ret == 4) {
          wx.showToast({ title: "优惠券不可用", icon: "none" });
        }
        fail && fail();
      }
    },
    undefined,
    undefined,
    true
  );
};

var getCouponList = (page, page_size, success) => {
  var params = {};
  if(page){
    params.page = page;
  }
  if(page_size){
    params.page_size = page_size;
  }
  baseApi.request(getCouponListUrl, params, {}, "GET", response => {
    baseApi.log("getCouponList:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.coupons, response.data.coupon_count);
      }
    } else {
      util.showFail(response.data.msg);
    }
  }, undefined, undefined, true);
};

var getCouponInfo = (types, success) => {
  baseApi.request(`${getCouponInfoUrl}?${types}`, {}, {}, "GET", (response) => {
    baseApi.log("getCouponInfo:", response);
    if (success && typeof success == "function") {
      success(response.data.coupon_types);
    }
  }, undefined, undefined, true);
};

var getDrawableCoupons = (page, page_size, success) => {
  var params = {};
  if(page){
    params.page = page;
  }
  if(page_size){
    params.page_size = page_size;
  }
  baseApi.request(getDrawableCouponsUrl, params, {}, "GET", response => {
    baseApi.log("getDrawableCoupons:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.drawable_coupons);
      }
    } else {
      util.showFail(response.data.msg);
    }
  }, undefined, undefined, true);
};

module.exports = {
  checkCoupon,
  drawCoupon,
  getCouponList,
  getCouponInfo,
  getDrawableCoupons
};
