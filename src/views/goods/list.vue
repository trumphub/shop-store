<template>
  <div class="app-container">
    <el-scrollbar style="height: 100%">
      <el-card class="app">
        <div slot="header">
          <el-row>
            <el-form :inline="true" :model="searchParams" size="small">
              <el-form-item label="商品名称">
                <el-input v-model.trim="searchParams.goodsName" />
              </el-form-item>
              <el-form-item label="商品编码">
                <el-input v-model.trim="searchParams.goodsNo" />
              </el-form-item>
              <el-form-item label="商品分类">
                <el-select v-model="searchParams.categoryId" clearable>
                  <el-option
                    v-for="{ category_id, name } in categoryList"
                    :key="category_id"
                    :label="name"
                    :value="category_id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button @click="search" icon="el-icon-search" type="primary"
                  >搜索</el-button
                >
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-radio-group
              @change="search"
              v-model="searchParams.listType"
              size="small"
            >
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="on_sale">出售中</el-radio-button>
              <el-radio-button label="off_sale">已下架</el-radio-button>
              <el-radio-button label="sold_out">已售罄</el-radio-button>
            </el-radio-group>
            <el-button
              size="small"
              icon="el-icon-plus"
              type="primary"
              v-permission="createGoodsPath"
              >创建商品</el-button
            >
          </el-row>
        </div>
        <el-table :data="list.data" v-loading="loading">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            prop="goods_id"
            label="商品ID"
            width="80"
            align="center"
          />
          <el-table-column label="商品图片" align="center" width="80">
            <template slot-scope="{ row }">
              <el-image
                style="width: 50px; height: 50px"
                :src="row.goods_image"
                :preview-src-list="[row.goods_image]"
              >
              </el-image>
            </template>
          </el-table-column>
          <el-table-column prop="goods_name" label="商品名称" align="center" />
          <el-table-column
            prop="goods_price_min"
            label="商品价格"
            width="80"
            align="center"
          />
          <el-table-column
            prop="sales_actual"
            label="总销量"
            width="80"
            align="center"
          />
          <el-table-column
            prop="stock_total"
            label="库存总量"
            width="80"
            align="center"
          />
          <el-table-column label="状态" width="80" align="center">
            <template slot-scope="{ row }">
              <el-tag
                size="small"
                :type="row.status === 10 ? 'success' : 'danger'"
                >{{ row.status === 10 ? "上架" : "下架" }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="80" align="center" />
          <el-table-column
            prop="create_time"
            label="添加时间"
            width="160"
            align="center"
          />
          <el-table-column label="操作" width="160" align="center">
            <template>
              <el-button
                type="text"
                size="small"
                v-permission="updateGoodsPath"
              >
                编辑
              </el-button>
              <el-button type="text" size="small" v-action:delete>
                删除
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
import * as Api from "@/api/goods";

export default {
  name: "GoodsList",
  data() {
    return {
      createGoodsPath: "/goods/create",
      updateGoodsPath: "/goods/update",
      searchParams: {
        goodsName: "",
        goodsNo: "",
        categoryId: "",
        listType: "all",
        page: 1,
      },
      categoryList: [],
      loading: false,
      list: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 1,
      },
    };
  },
  mounted() {
    this.getCategoryList();
    this.getGoodsList();
  },
  methods: {
    async getCategoryList() {
      const { data } = await Api.categoryList();
      this.categoryList = data.list;
    },
    async getGoodsList() {
      try {
        this.loading = true;
        const { data } = await Api.goodsList(this.searchParams);
        this.list = data.list;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    search() {
      this.searchParams.page = 1;
      this.getGoodsList();
    },
    handleCurrentChange(page) {
      this.searchParams.page = page;
      this.getGoodsList();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-radio-group {
  margin-right: 20px;
}
.el-pagination-wrap {
  padding-top: 20px;
  .el-pagination {
    float: right;
  }
}
</style>
