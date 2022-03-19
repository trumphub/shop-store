<template>
  <div class="app-container">
    <el-scrollbar style="height: 100%">
      <el-card class="app">
        <div slot="header">
          <el-row type="flex" justify="space-between">
            <el-col :span="6">
              <el-button
                @click="handleAdd"
                type="primary"
                icon="el-icon-plus"
                size="small"
                v-permission="createPath"
              >
                新增
              </el-button>
            </el-col>
            <el-col :span="8">
              <el-input
                placeholder="请输入页面名称"
                suffix-icon="el-icon-search"
                size="small"
                v-model.trim="searchParam.name"
                @keyup.native.enter="handleChange"
              />
            </el-col>
          </el-row>
        </div>
        <el-table :data="list.data" v-loading="loading">
          <el-table-column prop="page_id" label="页面ID" />
          <el-table-column prop="page_name" label="页面名称" />
          <el-table-column label="页面类型">
            <template slot-scope="{ row }">
              <el-tag size="small">{{ type[row.page_type] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="添加时间" />
          <el-table-column prop="update_time" label="更新时间" />
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button type="text" size="small" v-permission="updatePath"
                >编辑</el-button
              >
              <el-button
                v-if="row.page_type !== 10"
                type="text"
                size="small"
                v-action:setHome
                @click="setHome(row.page_id)"
                >设为首页</el-button
              >
              <el-button
                v-if="row.page_type !== 10"
                type="text"
                size="small"
                v-action:delete
                @click="deletePage(row.page_id)"
              >
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
import * as Api from "@/api/page";

export default {
  name: "PageIndex",
  data() {
    return {
      createPath: "/page/create",
      updatePath: "/page/update",
      type: {
        10: "首页",
        20: "自定义页",
      },
      searchParam: {
        name: "",
        page: 1,
      },
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
    this.getPageList();
  },
  methods: {
    handleAdd() {
      this.$router.push(this.createPath);
    },
    handleChange() {
      this.searchParam.page = 1;
      this.getPageList();
    },
    async getPageList() {
      try {
        this.loading = true;
        const { data } = await Api.reqPageList(this.searchParam);
        this.list = data.list;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    handleCurrentChange(page) {
      this.searchParam.page = page;
      this.getPageList();
    },
    async setHome(pageId) {
      try {
        await this.$confirm("您确定要设置为首页吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const { message } = await Api.setHome({ pageId });
        this.$message({
          message,
          type: "success",
        });
        await this.getPageList();
      } catch (error) {}
    },
    async deletePage(pageId) {
      try {
        await this.$confirm("您确定要删除该记录吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const { message } = await Api.deletePage({ pageId });
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
        await this.getPageList();
      } catch (error) {}
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
