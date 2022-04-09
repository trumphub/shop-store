<template>
  <div class="app-container">
    <el-scrollbar style="height: 100%">
      <el-card class="app">
        <el-alert
          title="功能说明：此功能用于订单数据导出，导出后的文件请用Excel打开查看"
          type="warning"
          :closable="false"
        />
        <el-form
          style="margin-top: 20px"
          label-width="100px"
          :model="criteria"
          :rules="rules"
          ref="ruleForm"
          size="small"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="下单时间" prop="betweenTime">
                <el-date-picker
                  v-model="criteria.betweenTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="订单来源">
                <el-select v-model="criteria.orderSource">
                  <el-option label="全部" :value="-1" />
                  <el-option label="普通订单" :value="10" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="支付方式">
                <el-select v-model="criteria.payType">
                  <el-option label="全部" :value="-1" />
                  <el-option label="余额支付" :value="10" />
                  <el-option label="微信支付" :value="20" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="配送方式">
                <el-select v-model="criteria.deliveryType">
                  <el-option label="全部" :value="-1" />
                  <el-option label="快递配送" :value="10" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="导出字段" prop="columns">
            <el-checkbox-group v-model="criteria.columns">
              <el-checkbox
                v-for="{ label, value } in columnData"
                :key="value"
                :label="value"
                >{{ label }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">导出</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card class="app">
        <el-table :data="list.data">
          <el-table-column prop="id" label="记录ID" />
          <el-table-column label="下单时间">
            <template slot-scope="{ row }">
              {{ row.start_time }} 到 {{ row.end_time }}
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="导出时间" />
          <el-table-column label="导出状态">
            <template>
              <el-tag size="small">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                v-action:download
                @click="download(row)"
                type="text"
                size="small"
              >
                下载
              </el-button>
            </template>
          </el-table-column>
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
  </div>
</template>

<script>
import * as Api from "@/api/order";

const columnData = [
  { label: "订单ID", value: "order_id" },
  { label: "订单号", value: "order_no" },
  { label: "商品信息", value: "goods_detail" },
  { label: "商品总额", value: "total_price" },
  { label: "优惠券抵扣金额", value: "coupon_money" },
  { label: "积分抵扣金额", value: "points_money" },
  { label: "后台改价", value: "update_price" },
  { label: "运费金额", value: "express_price" },
  { label: "订单实付款", value: "pay_price" },
  { label: "支付方式", value: "pay_type" },
  { label: "下单时间", value: "create_time" },
  { label: "买家信息", value: "user_info" },
  { label: "买家留言", value: "buyer_remark" },
  { label: "配送方式", value: "delivery_type" },
  { label: "收货人", value: "receipt_name" },
  { label: "联系电话", value: "receipt_phone" },
  { label: "收货地址", value: "receipt_address" },
  { label: "物流公司", value: "express_company" },
  { label: "物流单号", value: "express_no" },
  { label: "付款状态", value: "pay_status" },
  { label: "付款时间", value: "pay_time" },
  { label: "发货状态", value: "delivery_status" },
  { label: "发货时间", value: "delivery_time" },
  { label: "收货状态", value: "receipt_status" },
  { label: "收货时间", value: "receipt_time" },
  { label: "订单状态", value: "order_status" },
  { label: "是否已评价", value: "is_comment" },
  { label: "订单来源", value: "order_source" },
];

const columnValue = [
  "order_no",
  "goods_detail",
  "total_price",
  "coupon_money",
  "points_money",
  "update_price",
  "express_price",
  "pay_price",
  "pay_type",
  "create_time",
  "user_info",
  "buyer_remark",
  "delivery_type",
  "receipt_name",
  "receipt_phone",
  "receipt_address",
  "express_company",
  "express_no",
  "pay_status",
  "pay_time",
  "delivery_status",
  "delivery_time",
  "receipt_status",
  "receipt_time",
  "order_status",
  "order_source",
];

export default {
  name: "OrderExport",
  data() {
    return {
      criteria: {
        betweenTime: null,
        orderSource: -1,
        payType: -1,
        deliveryType: -1,
        columns: columnValue,
      },
      rules: {
        betweenTime: [
          {
            required: true,
            message: "请选择下单时间",
            trigger: "blur",
          },
        ],
        columns: [
          {
            required: true,
            message: "请选择导出的字段",
            trigger: "blur",
          },
        ],
      },
      columnData,
      page: 1,
      list: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 10,
        total: 1, // 总记录
      },
    };
  },
  mounted() {
    this.exportList();
  },
  methods: {
    async exportList() {
      const { data } = await Api.exportList({ page: this.page });
      this.list = data.list;
      console.log(data);
    },
    handleCurrentChange(page) {
      this.page = page;
      this.exportList();
    },
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          try {
            const { message } = await Api.exportOrder(this.criteria);
            this.$message({
              message,
              type: "success",
            });
            this.page = 1;
            this.exportList();
          } catch (error) {}
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    download({ download_url }) {
      //   location.href = download_url;
      open(download_url, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
.el-pagination-wrap {
  padding-top: 20px;
  .el-pagination {
    float: right;
  }
}
</style>
