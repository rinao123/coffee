var { frontServer } = require("../hosts/hosts");
var baseApi = require("./baseApi");
var util = require("../utils/util");
var md5 = require("../utils/md5");
var config = require("../config");
var getAddressListUrl = `${frontServer}/member/addr/list`;
var addAddressUrl = `${frontServer}/member/addr/add`;
var delAddressUrl = `${frontServer}/member/addr/del`;
var editAddressUrl = `${frontServer}/member/addr/edit`;
var setDefaultAddressUrl = `${frontServer}/member/addr/set_default`;
var getDefaultAddressUrl = `${frontServer}/member/addr/default`;
var getBindMobileVCodeUrl = `${frontServer}/member/bind_mobile_vcode`;
var bindMobileUrl = `${frontServer}/member/bind_mobile`;
var chargeUrl = `${frontServer}/member/charge`;
var getMemberInfoUrl = `${frontServer}/member/info`;
var getMoneyRecordsUrl = `${frontServer}/member/money_records`;
var notifyUserUrl = `${frontServer}/member/notify_user`;
var getRuleUrlUrl = `${frontServer}/member/rule_url`;
var getPrivilegeUrlUrl = `${frontServer}/member/privilege_url`;

var getAddressList = success => {
  baseApi.request(
    getAddressListUrl,
    {},
    {},
    "GET",
    response => {
      baseApi.log("getAddressList:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response.data.address_list);
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

var addAddress = (
  userName,
  postalCode,
  provinceName,
  cityName,
  countyName,
  detailInfo,
  nationalCode,
  telNumber,
  isDefault,
  success
) => {
  //countyName是微信接口拼写错误
  let params = {
    userName: userName,
    postalCode: postalCode,
    provinceName: provinceName,
    cityName: cityName,
    countyName: countyName,
    detailInfo: detailInfo,
    nationalCode: nationalCode,
    telNumber: telNumber,
    isDefault: isDefault ? 1 : 0
  };
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    addAddressUrl,
    params,
    header,
    "POST",
    response => {
      baseApi.log("addAddress:", response);
      if (response.data.ret == 0) {
        let address = {
          addrId: response.data.addrId,
          userName: userName,
          postalCode: postalCode,
          provinceName: provinceName,
          cityName: cityName,
          countyName: countyName,
          detailInfo: detailInfo,
          nationalCode: nationalCode,
          telNumber: telNumber,
          isDefault: response.data.isDefault
        };
        if (success && typeof success == "function") {
          success(address);
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

var delAddress = (addrId, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    delAddressUrl,
    { addrId: addrId },
    header,
    "POST",
    response => {
      baseApi.log("delAddress:", response);
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

var editAddress = (
  addrId,
  userName,
  postalCode,
  provinceName,
  cityName,
  countyName,
  detailInfo,
  nationalCode,
  telNumber,
  isDefault,
  success
) => {
  let params = {
    addrId: addrId,
    userName: userName,
    postalCode: postalCode,
    provinceName: provinceName,
    cityName: cityName,
    countyName: countyName,
    detailInfo: detailInfo,
    nationalCode: nationalCode,
    telNumber: telNumber,
    isDefault: isDefault ? 1 : 0
  };
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    editAddressUrl,
    params,
    header,
    "POST",
    response => {
      baseApi.log("editAddress:", response);
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

var setDefaultAddress = (addrId, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    setDefaultAddressUrl,
    { addrId: addrId },
    header,
    "POST",
    response => {
      baseApi.log("setDefaultAddress:", response);
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

var getDefaultAddress = success => {
  baseApi.request(
    getDefaultAddressUrl,
    {},
    {},
    "GET",
    response => {
      baseApi.log("getDefaultAddress:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response.data.address);
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

var getBindMobileVCode = (mobile, success) => {
  let sig = md5.hexMD5(mobile + "memberBindMobile" + config.vcodeSecret);
  var params = { mobile: mobile, sig: sig };
  baseApi.request(getBindMobileVCodeUrl, params, {}, "GET", response => {
    baseApi.log("getBindMobileVCode:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success();
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var bindMobile = (mobile, vcode, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    bindMobileUrl,
    { mobile: mobile, vcode: vcode },
    header,
    "POST",
    response => {
      baseApi.log("bindMobile:", response);
      if (response.data.ret == 0) {
        if (success && typeof success == "function") {
          success(response.data.member);
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

var charge = (money, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    chargeUrl,
    { money: money },
    header,
    "POST",
    response => {
      baseApi.log("charge:", response);
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

var getMemberInfo = (success) => {
  baseApi.request(getMemberInfoUrl, {}, {}, "GET", response => {
    baseApi.log("getMemberInfo:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.member_info);
      }
    } else {
      util.showFail(response.data.msg);
    }
  }, undefined, undefined, true);
}

var getMoneyRecords = (page, page_size, success) => {
  var params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(getMoneyRecordsUrl, params, {}, "GET", response => {
    baseApi.log("getMoneyRecords:", response);
    wx.stopPullDownRefresh();
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.records);
      }
    } else {
      util.showFail(response.data.msg);
    }
  }, undefined, undefined, true);
}

var notifyUser = (success) => {
  baseApi.request(notifyUserUrl, {}, {}, "GET", response => {
    baseApi.log("notifyUser:", response);
  });
}

var getRuleUrl = (success) => {
  baseApi.request(getRuleUrlUrl, {}, {}, "GET", response => {
    baseApi.log("getRuleUrl:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.rule_url, response.data.has_bind_mobile);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
}

var getRule = (success) => {
  getRuleUrl((url, hasBindMobile) => {
    wx.request({
      url: url,
      success: response => {
        baseApi.log("getRule:", response);
        for (var text of response.data) {
          text.text = text.text.replace(/\\n/g, "\n");
        }
        if (success && typeof success == "function") {
          success(response.data, hasBindMobile);
        }
      }
    });
  });
}

var getPrivilegeUrl = (success) => {
  baseApi.request(getPrivilegeUrlUrl, {}, {}, "GET", response => {
    baseApi.log("getPrivilegeUrl:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.privilege_url);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
}

var getPrivilege = (success) => {
  getPrivilegeUrl((url) => {
    wx.request({
      url: url,
      success: response => {
        baseApi.log("getPrivilege:", response);
        for (var text of response.data) {
          text.text = text.text.replace(/\\n/g, "\n");
        }
        if (success && typeof success == "function") {
          success(response.data);
        }
      }
    });
  });
}

module.exports = {
  getAddressList,
  addAddress,
  delAddress,
  editAddress,
  setDefaultAddress,
  getDefaultAddress,
  getBindMobileVCode,
  bindMobile,
  charge,
  getMemberInfo,
  getMoneyRecords,
  notifyUser,
  getRule,
  getPrivilege
};
