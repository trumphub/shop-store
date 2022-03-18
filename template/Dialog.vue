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
// <Dialog
//       @refresh="提交表单后执行的操作"
//       @close="对话框关闭后执行的操作"
//       :commit="表单提交业务逻辑"
//       :title="对话框标题"
//       :visible="对话框可见性"
//       :item="表单数据"
//     />
export default {
  name: "Dialog",
  props: {
    title: String,
    visible: Boolean,
    item: Object,
    commit: Function,
  },
  data() {
    return {
      rules: {
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

<style lang="scss" scoped>
.el-input {
  width: 364px;
}
</style>
