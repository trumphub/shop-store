<template>
  <div class="app-container" v-loading="loading">
    <el-scrollbar style="height: 100%">
      <el-card class="app" shadow="never">
        <div slot="header">
          <h2>实时概况</h2>
        </div>
        <el-row>
          <el-col :md="6">
            <div class="one te">
              <i class="el-icon-s-marketing"></i>
              <div class="info">
                <h3>销售额</h3>
                <span>{{ overview.orderTotalPrice }}</span>
              </div>
            </div>
          </el-col>
          <el-col :md="6">
            <div class="one">
              <i class="el-icon-s-order"></i>
              <div class="info">
                <h3>支付订单数</h3>
                <span>{{ overview.orderTotal }}</span>
              </div>
            </div>
          </el-col>
          <el-col :md="6">
            <div class="one">
              <i class="el-icon-s-custom"></i>
              <div class="info">
                <h3>新增会员数</h3>
                <span>{{ overview.newUserTotal }}</span>
              </div>
            </div>
          </el-col>
          <el-col :md="6">
            <div class="one">
              <i class="el-icon-user-solid"></i>
              <div class="info">
                <h3>付款会员数</h3>
                <span>{{ overview.consumeUserTotal }}</span>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <div class="app">
        <el-row :gutter="20">
          <el-col :md="6">
            <div class="two te">
              <h3>商品总数量</h3>
              <span>{{ statistics.goodsTotal }}</span>
            </div>
          </el-col>
          <el-col :md="6">
            <div class="two">
              <h3>会员总人数</h3>
              <span>{{ statistics.userTotal }}</span>
            </div>
          </el-col>
          <el-col :md="6">
            <div class="two">
              <h3>付款订单总量</h3>
              <span>{{ statistics.orderTotal }}</span>
            </div>
          </el-col>
          <el-col :md="6">
            <div class="two">
              <h3>消费总人数</h3>
              <span>{{ statistics.consumeUserTotal }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-card class="app" shadow="never">
        <el-row>
          <el-col :md="6">
            <div class="two te">
              <h3>待发货订单</h3>
              <span>{{ pending.deliverOrderTotal }}</span>
            </div>
          </el-col>
          <el-col :md="6">
            <div class="two">
              <h3>售后单</h3>
              <span>{{ pending.refundTotal }}</span>
            </div>
          </el-col>
          <el-col :md="6">
            <div class="two">
              <h3>待付款订单</h3>
              <span>{{ pending.paidOrderTotal }}</span>
            </div>
          </el-col>
          <el-col :md="6">
            <div class="two">
              <h3>已售罄商品</h3>
              <span>{{ pending.soldoutGoodsTotal }}</span>
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="app" shadow="never">
        <div ref="chart" class="chart"></div>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { mapGetters } from "vuex";
import debounce from "lodash/debounce";
import { getData } from "@/api/home";

export default {
  name: "Dashboard",
  computed: mapGetters(["sidebar"]),
  data() {
    return {
      overview: {
        orderTotalPrice: 0,
        orderTotal: 0,
        newUserTotal: 0,
        consumeUserTotal: 0,
      },
      pending: {
        deliverOrderTotal: 0,
        refundTotal: 0,
        paidOrderTotal: 0,
        soldoutGoodsTotal: 0,
      },
      statistics: {
        goodsTotal: 0,
        userTotal: 0,
        orderTotal: 0,
        consumeUserTotal: 0,
      },
      loading: true,
    };
  },
  mounted() {
    this.getHomeData();
  },
  methods: {
    getHomeData() {
      getData().then((response) => {
        const data = response.data.data;

        this.overview = {
          orderTotalPrice: data.overview.orderTotalPrice.tday,
          orderTotal: data.overview.orderTotal.tday,
          newUserTotal: data.overview.newUserTotal.tday,
          consumeUserTotal: data.overview.consumeUserTotal.tday,
        };

        this.statistics = {
          goodsTotal: data.statistics.goodsTotal,
          userTotal: data.statistics.userTotal,
          orderTotal: data.statistics.orderTotal,
          consumeUserTotal: data.statistics.consumeUserTotal,
        };

        this.pending = {
          deliverOrderTotal: data.pending.deliverOrderTotal,
          refundTotal: data.pending.refundTotal,
          paidOrderTotal: data.pending.paidOrderTotal,
          soldoutGoodsTotal: data.pending.soldoutGoodsTotal,
        };

        this.$nextTick(() => {
          this.initChart(response.data.data.tradeTrend);
        });
      });
    },
    initChart({ date, orderTotal, orderTotalPrice }) {
      this.chart = echarts.init(this.$refs.chart);
      this.chart.setOption({
        xAxis: {
          data: date,
          boundaryGap: false,
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          axisTick: {
            show: false,
          },
        },
        grid: {
          left: 50,
          right: 50,
          bottom: 50,
          top: 50,
          containLabel: false,
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
          padding: [5, 10],
        },
        legend: {
          data: ["成交量", "成交额"],
        },
        series: [
          {
            name: "成交量",
            data: orderTotal,
            type: "line",
            smooth: true,
            animationDuration: 2800,
            animationEasing: "cubicInOut",
          },
          {
            name: "成交额",
            data: orderTotalPrice,
            type: "line",
            smooth: true,
            animationDuration: 2800,
            animationEasing: "quadraticOut",
          },
        ],
      });
      setTimeout(() => {
        this.loading = false;
        this.resizeChart = debounce(() => {
          this.chart.resize({
            animation: {
              duration: 100,
              easing: "linear",
            },
          });
        }, 200);
        window.addEventListener("resize", this.resizeChart);
      }, 200);
    },
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeChart);
    this.chart.dispose();
  },
  watch: {
    sidebar: {
      handler() {
        this.resizeChart();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  background-color: #f0f2f5;

  .one {
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      font-size: 50px;
    }
    .info {
      margin-left: 20px;
      h3 {
        margin: 0;
        margin-bottom: 5px;
        font-weight: normal;
        font-size: 16px;
      }
      span {
        font-size: 18px;
      }
    }

    background-color: #fff;
    transition: all 0.3s;

    @media screen and (max-width: 992px) {
      margin-top: 20px;
    }
  }

  .two {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 0;
    h3 {
      font-weight: normal;
      font-size: 16px;
    }
    span {
      font-size: 18px;
    }
    @media screen and (max-width: 992px) {
      margin-top: 20px;
    }
  }
  .te {
    margin-top: 0px;
    i {
      margin-left: -30px;
    }
  }

  .chart {
    width: 100%;
    height: 350px;
  }
}
</style>
