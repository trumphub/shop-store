<template>
  <div class="app-container">
    <el-scrollbar style="height: 100%">
      <el-card class="app">
        <div slot="header">
          <el-row justify="space-between" type="flex">
            <el-col :span="6">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                v-action:add
                @click="showAddForm"
              >
                新增
              </el-button>
            </el-col>
            <el-col :span="8">
              <el-input
                placeholder="请输入服务名称"
                suffix-icon="el-icon-search"
                size="small"
                v-model.trim="searchParam.search"
                @keyup.native.enter="handleChange"
              />
            </el-col>
          </el-row>
        </div>
        <el-table :data="list.data" v-loading="loading">
          <el-table-column prop="name" label="服务名称" />
          <el-table-column prop="summary" label="概述" />
          <el-table-column label="是否默认" width="80" align="center">
            <template slot-scope="{ row }">
              <el-tag
                :type="row.is_default ? 'success' : 'info'"
                size="small"
                >{{ row.is_default ? "是" : "否" }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80" align="center">
            <template slot-scope="{ row }">
              <el-tag :type="row.status ? 'success' : 'info'" size="small">{{
                row.status ? "显示" : "隐藏"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sort" width="80" label="排序" align="center" />
          <el-table-column
            prop="update_time"
            label="更新时间"
            width="180"
            align="center"
          />
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="{ row }">
              <el-button
                @click="showEdit(row)"
                type="text"
                size="small"
                v-action:edit
              >
                编辑
              </el-button>
              <el-button
                @click="handleDelete(row)"
                type="text"
                size="small"
                v-action:delete
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
    <ServiceDialog
      @refresh="refresh"
      @close="close"
      :commit="commit"
      :title="title"
      :visible.sync="visible"
      :item="item"
    />
  </div>
</template>

<script>
import * as Api from "@/api/goods";
import ServiceDialog from "@/components/ServiceDialog";

export default {
  name: "GoodsService",
  data() {
    return {
      searchParam: {
        search: "",
        page: 1,
      },
      loading: false,
      list: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 1, // 总记录
      },
      item: {
        name: "",
        summary: "",
        is_default: 1,
        status: 1,
        sort: 100,
      },
      visible: false,
      title: "",
      serviceId: "",
    };
  },
  mounted() {
    this.getServiceList();
  },
  methods: {
    showAddForm() {
      this.title = "新增记录";
      this.visible = true;
    },
    handleChange() {
      this.searchParam.page = 1;
      this.getServiceList();
    },
    handleCurrentChange(page) {
      this.searchParam.page = page;
      this.getServiceList();
    },
    showEdit({ name, summary, is_default, status, sort, service_id }) {
      this.item = {
        name,
        summary,
        is_default,
        status,
        sort,
      };
      this.title = "编辑记录";
      this.visible = true;
      this.serviceId = service_id;
    },
    async commit() {
      return new Promise((resolve, reject) => {
        if (this.title === "新增记录") {
          Api.addService({ form: this.item }).then(resolve, reject);
        } else {
          Api.editService({ serviceId: this.serviceId, form: this.item }).then(
            resolve,
            reject
          );
        }
      });
    },
    close() {
      this.title = "";
      this.serviceId = "";
      this.item = {
        name: "",
        summary: "",
        is_default: 1,
        status: 1,
        sort: 100,
      };
    },
    refresh() {
      this.getServiceList();
    },
    async handleDelete({ service_id }) {
      try {
        await this.$confirm("您确定要删除该记录吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const { message } = await Api.deleteService({ serviceId: service_id });
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
        await this.getServiceList();
      } catch (error) {}
    },
    async getServiceList() {
      this.loading = true;
      const { data } = await Api.serviceListPage(this.searchParam);
      this.list = data.list;
      this.loading = false;
    },
  },
  components: { ServiceDialog },
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
