var { userServer } = require("../hosts/hosts");
var baseApi = require("./baseApi");
var util = require("../utils/util");
var getAccountInfoUrl = `${userServer}/account/info`;
var getAccountRecordsUrl = `${userServer}/account/records`;
var withdrawUrl = `${userServer}/account/withdraw`;
var getIncomeRecordsUrl = `${userServer}/account/income_records`;
var getWithdrawRecordsUrl = `${userServer}/account/withdraw_records`;

var getAccountInfo = callback => {
  baseApi.request(
    getAccountInfoUrl,
    {},
    {},
    "GET",
    response => {
      baseApi.log("getAccountInfo:", response);
      if (response.data.ret == 0) {
        if (callback && typeof callback == "function") {
          callback(response.data.account_info);
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

var getAccountRecords = (page, page_size, callback) => {
  let params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(
    getAccountRecordsUrl,
    params,
    {},
    "GET",
    response => {
      baseApi.log("getAccountRecords:", response);
      if (response.data.ret == 0) {
        if (callback && typeof callback == "function") {
          callback(response.data.account_records);
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
var getIncomeRecords = (page, page_size, callback) => {
  let params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(
    getIncomeRecordsUrl,
    params,
    {},
    "GET",
    response => {
      baseApi.log("getIncomeRecords:", response);
      if (response.data.ret == 0) {
        if (callback && typeof callback == "function") {
          callback(response.data.account_records);
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
var getWithdrawRecords = (page, page_size, callback) => {
  let params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(
    getWithdrawRecordsUrl,
    params,
    {},
    "GET",
    response => {
      baseApi.log("getWithdrawRecords:", response);
      if (response.data.ret == 0) {
        if (callback && typeof callback == "function") {
          callback(response.data.account_records);
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
var withdraw = (money, callback) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    withdrawUrl,
    { money: money },
    header,
    "POST",
    response => {
      baseApi.log("withdraw:", response);
      if (callback && typeof callback == "function") {
        callback(response.data);
      }
    },
    undefined,
    undefined,
    true
  );
};

module.exports = {
  getAccountInfo,
  getAccountRecords,
  withdraw,
  getIncomeRecords,
  getWithdrawRecords
};
