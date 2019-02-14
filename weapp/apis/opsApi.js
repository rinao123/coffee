var { frontServer, opsServer } = require("../hosts/hosts");
var baseApi = require("./baseApi");
var util = require("../utils/util");
var getAdListUrl = `${frontServer}/site/ad/list`;
var getQRcodeUrl = `${opsServer}/site/getQRCode`;
var getMPCodeUrl = `${opsServer}/site/getMPCode`;
var getUnlimitMPCodeUrl = `${opsServer}/site/getUnlimitMPCode`;
var saveShareParamUrl = `${opsServer}/site/save_share_param`;
var decodeShareParamUrl = `${opsServer}/site/decode_share_param`;
var uploadFileUrl = `${opsServer}/storage/upload`;
var opsEventUrl = `${opsServer}/site/event`;
var getChannelListUrl = `${opsServer}/channel/list`;
var getActivityListUrl = `${opsServer}/activity/list`;
var getLayoutByIdUrl = `${opsServer}/site/layout_by_id`;
var getLayoutByCodeUrl = `${opsServer}/site/layout`;

var getAdList = (position, success, fail, complete) => {
  baseApi.request(
    `${getAdListUrl}/${position}`,
    {},
    {},
    "GET",
    response => {
      baseApi.log("getAdList:", response);
      if (response.data.ret == 0) {
        for (let ad of response.data.ads) {
          let index = ad.link.indexOf(":");
          if (index > -1) {
            let schema = ad.link.substring(0, index);
            let link = ad.link.substring(index + 1, ad.link.length);
            ad.schema = schema;
            if (schema == "external") {
              ad.link = link;
            } else if (schema == "shop") {
              ad.link = "/pages/shop/shop?id=" + link;
            } else if (schema == "goods") {
              ad.link = `/pages/goods_detail/goods_detail?id=${link}`;
            } else if (schema == "live") {
              ad.link = `/pages/live/live?liveId=${link}`;
            } else if (schema == "category") {
              ad.link = `/pages/category/category?categoryId=${link}`;
            } else if (schema == "contact") {
              ad.link = `/pages/contact/contact`;
            } else if (schema == "newpacket") {
              ad.link = `/pages/newpacket/newpacket`;
            } else if (schema == "special") {
              ad.link = `/pages/special/special?code=${link}`;
            } else if (schema == "layout") {
              ad.link = JSON.parse(link);
            }
          }
        }
        if (success && typeof success == "function") {
          success(response.data.ads);
        }
      } else {
        util.showFail(response.data.msg);
      }
    },
    fail,
    complete
  );
};

var getQRcode = (path, success) => {
  baseApi.request(getQRcodeUrl, { path: path, width: 55 }, {}, "POST", success);
};

var getMPcode = (path, width, success) => {
  baseApi.request(
    getMPCodeUrl,
    { path: path, width: width },
    {},
    "POST",
    response => {
      baseApi.log("getMPcode:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response.data.url);
        }
      } else {
        util.showFail(response.data.msg);
      }
    }
  );
};

var getUnlimitMPCode = (scene, page, width, success) => {
  baseApi.request(
    getUnlimitMPCodeUrl,
    { scene: scene, page: page, width: width },
    {},
    "POST",
    response => {
      baseApi.log("getUnlimitMPCode:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response.data.url);
        }
      } else {
        util.showFail(response.data.msg);
      }
    }
  );
};

var saveShareParam = (key, param, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    saveShareParamUrl,
    { key: key, param: param },
    header,
    "POST",
    response => {
      baseApi.log("saveShareParam:", response);
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

var decodeShareParam = (key, success) => {
  baseApi.request(decodeShareParamUrl, { key: key }, {}, "GET", response => {
    baseApi.log("decodeShareParam:", response);
    if (response.data.ret == 0) {
      if (!response.data.share_param) {
        console.error(`{share key ${key} not found}`);
      }
      if (success && typeof success == "function") {
        success(response.data.share_param);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var uploadFile = (filePath, res_type, success) => {
  baseApi.upload(`${uploadFileUrl}?res_type=${res_type}`, filePath, success);
};

var opsEvent = (event, params, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    opsEventUrl,
    { event: event, params: params },
    header,
    "POST",
    () => {
      if (success && typeof success == "function") {
        success();
      }
    }
  );
};

var getChannelList = success => {
  baseApi.request(getChannelListUrl, {}, {}, "GET", response => {
    if (response.data.ret == 0) {
      success(response);
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getActivityList = success => {
  baseApi.request(getActivityListUrl, {}, {}, "GET", response => {
    if (response.data.ret == 0) {
      success(response);
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getIndexAdList = success => {
  getAdList(
    "index_goods",
    ads => {
      baseApi.log("getIndexAdList:", ads);
      if (success && typeof success == "function") {
        success(ads);
      }
    },
    undefined,
    () => {
      wx.stopPullDownRefresh();
    }
  );
};

var getIndexShareInfo = success => {
  getAdList("index_share", ads => {
    baseApi.log("getIndexShareInfo:", ads);
    let shareInfo = null;
    if (ads.length > 0) {
      shareInfo = { title: ads[0].title, picUrl: ads[0].picUrl };
    }
    if (success && typeof success == "function") {
      success(shareInfo);
    }
  });
};

var getIndexAds = success => {
  getAdList("index_boss", ads => {
    baseApi.log("getIndexAds:", ads);
    if (success && typeof success == "function") {
      success(ads);
    }
  });
};

var getNewPacketShareInfo = success => {
  getAdList("new_packet_share", ads => {
    baseApi.log("getNewPacketShareInfo:", ads);
    let shareInfo = null;
    if (ads.length > 0) {
      shareInfo = { title: ads[0].title, picUrl: ads[0].picUrl };
    }
    if (success && typeof success == "function") {
      success(shareInfo);
    }
  });
};

var getInnerShareInfo = success => {
  getAdList("inner_share", ads => {
    baseApi.log("getInnerShareInfo:", ads);
    if (success && typeof success == "function") {
      success(ads);
    }
  });
};

var getInviteShareInfo = success => {
  getAdList("invite_share_info", ads => {
    baseApi.log("getInviteShareInfo:", ads);
    let shareInfo = null;
    if (ads.length > 0) {
      shareInfo = { title: ads[0].title, picUrl: ads[0].picUrl };
    }
    if (success && typeof success == "function") {
      success(shareInfo);
    }
  });
};

var getLayoutById = (layout_id, success) => {
  baseApi.request(
    getLayoutByIdUrl,
    { layout_id: layout_id },
    {},
    "GET",
    response => {
      baseApi.log("getLayoutById:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response.data.layout_url);
        }
      } else {
        util.showFail(response.data.msg);
      }
    }
  );
};

var getLayoutByCode = (code, success) => {
  baseApi.request(getLayoutByCodeUrl, { code: code }, {}, "GET", response => {
    baseApi.log("getLayoutByCode:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.layout_url);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

module.exports = {
  getAdList,
  getQRcode,
  getMPcode,
  getUnlimitMPCode,
  saveShareParam,
  decodeShareParam,
  uploadFile,
  opsEvent,
  getChannelList,
  getActivityList,
  getIndexAdList,
  getIndexShareInfo,
  getIndexAds,
  getInnerShareInfo,
  getNewPacketShareInfo,
  getInviteShareInfo,
  getLayoutById,
  getLayoutByCode
};
