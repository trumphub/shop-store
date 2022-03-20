<template>
  <div class="app-container">
    <el-scrollbar style="height: 100%">
      <el-card class="app">
        <div class="row">
          <ComponentLib @handleClickItem="handleClickItem" />
          <Phone :data="data" v-if="data" :selectedIndex="selectedIndex" />
          <Editor />
        </div>
      </el-card>
    </el-scrollbar>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
import * as Api from "@/api/page";
import ComponentLib from "@/components/ComponentLib/index.vue";
import Phone from "@/components/Phone/index.vue";
import Editor from "@/components/Editor/index.vue";

export default {
  name: "PageCreate",
  components: { ComponentLib, Phone, Editor },
  data() {
    return {
      // 页面装修默认数据 形如 {page: {}, items: {}}
      // page 组件编辑参数
      // items 默认组件列表 {data defaultData name params style type}
      defaultData: {},
      // 当前页面数据
      data: null,
      // 当前选中的元素索引
      selectedIndex: "page",
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    handleClickItem(type) {
      const newItem = cloneDeep(this.defaultData.items[type]);
      this.data.items.push(newItem);
    },
    async init() {
      try {
        const { data } = await Api.defaultData();
        this.defaultData = data;
        this.data = { page: cloneDeep(data.page), items: [] };
      } catch (error) {}
    },
  },
};
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  justify-content: space-between;
  > div {
    flex: none;
  }
}
</style>
