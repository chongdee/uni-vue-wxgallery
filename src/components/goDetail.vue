<template>
  <view @click="onClick">
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    list:Array,
    index: Number
  },
  methods: {
    onClick() {
      // 缓存数据
      getApp().globalData.imgList=this.list;
      getApp().globalData.imgIndex=this.index
      // 实现点击跳转
      uni.navigateTo({
        url:'/pages/imgDetail/index'
      })

    }
  },

}
</script>

<style>

</style>