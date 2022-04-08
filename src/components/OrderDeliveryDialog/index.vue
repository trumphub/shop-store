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
      <el-form-item label="物流公司" prop="express_id">
        <el-select v-model="item.express_id">
          <el-option
            v-for="item in list"
            :key="item.express_id"
            :label="item.express_name"
            :value="item.express_id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物流单号" prop="express_no">
        <el-input v-model="item.express_no" />
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
  name: "OrderDeliveryDialog",
  props: {
    title: String,
    visible: Boolean,
    item: Object,
    commit: Function,
    list: Array,
  },
  data() {
    return {
      rules: {
        express_id: [
          { required: true, message: "请选择物流公司", trigger: "blur" },
        ],
        express_no: [
          { required: true, message: "请输入物流单号", trigger: "blur" },
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
.el-input,
.el-select {
  width: 364px;
}
</style>
