//index.js
var api = require("../../common/api");
var goodsApi = require("../../apis/goodsApi");
var cartApi = require("../../apis/cartApi");
var util = require("../../utils/util");
var app = getApp();

Page({
  data: {
    categories: [],
    goodsList: [],
    histories: [],
    curCategory: -1,
    curCategoryName: "",
    curGoods: null,
    curGoodsSpecLength: 0,
    curSkuId: 0,
    curPrice: 0,
    curSku: "",
    curNum: 1,
    carts: [],
    cartNum: 0,
    totalPrice: 0,
    isShowGoodsSelectBg: false,
    isShowGoodsSelect: false,
    isShowCartBg: false,
    isShowCart: false,
    isShowAuthorize: false,
    cartHeight: 0,
    categoryHeights: [],
    goodsScrollTop: 0,
    goodsListItemMinHeight: 0,
    canNavigateMiniProgram: true
  },

  onLoad: function (options) {
    this.setData({ isShowAuthorize: !app.globalData.userInfo.authorized, canNavigateMiniProgram: wx.canIUse("navigator.app-id") });
  },

  onShow: function () {
    console.log(app.globalData.options);
    this.setData({ isShowGoodsSelectBg: false, isShowGoodsSelect: false, isShowCartBg: false, isShowCart: false });
    if (app.globalData.options && app.globalData.options.shareType) {
      try{
        if (app.globalData.options.shareType == "order_detail"){
          wx.navigateTo({ url: "/pages/order_detail/order_detail?orderId=" + app.globalData.options.orderId });
          app.globalData.options = null;
        }
      }catch(err){
        console.error(err);
      }
    }else{
      this.getCategories();
      this.getCartList();
    }
  },

  onReady: function () {
    this.queryGoodsListMinHeight();
  },

  onShareAppMessage: function () {
    return {
      title: "Have a good time in WeStore Café",
      path: "/pages/index/index",
      imageUrl: "/resources/images/share.jpg"
    }
  },

  getCategories: function () {
    goodsApi.getCategories((categories) => {
      this.setData({ categories: categories });
      if (this.data.curCategory == -1) {
        if (this.data.histories.length > 0) {
          this.setData({ curCategory: 0 });
        } else {
          if (categories.length > 0) {
            this.setData({ curCategory: categories[0].id });
          }
        }
      }
      let count = 0;
      for (let category of categories) {
        this.getGoodsList(category.id, () => {
          count++;
          if (count == categories.length) {
            this.queryGoodsListHeight();
          }
        });
      }
    });
  },

  getGoodsList: function (categoryId, callback) {
    goodsApi.getCategoryGoods(null, categoryId, null, null, null, null, 1, 50, (goodsList) => {
      for (let i in this.data.categories) {
        let category = this.data.categories[i];
        if (category.id == categoryId) {
          if (goodsList.length > 0){
            category.goodsList = goodsList;
          } else {
            this.data.categories.splice(i, 1);
          }
          break;
        }
      }
      this.setData({ categories: this.data.categories });
      if (callback && typeof callback == "function") {
        callback();
      }
    });
  },

  getGoodsDetail: function (goodsId) {
    goodsApi.getGoodsDetail(goodsId, (goods) => {
      goods.goods_spec = JSON.parse(goods.goods_spec);
      let curGoodsSpecLength = 0;
      for (let i in goods.goods_spec) {
        let spec = goods.goods_spec[i];
        let count = 1;
        for (let j in spec.spec_values) {
          let specValue = spec.spec_values[j];
          specValue.selected = count == 1;
          count++;
        }
        curGoodsSpecLength++;
      }

      this.setData({ isShowGoodsSelectBg: true });

      this.setData({
        isShowGoodsSelect: true,
        curGoods: goods,
        curGoodsSpecLength: curGoodsSpecLength,
        curNum: 1
      });
      this.updateCurSku();
    });
  },

  getCartList: function () {
    cartApi.getCartList((carts) => {
      app.globalData.carts = carts;
      this.setData({ carts: carts });
      this.updateBottomData();
    });
  },

  updateCartGoods: function (goodsId, skuId, num) {
    cartApi.updateCartGoods(goodsId, skuId, num, (newCart) => {
      let exist = false;
      for (let i in app.globalData.carts) {
        let cart = app.globalData.carts[i];
        if (cart.goods_id == goodsId && cart.sku_id == skuId) {
          if (num > 0) {
            cart.num = num;
          } else {
            app.globalData.carts.splice(i, 1);
          }
          exist = true;
        }
      }
      if (!exist){
        app.globalData.carts.push(newCart);
      }
      this.setData({ carts: app.globalData.carts });
      this.updateBottomData();
      this.onSelectClose();
    });
  },

  // getOrderHistories: function (callback) {
  //   api.request({
  //     url: api.getOrderHistoriesUrl,
  //     success: (response) => {
  //       console.log("getOrderHistories:", response);
  //       if (response.data.ret == 0) {
  //         this.setData({ histories: response.data.histories });
  //         if (callback && typeof callback == "function") {
  //           callback();
  //         }
  //       } else if (response.data.ret == 10000) {
  //         wx.showModal({
  //           title: "提示",
  //           content: "登录超时，点击确定重新登录",
  //           showCancel: false,
  //           success: (res) => {
  //             wx.reLaunch({ url: "/pages/login/login" });
  //           }
  //         });
  //       } else {
  //         util.showFail(response.data.msg);
  //       }
  //     },
  //     fail: () => {
  //       util.showFail("网络请求失败，请检查您的网络状态");
  //     }
  //   });
  // },

  // getCategories: function () {
  //   api.request({
  //     url: api.categoriesUrl,
  //     success: (response) => {
  //       console.log("categories:", response);
  //       this.setData({ categories: response.data.categories });
  //       if (this.data.curCategory == -1){
  //         if (this.data.histories.length > 0) {
  //           this.setData({ curCategory: 0 });
  //         } else {
  //           if (response.data.categories.length > 0) {
  //             this.setData({ curCategory: response.data.categories[0].categoryId });
  //           }
  //         }
  //       }
  //       this.queryGoodsListHeight();
  //     },
  //     fail: () => {
  //       util.showFail("网络请求失败，请检查您的网络状态");
  //     }
  //   });
  // },

  // getGoodsList: function (categoryId) {
  //   api.request({
  //     url: api.goodsListUrl,
  //     data: { categoryId: categoryId },
  //     success: (response) => {
  //       console.log("goodsList:", response);
  //       this.setData({ curCategory: categoryId, goodsList: response.data.goodsList });
  //       this.updateCurCategoryName();
  //     },
  //     fail: () => {
  //       util.showFail("网络请求失败，请检查您的网络状态");
  //     }
  //   });
  // },

  // getCarts: function () {
  //   api.request({
  //     url: api.cartsUrl,
  //     success: (response) => {
  //       console.log("getCarts:", response);
  //       if(response.data.ret == 0){
  //         for (let cart of response.data.carts) {
  //           cart.price = parseFloat(cart.price);
  //         }
  //         app.globalData.carts = response.data.carts;
  //         this.setData({ carts: app.globalData.carts });
  //         this.updateBottomData();
  //       } else if (response.data.ret == 10000) {
  //         wx.showModal({
  //           title: "提示",
  //           content: "登录超时，点击确定重新登录",
  //           showCancel: false,
  //           success: (res) => {
  //             wx.reLaunch({ url: "/pages/login/login" });
  //           }
  //         });
  //       }else{
  //         util.showFail(response.data.msg);
  //       }
  //     },
  //     fail: () => {
  //       util.showFail("网络请求失败，请检查您的网络状态");
  //     }
  //   })
  // },

  queryGoodsListMinHeight: function () {
    let query = wx.createSelectorQuery()
    query.select(".goods-list").boundingClientRect();
    query.exec((res) => {
      console.log("goods-list height:", res);
      if (res[0]) {
        this.setData({ goodsListItemMinHeight: res[0].height });
      }
    });
  },

  queryGoodsListHeight: function () {
    let categoryHeights = [];
    let queryHistory = wx.createSelectorQuery()
    queryHistory.select("#history").boundingClientRect();
    queryHistory.exec((historyRes) => {
      console.log("history:", historyRes);
      if (historyRes[0]) {
        categoryHeights.push({ categoryId: 0, height: historyRes[0].height });
      }
      for (let category of this.data.categories) {
        let queryCategory = wx.createSelectorQuery()
        queryCategory.select(`#goods-list-${category.id}`).boundingClientRect();
        queryCategory.exec((categoryRes) => {
          console.log(`goods-list-${category.id}`, categoryRes);
          if (categoryRes[0]) {
            categoryHeights.push({ categoryId: category.id, height: categoryRes[0].height });
            this.setData({ categoryHeights: categoryHeights });
          }
        });
      }
    });
  },

  updateCurCategoryName: function () {
    for (let category of this.data.categories) {
      if (category.id == this.data.curCategory) {
        this.setData({ curCategoryName: category.categoryName });
        break;
      }
    }
  },

  onCategoryTap: function (event) {
    let goodsScrollTop = 0;
    for (let categoryHeight of this.data.categoryHeights){
      if (categoryHeight.categoryId == event.currentTarget.dataset.categoryId){
        this.setData({ curCategory: event.currentTarget.dataset.categoryId, goodsScrollTop: goodsScrollTop });
        break;
      }
      goodsScrollTop += categoryHeight.height;
    }
  },

  onGoodsListScroll: function (event) {
    let scrollTop = event.detail.scrollTop;
    let goodsScrollTop = 0;
    for (let categoryHeight of this.data.categoryHeights) {
      goodsScrollTop += categoryHeight.height;
      if (scrollTop < goodsScrollTop){
        this.setData({ curCategory: categoryHeight.categoryId });
        break;
      }
    }
  },

  onGoodsListScrollToLower: function (event) {
    setTimeout(() => {
      this.setData({ curCategory: this.data.categoryHeights[this.data.categoryHeights.length - 1].categoryId });
    }, 100);
  },

  updateBottomData: function () {
    let cartHeight = 208;
    let cartNum = 0;
    let totalPrice = 0;
    for(let cart of this.data.carts){
      cartHeight += 152;
      cartNum += cart.num;
      totalPrice += cart.price * cart.num;
    }
    cartHeight = Math.min(cartHeight, 664);
    let isShowCart = this.data.isShowCart;
    if (!cartNum) {
      isShowCart = false;
    }
    this.setData({ cartNum: cartNum, totalPrice: totalPrice, cartHeight: cartHeight, isShowCart: isShowCart });
  },

  onSelectTap: function (event) {
    // api.request({
    //   url: api.goodsDetailUrl,
    //   data: { goodsId: event.currentTarget.dataset.goodsId },
    //   success: (response) => {
    //     console.log("goodsDetail:", response);
    //     let curGoodsSpecLength = 0;
    //     for (let i in response.data.goods.goodsSkuSpecs){
    //       let spec = response.data.goods.goodsSkuSpecs[i];
    //       let count = 1;
    //       for (let j in spec.specValues){
    //         let specValue = spec.specValues[j];
    //         specValue.selected = count == 1;
    //         count++;
    //       }
    //       curGoodsSpecLength++;
    //     }

    //     this.setData({ isShowGoodsSelectBg: true });

    //     this.setData({ 
    //       isShowGoodsSelect: true, 
    //       curGoods: response.data.goods,
    //       curGoodsSpecLength: curGoodsSpecLength,
    //       curNum: 1
    //     });
    //     this.updateCurSku();
    //   },
    //   fail: () => {
    //     util.showFail("网络请求失败，请检查您的网络状态");
    //   }
    // });
    this.getGoodsDetail(event.currentTarget.dataset.goodsId);
  },

  updateCurSku: function () {
    let curSkuId = 0;
    let curPrice = 0;
    let curSku = "";
    let attrValueItems = "";
    for (let spec of this.data.curGoods.goods_spec) {
      if (attrValueItems != "") {
        attrValueItems += ";";
      }
      attrValueItems += spec.spec_id;
      for (let specValue of spec.spec_values) {
        if (specValue.selected) {
          attrValueItems += ":" + specValue.spec_value_id;
          if(curSku != ""){
            curSku += "/";
          }
          curSku += specValue.spec_value_name;
          break;
        }
      }
    }
    for (let sku of this.data.curGoods.skus) {
      if (sku.attr_value_items == attrValueItems) {
        curSkuId = sku.id;
        curPrice = sku.promote_price;
        break;
      }
    }
    this.setData({
      curSkuId: curSkuId,
      curPrice: curPrice,
      curSku: curSku
    });
  },

  onSelectClose: function () {
    this.setData({ isShowGoodsSelect: false });
    setTimeout(() => {
      this.setData({ isShowGoodsSelectBg: false });
    }, 300);
  },

  onSpecValueTap: function (event) {
    for (let spec of this.data.curGoods.goods_spec) {
      if (spec.spec_id == event.currentTarget.dataset.specId){
        for (let specValue of spec.spec_values) {
          specValue.selected = specValue.spec_value_id == event.currentTarget.dataset.specValueId;
        }
        break;
      }
    }
    this.setData({ curGoods: this.data.curGoods });
    this.updateCurSku();
  },

  onAddTap: function () {
    let curNum = this.data.curNum;
    curNum++;
    this.setData({ curNum: curNum });
  },

  onSubTap: function () {
    let curNum = this.data.curNum;
    if (curNum > 1){
      curNum--;
      this.setData({ curNum: curNum });
    }
  },

  onAddToCartTap: function () {
    let num = this.data.curNum;
    for(let cart of app.globalData.carts){
      if(cart.sku_id == this.data.curSkuId){
        num += cart.num;
        break;
      }
    }
    this.updateCartGoods(this.data.curGoods.id, this.data.curSkuId, num);
    // api.request({
    //   url: api.updateCartsUrl,
    //   data: { skuId: this.data.curSkuId, num: num },
    //   success: (response) => {
    //     console.log("onAddToCartTap:", response);
    //     if (response.data.ret == 0){
    //       let exist = false;
    //       for(let i in app.globalData.carts){
    //         let cart = app.globalData.carts[i];
    //         if (cart.cartId == response.data.cart.cartId){
    //           if(num > 0){
    //             cart.num = num;
    //           }else{
    //             app.globalData.carts.splice(i, 1);
    //           }
    //           exist = true;
    //         }
    //       }
    //       if (!exist){
    //         app.globalData.carts.push(response.data.cart);
    //       }
    //       this.setData({ carts: app.globalData.carts });
    //       this.updateBottomData();
    //       this.onSelectClose();
    //     } else if (response.data.ret == 10000){
    //       wx.showModal({
    //         title: "提示",
    //         content: "登录超时，点击确定重新登录",
    //         showCancel: false,
    //         success: (res) => {
    //           wx.reLaunch({ url: "/pages/login/login" });
    //         }
    //       });
    //     }else{
    //       util.showFail(response.data.msg);
    //     }
    //   },
    //   fail: () => {
    //     util.showFail("网络请求失败，请检查您的网络状态");
    //   }
    // });
  },

  onCartTap: function () {
    let isShowCartBg = !this.data.isShowCartBg;
    let isShowCart = !this.data.isShowCart;
    if (isShowCart){
      this.setData({ isShowCartBg: isShowCartBg });
      this.setData({ isShowCart: isShowCart });
    }else{
      this.onCartClose();
    }
  },

  onCartClose: function () {
    this.setData({ isShowCart: false });
    setTimeout(() => {
      this.setData({ isShowCartBg: false });
    }, 400);
  },

  onAddCartTap: function (event) {
    for(let cart of app.globalData.carts){
      if(cart.id == event.currentTarget.dataset.cartId){
        cart.num++;
        this.updateCartGoods(cart.goods_id, cart.sku_id, cart.num);
        // api.request({
        //   url: api.updateCartsUrl,
        //   data: { skuId: cart.skuId, num: cart.num },
        //   success: (response) => {
        //     if(response.data.ret == 0){
        //       console.log("onAddCartTap:", response);
        //       this.setData({ carts: app.globalData.carts });
        //       this.updateBottomData();
        //     } else if (response.data.ret == 10000) {
        //       wx.showModal({
        //         title: "提示",
        //         content: "登录超时，点击确定重新登录",
        //         showCancel: false,
        //         success: (res) => {
        //           wx.reLaunch({ url: "/pages/login/login" });
        //         }
        //       });
        //     } else {
        //       util.showFail(response.data.msg);
        //     }
        //   },
        //   fail: () => {
        //     util.showFail("网络请求失败，请检查您的网络状态");
        //   }
        // });
        break;
      }
    }
  },

  onSubCartTap: function (event) {
    for (let i in app.globalData.carts) {
      let cart = app.globalData.carts[i];
      if (cart.id == event.currentTarget.dataset.cartId) {
        cart.num--;
        if(cart.num < 0){
          cart.num = 0;
        }
        this.updateCartGoods(cart.goods_id, cart.sku_id, cart.num);
        // api.request({
        //   url: api.updateCartsUrl,
        //   data: { skuId: cart.skuId, num: cart.num },
        //   success: (response) => {
        //     if (response.data.ret == 0) {
        //       console.log("onAddCartTap:", response);
        //       if (cart.num == 0) {
        //         app.globalData.carts.splice(i, 1);
        //       }
        //       this.setData({ carts: app.globalData.carts });
        //       this.updateBottomData();
        //       if (app.globalData.carts.length == 0){
        //         this.onCartClose();
        //       }
        //     } else if (response.data.ret == 10000) {
        //       wx.showModal({
        //         title: "提示",
        //         content: "登录超时，点击确定重新登录",
        //         showCancel: false,
        //         success: (res) => {
        //           wx.reLaunch({ url: "/pages/login/login" });
        //         }
        //       });
        //     } else {
        //       util.showFail(response.data.msg);
        //     }
        //   },
        //   fail: () => {
        //     util.showFail("网络请求失败，请检查您的网络状态");
        //   }
        // });
        break;
      }
    }
  },

  onBalanceTap: function () {
    wx.navigateTo({ url: "../../pages/balance/balance" });
    this.setData({ isShowCartBg: false, isShowCart: false });
  },

  onHistoryTap: function (event) {
    api.request({
      url: api.buyHistoryUrl,
      data: { orderGoodsId: event.currentTarget.dataset.orderGoodsId },
      success: (response) => {
        console.log("buyHistory:", response);
        if (response.data.ret == 0) {
          app.globalData.carts = response.data.carts;
          wx.navigateTo({ url: "/pages/balance/balance" });
        } else if (response.data.ret == 10000) {
          wx.showModal({
            title: "提示",
            content: "登录超时，点击确定重新登录",
            showCancel: false,
            success: (res) => {
              wx.reLaunch({ url: "/pages/login/login" });
            }
          });
        } else {
          util.showFail(response.data.msg);
        }
      },
      fail: () => {
        util.showFail("网络请求失败，请检查您的网络状态");
      }
    });
  },

  onAuthorizeCancel: function () {
    this.setData({ isShowAuthorize: false });
  },

  getUserInfo: function (event) {
    console.log("getUserInfo:", event);
    api.request({
      url: api.authorizeUrl,
      data: { encryptedData: event.detail.encryptedData, iv: event.detail.iv },
      success: (response) => {
        if (response.data.ret == 0) {
          console.log("authorize:", response);
          app.globalData.userInfo.authorized = 1;
          app.globalData.userInfo.userNick = response.data.userinfo.nickName;
          app.globalData.userInfo.userHeadimg = response.data.userinfo.avatarUrl;
          this.setData({ isShowAuthorize: false });
        } else {
          util.showFail(response.data.msg);
        }
      },
      fail: () => {
        util.showFail("网络请求失败，请检查您的网络状态");
      }
    });
  }
  
})
