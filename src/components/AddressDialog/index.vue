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
      <el-form-item label="地址类型" prop="type">
        <el-radio-group v-model="item.type">
          <el-radio :label="10">发货地址</el-radio>
          <el-radio :label="20">退货地址</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="联系人姓名" prop="name">
        <el-input v-model="item.name" />
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="item.phone" />
      </el-form-item>
      <el-form-item label="选择地区" prop="cascader">
        <el-cascader
          placeholder=""
          v-model="item.cascader"
          :options="regionTree"
          clearable
        />
      </el-form-item>
      <el-form-item label="详细地址" prop="detail">
        <el-input v-model="item.detail" />
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
  name: "AddressDialog",
  props: {
    title: String,
    visible: Boolean,
    item: Object,
    commit: Function,
    regionTree: Array,
  },
  data() {
    return {
      rules: {
        cascader: [
          {
            required: true,
            message: "请选择省市区",
            trigger: "blur",
          },
        ],
        detail: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
        name: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择地址类型", trigger: "blur" }],
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
.el-input,
.el-cascader {
  width: 364px;
}
</style>
