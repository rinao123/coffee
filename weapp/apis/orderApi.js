var { frontServer } = require("../hosts/hosts");
var baseApi = require("./baseApi");
var util = require("../utils/util");
var preOrderUrl = `${frontServer}/order/pre_order`;
var buyNowUrl = `${frontServer}/order/buy_now`;
var createOrderUrl = `${frontServer}/order/create_order`;
var getOrderListUrl = `${frontServer}/order/list`;
var getOrderInfoUrl = `${frontServer}/order/detail`;
var cancelOrderUrl = `${frontServer}/order/cancel`;
var payUrl = `${frontServer}/order/pay`;
var payByMemberMoneyUrl = `${frontServer}/order/pay_by_member_money`;
var deleteOrderUrl = `${frontServer}/order/delete`;
var confirmArrivalUrl = `${frontServer}/order/confirm_arrival`;
var requestRefundUrl = `${frontServer}/order/request_refund`;
var updateRefundRequestUrl = `${frontServer}/order/update_refund_request`;
var getRefundInfoUrl = `${frontServer}/order/refund_request`;
var fillRefundShippingNoUrl = `${frontServer}/order/fill_refund_shipping_no`;
var refundOperationRecordUrl = `${frontServer}/order/refund_oper_record`;
var getRefundListUrl = `${frontServer}/order/refund_request/list`;
var calculateShippingFeeUrl = `${frontServer}/order/calculate_shipping_fee`;
var createCodOrderUrl = `${frontServer}/order/create_cod_order`;
var shippingTraceUrl = `${frontServer}/shipping/trace`;

var preOrder = (coupon_id, order_info, order_type, success) => {
  let params = { order_info: order_info };
  if (coupon_id != null) {
    params.coupon_id = coupon_id;
  }
  if (order_type) {
    params.order_type = order_type;
  }
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    preOrderUrl,
    params,
    header,
    "POST",
    response => {
      baseApi.log("preOrder:", response);
      if (response.data.ret == 0) {
        let productDiscounts = null;
        let productDiscountsDesc = "";
        let totalProductDiscounts = 0;
        if (response.data.product_discounts) {
          productDiscounts = response.data.product_discounts;
          let productDiscountsData = parseProductDiscountsDesc(response.data.product_discounts);
          productDiscountsDesc = productDiscountsData.productDiscountsDesc;
          totalProductDiscounts = productDiscountsData.totalProductDiscounts;
        }

        let discount = response.data.discount || null;
        let reduction = response.data.reduction || null;
        let coupon = response.data.coupon || null;
        let address = response.data.address || null;
        let freight = response.data.shipping_fee || 0;
        let couponList = response.data.coupon_list || [];
        let availableStores = response.data.available_stores || [];
        let memberMoney = response.data.member_money || 0;
        let isPresell = response.data.is_presell || false;
        let plannedShippingTime = response.data.planned_shipping_time || 0;

        let data = {
          address: address,
          productDiscounts: productDiscounts,
          discount: discount,
          reduction: reduction,
          selectedCoupon: coupon,
          totalGoodsPrice: response.data.goods_money,
          orderPrice: response.data.order_money,
          freight: freight,
          totalPayPrice: response.data.order_money,
          totalProductDiscounts: totalProductDiscounts,
          productDiscountsDesc: productDiscountsDesc,
          saveMoney: response.data.save_money,
          couponList: couponList,
          availableStores: availableStores,
          memberMoney: memberMoney,
          isPresell: isPresell,
          plannedShippingTime: plannedShippingTime
        };
        if (success && typeof success == "function") {
          success(data);
        }
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var buyNow = (anchor_id, goods_id, sku_id, num, coupon_id, address, form_id, store_id, buyer_message, live_id, success) => {
  wx.showLoading({ title: "正在创建订单", mask: true });
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  var complete = () => {
    wx.hideLoading();
  };
  var params = {
    goods_id: goods_id,
    sku_id: sku_id,
    num: num,
    coupon_id: coupon_id,
    address: address,
    form_id: form_id
  };
  if (anchor_id) {
    params.anchor_id = anchor_id;
  }
  if (store_id) {
    params.store_id = store_id;
  }
  if (buyer_message) {
    params.buyer_message = buyer_message;
  }
  if (live_id) {
    params.live_id = live_id;
  }
  var app = getApp();
  params.spm = app.getSpm();
  baseApi.request(buyNowUrl, params, header, "POST", response => {
    baseApi.log("buyNow:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.order);
      }
    } else {
      util.showFail(response.data.msg);
    }
  },
    undefined,
    complete,
    true
  );
};

var createOrder = (cart_list, coupon_id, address, form_id, store_id, buyer_message, success) => {
  wx.showLoading({ title: "正在创建订单", mask: true });
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  var complete = () => {
    wx.hideLoading();
  };
  var params = {
    cart_list: cart_list,
    coupon_id: coupon_id,
    address: address,
    form_id: form_id
  };
  if (store_id) {
    params.store_id = store_id;
  }
  if (buyer_message) {
    params.buyer_message = buyer_message;
  }
  var app = getApp();
  params.spm = app.getSpm();
  baseApi.request(createOrderUrl, params, header, "POST", response => {
    baseApi.log("createOrder:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.order);
      }
    } else {
      util.showFail(response.data.msg);
    }
  },
    undefined,
    complete,
    true
  );
};

var getOrderList = (order_status, page, page_size, success) => {
  let params = {};
  if (order_status != undefined || order_status != null) {
    params.order_status = order_status;
  }
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(
    getOrderListUrl,
    params,
    {},
    "GET",
    response => {
      baseApi.log("getOrderList:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response.data.order_list);
        }
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var getOrderInfo = (orderId, success) => {
  baseApi.request(`${getOrderInfoUrl}/${orderId}`, {}, {}, "GET", response => {
    baseApi.log("getOrderInfo", response);
    if (response.data.ret == 0) {
      for (let goods of response.data.order_goods) {
        goods.sku_name = goods.sku_name.trim().replace(" ", "；");
      }
      if (success && typeof success == "function") {
        success(response.data);
      }
    } else {
      util.showFail(response.data.msg);
    }
  },
    undefined,
    undefined,
    true
  );
};

var cancelOrder = (order_id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    cancelOrderUrl,
    { order_id: order_id },
    header,
    "POST",
    response => {
      baseApi.log("onCancelOrder:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response.data.order);
        }
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var pay = (order_id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(payUrl, { order_id: order_id }, header, "POST", response => {
    baseApi.log("pay:", response);
    if (success && typeof success == "function") {
      success(response.data);
    }
  },
    undefined,
    undefined,
    true
  );
};

var payByMemberMoney = (order_id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    payByMemberMoneyUrl,
    { order_id: order_id },
    header,
    "POST",
    response => {
      baseApi.log("payByMemberMoney:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success();
        }
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var deleteOrder = (order_id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    deleteOrderUrl,
    { order_id: order_id },
    header,
    "POST",
    response => {
      baseApi.log("deleteOrder:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success();
        }
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var confirmArrival = (order_id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    confirmArrivalUrl,
    { order_id: order_id },
    header,
    "POST",
    response => {
      baseApi.log("confirmArrival:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response.data.order);
        }
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var requestRefund = (params, success) => {
  baseApi.request(
    requestRefundUrl,
    params,
    {},
    "POST",
    response => {
      baseApi.log("requestRefund:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response.data);
        }
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var updateRefundRequest = (params, success) => {
  baseApi.request(
    updateRefundRequestUrl,
    params,
    {},
    "POST",
    response => {
      baseApi.log("updateRefundRequest:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success();
        }
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var getRefundInfo = (reqId, success) => {
  baseApi.request(
    `${getRefundInfoUrl}/${reqId}`,
    {},
    {},
    "GET",
    response => {
      if (response.data.ret == 0) {
        baseApi.log("getRefundInfo:", response);
        if (success && typeof success == "function") {
          success(response.data);
        }
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var fillRefundShippingNo = (refund_request_id, shipping_no, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    fillRefundShippingNoUrl,
    { refund_request_id: refund_request_id, shipping_no: shipping_no },
    header,
    "POST",
    response => {
      baseApi.log("fillRefundShippingNo:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success();
        }
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var refundOperationRecord = (reqId, success) => {
  baseApi.request(
    `${refundOperationRecordUrl}/${reqId}`,
    {},
    {},
    "GET",
    response => {
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response);
        }
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var getRefundList = (page, page_size, success) => {
  var params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(getRefundListUrl, params, {}, "GET", response => {
    baseApi.log("getRefundList:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.refund_requests);
      }
    } else {
      util.showFail(response.data.msg);
    }
  },
    undefined,
    undefined,
    true
  );
};

var calculateShippingFee = (params, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(calculateShippingFeeUrl, params, header, "POST", response => {
    if (response.data.ret == 0) {
      baseApi.log("calculateShippingFee:", response);
      if (success && typeof success == "function") {
        success(response.data.shipping_fee);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var createCodOrder = (goods_detail, address, form_id) => {
  wx.showLoading({ title: "正在创建订单", mask: true });
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  var complete = () => {
    wx.hideLoading();
  };
  baseApi.request(
    createCodOrderUrl,
    { goods_detail: goods_detail, address, address, form_id: form_id },
    header,
    "POST",
    response => {
      baseApi.log("createCodOrder:", response);
      if (response.data.ret == 0) {
        let app = getApp();
        app.globalData.cartInfo = [];
        wx.redirectTo({ url: "../../pages/pay_success/pay_success" });
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var shippingTrace = (shipping_no, success) => {
  baseApi.request(shippingTraceUrl, { shipping_no: shipping_no }, {}, "GET", response => {
    baseApi.log("shippingTrace", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.trace);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var parseProductDiscountsDesc = productDiscounts => {
  let totalProductDiscounts = 0;
  let productDiscountsDesc = "";
  let count = 0;
  if (productDiscounts) {
    for (let item of productDiscounts) {
      totalProductDiscounts += parseFloat(item.money);
      if (count < 4) {
        if (productDiscountsDesc != "") {
          productDiscountsDesc += " ";
        }
        productDiscountsDesc += item.desc;
      } else {
        productDiscountsDesc += "…";
      }
      count++;
      if (count > 4) {
        break;
      }
    }
  }
  return { totalProductDiscounts: totalProductDiscounts, productDiscountsDesc: productDiscountsDesc };
};

module.exports = {
  preOrder,
  buyNow,
  createOrder,
  getOrderList,
  getOrderInfo,
  cancelOrder,
  pay,
  payByMemberMoney,
  deleteOrder,
  confirmArrival,
  requestRefund,
  updateRefundRequest,
  getRefundInfo,
  fillRefundShippingNo,
  refundOperationRecord,
  getRefundList,
  calculateShippingFee,
  createCodOrder,
  shippingTrace
};
