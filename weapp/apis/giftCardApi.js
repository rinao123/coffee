var { frontServer } = require("../hosts/hosts");
var baseApi = require("./baseApi");
var util = require("../utils/util");
var getGiftCardListUrl = `${frontServer}/gift_card/list`;
var buyGiftCardUrl = `${frontServer}/gift_card/buy`;
var getRuleUrlUrl = `${frontServer}/gift_card/rule_url`;

var getGiftCardList = success => {
  baseApi.request(getGiftCardListUrl, {}, {}, "GET", response => {
    if (response.data.ret == 0) {
      console.log("getGiftCardList", response);
      if (success && typeof success == "function"){
        success(response.data.gift_cards);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var buyGiftCard = (gift_card_id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(buyGiftCardUrl, { gift_card_id: gift_card_id }, header, "POST", response => {
      baseApi.log("buyGiftCard:", response);
      if (response.data.ret == 0) {
        success(response.data);
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var getRuleUrl = (success) => {
  baseApi.request(getRuleUrlUrl, {}, {}, "GET", response => {
    baseApi.log("getRuleUrl:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.rule_url);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getRule = (success) => {
  getRuleUrl((url) => {
    wx.request({
      url: url,
      success: response => {
        baseApi.log("getRule:", response);
        response.data.content = response.data.content.replace(/\\n/g, "\n");
        if (success && typeof success == "function") {
          success(response.data);
        }
      }
    });
  });
};

module.exports = {
  getGiftCardList,
  buyGiftCard,
  getRule
};
