<template>
  <div class="app-container">
    <el-scrollbar style="height: 100%">
      <el-card class="app">
        <h4>订单状态</h4>
        <el-divider></el-divider>
        <ul class="progress" :class="`progress-${progress}`">
          <li>
            <span>下单时间</span>
            <span>{{ record.create_time }}</span>
          </li>
          <li>
            <span>付款时间</span>
            <span v-show="record.pay_status === 20">{{ record.pay_time }}</span>
          </li>
          <li>
            <span>发货时间</span>
            <span v-show="record.delivery_status === 20">{{
              record.delivery_time
            }}</span>
          </li>
          <li>
            <span>收货时间</span>
            <span v-show="record.receipt_status === 20">{{
              record.receipt_time
            }}</span>
          </li>
          <li>
            <span>完成时间</span>
            <span v-show="record.order_status === 30">{{
              record.receipt_time
            }}</span>
          </li>
        </ul>
      </el-card>
      <el-card class="app">
        <h4>订单操作</h4>
        <el-divider></el-divider>
        <el-alert
          v-if="record.order_status === 21"
          type="warning"
          description="当前买家已付款并申请取消订单，请审核是否同意，如同意则自动退回付款金额（原路退款）并关闭订单。"
          show-icon
          :closable="false"
        >
        </el-alert>
        <div>
          <el-button
            v-if="
              record.pay_status === 20 &&
              record.delivery_type === 10 &&
              record.delivery_status === 10 &&
              !(record.order_status === 20 || record.order_status === 21)
            "
            v-permission="delivery"
            type="primary"
            @click="handleDelivery"
            size="small"
            >发货</el-button
          >
          <el-button
            style="margin-top: 20px"
            v-permission="cancel"
            v-if="record.order_status === 21"
            type="primary"
            size="small"
            @click="handleCancel"
            >审核取消订单</el-button
          >
        </div>
        <el-divider></el-divider>
        <el-descriptions title="订单信息">
          <el-descriptions-item label="订单号">{{
            record.order_no
          }}</el-descriptions-item>
          <el-descriptions-item label="实付款金额"
            >￥{{ record.pay_price }}</el-descriptions-item
          >
          <el-descriptions-item label="支付方式">{{
            record.pay_type === 10 ? "余额支付" : "微信支付"
          }}</el-descriptions-item>
          <el-descriptions-item label="配送方式">快递配送</el-descriptions-item>
          <el-descriptions-item label="运费金额"
            >￥{{ record.express_price }}</el-descriptions-item
          >
          <el-descriptions-item label="订单状态">{{
            orderStatus[record.order_status]
          }}</el-descriptions-item>
          <el-descriptions-item label="买家信息">
            <el-tooltip
              effect="dark"
              :content="`会员ID: ${record.user_id}`"
              placement="top"
            >
              <span>{{ record.user && record.user.nick_name }}</span>
            </el-tooltip>
          </el-descriptions-item>
          <el-descriptions-item label="买家留言">
            {{ record.buyer_remark || "暂无留言" }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
      <el-card class="app">
        <h4>订单商品</h4>
        <el-divider></el-divider>
        <el-table v-if="record.goods" :data="record.goods">
          <el-table-column label="商品信息">
            <template slot-scope="{ row }">
              <div class="goods-info">
                <img :src="row.goods_image" alt="" />
                <div>
                  <span>{{ row.goods_name }}</span>
                  <span v-if="row.goods_props">
                    {{
                      row.goods_props.map((prop) => prop.value.name).join(" ")
                    }}
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品编码">
            <template slot-scope="{ row }">
              {{ row.goods_no || "---" }}
            </template>
          </el-table-column>
          <el-table-column label="重量(Kg)" prop="goods_weight" />
          <el-table-column label="单价" prop="goods_price" />
          <el-table-column label="购买数量" prop="total_num" />
          <el-table-column label="商品总价" prop="total_price" />
        </el-table>
        <div class="summary">
          <p>订单总额：￥{{ record.total_price }}</p>
          <p v-if="record.coupon_money > 0">
            优惠券抵扣：-￥{{ record.coupon_money }}
          </p>
          <p v-if="record.points_money > 0">
            积分抵扣：-￥{{ record.points_money }}
          </p>
          <p v-if="record.update_price && record.update_price.value != 0">
            商家改价：{{ record.update_price.symbol }}￥{{
              record.update_price.value
            }}
          </p>
          <p>运费金额：+￥{{ record.express_price }}</p>
          <p>实付款金额：￥{{ record.pay_price }}</p>
        </div>
      </el-card>
      <el-card class="app">
        <el-descriptions title="收货信息" v-if="record.address">
          <el-descriptions-item label="收货人姓名">{{
            record.address.name
          }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">{{
            record.address.phone
          }}</el-descriptions-item>
          <el-descriptions-item label="收货地区">
            {{ record.address.region.province }}
            {{ record.address.region.city }}
            {{ record.address.region.region }}
          </el-descriptions-item>
          <el-descriptions-item label="详细地址">
            {{ record.address.detail }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions
          v-if="
            record.pay_status === 20 &&
            record.delivery_status === 20 &&
            !(record.order_status === 20 || record.order_status === 21)
          "
          title="发货信息"
        >
          <el-descriptions-item label="物流公司">
            {{ record.express.express_name }}
          </el-descriptions-item>
          <el-descriptions-item label="物流单号">
            {{ record.express_no }}
          </el-descriptions-item>
          <el-descriptions-item label="发货状态"> 已发货 </el-descriptions-item>
          <el-descriptions-item label="发货时间">
            {{ record.delivery_time }}
          </el-descriptions-item>
        </el-descriptions>
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
  name: "OrderDetail",
  props: ["id"],
  data() {
    return {
      record: {},
      progress: 1,
      delivery: "/order/list/all.deliver",
      cancel: "/order/list/all.cancel",
      orderStatus: {
        10: "进行中",
        20: "已取消",
        21: "待取消",
        30: "已完成",
      },
      visible: false,
      item: {
        status: 1,
        price: 0,
      },
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
    this.getOrderDetail();
    this.getExpressList();
  },
  methods: {
    async getExpressList() {
      const { data } = await Api.getAllExpress();
      this.expressList = data.list;
    },
    async getOrderDetail() {
      const { data } = await Api.getDetail({ orderId: this.id });
      this.record = data.detail;
      // pay_status  10 待支付 20 已支付
      if (this.record.pay_status === 20) {
        this.progress = 2;
      }
      // delivery_status 10 未发货 20 已发货
      if (this.record.delivery_status === 20) {
        this.progress = 3;
      }
      // receipt_status 10 未收货 20 已收货
      if (this.record.receipt_status === 20) {
        this.progress = 4;
      }
      if (this.record.order_status === 30) {
        this.progress = 5;
      }
      console.log(data);
    },
    handleDelivery() {
      this.visible2 = true;
    },
    handleCancel() {
      this.item.price = this.record.pay_price;
      this.visible = true;
    },
    close() {
      this.item = {
        status: 1,
        price: 0,
      };
    },
    refresh() {
      this.getOrderDetail();
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
.progress {
  display: flex;
  list-style-type: none;
  margin-block-start: 0;
  margin-block-end: 0;
  padding-inline-start: 0;
  li {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    span {
      z-index: 1;
      font-size: 14px;
      line-height: 20px;
      &:last-child {
        margin-top: 20px;
        font-size: 12px;
      }
    }
  }
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 20px;
    background-color: #91d5ff;
    border-radius: 10px;
  }
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 20px;
    background-color: #1890ff;
    border-radius: 10px;
  }

  @for $i from 0 through 5 {
    $before-width: ($i + 1) * 20;
    $after-width: $i * 20%;

    @if $before-width > 100 {
      $before-width: 100;
    }

    &.progress-#{$i} {
      &::before {
        width: $before-width + 0%;
      }
      &::after {
        width: $after-width;
      }

      @for $j from 1 through $i {
        li:nth-child(#{$j}) {
          span:first-child {
            color: #fff;
          }
        }
      }
    }
  }
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

.summary {
  font-size: 14px;
  text-align: right;
}
</style>
