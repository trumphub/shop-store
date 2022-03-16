<template>
  <div class="app-container">
    <el-card>
      <div slot="header">
        <el-button type="primary" icon="el-icon-plus" size="small">
          新增
        </el-button>
      </div>
      <el-table :data="roleList" v-loading="loading">
        <el-table-column prop="role_id" label="角色ID" />
        <el-table-column prop="role_name" label="角色名称" />
        <el-table-column prop="sort" label="排序" />
        <el-table-column prop="create_time" label="添加时间" />
        <el-table-column label="操作">
          <template>
            <el-button type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import * as Api from "@/api/manage";
export default {
  name: "ManageRole",
  data() {
    return {
      roleList: [],
      loading: false,
    };
  },
  mounted() {
    this._roleList();
  },
  methods: {
    async _roleList() {
      try {
        this.loading = true;
        const { data } = await Api.roleList();
        this.roleList = data.list;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
