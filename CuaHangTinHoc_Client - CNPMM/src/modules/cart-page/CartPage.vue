<template>
  <div>
    <div class="row" v-if="false">
      <div class="alert alert-success col-12 col-md-12" role="alert">Mã discount hợp lệ</div>
      <div class="alert alert-danger col-12 col-md-12" role="alert">Mã discount không hợp lệ</div>
    </div>
    <div class="row">
      <div class="col-12 col-md-9">
        <div
          v-for="(product,index) in loadCart"
          :key="index"
          class="row product-item"
          style="background-color: white;"
        >
          <div class="col col-md-2">
            <router-link :to="{name: 'product', params: {id: product.id}}">
              <img :src="image_link+ product.id +'/1.png' " alt="image" style="width:100%;" />
            </router-link>
          </div>
          <div class="col col-md-10">
            <div class="row" style="padding: 1rem;">
              <div class="col-6 col-md-9 text-left">
                <div>{{product.name}}</div>
              </div>
              <div class="col-6 col-md-3 text-right">
                <div>
                  <b>{{fixFormatVND(product.price)}}đ</b>
                </div>
                <div style="margin-top: 1rem;">
                  <button class="btn btn-danger btn-sm" @click="deleteCartItem(product.id)">Xóa</button>
                </div>
              </div>
            </div>
            <div class="row" style="padding: 1rem;">
              <div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                <div class="btn-group mr-2" role="group" aria-label="First group">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    v-on:click="(product.count > 1) ? product.count-- : ''"
                  >-</button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    style="background-color: white;color:black;cursor:auto"
                  >{{product.count}}</button>
                  <button
                    type="button"
                    class="btn btn-secondary"
                    v-on:click="(product.count < product.productCount) ? product.count++ : ''"
                  >+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-3">
        <div class="row" style="background-color: #e9ebea;">
          <div class="col-12 col-md-11 offset-md-1" style="background-color: white;">
            <div class="row">
              <div class="col-12 col-md-12">
                <div class="row">
                  <div
                    class="col-12 col-md-12 text-left price-item"
                    style="border-bottom: 1px solid #333333;"
                  >
                    <span>
                      <b>Tạm tính :</b>
                    </span>
                    <span style="position: absolute;right: 1rem;">
                      <b>{{fixFormatVND(loadTotalPrice)}}đ</b>
                    </span>
                  </div>

                  <div
                    class="col-12 col-md-12 text-left price-item"
                    style="border-bottom: 1px solid #333333;"
                  >
                    <span>
                      <b>Giảm giá :</b>
                    </span>
                    <span style="position: absolute;right: 1rem;margin-top: -0.3rem;">
                      <h6 class="total-price">
                        <b>{{fixFormatVND(loadTotalPrice * loadDiscount)}}đ</b>
                      </h6>
                    </span>
                  </div>

                  <div class="col-12 col-md-12 text-left price-item">
                    <span>
                      <b>Thành tiền :</b>
                    </span>
                    <span style="position: absolute;right: 1rem;margin-top: -0.3rem;">
                      <h6 class="total-price">
                        <b>{{fixFormatVND(loadTotalPrice - loadTotalPrice*loadDiscount)}}đ</b>
                      </h6>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row" style="margin-top: 1rem;">
          <div class="col-12 col-md-11 offset-md-1" style="padding:0;">
            <button
              class="btn btn-danger btn-order"
              v-on:click="checkLogin()"
              style="width: 100%;"
            >Tiến hành đặt hàng</button>
          </div>
        </div>

        <div class="row" style="margin-top: 1rem;" v-if="false">
          <div class="col-12 col-md-6 offset-md-1" style="padding:0;">
            <input class="form-control" v-model="discountCode" placeholder="Mã giảm giá" />
          </div>
          <div class="col-12 col-md-5" style="padding:0;">
            <button class="btn btn-warning">Kiểm tra mã</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      image_link: "http://localhost:8000/images/",
      productList: [],
      totalPrice: 0,
      discountCode: "",
      discount: 0,
      address: ''
    };
  },
  created() {
    if (localStorage.cart) {
      this.productList = JSON.parse(localStorage.cart);
      console.log(this.productList);
    }
  },
  methods: {
    fixFormatVND(nStr) {
      nStr = nStr + "";
      let x = nStr.split(".");
      let x1 = x[0];
      let x2 = x.length > 1 ? "." + x[1] : "";
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + "," + "$2");
      }
      return x1 + x2;
    },
    checkLogin() {
      if (localStorage.ctoken) {
        this.$store
          .dispatch("checkLoginCustomer")
          .then(respone => this.affterCheckLogin(respone));
      } else {
        this.alertFailOrder();
      }
    },
    affterCheckLogin(respone) {
      if (respone.data.user) {
        if(respone.data.user.address && respone.data.user.address!= '')
          this.address = respone.data.user.address;
        if (this.productList.length > 0) {
          this.$swal
            .fire({
              title: "Nhập địa chỉ giao hàng",
              input: "textarea",
              inputValue: this.address,
              inputPlaceholder: "Địa chỉ giao hàng",
              inputAttributes: {
                "aria-label": "Địa Chỉ giao hàng"
              },
              showCancelButton: true
            })
            .then(result => this.handleOrder(result));
        } else {
          this.$swal({
            type: "info",
            text: "Giỏ hàng rỗng, không thể đặt hàng"
          });
        }
      } else {
        this.alertFailOrder();
      }
    },
    handleOrder(result) {
      if (result.value) {
        alert(this.totalPrice)
        let order = {
          total_price: this.totalPrice,
          token: localStorage.ctoken,
          address: result.value,
          productList: JSON.stringify(this.productList)
        };

        this.$store
          .dispatch("customerOrder", order)
          .then(response => this.afterOrder(response));
      }
    },
    afterOrder(response) {
      if (response.data.msg) {
        this.$swal({
          type: "success",
          title: "Thông báo",
          text: response.data.msg
        });
      }
      if (response.data.RequestSuccess) {
        localStorage.removeItem("cart");
        this.$store.dispatch('updateProductCountInCart')
        this.$router.push({ path: "/mypage" });
      }
    },
    alertFailOrder() {
      this.$swal
        .fire({
          title: "Xác thực tài khoản",
          text: "Vui lòng đăng nhập để tiến hành đặt hàng"
        })
        .then(() => this.handleLoginForCart());
    },
    handleLoginForCart() {
      localStorage.removeItem("ctoken");
      localStorage.removeItem("cname");
      this.$router.push({ name: "login" });
    },
    deleteCartItem(id) {
      this.$swal({
        title: "Thông báo",
        text: "Bạn muốn xóa sản phẩm khỏi giỏ hàng ?",
        showCancelButton: true
      }).then(result => this.handleDeleteCartItem(result, id));
    },
    handleDeleteCartItem(result, id) {
      if (result.value) {
        for (let i = 0; i < this.productList.length; i++) {
          if (this.productList[i].id == id) {
            this.productList.splice(i, 1);
            localStorage.cart = JSON.stringify(this.productList);
            this.$swal({
              title: "Thông báo",
              text: "Xóa thành công"
            });
            this.$store.dispatch("updateProductCountInCart");
            return 0;
          }
        }
      }
    }
  },
  computed: {
    loadCart() {
      return this.productList;
    },
    loadTotalPrice() {
      let totalPrice = 0;
      this.productList.forEach(product => {
        totalPrice += product.price * product.count;
      });
      this.totalPrice = totalPrice
      return totalPrice;
    },
    loadDiscount() {
      return this.discount;
    }
  }
};
</script>
<style lang="scss" scoped>
.price-item {
  padding: 1rem;
  .total-price {
    font-size: 20px;
    color: red;
  }
}
.btn-order {
  width: 100%;
}
.product-item {
  margin-bottom: 1rem;
}
</style>