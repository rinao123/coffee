var { frontServer } = require("../hosts/hosts");
var baseApi = require("./baseApi");
var util = require("../utils/util");
var getUserInfoUrl = `${frontServer}/user/info`;
var collectFormUrl = `${frontServer}/user_contact/collect_form`;
var getUserInvitorRecordsUrl = `${frontServer}/user_invite/records`;
var getInviteCouponUrl = `${frontServer}/invite_coupon/status`;

var getUserInfo = (uid, success) => {
  let params = {};
  if (uid) {
    params.uid = uid;
  }
  baseApi.request(
    getUserInfoUrl,
    params,
    {},
    "GET",
    response => {
      baseApi.log("getUserInfo:", response);
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

var getInviteCoupon = (success) => {
  baseApi.request(
    getInviteCouponUrl,
    {},
    {},
    "GET",
    response => {
      baseApi.log("getInviteCoupon:", response);
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

var collectForm = (form_id, success) => {
  if (!form_id) {
    return;
  }
  let app = getApp();
  if (app.globalData.systemInfo.platform == "devtools") {
    return;
  }
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    collectFormUrl,
    { form_id: form_id },
    header,
    "POST",
    response => {
      baseApi.log("collectForm:", response);
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

var getUserInvitorRecords = (page, page_size, success) => {
  var params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(
    getUserInvitorRecordsUrl,
    params,
    {},
    "GET",
    response => {
      baseApi.log("getuserInvitor:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response.data.records, response.data.record_count);
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
  getUserInfo,
  collectForm,
  getUserInvitorRecords,
  getInviteCoupon
};
