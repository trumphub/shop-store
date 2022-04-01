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
      <el-form-item label="评分" prop="score">
        <el-radio-group v-model="item.score">
          <el-radio :label="10">好评</el-radio>
          <el-radio :label="20">中评</el-radio>
          <el-radio :label="30">差评</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="评价内容">
        <el-input type="textarea" v-model="item.content" />
      </el-form-item>
      <el-form-item label="评价图片">
        <el-upload
          :action="action"
          :headers="{ 'Access-Token': token }"
          :data="{ groupId: -1 }"
          name="iFile"
          accept="image/*"
          list-type="picture-card"
          :limit="6"
          :file-list="imageList"
          :on-success="uploadSuccess"
          :on-remove="handleRemoveImage"
          :before-upload="handleBeforeUpload"
        >
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="状态" prop="status">
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
  computed: {
    ...mapGetters(["token"]),
    action() {
      return `${process.env.VUE_APP_BASE_API}/upload/image`;
    },
  },
  name: "CommentDialog",
  props: {
    title: String,
    visible: Boolean,
    item: Object,
    commit: Function,
    imageList: Array,
  },
  data() {
    return {
      rules: {
        score: [{ required: true }],
        status: [{ required: true }],
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
    uploadSuccess({ data, message }) {
      this.$message.success(message);
      const { file_id } = data.fileInfo;
      this.item.imageIds.push(file_id);
    },
    handleRemoveImage({ response, file_id }) {
      if (response) {
        // 删除上传的图片
        this.item.imageIds = this.item.imageIds.filter(
          (id) => id !== response.data.fileInfo.file_id
        );
      } else {
        // 删除已存在图片
        this.item.imageIds = this.item.imageIds.filter((id) => id !== file_id);
      }
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
  },
};
</script>

<style lang="scss" scoped>
.el-input,
.el-textarea {
  width: 364px;
}
</style>
