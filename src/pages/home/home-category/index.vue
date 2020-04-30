<template>
  <view class="home-category">
    <navigator class="cate-item"
      v-for="item in category"
      :key="item.id"
      :url="`/pages/imgCategory/index?id=${item.id}`"
    >
      <image mode="aspectFill" :src="item.cover" />
      <view class="cate-name">{{ item.name }}</view>
    </navigator>
   
    
  </view>
</template>

<script>
export default {
  data() {
    return {
      category: []
    }
  },
  mounted() {
    // 修改页面的标题

    uni.setNavigationBarTitle({
      title: "分类"
    });
    this.getList()
  },

  methods: {
    getList() {
      this.request({
        url: 'http://157.122.54.189:9088/image/v1/vertical/category'
      })
      .then(result=>{
        console.log(result);
        this.category = result.data.res.category
        
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.home-category {
  display: flex;
  flex-wrap: wrap;
  .cate-item {
    width: 33.33%;
    position: relative;
    border: 5rpx solid #fff;
    image {
      height: 240rpx;
    }
  }

  .cate-name {
    position: absolute;
    width: 100%;
    height: 50rpx;
    left: 0;
    bottom: 0;
    color: #fff;

    // css3渐变
    background-image: linear-gradient(to right top, rgba(0,0,0,.2),rgba(0,0,0,0));
    font-size: 40rpx;
    display: flex;
    align-items: center;
    padding-left: 20rpx;
  }
}</style>
