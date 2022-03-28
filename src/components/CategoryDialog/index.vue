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
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="item.name" />
      </el-form-item>
      <el-form-item label="上级分类">
        <el-cascader
          popper-class="popper"
          :options="options"
          :props="props"
          v-model="item.parent_id"
          placeholder=""
          clearable
          :show-all-levels="false"
        />
      </el-form-item>
      <el-form-item label="分类图片">
        <el-upload
          ref="upload"
          :action="action"
          :headers="{ 'Access-Token': token }"
          :data="{ groupId: -1 }"
          name="iFile"
          accept="image/*"
          list-type="picture-card"
          :limit="1"
          :file-list="fileList"
          :on-success="uploadSuccess"
          :on-remove="handleRemoveImage"
          :before-upload="handleBeforeUpload"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-radio-group v-model="item.status">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">隐藏</el-radio>
        </el-radio-group>
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
import { mapGetters } from "vuex";

export default {
  name: "CategoryDialog",
  computed: {
    ...mapGetters(["token"]),
    action() {
      return `${process.env.VUE_APP_BASE_API}/upload/image`;
    },
    fileList() {
      const logoImage = this.image;
      return logoImage
        ? [{ name: logoImage.file_name, url: `${logoImage.preview_url}` }]
        : undefined;
    },
  },
  props: {
    title: String,
    visible: Boolean,
    item: Object,
    commit: Function,
    options: Array,
    image: Object,
  },
  data() {
    return {
      props: {
        label: "name",
        value: "category_id",
        checkStrictly: true,
        emitPath: false,
      },
      rules: {
        sort: [
          { required: true, message: "请输入至少1个数字", trigger: "blur" },
        ],
        name: [
          {
            required: true,
            min: 2,
            message: "请输入至少2个字符",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            trigger: "blur",
          },
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
      this.$refs.upload.clearFiles();
      this.$emit("close");
    },
    handleBeforeUpload(file) {
      const isJPG = file.type.startsWith("image");
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片格式错误");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB");
      }
      return isJPG && isLt2M;
    },
    uploadSuccess({ data, message }) {
      this.$message.success(message);
      const { file_id } = data.fileInfo;
      this.item.image_id = file_id;
    },
    handleRemoveImage() {
      this.item.image_id = undefined;
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
