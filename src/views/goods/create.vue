<template>
  <div class="app-container">
    <el-scrollbar style="height: 100%">
      <el-card class="app">
        <el-form
          label-width="196px"
          :model="item"
          :rules="rules"
          ref="form"
          size="small"
          v-loading="loading"
        >
          <el-tabs v-model="active">
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="item.goods_name" />
              </el-form-item>
              <el-form-item label="商品分类" prop="categoryIds">
                <el-cascader
                  popper-class="popper2"
                  v-model="item.categoryIds"
                  :options="categoryList"
                  :props="props"
                  placeholder=""
                  :show-all-levels="false"
                  clearable
                />
              </el-form-item>
              <el-form-item label="商品图片" prop="imagesIds">
                <el-upload
                  :action="action"
                  :headers="{ 'Access-Token': token }"
                  :data="{ groupId: -1 }"
                  name="iFile"
                  accept="image/*"
                  list-type="picture-card"
                  :limit="10"
                  :on-success="uploadSuccess"
                  :on-remove="handleRemoveImage"
                  :before-upload="handleBeforeUpload"
                >
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip">建议尺寸: 750*750像素, 最多上传10张</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="商品编码">
                <el-input v-model="item.goods_no" />
              </el-form-item>
              <el-form-item label="运费模板" prop="delivery_id">
                <el-select v-model="item.delivery_id">
                  <el-option
                    v-for="item in deliveryList"
                    :key="item.delivery_id"
                    :label="item.name"
                    :value="item.delivery_id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="商品状态" prop="status">
                <el-radio-group v-model="item.status">
                  <el-radio :label="10">上架</el-radio>
                  <el-radio :label="20">下架</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="排序" prop="sort">
                <el-input-number
                  v-model="item.sort"
                  controls-position="right"
                  :min="0"
                />
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="规格库存" name="1">
              <el-form-item label="规格类型" prop="spec_type">
                <el-radio-group v-model="item.spec_type">
                  <el-radio :label="10">单规格</el-radio>
                  <el-radio :label="20">多规格</el-radio>
                </el-radio-group>
              </el-form-item>
              <!-- 单规格 -->
              <template v-if="item.spec_type === 10">
                <el-form-item label="商品价格" prop="goods_price">
                  <el-input-number
                    v-model="item.goods_price"
                    controls-position="right"
                    :precision="2"
                    :step="0.01"
                    :min="0.01"
                  />
                  <span class="suffix">元</span>
                </el-form-item>
                <el-form-item label="划线价">
                  <el-input-number
                    v-model="item.line_price"
                    controls-position="right"
                    :precision="2"
                    :step="0.01"
                    :min="0"
                  />
                  <span class="suffix">元</span>
                </el-form-item>
                <el-form-item label="当前库存数量" prop="stock_num">
                  <el-input-number
                    v-model="item.stock_num"
                    controls-position="right"
                    :precision="0"
                    :min="0"
                  />
                  <span class="suffix">件</span>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                  <el-input-number
                    v-model="item.goods_weight"
                    controls-position="right"
                    :min="0"
                  />
                  <span class="suffix">千克</span>
                </el-form-item>
              </template>
              <!-- 多规格 -->
              <template v-else>
                <el-form-item label="商品规格">
                  <el-button @click="addSpecItem" plain icon="el-icon-plus"
                    >添加规格组</el-button
                  >
                  <span class="suffix"
                    >最多添加3个商品规格组,生成的SKU数量不能超出50个</span
                  >
                  <!-- 规格列表 start -->
                  <div
                    class="spec-item"
                    v-for="(specItem, index) in item.specData.specList"
                    :key="specItem.key"
                  >
                    <div class="top">
                      <el-input
                        v-model="specItem.spec_name"
                        placeholder="请输入规格名称"
                      />
                      <el-button type="text" @click="deleteSpecItem(index)"
                        >删除规格组</el-button
                      >
                    </div>
                    <div class="bottom">
                      <div
                        class="input-box"
                        v-for="(val, idx) in specItem.valueList"
                        :key="val.key"
                      >
                        <el-input
                          v-model="val.spec_value"
                          placeholder="请输入规格值"
                          v-focus
                        />
                        <i
                          class="el-icon-error"
                          @click="
                            deleteSpecItamVal(specItem.valueList, idx, index)
                          "
                        ></i>
                      </div>
                      <el-button
                        @click="
                          addSpecItamVal(
                            index,
                            specItem.key,
                            specItem.valueList
                          )
                        "
                        type="text"
                        >新增规格值</el-button
                      >
                    </div>
                  </div>
                  <!-- 规格列表 end -->
                </el-form-item>
                <el-form-item label="SKU列表" v-show="tableData.length">
                  <el-table
                    :data="tableData"
                    border
                    stripe
                    :span-method="objectSpanMethod"
                  >
                    <el-table-column
                      v-for="{ key, spec_name, attrName } in tableHead"
                      :key="key"
                      :label="spec_name"
                      :prop="attrName"
                      align="center"
                    />
                    <el-table-column label="预览图" align="center">
                      <template slot-scope="{ row }">
                        <el-upload
                          class="sku-upload"
                          :action="action"
                          :headers="{ 'Access-Token': token }"
                          :data="{ groupId: -1 }"
                          name="iFile"
                          accept="image/*"
                          list-type="picture-card"
                          :limit="1"
                          :on-success="
                            function () {
                              uploadSuccessSKU(row, ...arguments);
                            }
                          "
                          :on-remove="
                            function () {
                              handleRemoveImageSKU(row);
                            }
                          "
                          :before-upload="handleBeforeUpload"
                        >
                          <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                      </template>
                    </el-table-column>
                    <el-table-column label="商品价格" align="center">
                      <template slot-scope="{ row }">
                        <el-input-number
                          v-model="row.goods_price"
                          controls-position="right"
                          :min="0.01"
                          :precision="2"
                          :step="0.01"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column label="划线价格" align="center">
                      <template slot-scope="{ row }">
                        <el-input-number
                          v-model="row.line_price"
                          controls-position="right"
                          :min="0.01"
                          :precision="2"
                          :step="0.01"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column label="库存数量" align="center">
                      <template slot-scope="{ row }">
                        <el-input-number
                          v-model="row.stock_num"
                          controls-position="right"
                          :precision="0"
                          :min="0"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column label="商品重量 (KG)" align="center">
                      <template slot-scope="{ row }">
                        <el-input-number
                          v-model="row.goods_weight"
                          controls-position="right"
                          :min="0"
                        />
                      </template>
                    </el-table-column>
                    <el-table-column label="SKU编码" align="center">
                      <template slot-scope="{ row }">
                        <el-input
                          style="width: auto"
                          v-model="row.goods_sku_no"
                        />
                      </template>
                    </el-table-column>
                  </el-table>
                </el-form-item>
              </template>
              <el-form-item label="库存计算方式" prop="deduct_stock_type">
                <el-radio-group v-model="item.deduct_stock_type">
                  <el-radio :label="10">下单减库存</el-radio>
                  <el-radio :label="20">付款减库存</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="商品详情" name="2">
              <el-form-item label="商品详情" prop="content">
                <editor
                  api-key="tliupoiax18eh94bmtn1onf82b6cwes3ygkpj0x2ivvrfk4i"
                  :init="{
                    height: 500,
                    language: 'zh_CN',
                    plugins: 'image',
                    images_upload_handler,
                  }"
                  v-model="item.content"
                />
              </el-form-item>
            </el-tab-pane>

            <el-tab-pane label="更多设置" name="3">
              <el-form-item label="主图视频">
                <div v-if="videoUrl" class="video">
                  <video :src="videoUrl" controls muted autoplay></video>
                  <i class="el-icon-error" @click="removeMovie"></i>
                </div>
                <el-upload
                  v-else
                  :action="videoUploadUrl"
                  :headers="{ 'Access-Token': token }"
                  :data="{ groupId: -1 }"
                  name="iFile"
                  accept="video/*"
                  list-type="picture-card"
                  :limit="1"
                  :on-success="_uploadSuccess"
                  :before-upload="_handleBeforeUpload"
                >
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip">建议视频宽高比19:9,建议时长8-45秒</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="视频封面">
                <el-upload
                  :action="action"
                  :headers="{ 'Access-Token': token }"
                  :data="{ groupId: -1 }"
                  name="iFile"
                  accept="image/*"
                  list-type="picture-card"
                  :limit="1"
                  :on-success="__onSuccess"
                  :on-remove="__onRemove"
                  :before-upload="handleBeforeUpload"
                >
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <div slot="tip">建议尺寸: 750像素*750像素</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="商品卖点">
                <el-input v-model="item.selling_point" />
              </el-form-item>
              <el-form-item label="服务与承诺">
                <el-select v-model="item.serviceIds" multiple placeholder="">
                  <el-option
                    v-for="item in serviceList"
                    :key="item.service_id"
                    :label="item.name"
                    :value="item.service_id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="初始销量" prop="sales_initial">
                <el-input-number
                  v-model="item.sales_initial"
                  controls-position="right"
                  :precision="0"
                  :min="0"
                />
                <span class="suffix">件</span>
              </el-form-item>
              <el-divider>积分设置</el-divider>
              <el-form-item label="积分赠送" prop="is_points_gift">
                <el-radio-group v-model="item.is_points_gift">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="积分抵扣" prop="is_points_discount">
                <el-radio-group v-model="item.is_points_discount">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-divider>会员折扣设置</el-divider>
              <el-form-item label="会员折扣" prop="is_enable_grade">
                <el-radio-group v-model="item.is_enable_grade">
                  <el-radio :label="1">开启</el-radio>
                  <el-radio :label="0">关闭</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="会员折扣设置"
                prop="is_alone_grade"
                v-if="item.is_enable_grade"
              >
                <el-radio-group v-model="item.is_alone_grade">
                  <el-radio :label="0">默认等级折扣</el-radio>
                  <el-radio :label="1">单独设置折扣</el-radio>
                </el-radio-group>
                <div v-if="item.is_alone_grade">
                  <div v-for="grade in gradeList" :key="grade.grade_id">
                    <span>{{ grade.name }}</span>
                    <el-input-number
                      style="margin: 20px 20px 0 20px"
                      controls-position="right"
                      :precision="2"
                      :min="0"
                      v-model="
                        item.alone_grade_equity[`grade_id:${grade.grade_id}`]
                      "
                    />
                    <span>折</span>
                  </div>
                </div>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
          <el-form-item>
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import * as Api from "@/api/goods";
import { mapGetters } from "vuex";

import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/plugins/image";
import "tinymce/themes/silver/theme";
import "tinymce/icons/default";
import "tinymce/skins/ui/oxide/skin.css";

export default {
  name: "GoodsCreate",
  directives: {
    focus: {
      inserted: function (el) {
        el.children[0].focus();
      },
    },
  },
  computed: {
    ...mapGetters(["token"]),
    action() {
      return `${process.env.VUE_APP_BASE_API}/upload/image`;
    },
    videoUploadUrl() {
      return `${process.env.VUE_APP_BASE_API}/upload/video`;
    },
    tableData() {
      const specList = this.item.specData.specList;
      return specList.reduce((pre, cur, idx) => {
        const res = [];
        if (pre.length) {
          pre.forEach((p) => {
            cur.valueList.forEach((c, i) => {
              res.push({
                ...p,
                // image_id: 0,
                // goods_price: undefined,
                // line_price: undefined,
                // stock_num: undefined,
                // goods_weight: undefined,
                // goods_sku_no: undefined,
                skuKey: `${p.skuKey}_${i}`,
                skuKeys: [
                  ...p.skuKeys,
                  {
                    groupKey: c.groupKey,
                    valueKey: c.key,
                  },
                ],
                [`spec_value_${p.skuKeys.length}`]: c.spec_value,
              });
            });
          });
        } else {
          if (idx === 0) {
            cur.valueList.forEach((c, i) => {
              res.push({
                image_id: 0,
                goods_price: undefined,
                line_price: undefined,
                stock_num: undefined,
                goods_weight: undefined,
                goods_sku_no: undefined,
                skuKey: `${i}`,
                skuKeys: [
                  {
                    groupKey: c.groupKey,
                    valueKey: c.key,
                  },
                ],
                spec_value_0: c.spec_value,
              });
            });
          }
        }
        return res;
      }, []);
    },
    tableHead() {
      return this.item.specData.specList.map(({ key, spec_name }, index) => ({
        key,
        spec_name,
        attrName: `spec_value_${index}`,
      }));
    },
  },
  data() {
    return {
      videoUrl: "",
      active: "0",
      item: {
        goods_name: "",
        categoryIds: [],
        imagesIds: [],
        goods_no: undefined, // 为空时则删除此项
        delivery_id: "",
        status: 10,
        sort: 100,
        spec_type: 10,
        // 单规格 start
        goods_price: 1,
        line_price: undefined, // 为空时则删除此项
        stock_num: 100,
        goods_weight: 0,
        // 单规格 end
        // 多规格 start
        specData: {
          skuList: [],
          specList: [],
        },
        // 多规格 end
        deduct_stock_type: 10,
        content: "",
        video_id: undefined, // 为空时则删除此项
        video_cover_id: undefined, // 为空时则删除此项
        selling_point: undefined, // 为空时则删除此项
        serviceIds: [],
        sales_initial: 0,
        is_points_gift: 1,
        is_points_discount: 1,
        is_enable_grade: 1,
        is_alone_grade: 0, // 关闭会员折扣删除此项
        alone_grade_equity: {}, // 关闭会员折扣删除此项
      },
      rules: {
        goods_name: [
          {
            required: true,
            min: 2,
            message: "请输入至少2个字符",
            trigger: "blur",
          },
        ],
        categoryIds: [
          {
            required: true,
            message: "请至少选择1个商品分类",
            trigger: "blur",
          },
        ],
        imagesIds: [
          {
            required: true,
            message: "请至少上传1张商品图片",
            trigger: "blur",
          },
        ],
        delivery_id: [
          {
            required: true,
            message: "请选择运费模板",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择商品状态",
            trigger: "blur",
          },
        ],
        sort: [
          { required: true, message: "请输入至少1个数字", trigger: "blur" },
        ],
        spec_type: [
          {
            required: true,
            message: "请选择规格类型",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        stock_num: [
          {
            required: true,
            message: "请输入库存数量",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
        ],
        deduct_stock_type: [
          {
            required: true,
            message: "请选择库存计算方式",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "商品详情不能为空",
            trigger: "blur",
          },
        ],
        sales_initial: [
          {
            required: true,
            message: "请输入初始销量数量",
            trigger: "blur",
          },
        ],
        is_points_gift: [
          {
            required: true,
          },
        ],
        is_points_discount: [
          {
            required: true,
          },
        ],
        is_enable_grade: [
          {
            required: true,
          },
        ],
        is_alone_grade: [
          {
            required: true,
          },
        ],
      },
      loading: false,
      categoryList: [],
      props: {
        checkStrictly: true,
        value: "category_id",
        label: "name",
        emitPath: false,
        multiple: true,
      },
      deliveryList: [],
      specItemKey: 0,
      specItemValKey: [],
      serviceList: [],
      gradeList: [],
    };
  },
  created() {
    tinymce.init({});
  },
  mounted() {
    this.getCategoryList();
    this.getDeliveryList();
    this.getServiceList();
    this.getGradeList();
  },
  methods: {
    async getCategoryList() {
      const { data } = await Api.categoryList();
      this.categoryList = data.list;
    },
    async getDeliveryList() {
      const { data } = await Api.deliveryList();
      this.deliveryList = data.list;
    },
    async getServiceList() {
      const { data } = await Api.serviceList();
      this.serviceList = data.list;
      this.item.serviceIds = this.serviceList
        .filter((item) => item.is_default)
        .map((item) => item.service_id);
    },
    async getGradeList() {
      const { data } = await Api.gradeList({ status: 1 });
      this.gradeList = data.list;
      for (let i = 0; i < data.list.length; i++) {
        const element = data.list[i];
        this.$set(
          this.item.alone_grade_equity,
          `grade_id:${element.grade_id}`,
          element.equity.discount
        );
      }
    },
    uploadSuccess({ data, message }) {
      this.$message.success(message);
      const { file_id } = data.fileInfo;
      this.item.imagesIds.push(file_id);
    },
    handleRemoveImage({ response }) {
      const { file_id } = response.data.fileInfo;
      this.item.imagesIds = this.item.imagesIds.filter(
        (item) => item !== file_id
      );
    },
    uploadSuccessSKU(row, { data, message }) {
      this.$message.success(message);
      const { file_id } = data.fileInfo;
      row.image_id = file_id;
    },
    handleRemoveImageSKU(row) {
      row.image_id = 0;
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
    _uploadSuccess({ data, message }) {
      this.$message.success(message);
      const { file_id, external_url } = data.fileInfo;
      this.item.video_id = file_id;
      this.videoUrl = external_url;
    },
    removeMovie() {
      this.item.video_id = undefined;
      this.videoUrl = "";
    },
    _handleBeforeUpload(file) {
      const isJPG = file.type.startsWith("video");
      const isLt2M = file.size / 1024 / 1024 < 100;
      if (!isJPG) {
        this.$message.error("上传视频格式错误");
      }
      if (!isLt2M) {
        this.$message.error("上传视频大小不能超过 100MB");
      }
      return isJPG && isLt2M;
    },
    __onSuccess({ data, message }) {
      this.$message.success(message);
      const { file_id } = data.fileInfo;
      this.item.video_cover_id = file_id;
    },
    __onRemove() {
      this.item.video_cover_id = undefined;
    },
    addSpecItem() {
      const specList = this.item.specData.specList;
      if (specList.length >= 3) {
        this.$message.warning("最多添加三条");
        return;
      }
      // 创建 item
      const item = {
        key: this.specItemKey,
        spec_name: "",
        valueList: [],
      };
      this.specItemKey += 1;
      this.specItemValKey.push(0);
      specList.push(item);
      this.$message.success("添加成功");
    },
    deleteSpecItem(index) {
      const specList = this.item.specData.specList;
      specList.splice(index, 1);
      this.specItemValKey.splice(index, 1);
      if (specList.length === 0) {
        this.specItemKey = 0;
      }
      this.$message.success("删除成功");
    },
    addSpecItamVal(index, groupKey, list) {
      let key = this.specItemValKey[index];
      const o = {
        key,
        groupKey,
        spec_value: "",
      };
      key += 1;
      this.specItemValKey.splice(index, 1, key);
      list.push(o);
      this.$message.success("新增成功");
    },
    deleteSpecItamVal(list, idx, index) {
      list.splice(idx, 1);
      if (list.length === 0) {
        this.specItemValKey.splice(index, 1, 0);
      }
      this.$message.success("删除成功");
    },
    submitForm() {
      this.$refs.form.validate((v) => {
        if (v) {
          const good = cloneDeep(this.item);
          if (good.goods_no === undefined) {
            delete good.goods_no;
          }
          if (good.line_price === undefined) {
            delete good.line_price;
          }
          if (good.spec_type === 10) {
            delete good.specData;
          } else {
            good.specData.skuList = this.tableData;
          }
          if (good.video_id === undefined) {
            delete good.video_id;
          }
          if (good.video_cover_id === undefined) {
            delete good.video_cover_id;
          }
          if (good.selling_point === undefined) {
            delete good.selling_point;
          }
          if (good.is_enable_grade === 0) {
            if (good.is_alone_grade === undefined) {
              delete good.is_alone_grade;
            }
            if (good.alone_grade_equity === undefined) {
              delete good.alone_grade_equity;
            }
          } else {
            if (good.is_alone_grade === 0) {
              if (good.alone_grade_equity === undefined) {
                delete good.alone_grade_equity;
              }
            }
          }
          this.loading = true;
          Api.addGood({ form: good })
            .then(({ message }) => {
              this.loading = false;
              this.$message.success(message);
              this.$router.push("/goods/list");
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      const specList = this.item.specData.specList;
      if (columnIndex < specList.length - 1) {
        const len = specList[columnIndex + 1].valueList.length;
        if (rowIndex % len === 0) {
          return {
            rowspan: len,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      } else {
        return { rowspan: 1, colspan: 1 };
      }
    },
    images_upload_handler(blobInfo, success, failure, progress) {
      var xhr, formData;

      xhr = new XMLHttpRequest();
      xhr.withCredentials = false;
      xhr.open("POST", this.action);

      xhr.upload.onprogress = function (e) {
        progress((e.loaded / e.total) * 100);
      };

      xhr.onload = function () {
        var json;

        if (xhr.status === 403) {
          failure("HTTP Error: " + xhr.status, {
            remove: true,
          });
          return;
        }

        if (xhr.status < 200 || xhr.status >= 300) {
          failure("HTTP Error: " + xhr.status);
          return;
        }

        json = JSON.parse(xhr.responseText);
        success(json.data.fileInfo.preview_url);
      };

      xhr.onerror = function () {
        failure(
          "Image upload failed due to a XHR Transport error. Code: " +
            xhr.status
        );
      };

      formData = new FormData();
      formData.append("iFile", blobInfo.blob(), blobInfo.filename());
      formData.append("groupId", -1);
      xhr.setRequestHeader("Access-Token", this.token);
      xhr.send(formData);
    },
  },
  components: { Editor },
};
</script>

<style lang="scss">
.popper2 {
  width: 500px;
}
.sku-upload {
  display: inline-block;
  width: 50px;
  height: 50px;
  overflow: hidden;
  .el-upload {
    width: 50px;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    .el-icon-plus {
      font-size: 16px;
    }
  }
  .el-upload-list__item {
    width: 50px;
    height: 50px;
  }
}
.el-upload {
  .el-icon-plus {
    line-height: inherit;
  }
}
</style>

<style lang="scss" scoped>
.el-input,
.el-cascader,
.el-select {
  width: 500px;
}
.suffix {
  color: rgba(0, 0, 0, 0.5);
  margin-left: 20px;
}
.spec-item {
  margin-top: 20px;
  .top {
    display: flex;
    justify-content: space-between;
    background-color: #f4f5f9;
    padding: 10px 20px;
    .el-input {
      width: 180px;
    }
  }
  .bottom {
    padding: 10px 40px;
    background-color: #fbfbfb;
    .input-box {
      position: relative;
      display: inline-block;
      .el-input {
        width: 180px;
        margin: 10px;
      }
      i {
        display: none;
        font-size: 20px;
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
      }
      &:hover {
        i {
          display: block;
        }
      }
    }
    .el-button {
      margin-left: 10px;
    }
  }
}

.video {
  width: 500px;
  video {
    width: 100%;
  }
  position: relative;
  &:hover .el-icon-error {
    display: block;
  }
  .el-icon-error {
    display: none;
    position: absolute;
    cursor: pointer;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 50px;
  }
}
</style>
