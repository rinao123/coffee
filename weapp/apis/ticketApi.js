var {frontServer} = require("../hosts/hosts");
var baseApi = require("./baseApi");
var util = require("../utils/util");
var getTicketTypeListUrl = `${frontServer}/tianyuan/ticket/type_list`;
var buyTicketUrl = `${frontServer}/tianyuan/ticket/buy`;
var getTicketListUrl = `${frontServer}/tianyuan/ticket/list`;
var getTicketDetailUrl = `${frontServer}/tianyuan/ticket/detail`;
var getPayResultUrl = `${frontServer}/tianyuan/ticket/pay_result`;

var getTicketTypeList = (success) => {
  baseApi.request(getTicketTypeListUrl, {}, {}, "GET", response => {
    baseApi.log("getTicketTypeList:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.ticket_type_list);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var buyTicket = (ticket_type_id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(buyTicketUrl, { ticket_type_id: ticket_type_id }, header, "POST", response => {
    baseApi.log("buyTicket:", response);
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

var getTicketList = (status, page, page_size, success) => {
  let params = { status: status };
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(getTicketListUrl, params, {}, "GET", response => {
    baseApi.log("getTicketList:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.tickets);
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

var getTicketDetail = (ticket_id, success) => {
  baseApi.request(`${getTicketDetailUrl}/${ticket_id}`, {}, {}, "GET", response => {
    baseApi.log("getTicketDetail:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.ticket);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getPayResult = (order_id, success) => {
  baseApi.request(getPayResultUrl, {order_id: order_id}, {}, "GET", response => {
    baseApi.log("getPayResult:", response);
    if (success && typeof success == "function") {
      success(response.data);
    }
  });
};


module.exports = {
  getTicketTypeList,
  buyTicket,
  getTicketList,
  getTicketDetail,
  getPayResult
};
