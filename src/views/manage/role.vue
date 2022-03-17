<template>
  <div class="app-container">
    <el-scrollbar style="height: 100%">
      <el-card class="app">
        <div slot="header">
          <el-button
            @click="showAddForm"
            v-action:add
            type="primary"
            icon="el-icon-plus"
            size="small"
          >
            新增
          </el-button>
        </div>
        <el-table row-key="role_id" :data="roleList" v-loading="loading">
          <el-table-column prop="role_id" label="角色ID" />
          <el-table-column prop="role_name" label="角色名称" />
          <el-table-column prop="sort" label="排序" />
          <el-table-column prop="create_time" label="添加时间" />
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                v-action:edit
                @click="showEdit(row)"
                type="text"
                size="small"
              >
                编辑
              </el-button>
              <el-button
                v-action:delete
                @click="handleDelete(row.role_id)"
                type="text"
                size="small"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-scrollbar>
    <role-list-dialog
      ref="dialog"
      :title="title"
      :visible.sync="visible"
      :item="item"
      :menu-list="menuList"
      :role-list="roleList"
      :commit="handleCommit"
      @close="handleClose"
      @refresh="_roleList"
    />
  </div>
</template>

<script>
import * as Api from "@/api/manage";
import RoleListDialog from "@/components/RoleListDialog/index.vue";

export default {
  name: "ManageRole",
  data() {
    return {
      roleList: [],
      loading: false,
      // 编辑框相关
      menuList: [],
      title: "",
      visible: false,
      roleId: "",
      item: {
        menus: [],
        parent_id: null,
        role_name: "",
        sort: 100,
      },
    };
  },
  created() {
    this._menuList();
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
    async _menuList() {
      try {
        const { data } = await Api.menuList();
        this.menuList = data.list;
      } catch (error) {}
    },
    showAddForm() {
      this.title = "新增角色";
      this.visible = true;
    },
    showEdit({ menuIds, parent_id, role_name, sort, role_id }) {
      this.item.menus = menuIds;
      this.item.parent_id = parent_id;
      this.item.role_name = role_name;
      this.item.sort = sort;

      this.roleId = role_id;
      this.title = "编辑角色";
      this.visible = true;

      this.$refs.dialog.initTreeData();
    },
    handleCommit() {
      return new Promise((resolve, reject) => {
        if (this.item.parent_id === null) {
          this.item.parent_id = 0;
        }
        if (this.title === "新增角色") {
          Api.addRole({ form: this.item }).then(resolve).catch(reject);
        } else {
          Api.editRole({ roleId: this.roleId, form: this.item })
            .then(resolve)
            .catch(reject);
        }
      });
    },
    handleClose() {
      this.item = {
        menus: [],
        parent_id: null,
        role_name: "",
        sort: 100,
      };
      this.roleId = "";
      this.title = "";
    },
    async handleDelete(roleId) {
      try {
        await this.$confirm("您确定要删除该记录吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const { message } = await Api.deleteRole({ roleId });
        this.$message({
          message,
          type: "success",
        });
        await this._roleList();
      } catch (error) {}
    },
  },
  components: {
    RoleListDialog,
  },
};
</script>

<style lang="scss" scoped></style>
