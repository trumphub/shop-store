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
      <el-form-item label="管理员姓名" prop="real_name">
        <el-input v-model="item.real_name" />
      </el-form-item>
      <el-form-item label="用户名" prop="user_name">
        <el-input v-model="item.user_name" />
      </el-form-item>
      <el-form-item v-if="isSuper !== 1" label="所属角色" prop="roles">
        <el-cascader
          popper-class="popper"
          :options="roleList"
          :props="props"
          v-model="item.roles"
          placeholder=""
          clearable
        />
      </el-form-item>
      <template v-if="title === '新增管理员'">
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="item.password" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirm">
          <el-input v-model="item.password_confirm" type="password" />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item label="用户密码" prop="passwordEdit">
          <el-input v-model="item.password" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirm_edit">
          <el-input v-model="item.password_confirm" type="password" />
        </el-form-item>
      </template>
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
  name: "ManageListDialog",
  props: {
    title: String,
    visible: Boolean,
    item: Object,
    roleList: Array,
    commit: Function,
    isSuper: Number,
  },
  data() {
    return {
      props: {
        multiple: true,
        label: "role_name",
        value: "role_id",
      },
      rules: {
        real_name: [
          {
            required: true,
            min: 2,
            message: "请输入至少2个字符",
            trigger: "blur",
          },
        ],
        user_name: [
          {
            required: true,
            min: 4,
            message: "请输入至少4个字符",
            trigger: "blur",
          },
        ],
        roles: [
          {
            required: true,
            message: "请至少选择一个角色",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            min: 6,
            message: "请输入至少6个字符",
            trigger: "blur",
          },
        ],
        passwordEdit: [
          {
            validator: (rule, value, callback) => {
              if (this.item.password && this.item.password.length < 6) {
                callback(new Error("请输入至少6个字符"));
              } else {
                callback();
              }
            },
          },
        ],
        password_confirm_edit: [
          {
            validator: (rule, value, callback) => {
              if (this.item.password !== this.item.password_confirm) {
                callback(new Error("您输入的确认密码不一致"));
              } else {
                callback();
              }
            },
          },
        ],
        password_confirm: [
          { required: true, message: "请输入确认密码", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (this.item.password !== value) {
                callback(new Error("您输入的确认密码不一致"));
              } else {
                callback();
              }
            },
          },
        ],
        sort: [
          { required: true, message: "请输入至少1个数字", trigger: "blur" },
        ],
      },
      loading: false,
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
      this.$refs.form.resetFields();
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss">
.popper {
  width: 364px;
}
</style>
<style lang="scss" scoped>
.el-input,
.el-cascader {
  width: 364px;
}
</style>
