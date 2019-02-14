var { frontServer } = require("../hosts/hosts");
var baseApi = require("./baseApi");
var util = require("../utils/util");
var createTeamUrl = `${frontServer}/pintuan/create_team`;
var joinTeamUrl = `${frontServer}/pintuan/join_team`;
var getPintuanDetailUrl = `${frontServer}/pintuan/details`;

var createTeam = (anchor_id, goods_id, sku_id, num, coupon_id, address, form_id, store_id, buyer_message, showLoading, success) => {
  if (showLoading) {
    wx.showLoading({ title: "正在创建订单", mask: true });
  }
  var complete = () => {
    if (showLoading) {
      wx.hideLoading();
    }
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
  if (anchor_id) {
    params.anchor_id = anchor_id;
  }
  if (store_id) {
    params.store_id = store_id;
  }
  if (buyer_message) {
    params.buyer_message = buyer_message;
  }
  var app = getApp();
  params.spm = app.getSpm();
  baseApi.request(createTeamUrl, params, header, "POST", response => {
      baseApi.log("createTeam:", response);
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

var joinTeam = (anchor_id, team_id, goods_id, sku_id, num, coupon_id, address, form_id, store_id, buyer_message, success) => {
  wx.showLoading({ title: "正在创建订单", mask: true });
  var complete = () => {
    wx.hideLoading();
  };
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  var params = {
    team_id: team_id,
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
  var app = getApp();
  params.spm = app.getSpm();
  baseApi.request(joinTeamUrl, params, header, "POST", response => {
      baseApi.log("joinTeam:", response);
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

var getPintuanDetail = (id, success) => {
  baseApi.request(`${getPintuanDetailUrl}/${id}`, {}, {}, "GET", response => {
    baseApi.log("getPintuanDetail", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        var order = response.data.order ? response.data.order : null;
        success(response.data.goods, response.data.team, order);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

module.exports = {
  createTeam,
  joinTeam,
  getPintuanDetail
};
