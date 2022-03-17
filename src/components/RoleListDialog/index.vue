<template>
  <el-dialog
    width="720px"
    :title="title"
    :visible="visible"
    :show-close="false"
    @close="handleClose"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      label-width="196px"
      :model="item"
      :rules="rules"
      ref="form"
      size="small"
      v-loading="loading"
    >
      <el-form-item label="角色姓名" prop="role_name">
        <el-input v-model="item.role_name" />
      </el-form-item>
      <el-form-item label="上级角色">
        <el-cascader
          popper-class="popper"
          :options="roleList"
          :props="props"
          v-model="item.parent_id"
          placeholder=""
          clearable
          :show-all-levels="false"
        />
      </el-form-item>
      <el-form-item label="菜单权限">
        <el-tree
          ref="tree"
          :data="menuList"
          node-key="menu_id"
          :props="treeProps"
          show-checkbox
          :check-strictly="strictly"
          @check-change="checkChange"
        />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number
          v-model="item.sort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "RoleListDialog",
  props: {
    title: String,
    visible: Boolean,
    item: Object,
    commit: Function,
    menuList: Array,
    roleList: Array,
  },
  data() {
    return {
      props: {
        label: "role_name",
        value: "role_id",
        checkStrictly: true,
        emitPath: false,
      },
      treeProps: {
        label: "name",
      },
      loading: false,
      strictly: false,
      rules: {
        role_name: [
          {
            required: true,
            min: 2,
            message: "请输入至少2个字符",
            trigger: "blur",
          },
        ],
        sort: [
          { required: true, message: "请输入至少1个数字", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    handleCancel() {
      this.$emit("update:visible", false);
    },
    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.commit()
            .then(({ message }) => {
              this.$message({
                message,
                type: "success",
              });
              this.loading = false;
              this.$emit("update:visible", false);
              this.$emit("refresh");
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    handleClose() {
      this.$refs.tree.setCheckedKeys([]);
      this.$refs.form.resetFields();
      this.$emit("close");
    },
    checkChange() {
      this.item.menus = this.$refs.tree
        .getCheckedNodes(false, true)
        .map((item) => item.menu_id);
    },
    initTreeData() {
      this.strictly = true;
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(this.item.menus);
        this.strictly = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-input,
.el-cascader {
  width: 364px;
}
</style>
