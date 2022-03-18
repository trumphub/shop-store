<template>
  <div class="app-container">
    <el-scrollbar style="height: 100%">
      <el-card class="app">
        <div slot="header">
          <el-row>
            <el-col :span="5">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                v-action:add
                @click="showAddForm"
              >
                新增
              </el-button>
            </el-col>
            <el-col :span="11" :offset="8">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-select
                    v-model="searchParam.type"
                    placeholder="请选择地址类型"
                    size="small"
                    @change="handleChange"
                  >
                    <el-option label="全部" :value="0" />
                    <el-option label="发货地址" :value="10" />
                    <el-option label="退货地址" :value="20" />
                  </el-select>
                </el-col>
                <el-col :span="16">
                  <el-input
                    placeholder="请输入姓名/联系电话"
                    suffix-icon="el-icon-search"
                    size="small"
                    v-model.trim="searchParam.search"
                    @keyup.native.enter="handleChange"
                  />
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <el-table :data="list.data" v-loading="loading">
          <el-table-column prop="address_id" label="地址ID" />
          <el-table-column prop="name" label="联系人姓名" />
          <el-table-column prop="phone" label="联系电话" />
          <el-table-column prop="full_address" label="详细地址" />
          <el-table-column label="地址类型">
            <template slot-scope="{ row }">
              <el-tag effect="plain" size="small">{{ type[row.type] }}</el-tag>
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
                @click="handleDelete(row.address_id)"
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
    <AddressDialog
      @refresh="_addressList"
      @close="handleClose"
      :commit="handleCommit"
      :title="title"
      :visible.sync="visible"
      :item="item"
      :region-tree="regionTree"
    />
  </div>
</template>

<script>
import * as Api from "@/api/store";
import AddressDialog from "@/components/AddressDialog/index.vue";

export default {
  name: "StoreAddress",
  data() {
    return {
      type: {
        10: "发货地址",
        20: "退货地址",
      },
      searchParam: {
        type: 0,
        search: "",
        page: 1, // 页码
      },
      loading: false,
      list: {
        current_page: 1,
        data: [],
        last_page: 1,
        per_page: 15,
        total: 1, // 总记录
      },
      // 新增与编辑相关
      title: "",
      visible: false,
      item: {
        cascader: [], // 地区
        detail: "", // 详址
        name: "", // 姓名
        phone: "", // 电话
        sort: 100, // 排序
        type: 10, // 类型
      },
      regionTree: [],
      addressId: "",
    };
  },
  mounted() {
    this._addressList();
  },
  methods: {
    async _addressList() {
      try {
        this.loading = true;
        const { data } = await Api.addressList(this.searchParam);
        this.loading = false;
        this.list = data.list;
      } catch (error) {
        this.loading = false;
      }
    },
    handleCurrentChange(page) {
      this.searchParam.page = page;
      this._addressList();
    },
    handleChange() {
      this.searchParam.page = 1;
      this._addressList();
    },
    async showAddForm() {
      if (!this.regionTree.length) {
        await this.getRegionTree();
      }
      this.title = "新增地址";
      this.visible = true;
    },
    async showEdit({ cascader, detail, name, phone, sort, type, address_id }) {
      if (!this.regionTree.length) {
        await this.getRegionTree();
      }
      this.item = {
        cascader, // 地区
        detail, // 详址
        name, // 姓名
        phone, // 电话
        sort, // 排序
        type, // 类型
      };
      this.addressId = address_id;
      this.title = "编辑地址";
      this.visible = true;
    },
    handleCommit() {
      return new Promise((resolve, reject) => {
        if (this.title === "新增地址") {
          Api.addAddress({ form: this.item }).then(resolve, reject);
        } else {
          Api.editAddress({ addressId: this.addressId, form: this.item }).then(
            resolve,
            reject
          );
        }
      });
    },
    async handleDelete(addressId) {
      try {
        await this.$confirm("您确定要删除该记录吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        const { message } = await Api.deleteAddress({ addressId });
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
        await this._addressList();
      } catch (error) {}
    },
    handleClose() {
      this.item = {
        cascader: [], // 地区
        detail: "", // 详址
        name: "", // 姓名
        phone: "", // 电话
        sort: 100, // 排序
        type: 10, // 类型
      };
      this.title = "";
      this.addressId = "";
    },
    async getRegionTree() {
      try {
        const { data } = await Api.regionTree();
        this.regionTree = this.generationTree(data.list);
      } catch (error) {}
    },
    generationTree(srcObj) {
      const target = [];
      for (const key in srcObj) {
        if (Object.hasOwnProperty.call(srcObj, key)) {
          const { id, name, city, region } = srcObj[key];
          const o = { value: id, label: name };
          if (city) {
            o.children = this.generationTree(city);
          }
          if (region) {
            o.children = this.generationTree(region);
          }
          target.push(o);
        }
      }
      return target;
    },
  },
  components: { AddressDialog },
};
</script>

<style lang="scss" scoped>
.el-pagination-wrap {
  padding-top: 20px;
  .el-pagination {
    float: right;
  }
}
</style>
