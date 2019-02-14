var { frontServer } = require("../hosts/hosts");
var baseApi = require("./baseApi");
var util = require("../utils/util");
var followAnchorUrl = `${frontServer}/social/follow`;
var getFollowedAnchorsUrl = `${frontServer}/social/anchors`;
var unfollowAnchorUrl = `${frontServer}/social/unfollow`;
var getAnchorProfileUrl = `${frontServer}/social/anchor/profile`;
var getFollowedLivesUrl = `${frontServer}/social/follow_lives`;
var getFollowedTimelinesUrl = `${frontServer}/social/timelines`;
var getInterestingLivesUrl = `${frontServer}/social/interesting_lives`;
var getInterestingTimelinesUrl = `${frontServer}/social/interesting_timelines`;
var getRecommendationsUrl = `${frontServer}/social/recommendations`;
var getAnchorListUrl = `${frontServer}/social/anchor/list`;
var followShopUrl = `${frontServer}/social/follow_shop`;
var unfollowShopUrl = `${frontServer}/social/unfollow_shop`;
var getPostListUrl = `${frontServer}/social/post/list`;
var getGoodsPostListUrl = `${frontServer}/social/post/goods`;
var getUserPostListUrl = `${frontServer}/social/post/user`;
var getPostUrl = `${frontServer}/social/post`;
var checkPostLikeUrl = `${frontServer}/social/post/check_like`;
var likePostUrl = `${frontServer}/social/post/do_like`;
var undoLikePostUrl = `${frontServer}/social/post/undo_like`;
var getPostCommentListUrl = `${frontServer}/social/post/comment/list`;
var sendPostCommentUrl = `${frontServer}/social/post/comment/add`;
var sharePostUrl = `${frontServer}/social/post/share`;

var followAnchor = (anchor_id, success) => {
  baseApi.request(
    followAnchorUrl,
    { anchor_id: anchor_id },
    {},
    "GET",
    response => {
      if (response.data.ret == 0) {
        wx.showToast({ title: "关注成功", duration: 2000 });
        success(response);
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var getFollowedAnchors = success => {
  baseApi.request(
    getFollowedAnchorsUrl,
    {},
    {},
    "GET",
    response => {
      if (response.data.ret == 0) {
        success(response);
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var unfollowAnchor = (anchor_id, success) => {
  baseApi.request(
    unfollowAnchorUrl,
    { anchor_id: anchor_id },
    {},
    "GET",
    success,
    undefined,
    undefined,
    true
  );
};

var getAnchorProfile = (id, success) => {
  baseApi.request(getAnchorProfileUrl + "/" + id, {}, {}, "GET", response => {
      baseApi.log("getAnchorProfile:", response);
      if (response.data.ret == 0) {
        success(response.data.userSocial);
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var getFollowedLives = success => {
  baseApi.request(
    getFollowedLivesUrl,
    {},
    {},
    "GET",
    response => {
      if (response.data.ret == 0) {
        success(response);
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var getFollowedTimelines = (params, success) => {
  baseApi.request(
    getFollowedTimelinesUrl,
    params,
    {},
    "GET",
    response => {
      if (response.data.ret == 0) {
        success(response);
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var getInterestingLives = success => {
  baseApi.request(
    getInterestingLivesUrl,
    {},
    {},
    "GET",
    response => {
      if (response.data.ret == 0) {
        success(response);
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var getInterestingTimelines = (params, success) => {
  baseApi.request(
    getInterestingTimelinesUrl,
    params,
    {},
    "GET",
    response => {
      if (response.data.ret == 0) {
        success(response);
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var getRecommendations = (uid, success) => {
  baseApi.request(
    getRecommendationsUrl,
    { uid: uid },
    {},
    "GET",
    response => {
      if (response.data.ret == 0) {
        success(response);
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var getAnchorList = (page, page_size, success) => {
  let params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(
    getAnchorListUrl,
    params,
    {},
    "GET",
    response => {
      if (response.data.ret == 0) {
        success(response);
      } else {
        util.showFail(response.data.msg);
      }
    },
    undefined,
    undefined,
    true
  );
};

var followShop = (shop_id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    followShopUrl,
    { shop_id: shop_id },
    header,
    "POST",
    success,
    undefined,
    undefined,
    true
  );
};

var unfollowShop = (shop_id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(
    unfollowShopUrl,
    { shop_id: shop_id },
    header,
    "POST",
    success,
    undefined,
    undefined,
    true
  );
};

var getPostList = (page, page_size, success) => {
  var params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(getPostListUrl, params, {}, "GET", response => {
    baseApi.log("getPostList:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.posts);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var getGoodsPostList = (goodsId, page, page_size, success) => {
  let params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(`${getGoodsPostListUrl}/${goodsId}/list`, params, {}, "GET", response => {
    baseApi.log("getGoodsPostList:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.posts);
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

var getUserPostList = (userId, page, page_size, success) => {
  let params = {};
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(`${getUserPostListUrl}/${userId}/list`, params, {}, "GET", response => {
    baseApi.log("getUserPostList:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.posts);
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

var getPost = (postId, success) => {
  baseApi.request(`${getPostUrl}/${postId}`, {}, {}, "GET", response => {
    baseApi.log("getPost:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.post);
      }
    } else {
      util.showFail(response.data.msg);
    }
  });
};

var checkPostLike = (post_ids, success) => {
  baseApi.request(checkPostLikeUrl, { post_ids: post_ids }, {}, "GET", response => {
    baseApi.log("checkPostLike:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.posts);
      }
    } else {
      util.showFail(response.data.msg);
    }
  }, undefined, undefined, true);
};

var likePost = (post_id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(likePostUrl, { post_id: post_id }, header, "POST", response => {
    baseApi.log("likePost:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success();
      }
    } else {
      util.showFail(response.data.msg);
    }
  }, undefined, undefined, true);
};

var undoLikePost = (post_id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(undoLikePostUrl, { post_id: post_id }, header, "POST", response => {
    baseApi.log("undoLikePost:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success();
      }
    } else {
      util.showFail(response.data.msg);
    }
  }, undefined, undefined, true);
};

var getPostCommentList = (post_id, page, page_size, success) => {
  let params = { post_id: post_id };
  if (page) {
    params.page = page;
  }
  if (page_size) {
    params.page_size = page_size;
  }
  baseApi.request(getPostCommentListUrl, params, {}, "GET", response => {
    baseApi.log("getPostCommentList:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success(response.data.comments);
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

var sendPostComment = (post_id, content, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(sendPostCommentUrl, { post_id: post_id, content: content }, header, "POST", response => {
    baseApi.log("sendPostComment:", response);
    if (response.data.ret == 0) {
      if (success && typeof success == "function") {
        success();
      }
    } else {
      util.showFail(response.data.msg);
    }
  }, undefined, undefined, true);
};

var sharePost = (post_id, success) => {
  var header = { "Content-Type": "application/x-www-form-urlencoded" };
  baseApi.request(sharePostUrl, { post_id: post_id }, header, "POST", response => {
    baseApi.log("sharePost", response);
  });
};

module.exports = {
  followAnchor,
  getFollowedAnchors,
  unfollowAnchor,
  getAnchorProfile,
  getFollowedLives,
  getFollowedTimelines,
  getInterestingLives,
  getInterestingTimelines,
  getRecommendations,
  getAnchorList,
  followShop,
  unfollowShop,
  getPostList,
  getGoodsPostList,
  getPost,
  getUserPostList,
  checkPostLike,
  likePost,
  undoLikePost,
  getPostCommentList,
  sendPostComment,
  sharePost
};
