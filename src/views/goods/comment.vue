<template>
  <div class="app-container">
    <el-scrollbar style="height: 100%">
      <el-card class="app">
        <div slot="header">
          <el-row>
            <el-form :inline="true" size="small" :model="searchParam">
              <el-form-item label="商品名称">
                <el-input v-model="searchParam.goodsName" />
              </el-form-item>
              <el-form-item label="订单号">
                <el-input v-model="searchParam.orderNo" />
              </el-form-item>
              <el-form-item label="会员ID">
                <el-input v-model="searchParam.userId" />
              </el-form-item>
              <el-form-item label="状态">
                <el-select v-model="searchParam.status">
                  <el-option label="全部" :value="-1"></el-option>
                  <el-option label="显示" :value="1"></el-option>
                  <el-option label="隐藏" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="search"
                  >搜索</el-button
                >
              </el-form-item>
            </el-form>
          </el-row>
          <el-row>
            <el-radio-group
              @change="search"
              v-model="searchParam.score"
              size="small"
            >
              <el-radio-button :label="0">全部</el-radio-button>
              <el-radio-button :label="10">好评</el-radio-button>
              <el-radio-button :label="20">中评</el-radio-button>
              <el-radio-button :label="30">差评</el-radio-button>
            </el-radio-group>
          </el-row>
        </div>
        <el-table :data="list.data" v-loading="loading">
          <el-table-column prop="comment_id" label="ID" width="80" />
          <el-table-column label="商品信息">
            <template slot-scope="{ row }">
              <div class="goods-info">
                <img class="goods-img" :src="row.orderGoods.goods_image" />
                <div class="goods-desc">
                  <span class="goods-title">{{
                    row.orderGoods.goods_name
                  }}</span>
                  <span class="goods-props" v-if="row.orderGoods.goods_props">
                    <i
                      v-for="(item, index) in row.orderGoods.goods_props"
                      :key="index"
                    >
                      {{ item.value.name }}
                    </i>
                  </span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="买家" width="100" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.user.nick_name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="评分" width="80" align="center">
            <template slot-scope="{ row }">
              <span>{{ scores[row.score] }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="content" label="评价内容" />
          <el-table-column label="图片评价" width="80" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.is_picture ? "是" : "否" }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.status ? "显示" : "隐藏" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" width="80" align="center" />
          <el-table-column
            prop="create_time"
            label="评价时间"
            width="150"
            align="center"
          />
          <el-table-column label="操作" width="100" align="center">
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
        <div class="el-pagination-wrap clearfix" v-if="list.last_page > 1">
          <el-pagination
            :current-page="list.current_page"
            :page-size="list.per_page"
            :total="list.total"
            background
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </el-scrollbar>
    <CommentDialog
      @refresh="refresh"
      @close="close"
      :commit="commit"
      title="编辑评价"
      :visible.sync="visible"
      :item="item"
      :imageList="imageList"
    />
  </div>
</template>

<script>
import * as Api from "@/api/goods";
import CommentDialog from "@/components/CommentDialog";

export default {
  name: "GoodsComment",
  data() {
    return {
      scores: { 10: "好评", 20: "中评", 30: "差评" },
      searchParam: {
        page: 1,
        score: 0, // 评价指标 0 10 20 30
        goodsName: "", //商品名称
        orderNo: "", // 订单号
        userId: "", // 会员 ID
        status: -1, // 状态 -1 1 0
      },
      loading: false,
      list: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 1, // 总记录
      },
      item: {
        score: 10,
        content: "",
        imageIds: [],
        status: 1,
        sort: 100,
      },
      visible: false,
      commentId: "",
      imageList: [],
    };
  },
  mounted() {
    this.getCommentList();
  },
  methods: {
    handleCurrentChange(page) {
      this.searchParam.page = page;
      this.getCommentList();
    },
    search() {
      this.searchParam.page = 1;
      this.getCommentList();
    },
    async getCommentList() {
      this.loading = true;
      const { data } = await Api.getCommentList(this.searchParam);
      this.list = data.list;
      this.loading = false;
    },
    async showEdit({ comment_id }) {
      const { data } = await Api.getComment({ commentId: comment_id });
      this.imageList = data.detail.imageList.map(
        ({ file_id, file_name, external_url }) => ({
          file_id,
          name: file_name,
          url: external_url,
        })
      );
      this.item = {
        score: data.detail.score,
        content: data.detail.content,
        imageIds: data.detail.imageIds,
        status: data.detail.status,
        sort: data.detail.sort,
      };
      this.visible = true;
      this.commentId = comment_id;
    },
    commit() {
      return new Promise((resolve, reject) => {
        Api.updateComment({ commentId: this.commentId, form: this.item }).then(
          resolve,
          reject
        );
      });
    },
    close() {
      this.commentId = "";
      this.imageList = [];
      this.item = {
        score: 10,
        content: "",
        imageIds: [],
        status: 1,
        sort: 100,
      };
    },
    refresh() {
      this.getCommentList();
    },
    async handleDelete({ comment_id: commentId }) {
      try {
        await this.$confirm("您确定要删除该记录吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const { message } = await Api.deleteComment({ commentId });
        this.$message({
          message,
          type: "success",
        });
        const { last_page, current_page, data } = this.list;
        if (last_page > 1) {
          if (last_page === current_page && data.length === 1) {
            this.searchParam.page -= 1;
          }
        }
        await this.getCommentList();
      } catch (error) {}
    },
  },
  components: {
    CommentDialog,
  },
};
</script>

<style lang="scss" scoped>
.goods-info {
  display: flex;
  align-items: center;
  .goods-img {
    width: 60px;
    height: 60px;
  }
  .goods-desc {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    i {
      font-style: normal;
    }
  }
}

.el-pagination-wrap {
  padding-top: 20px;
  .el-pagination {
    float: right;
  }
}
</style>
