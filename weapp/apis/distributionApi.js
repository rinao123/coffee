var { frontServer } = require("../hosts/hosts");
var baseApi = require("./baseApi");
var util = require("../utils/util");
var getChosenUrl = `${frontServer}/distribution/index`;
var getShopinfoUrl = `${frontServer}/distribution/shop/info`;
var enterShopUrl = `${frontServer}/distribution/shop/enter`;
var getCodeUrl = `${frontServer}/distribution/shop/vcode`;
var createShopUrl = `${frontServer}/distribution/shop/create`;
var isDistributorUrl = `${frontServer}/distribution/is_distributor`;
var updateShopUrl = `${frontServer}/distribution/shop/update`;
var getDistributorInfoUrl = `${frontServer}/distribution/my_info`;
var removeGoodsUrl = `${frontServer}/distribution/shop/remove_goods`;
var pickGoodsUrl = `${frontServer}/distribution/shop/pick_goods`;
var getRecommendGoodsUrl = `${frontServer}/distribution/recommend_goods`;
var getShopGoodsUrl = `${frontServer}/distribution/shop_goods`;
var getTeamMembersUrl = `${frontServer}/distribution/team/members`;
var getReceivableMoneyUrl = `${frontServer}/distribution/receivable_money`;
var getSoldOrdersUrl = `${frontServer}/distribution/sold_orders`;
var followShopUrl = `${frontServer}/distribution/shop/follow`;
var unfollowShopUrl = `${frontServer}/distribution/shop/unfollow`;
var getFollowListUrl = `${frontServer}/distribution/shop/follow_list`;
var getShopListUrl = `${frontServer}/distribution/recommend_shops`;
var buyNowUrl = `${frontServer}/distribution/buy_now`;
var createOrderUrl = `${frontServer}/distribution/create_order`;
var distributeGoodsUrl = `${frontServer}/distribution/distribute_goods`;
var getCartListUrl = `${frontServer}/distribution/cart_list`;
var updateCartGoodsUrl = `${frontServer}/distribution/update_cart_goods`;
var getDistributionGoodsListUrl = `${frontServer}/distribution/goods_list`;

var getChosen = success => {
  baseApi.request(getChosenUrl, {}, {}, "GET", response => {
    baseApi.log("getChosen:", response);
    for (let banner of response.data.banner) {
      let index = banner.link.indexOf(":");
      if (index > -1) {
        let schema = banner.link.substring(0, index);
        let link = banner.link.substring(index + 1, banner.link.length);
        banner.schema = schema;
        if (schema == "external") {
          banner.link = link;
        } else if (schema == "goods") {
          banner.link = `/pages/goods_detail/goods_detail?id=${link}`;
        }
      }
    }
    if (response.data.ret == 0) {
      success(response);
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var enterShop = (id, success) => {
  var params = {};
  if (id) {
    params.shop_id = id;
  }
  baseApi.request(
    enterShopUrl,
    params,
    {},
    "GET",
    response => {
      baseApi.log("enterShop:", response);
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

var isDistributor = success => {
  baseApi.request(isDistributorUrl, {}, {}, "GET", response => {
    baseApi.log("isDistributor:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.is_distributor);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getShopinfo = (id, success) => {
  baseApi.request(getShopinfoUrl, { shop_id: id }, {}, "GET", response => {
    baseApi.log("getShopinfo:", response);
    if (response.data.ret == 0) {
      success(response);
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getRecommendGoods = (category, page, page_size, success) => {
  var params = {};
  if (category) {
    params.category = category;
  }
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(getRecommendGoodsUrl, params, {}, "GET", response => {
      baseApi.log("getRecommendGoods:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response.data.goods_list);
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

var getShopGoods = (shop_id, page, page_size, success) => {
  var params = {};
  if (shop_id) {
    params.shop_id = shop_id;
  }
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(getShopGoodsUrl, params, {}, "GET", response => {
    baseApi.log("getShopGoods:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.goods_list);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getShopList = (shop_id, page, page_size, success) => {
  var params = {};
  if (shop_id) {
    params.shop_id = shop_id;
  }
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(getShopListUrl, params, {}, "GET", response => {
    baseApi.log("getShopGoods:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.recommend_shops);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var removeGoods = (id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    removeGoodsUrl,
    { goods_id: id },
    header,
    "POST",
    response => {
      baseApi.log("removeGoodsUrl:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success();
        }
      } else {
        util.showFail(response.data.msg);
      }
    }
  );
};

var pickGoods = (id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(pickGoodsUrl, { goods_id: id }, header, "POST", response => {
    baseApi.log("removeGoodsUrl:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success();
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getCode = (mobile, type, sig, success) => {
  var params = { mobile: mobile, type: type, sig: sig };
  baseApi.request(getCodeUrl, params, {}, "GET", response => {
    baseApi.log("getCode:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success();
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var createShop = (mobile, vcode, vcode_type, parent, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    createShopUrl,
    { mobile: mobile, vcode: vcode, vcode_type: vcode_type, parent: parent },
    header,
    "POST",
    response => {
      baseApi.log("createShop:", response);
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

var updateShop = (params, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(updateShopUrl, params, header, "POST", response => {
    baseApi.log("updateShop:", response);
    if (response.data.ret == 0) {
      success(response);
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getDistributorInfo = success => {
  baseApi.request(
    getDistributorInfoUrl,
    {},
    {},
    "GET",
    response => {
      baseApi.log("getDistributorInfo:", response);
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

var getTeamMembers = (page, pages_size, success) => {
  var params = {};
  if (page) {
    params.page = page;
  }
  if (pages_size) {
    params.pages_size = pages_size;
  }
  baseApi.request(
    getTeamMembersUrl,
    params,
    {},
    "GET",
    response => {
      baseApi.log("getTeamMembers:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response.data.member_list);
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

var getReceivableMoney = success => {
  baseApi.request(
    getReceivableMoneyUrl,
    {},
    {},
    "GET",
    response => {
      baseApi.log("getReceivableMoney:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response.data.receivable_money);
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

var getSoldOrders = (page, page_size, state, success) => {
  var params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  params.distribution_state = state;
  baseApi.request(
    getSoldOrdersUrl,
    params,
    {},
    "GET",
    response => {
      baseApi.log("getSoldOrders:", response);
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

var followShop = (shopId, success) => {
  baseApi.request(
    followShopUrl,
    { shop_id: shopId },
    {},
    "GET",
    response => {
      baseApi.log("followShop:", response);
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

var unfollowShop = (shopId, success) => {
  baseApi.request(
    unfollowShopUrl,
    { shop_id: shopId },
    {},
    "GET",
    response => {
      baseApi.log("unfollowShop:", response);
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

var getFollowList = (page, page_size, success) => {
  var params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(
    getFollowListUrl,
    params,
    {},
    "GET",
    response => {
      baseApi.log("getFollowList:", response);
      if (response.data.ret == 0) {
        for (let shop of response.data.following_shops) {
          shop.isFollow = true;
        }
        if (success && typeof success == "function") {
          success(response.data.following_shops);
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

var buyNow = (goods_id, sku_id, num, coupon_id, address, form_id, buyer_message, distributor_id, store_id, live_id, success) => {
  wx.showLoading({ title: "正在创建订单", mask: true });
  var complete = () => {
    wx.hideLoading();
  };
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  var params = {
    goods_id: goods_id,
    sku_id: sku_id,
    num: num,
    coupon_id: coupon_id,
    address: address,
    form_id: form_id
  };
  if (buyer_message) {
    params.buyer_message = buyer_message;
  }
  if (distributor_id) {
    params.distributor_id = distributor_id;
  }
  if (store_id) {
    params.store_id = store_id;
  }
  if (live_id) {
    params.live_id = live_id;
  }
  var app = getApp();
  params.spm = app.getSpm();
  baseApi.request(
    buyNowUrl,
    params,
    header,
    "POST",
    response => {
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

var createOrder = (cart_list, coupon_id, address, form_id, buyer_message, distributor_id, store_id, live_id, success) => {
  wx.showLoading({ title: "正在创建订单", mask: true });
  var complete = () => {
    wx.hideLoading();
  };
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  var params = {
    cart_list: cart_list,
    coupon_id: coupon_id,
    address: address,
    form_id: form_id
  };
  if (buyer_message) {
    params.buyer_message = buyer_message;
  }
  if (distributor_id) {
    params.distributor_id = distributor_id;
  }
  if (store_id) {
    params.store_id = store_id;
  }
  if (live_id) {
    params.live_id = live_id;
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

var distributeGoods = success => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(distributeGoodsUrl, {}, header, "POST", response => {
      baseApi.log("distributeGoods:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success();
        }
      }
    },
    undefined,
    undefined,
    true
  );
};

var getCartList = (distributor_id, success) => {
  distributor_id = distributor_id || 0;
  baseApi.request(getCartListUrl, { distributor_id: distributor_id }, {}, "GET", response => {
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
}

var updateCartGoods = (params, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(updateCartGoodsUrl, params, header, "POST", response => {
      baseApi.log("updateCartGoods:", response);
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
}

var getDistributionGoodsList = (page, page_size, success) => {
  var params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(getDistributionGoodsListUrl, params, {}, "GET", response => {
      baseApi.log("getDistributionGoodsList:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response.data.goods_list);
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
  getChosen,
  enterShop,
  getCode,
  createShop,
  isDistributor,
  updateShop,
  getDistributorInfo,
  removeGoods,
  pickGoods,
  getRecommendGoods,
  getShopGoods,
  getTeamMembers,
  getReceivableMoney,
  getSoldOrders,
  followShop,
  unfollowShop,
  getFollowList,
  getShopList,
  buyNow,
  createOrder,
  distributeGoods,
  getCartList,
  updateCartGoods,
  getDistributionGoodsList
};
