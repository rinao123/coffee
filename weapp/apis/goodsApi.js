var { frontServer } = require("../hosts/hosts");
var baseApi = require("./baseApi");
var util = require("../utils/util");
var getGoodsDetailUrl = `${frontServer}/goods/detail`;
var getGoodsBriefUrl = `${frontServer}/goods/brief`;
var getGoodsEvaluationsUrl = `${frontServer}/goods/evaluation`;
var evaluateGoodsUrl = `${frontServer}/goods/evaluate`;
var collectGoodsUrl = `${frontServer}/goods/collect`;
var deleteCollectGoodsUrl = `${frontServer}/goods/delete_collect`;
var getGoodsCollectionsUrl = `${frontServer}/goods/user_collect`;
var getFootprintsUrl = `${frontServer}/goods/user_footprint`;
var searchGoodsUrl = `${frontServer}/goods/search`;
var getBuyerInfoUrl = `${frontServer}/goods/get_buyer_info`;
var getCategoryInfoUrl = `${frontServer}/goods/category/info`;
var getCategoriesUrl = `${frontServer}/goods/categories`;
var getCategoryGoodsUrl = `${frontServer}/goods/list_by_category`;
var getCategoryGoods1Url = `${frontServer}/goods/list_by_category1`;
var getSubCategoriesUrl = `${frontServer}/goods/sub_categories`;
var getSeckillInfoUrl = `${frontServer}/seckill/info`;
var getSeckillProductListUrl = `${frontServer}/seckill/product_list`;
var getRecommendGoodsListUrl = `${frontServer}/goods/recommend_goods`;
var getGoodsCornerIconsUrl = `${frontServer}/goods/corner_icons`;
var getSeckillActivityListUrl = `${frontServer}/seckill/activity_list`;
var getSeckillActivityProductsUrl = `${frontServer}/seckill/activity_products`;
var getGoodsQoutationUrl = `${frontServer}/goods/qoutation`;
var barcodeToGoodsIdUrl = `${frontServer}/goods/barcode_to_goods_id`;


var getGoodsDetail = (goods_id, success) => {
  let params = {
    goods_id: goods_id
  };
  var app = getApp();
  params.spm = app.getSpm();
  baseApi.request(getGoodsDetailUrl, params, {}, "GET", response => {
      baseApi.log("getGoodsDetail:", response);
      if (response.data.ret == 0) {
        let goods = response.data.goods;
        goods.img_array = parseImgArray(goods.img_array);
        goods.attributes = parseAttributes(goods.attributes);
        if (success && typeof success == "function") {
          success(goods);
        }
      } else if (response.data.ret == 1) {
        util.showModal("提示", "商品已下架", false, res => {
          wx.navigateBack({
            delta: 1
          });
        });
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var getGoodsBrief = (ids, success) => {
  baseApi.request(`${getGoodsBriefUrl}?${ids}`, {}, {}, "GET", response => {
    if (response.data.ret == 0) {
      success(response.data);
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getGoodsEvaluations = (goods_id, page, page_size, success) => {
  var params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(
    `${getGoodsEvaluationsUrl}/${goods_id}`,
    params,
    {},
    "GET",
    response => {
      baseApi.log("getGoodsEvaluations:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response.data.evaluations);
        }
      } else {
        util.showFail(response.data.msg);
      }
    }
  );
};

var evaluateGoods = (order_id, evaluations, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    evaluateGoodsUrl,
    { order_id: order_id, evaluations: evaluations },
    header,
    "POST",
    response => {
      baseApi.log("evaluateGoods:", response);
      if (response.data.ret == 0) {
        if(success && typeof success == "function"){
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

var collectGoods = (goods_id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    collectGoodsUrl,
    { goods_id: goods_id },
    header,
    "POST",
    response => {
      baseApi.log("collectGoods:", response);
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

var deleteCollectGoods = (goods_id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    deleteCollectGoodsUrl,
    { goods_id: goods_id },
    header,
    "POST",
    response => {
      baseApi.log("deleteCollectGoods:", response);
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

var getGoodsCollections = (page, page_size, success) => {
  let params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(
    getGoodsCollectionsUrl,
    params,
    {},
    "GET",
    response => {
      baseApi.log("getGoodsCollections:", response);
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

var getFootprints = (page, page_size, success) => {
  let params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(
    getFootprintsUrl,
    params,
    {},
    "GET",
    response => {
      baseApi.log("getFootprints:", response);
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

var searchGoods = (keyword, filter, sort, order, page, page_size, success) => {
  let params = {
    keyword: keyword
  };
  if (filter) {
    params.filter = filter;
  }
  if (sort) {
    params.sort = sort;
  }
  if (order) {
    params.order = order;
  }
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(searchGoodsUrl, params, {}, "GET", response => {
    baseApi.log("searchGoods:", response);
    if (response.data.ret == 0) {
      success(response.data.result);
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getCategoryInfo = (cate_id, success) => {
  baseApi.request(
    getCategoryInfoUrl,
    { cate_id: cate_id },
    {},
    "GET",
    response => {
      baseApi.log("getCategoryInfo:", response);
      if (response.data.ret == 0) {
        success(response.data.category);
      } else {
        util.showFail(response.data.msg);
      }
    }
  );
};

var getCategories = success => {
  baseApi.request(getCategoriesUrl, {}, {}, "GET", response => {
    baseApi.log("getCategories:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.categories);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getSubCategories = (category, success) => {
  baseApi.request(getSubCategoriesUrl, { category: category }, {}, "GET", response => {
    baseApi.log("getSubCategories:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.sub_categories);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
}

var getCategoryGoods = (category, category1, category2, category3, sort, direction, page, page_size, success) => {
  var params = {};
  if (category && category != "0") {
    params.category = category;
  }
  if (category1 && category1 != "0") {
    params.category_1 = category1;
  }
  if (category2 && category2 != "0") {
    params.category_2 = category2;
  }
  if (category3 && category3 != "0") {
    params.category_3 = category3;
  }
  if (sort) {
    params.sort = sort;
  }
  if (direction) {
    params.direction = direction;
  }
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(getCategoryGoodsUrl, params, {}, "GET", response => {
    baseApi.log("getCategoryGoods:", response);
    if (response.data.ret == 0) {
      success(response.data.goods_list);
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var categoryGoods1 = (categoryId, page, page_size, success) => {
  var params = { category: categoryId };
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(getCategoryGoods1Url, params, {}, "GET", response => {
    baseApi.log("categoryGoods1:", response);
    if (response.data.ret == 0) {
      success(response.data.goods_list);
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getSeckillProductList = (page, page_size, success) => {
  var params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(getSeckillProductListUrl, params, {}, "GET", response => {
    baseApi.log("getSeckillProductList:", response);
    if (response.data.ret == 0) {
      success(response.data.product_list);
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getSeckillInfo = (success) => {
  baseApi.request(getSeckillInfoUrl, {}, {}, "GET", response => {
    baseApi.log("getSeckillInfo:", response);
    if (response.data.ret == 0) {
      success(response.data.seckill_info, response.data.product_list);
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getBuyerInfo = (goods_id, callback) => {
  var data = {
    buyerMsgs: [],
    msgInterval: 10
  };
  baseApi.request(
    getBuyerInfoUrl,
    { goods_id: goods_id },
    {},
    "GET",
    response => {
      baseApi.log("getBuyerInfo:", response);
      if (response.data.ret == 0) {
        data.buyerMsgs = response.data.buyers;
        data.msgInterval = response.data.show_interval;
      }
      if (callback && typeof callback == "function") {
        callback(data);
      }
    },
    () => {
      if (callback && typeof callback == "function") {
        callback(data);
      }
    }
  );
};

var getGoodsList = (url, page, page_size, success) => {
  let params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(`${frontServer}${url}`, params, {}, "GET", response => {
      baseApi.log("getGoodsList", response);
      if (response.data.ret == 0) {
        let goodsList = response.data.goods_list || response.data.product_list;
        if (success && typeof success == "function") {
          success(goodsList);
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

var getRecommendGoodsList = (page, page_size, success) => {
  let params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(
    getRecommendGoodsListUrl,
    params,
    {},
    "GET",
    response => {
      baseApi.log("getRecommendGoodsList", response);
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

var getGoodsCornerIcons = (goodsIds, success) => {
  var queryString = "";
  for(var goodsId of goodsIds){
    if(queryString != ""){
      queryString += "&";
    }
    queryString += "goods_id=" + goodsId;
  }
  baseApi.request(`${getGoodsCornerIconsUrl}?${queryString}`, {}, {}, "GET", response => {
    baseApi.log("getGoodsCornerIcons", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.corner_icons);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getSeckillActivityList = (success) => {
  baseApi.request(getSeckillActivityListUrl, {}, {}, "GET", response => {
    baseApi.log("getSeckillActivityList", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.activity_list);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getSeckillActivityProducts = (act_id, page, page_size, success) => {
  var params = { act_id: act_id };
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(getSeckillActivityProductsUrl, params, {}, "GET", response => {
    baseApi.log("getSeckillActivityProducts", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.product_list);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getGoodsQoutation = (goods_id, success) => {
  baseApi.request(getGoodsQoutationUrl, {goods_id: goods_id}, {}, "GET", response => {
    baseApi.log("getGoodsQoutation", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.goods_qoutation);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var barcodeToGoodsId = (barcode, success) => {
  baseApi.request(barcodeToGoodsIdUrl, {barcode: barcode}, {}, "GET", response => {
    baseApi.log("barcodeToGoodsId", response);
    if (success && typeof success == "function") {
        success(response.data);
      }
  });
}

var translateSkuAttrValueItemsToObject = attrValueItemsStr => {
  let attrs = {};
  let items = attrValueItemsStr.split(";");
  if (items.length == 1 && items[0] == "") {
    items = [];
  }
  for (let item of items) {
    let values = item.split(":");
    if (values.length == 1 && values[0] == "") {
      values = [];
    }
    attrs[values[0]] = values[1];
  }
  return attrs;
};

var parseImgArray = img_array => {
  if (img_array == "") {
    return [];
  } else {
    return img_array.split(",");
  }
};

var parseAttributes = attributes => {
  if (attributes == "") {
    return [];
  } else {
    return JSON.parse(attributes);
  }
};


module.exports = {
  getRecommendGoodsListUrl,
  getGoodsDetail,
  getGoodsBrief,
  getGoodsEvaluations,
  evaluateGoods,
  collectGoods,
  deleteCollectGoods,
  getGoodsCollections,
  getFootprints,
  searchGoods,
  getBuyerInfo,
  getCategories,
  getSubCategories,
  getCategoryGoods,
  categoryGoods1,
  getCategoryInfo,
  getSeckillInfo,
  getSeckillProductList,
  getGoodsList,
  getRecommendGoodsList,
  getGoodsCornerIcons,
  getSeckillActivityList,
  getSeckillActivityProducts,
  getGoodsQoutation,
  barcodeToGoodsId
};
