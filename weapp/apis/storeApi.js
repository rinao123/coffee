var { frontServer } = require("../hosts/hosts");
var baseApi = require("./baseApi");
var util = require("../utils/util");
var getStoreListUrl = `${frontServer}/store/list`;
var getStoreDetailUrl = `${frontServer}/store/detail`;

var getStoreList = callback => {
  baseApi.request(
    getStoreListUrl,
    {},
    {},
    "GET",
    response => {
      baseApi.log("getStoreList:", response);
      if (response.data.ret == 0) {
        if (callback && typeof callback == "function") {
          callback(response.data.store_list);
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

var getStoreDetail = (id, callback) => {
  baseApi.request(
    `${getStoreDetailUrl}/${id}`,
    {},
    {},
    "GET",
    response => {
      baseApi.log("getStoreDetail:", response);
      if (response.data.ret == 0) {
        if (callback && typeof callback == "function") {
          callback(response.data.store);
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
  getStoreList,
  getStoreDetail
};
