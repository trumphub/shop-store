<template>
  <div class="app-container">
    <el-scrollbar style="height: 100%">
      <el-card class="app">
        <div slot="header">
          <el-row type="flex" justify="space-between">
            <el-col :span="6">
              <el-button
                @click="showAddForm"
                type="primary"
                icon="el-icon-plus"
                size="small"
                v-action:add
              >
                新增
              </el-button>
            </el-col>
            <el-col :span="8">
              <el-input
                placeholder="请输入用户名/姓名"
                suffix-icon="el-icon-search"
                size="small"
                v-model.trim="userParams.search"
                @change="handleChange"
              >
              </el-input>
            </el-col>
          </el-row>
        </div>
        <el-table :data="userList.data" v-loading="loading">
          <el-table-column prop="store_user_id" label="管理员ID" />
          <el-table-column label="用户名">
            <template slot-scope="{ row }">
              <span>{{ row.user_name }}</span>
              <el-tag v-if="row.is_super === 1" type="success" size="small">
                超级管理员
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="real_name" label="姓名" />
          <el-table-column prop="sort" label="排序" />
          <el-table-column prop="create_time" label="添加时间" />
          <el-table-column label="操作">
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
                @click="handleDelete(row.store_user_id)"
                v-if="row.is_super !== 1"
                type="text"
                size="small"
                v-action:delete
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="el-pagination-wrap clearfix" v-if="userList.last_page > 1">
          <el-pagination
            :current-page="userList.current_page"
            :page-size="userList.per_page"
            :total="userList.total"
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </el-scrollbar>
    <manage-list-dialog
      :roleList="roleList"
      :title="title"
      :visible.sync="visible"
      :item="item"
      :is-super="isSuper"
      :commit="handleCommit"
      @close="handleClose"
      @refresh="_userList"
    />
  </div>
</template>

<script>
import * as Api from "@/api/manage";
import ManageListDialog from "@/components/ManageListDialog/index.vue";

export default {
  name: "ManageList",
  data() {
    return {
      // 角色列表
      roleList: [],
      // 管理员列表
      userList: {
        data: [],
        per_page: 0,
        total: 0,
        last_page: 0,
        current_page: 1, // 当前页
      },
      userParams: {
        page: 1,
        search: "",
      },
      loading: false,
      // 添加与编辑部分
      title: "",
      visible: false,
      userId: "",
      isSuper: 0, // 是否为管理员
      item: {
        real_name: "",
        user_name: "",
        roles: [],
        password: "",
        password_confirm: "",
        sort: 100,
      },
    };
  },
  created() {
    this._roleList();
  },
  mounted() {
    this._userList();
  },
  methods: {
    async _userList() {
      try {
        this.loading = true;
        const { data } = await Api.userList(this.userParams);
        this.userList = data.list;
        this.loading = false;
      } catch (error) {
        this.loading = false;
      }
    },
    handleCurrentChange(page) {
      this.userParams.page = page;
      this._userList();
    },
    handleChange() {
      this.userParams.page = 1;
      this._userList();
    },
    async handleDelete(userId) {
      try {
        await this.$confirm("您确定要删除该记录吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const { message } = await Api.deleteUser({ userId });
        this.$message({
          message,
          type: "success",
        });
        const { last_page, current_page, data } = this.userList;
        if (last_page === current_page && data.length === 1) {
          this.userParams.page -= 1;
        }
        await this._userList();
      } catch (error) {}
    },
    async _roleList() {
      try {
        const { data } = await Api.roleList();
        this.roleList = data.list;
      } catch (error) {}
    },
    showAddForm() {
      this.title = "新增管理员";
      this.visible = true;
    },
    showEdit({ real_name, user_name, roleIds, sort, is_super, store_user_id }) {
      this.item.real_name = real_name;
      this.item.user_name = user_name;
      this.item.roles = roleIds;
      this.item.sort = sort;

      this.isSuper = is_super;
      this.userId = store_user_id;
      this.title = "编辑管理员";
      this.visible = true;
    },
    handleCommit() {
      return new Promise((resolve, reject) => {
        if (this.title === "新增管理员") {
          Api.addUser({ form: this.item }).then(resolve).catch(reject);
        } else {
          const form = {};
          for (const key in this.item) {
            if (Object.hasOwnProperty.call(this.item, key)) {
              const val = this.item[key];
              val && (form[key] = val);
            }
          }
          Api.editUser({ userId: this.userId, form })
            .then(resolve)
            .catch(reject);
        }
      });
    },
    handleClose() {
      this.item = {
        real_name: "",
        user_name: "",
        roles: [],
        password: "",
        password_confirm: "",
        sort: 100,
      };
      this.userId = "";
      this.isSuper = 0;
      this.title = "";
    },
  },
  components: { ManageListDialog },
};
</script>

<style lang="scss" scoped>
.el-pagination-wrap {
  padding-top: 20px;
  .el-pagination {
    float: right;
  }
}
.el-tag {
  margin-left: 10px;
}
</style>
