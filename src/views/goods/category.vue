<template>
  <div class="app-container">
    <el-scrollbar style="height: 100%">
      <el-card class="app">
        <div slot="header">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            v-action:add
            @click="showAddForm"
          >
            新增
          </el-button>
        </div>
        <el-table :data="list" v-loading="loading" row-key="category_id">
          <el-table-column prop="category_id" label="分类ID" />
          <el-table-column prop="name" label="分类名称" />
          <el-table-column label="状态">
            <template slot-scope="{ row }">
              <el-tag :type="row.status ? 'success' : 'info'" size="small">{{
                row.status ? "显示" : "隐藏"
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" />
          <el-table-column prop="create_time" label="添加时间" />
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                @click="showEdit(row)"
                type="text"
                size="small"
                v-action:edit
              >
                编辑
              </el-button>
              <el-button
                @click="handleDelete(row)"
                type="text"
                size="small"
                v-action:delete
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-scrollbar>
    <CategoryDialog
      @refresh="refresh"
      @close="close"
      :commit="commit"
      :title="title"
      :visible.sync="visible"
      :item="item"
      :options="list"
      :image="image"
    />
  </div>
</template>

<script>
import * as Api from "@/api/goods";
import CategoryDialog from "@/components/CategoryDialog";

export default {
  name: "GoodsCategory",
  data() {
    return {
      list: [],
      loading: false,
      visible: false,
      title: "",
      item: {
        name: "",
        parent_id: null, //顶级分类 为空时设置为零
        sort: 100,
        status: 1,
        image_id: undefined, // 为空时删除此项
      },
      categoryId: "",
      image: null,
    };
  },
  mounted() {
    this.getCategoryList();
  },
  methods: {
    showAddForm() {
      this.title = "新增商品分类";
      this.visible = true;
    },
    showEdit({ category_id, name, parent_id, sort, status, image_id, image }) {
      this.item = {
        name,
        parent_id,
        sort,
        status,
        image_id,
      };
      this.image = image;
      this.categoryId = category_id;
      this.title = "编辑商品分类";
      this.visible = true;
    },
    async handleDelete({ category_id }) {
      try {
        await this.$confirm("您确定要删除该记录吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const { message } = await Api.deleteCategory({
          categoryId: category_id,
        });
        this.$message({
          message,
          type: "success",
        });
        await this.getCategoryList();
      } catch (error) {}
    },
    async getCategoryList() {
      this.loading = true;
      const { data } = await Api.categoryList();
      this.list = data.list;
      this.loading = false;
    },
    commit() {
      return new Promise((resolve, reject) => {
        // parent_id: null, //顶级分类 为空时设置为零
        if (this.item.parent_id === null) {
          this.item.parent_id = 0;
        }
        if (this.title === "新增商品分类") {
          //  image_id: undefined, // 为空时删除此项
          if (this.item.image_id === undefined) {
            delete this.item.image_id;
          }
          Api.addCategory({ form: this.item }).then(resolve, reject);
        } else {
          if (this.item.image_id === undefined) {
            this.item.image_id = 0;
          }
          Api.editCategory({
            categoryId: this.categoryId,
            form: this.item,
          }).then(resolve, reject);
        }
      });
    },
    close() {
      this.title = "";
      this.categoryId = "";
      this.image = null;
      this.item = {
        name: "",
        parent_id: null, //顶级分类 为空时设置为零
        sort: 100,
        status: 1,
        image_id: undefined, // 为空时删除此项
      };
    },
    refresh() {
      this.getCategoryList();
    },
  },
  components: { CategoryDialog },
};
</script>

<style lang="scss" scoped></style>
