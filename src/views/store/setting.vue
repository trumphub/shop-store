<template>
  <div class="app-container">
    <el-scrollbar style="height: 100%">
      <el-card class="app">
        <el-form
          :model="storeInfo"
          :rules="rules"
          ref="form"
          size="small"
          label-width="100px"
          v-loading="loading"
        >
          <el-form-item label="商城名称" prop="store_name">
            <el-input v-model="storeInfo.store_name"></el-input>
          </el-form-item>
          <el-form-item label="商城简介">
            <el-input type="textarea" v-model="storeInfo.describe"></el-input>
          </el-form-item>
          <el-form-item label="商城Logo">
            <el-upload
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
              <div slot="tip">建议尺寸: 300*300</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script>
import * as Api from "@/api/store";
import { mapGetters } from "vuex";

export default {
  name: "StoreSetting",
  computed: {
    ...mapGetters(["token"]),
    fileList() {
      const logoImage = this.storeInfo.logoImage;
      return logoImage
        ? [{ name: logoImage.file_name, url: `${logoImage.preview_url}` }]
        : [];
    },
    action() {
      return `${process.env.VUE_APP_BASE_API}/upload/image`;
    },
  },
  data() {
    return {
      storeInfo: {},
      rules: {
        store_name: [
          {
            required: true,
            min: 2,
            message: "请输入至少2个字符",
            trigger: "blur",
          },
        ],
      },
      loading: false,
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    async getInfo() {
      try {
        const { data } = await Api.info();
        this.storeInfo = data.storeInfo;
      } catch (error) {}
    },
    uploadSuccess({ data, message }) {
      this.$message.success(message);
      const { file_id } = data.fileInfo;
      this.storeInfo.logo_image_id = file_id;
    },
    handleRemoveImage() {
      this.storeInfo.logo_image_id = 0;
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
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          const { store_name, describe, logo_image_id } = this.storeInfo;
          Api.update({ form: { store_name, describe, logo_image_id } })
            .then(({ message }) => {
              this.$message.success(message);
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
