var { frontServer } = require("../hosts/hosts");
var baseApi = require("./baseApi");
var util = require("../utils/util");
var indexInfoUrl = `${frontServer}/index/index`;
var getIndexLayoutUrl = `${frontServer}/index/index_layout`;
var getAppConfigUrl = `${frontServer}/index/app_config`;

var indexInfo = callback => {
  baseApi.request(indexInfoUrl, {}, {}, "GET", response => {
    baseApi.log("indexInfo:", response);
    if (response.data.ret == 0) {
      for (let category of response.data.categories) {
        let index = category.link.indexOf(":");
        if (index > -1) {
          category.link = category.link.substring(
            index + 1,
            category.link.length
          );
        }
      }
      for (let banner of response.data.banners) {
        let index = banner.link.indexOf(":");
        if (index > -1) {
          let schema = banner.link.substring(0, index);
          let link = banner.link.substring(index + 1, banner.link.length);
          banner.schema = schema;
          if (schema == "external") {
            banner.link = link;
          } else if (schema == "live") {
            banner.link = "/pages/liveRoom/liveRoom?id=" + link;
          } else if (schema == "goods") {
            banner.link = `/pages/goods_detail/goods_detail?id=${link}`;
          } else if (schema == "category") {
            banner.link = `/pages/category_good/category_good?category=${link}&title=${
              banner.title
            }`;
          }
        }
      }
      for (let special of response.data.specials) {
        let index = special.link.indexOf(":");
        if (index > -1) {
          let schema = special.link.substring(0, index);
          let link = special.link.substring(index + 1, special.link.length);
          special.schema = schema;
          if (schema == "external") {
            special.link = link;
          } else if (schema == "live") {
            special.link = "/pages/liveRoom/liveRoom?id=" + link;
          } else if (schema == "goods") {
            special.link = `/pages/goods_detail/goods_detail?id=${link}`;
          } else if (schema == "category") {
            special.link = `/pages/category_good/category_good?category=${link}&title=${
              special.title
            }`;
          }
        }
      }
      if (callback && typeof callback == "function") {
        callback(response.data);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getIndexLayout = callback => {
  baseApi.request(getIndexLayoutUrl, {}, {}, "GET", response => {
    baseApi.log("getIndexLayoutUrl:", response);
    if (callback && typeof callback == "function") {
      callback(response.data.layout_url);
    }
  });
};

var getAppConfig = callback => {
  baseApi.request(getAppConfigUrl, {}, {}, "GET", response => {
    baseApi.log("getAppConfig:", response);
    if (callback && typeof callback == "function") {
      callback(response.data);
    }
  });
};

module.exports = {
  indexInfo,
  getIndexLayout,
  getAppConfig
};
