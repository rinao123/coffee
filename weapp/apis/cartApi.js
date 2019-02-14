var { frontServer } = require("../hosts/hosts");
var baseApi = require("./baseApi");
var util = require("../utils/util");
var getCartListUrl = `${frontServer}/cart/cart_list`;
var updateCartGoodsUrl = `${frontServer}/cart/update_cart_goods`;
var delCartsUrl = `${frontServer}/cart/delete`;
var buyAgainUrl = `${frontServer}/cart/buy_again`;

var getCartList = success => {
  baseApi.request(getCartListUrl, {}, {}, "GET", response => {
      baseApi.log("getCartList:", response);
      if (response.data.ret == 0) {
        for (let cart of response.data.carts) {
          cart.sku_name = cart.sku_name.trim().replace(" ", "；");
        }
        if (success && typeof success == "function") {
          success(response.data.carts);
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

var updateCartGoods = (goods_id, sku_id, num, success) => {
  var params = { goods_id: goods_id, sku_id: sku_id, num: num };
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(updateCartGoodsUrl, params, header, "POST", response => {
      baseApi.log("updateCartGoods:", response);
      if (response.data.ret == 0) {
        success(response.data.cart);
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var delCarts = (cart_ids, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(delCartsUrl, { cart_ids: cart_ids }, header, "POST", response => {
      if (response.data.ret == 0) {
        success(response);
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var buyAgain = (order_id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    buyAgainUrl,
    { order_id: order_id },
    header,
    "POST",
    response => {
      baseApi.log("buyAgain:", response);
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

module.exports = {
  getCartList,
  updateCartGoods,
  delCarts,
  buyAgain
};
