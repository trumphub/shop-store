<template>
  <div class="componentlib">
    <el-collapse>
      <el-collapse-item
        v-for="{ name, key, data } in list"
        :title="name"
        :key="key"
      >
        <ul class="list">
          <li
            @click="handleClickItem(item.type)"
            v-for="item in data"
            :key="item.icon"
          >
            <svg-icon className="icon" :iconClass="item.icon" />
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "ComponentLib",
  data() {
    return {
      list: [
        {
          name: "媒体组件",
          key: "media",
          data: [
            {
              name: "轮播图",
              type: "banner",
              icon: "banner",
            },
            {
              name: "图片",
              type: "image",
              icon: "image",
            },
            {
              name: "图片橱窗",
              type: "window",
              icon: "window",
            },
            {
              name: "视频",
              type: "video",
              icon: "video",
            },
            {
              name: "文章",
              type: "article",
              icon: "article",
            },
          ],
        },
        {
          name: "商城组件",
          key: "store",
          data: [
            {
              name: "搜索框",
              type: "search",
              icon: "search",
            },
            {
              name: "店铺公告",
              type: "notice",
              icon: "notice",
            },
            {
              name: "导航",
              type: "navBar",
              icon: "navBar",
            },
            {
              name: "商品",
              type: "goods",
              icon: "goods2",
            },
            {
              name: "在线客服",
              type: "service",
              icon: "service",
            },
          ],
        },
        {
          name: "其他组件",
          key: "other",
          data: [
            {
              name: "富文本",
              type: "richText",
              icon: "richText",
            },
            {
              name: "辅助空白",
              type: "blank",
              icon: "blank",
            },
            {
              name: "辅助线",
              type: "guide",
              icon: "guide",
            },
          ],
        },
      ],
    };
  },
  methods: {
    handleClickItem(type) {
      this.$emit("handleClickItem", type);
    },
  },
};
</script>

<style lang="scss" scoped>
.componentlib {
  width: 280px;
  padding: 0 20px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  .list {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    list-style-type: none;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      width: 80px;
      height: 80px;
      color: #9797a1;
      cursor: pointer;
      .icon {
        font-size: 30px;
      }
      &:hover {
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
