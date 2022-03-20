<template>
  <div class="phone">
    <!-- 顶部导航栏 -->
    <div
      class="phone-top"
      :class="{
        selected: 'page' === selectedIndex,
        [data.page.style.titleTextColor]: true,
      }"
      :style="{ backgroundColor: data.page.style.titleBackgroundColor }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "Phone",
  props: {
    data: Object,
    selectedIndex: String,
  },
};
</script>

<style lang="scss" scoped>
.phone {
  width: 375px;
  height: 667px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  .phone-top {
    position: relative;
    cursor: move;
    height: 66px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    &.black {
      background-image: url("~@/assets/phone-top-black.png");
    }

    &.white {
      background-image: url("~@/assets/phone-top-white.png");
    }
    &.selected::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border: 2px dashed #00a0e9;
    }
    &.selected:hover::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border: 2px dashed #00a0e9;
    }
  }
}
</style>
