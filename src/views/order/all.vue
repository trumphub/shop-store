<template>
  <div class="app-container">
    <el-scrollbar style="height: 100%">
      <el-card class="app">
        <div slot="header">
          <el-form :inline="true" :model="searchParam" size="small">
            <el-form-item label="订单查询">
              <el-input v-model="searchParam.searchValue">
                <el-select
                  placeholder="请选择"
                  v-model="searchParam.searchType"
                  slot="prepend"
                  class="select"
                >
                  <el-option label="订单号" :value="10"></el-option>
                  <el-option label="会员昵称" :value="20"></el-option>
                  <el-option label="会员ID" :value="30"></el-option>
                </el-select>
              </el-input>
            </el-form-item>
            <el-form-item label="订单来源">
              <el-select placeholder="请选择" v-model="searchParam.orderSource">
                <el-option label="全部" :value="-1"></el-option>
                <el-option label="普通订单" :value="10"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支付方式">
              <el-select placeholder="请选择" v-model="searchParam.payType">
                <el-option label="全部" :value="-1"></el-option>
                <el-option label="余额支付" :value="10"></el-option>
                <el-option label="微信支付" :value="20"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="配送方式">
              <el-select
                placeholder="请选择"
                v-model="searchParam.deliveryType"
              >
                <el-option label="全部" :value="-1"></el-option>
                <el-option label="快递配送" :value="10"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="下单时间">
              <el-date-picker
                v-model="searchParam.betweenTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <el-table
          :span-method="arraySpanMethod"
          :data="list.data"
          v-loading="loading"
        >
          <el-table-column label="商品信息" width="300">
            <template slot-scope="{ row }">
              <table class="tb">
                <tbody>
                  <tr>
                    <td colspan="8">
                      <span>{{ row.create_time }}</span>
                      <span class="tb-order">订单号：{{ row.order_no }}</span>
                    </td>
                  </tr>
                  <tr v-for="(goods, index) in row.goods" :key="index">
                    <td style="width: 288px">
                      <div class="goods-info">
                        <img :src="goods.goods_image" alt="" />
                        <div>
                          <span>{{ goods.goods_name }}</span>
                          <span v-if="goods.goods_props">
                            {{
                              goods.goods_props
                                .map((prop) => prop.value.name)
                                .join(" ")
                            }}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p>￥{{ goods.goods_price }}</p>
                      <p>×{{ goods.total_num }}</p>
                    </td>
                    <template v-if="index === 0">
                      <td :rowspan="row.goods.length">
                        <p>￥{{ row.pay_price }}</p>
                        <p>(含运费：￥{{ row.express_price }})</p>
                      </td>
                      <td :rowspan="row.goods.length" class="user-nickname">
                        <p>{{ row.user.nick_name }}</p>
                      </td>
                      <td :rowspan="row.goods.length" style="width: 91px">
                        <el-tag type="info" size="small">{{
                          row.pay_type === 10 ? "余额支付" : "微信支付"
                        }}</el-tag>
                      </td>
                      <td :rowspan="row.goods.length" style="width: 91px">
                        <el-tag type="info" size="small">快递配送</el-tag>
                      </td>
                      <td :rowspan="row.goods.length" style="width: 150px">
                        <div>
                          <span>付款状态：</span>
                          <el-tag size="small">
                            {{ row.pay_status === 10 ? "待支付" : "已支付" }}
                          </el-tag>
                        </div>
                        <div style="margin-top: 5px">
                          <span>发货状态：</span>
                          <el-tag size="small">
                            {{
                              row.delivery_status === 10 ? "未发货" : "已发货"
                            }}
                          </el-tag>
                        </div>
                        <div style="margin-top: 5px">
                          <span>收货状态：</span>
                          <el-tag size="small">
                            {{
                              row.receipt_status === 10 ? "未收货" : "已收货"
                            }}
                          </el-tag>
                        </div>
                        <div style="margin-top: 5px">
                          <span>订单状态：</span>
                          <el-tag size="small">
                            {{ orderStatus[row.order_status] }}
                          </el-tag>
                        </div>
                      </td>
                      <td :rowspan="row.goods.length" style="width: 188px">
                        <el-button
                          @click="toDetail(row)"
                          type="text"
                          size="small"
                          v-permission="detailPath"
                        >
                          详情
                        </el-button>
                        <el-button
                          v-if="
                            row.pay_status === 20 &&
                            row.delivery_status === 10 &&
                            !(
                              row.order_status === 20 || row.order_status === 21
                            )
                          "
                          @click="handleDelivery(row)"
                          type="text"
                          size="small"
                          v-action:cancel
                        >
                          发货
                        </el-button>
                        <el-button
                          @click="handleCancel(row)"
                          type="text"
                          size="small"
                          v-action:cancel
                          v-if="row.order_status === 21"
                        >
                          审核取消
                        </el-button>
                        <el-button
                          @click="handleDelete(row)"
                          type="text"
                          size="small"
                          v-action:delete
                        >
                          删除
                        </el-button>
                      </td>
                    </template>
                  </tr>
                </tbody>
              </table>
            </template>
          </el-table-column>
          <el-table-column label="单价数量" />
          <el-table-column label="实付款" />
          <el-table-column label="买家" width="100" />
          <el-table-column label="支付方式" width="91" />
          <el-table-column label="配送方式" width="91" />
          <el-table-column label="交易状态" width="150" />
          <el-table-column label="操作" width="200" />
        </el-table>
        <div class="el-pagination-wrap clearfix" v-if="list.last_page > 1">
          <el-pagination
            :current-page="list.current_page"
            :page-size="list.per_page"
            :total="list.total"
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </el-scrollbar>
    <OrderCancelDialog
      @refresh="refresh"
      @close="close"
      :commit="commit"
      title="审核取消订单"
      :visible.sync="visible"
      :item="item"
    />
    <OrderDeliveryDialog
      @refresh="refresh"
      @close="close2"
      :commit="commit2"
      title="订单发货"
      :visible.sync="visible2"
      :item="item2"
      :list="expressList"
    />
  </div>
</template>

<script>
import * as Api from "@/api/order";
import OrderCancelDialog from "@/components/OrderCancelDialog";
import OrderDeliveryDialog from "@/components/OrderDeliveryDialog";

export default {
  name: "OrderAll",
  data() {
    return {
      detailPath: "/order/detail",
      orderStatus: {
        10: "进行中",
        20: "已取消",
        21: "待取消",
        30: "已完成",
      },
      searchParam: {
        dataType: "all", // 订单状态

        searchType: 10, // 订单查询选项 10 20 30
        searchValue: "",

        orderSource: -1, // 订单来源 -1 10

        payType: -1, // 支付方式 -1 10 20

        deliveryType: -1, // 配送方式 -1 10

        betweenTime: null,

        page: 1,
      },
      loading: false,
      list: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 10,
        total: 1, // 总记录
      },
      visible: false,
      item: {
        status: 1,
        price: 0,
      },
      id: 0,
      /////////////////////
      item2: {
        express_id: "",
        express_no: "",
      },
      visible2: false,
      expressList: [],
    };
  },
  mounted() {
    this.getOrderList();
    this.getExpressList();
  },
  methods: {
    async getExpressList() {
      const { data } = await Api.getAllExpress();
      this.expressList = data.list;
    },
    search() {
      this.searchParam.page = 1;
      this.getOrderList();
    },
    handleCurrentChange(page) {
      this.searchParam.page = page;
      this.getOrderList();
    },
    async getOrderList() {
      this.loading = true;
      const { data } = await Api.getOrderList(this.searchParam);
      this.list = data.list;
      this.loading = false;
      console.log(data);
    },
    arraySpanMethod({ columnIndex }) {
      if (columnIndex === 0) {
        return [1, 8];
      } else {
        return [0, 0];
      }
    },
    toDetail({ order_id }) {
      this.$router.push({ path: this.detailPath, query: { id: order_id } });
    },
    handleDelivery({ order_id }) {
      this.visible2 = true;
      this.id = order_id;
    },
    handleCancel({ order_id, pay_price }) {
      this.visible = true;
      this.id = order_id;
      this.item.price = pay_price;
    },
    async handleDelete({ order_id }) {
      try {
        await this.$confirm("您确定要删除该记录吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const { message } = await Api.deleteOrder({ orderId: order_id });
        this.$message({
          message,
          type: "success",
        });
        const { last_page, current_page, data } = this.list;
        if (last_page > 1) {
          if (last_page === current_page && data.length === 1) {
            this.searchParam.page -= 1;
          }
        }
        await this.getOrderList();
      } catch (error) {}
    },
    close() {
      this.item = {
        status: 1,
        price: 0,
      };
      this.id = 0;
    },
    refresh() {
      this.getOrderList();
    },
    commit() {
      return new Promise((resolve, reject) => {
        Api.orderCancel({
          orderId: this.id,
          form: { status: this.item.status },
        }).then(resolve, reject);
      });
    },
    ////////////////////
    commit2() {
      return new Promise((resolve, reject) => {
        Api.orderDelivery({
          orderId: this.id,
          form: this.item2,
        }).then(resolve, reject);
      });
    },
    close2() {
      this.id = 0;
      this.item2 = {
        express_id: "",
        express_no: "",
      };
    },
  },
  components: {
    OrderCancelDialog,
    OrderDeliveryDialog,
  },
};
</script>

<style lang="scss" scoped>
.select {
  width: 120px;
}
.el-pagination-wrap {
  padding-top: 20px;
  .el-pagination {
    float: right;
  }
}

.tb {
  width: 100%;
  border-collapse: collapse;
  .tb-order {
    padding-left: 12px;
  }
  td {
    border: 1px solid #e8e8e8;
    padding: 12px;
  }
  .goods-info {
    display: flex;
    align-items: center;
    img {
      width: 60px;
      height: 60px;
    }
    div {
      display: flex;
      flex-direction: column;
      margin-left: 12px;
      span {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        white-space: normal;
      }
    }
  }

  .user-nickname {
    width: 100px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
}
</style>
