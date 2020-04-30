<template>
  <scroll-view 
    scroll-y
    enable-flex
    class="video-main"
    @scrolltolower="onScrollToLower"
  >
   <view class="video-item"
    v-for="item in videowp"
    :key="item.id"
    @click="onToVideo(item)"
   >
   <image :src="item.img" mode="widthFix" />
   </view> 
  </scroll-view>
</template>

<script>
export default {
  props:{
    urlObj:Object
  },
  data() {
    return {
      videowp: [],
      hasMore:true
    }
  },
  // 子组件因为共一个父组件，mounted钩子函数只加载一次，所以要添加watch监听数据变化
  watch:{
    urlObj(){
      // console.log("参数发生变化");
      // console.log(this.urlObj);
      // 监听页面urlObj变化时发送请求
      // 点击tab切换时做数组清空，不作清空，切换时数据没有变化
      this.videowp=[]
      this.getList()
    }
  },

  mounted(){
    // console.log(this.urlObj);
    this.getList()
  },

  methods: {
    getList() {
      this.request({
        url:this.urlObj.url,
        data:this.urlObj.params
      })
      .then(result=>{
        // console.log(result);
        if(result.data.res.videowp.length===0){
          this.hasMore=false
          uni.showToast({
            title:'没有更多数据了',
            icon:'none'
          })
          return
        }
        this.videowp =[...this.videowp,...result.data.res.videowp] 
      })
    },
// 到底加载下一页数据
    onScrollToLower(){
      if(this.hasMore){
        this.urlObj.params.skip +=  this.urlObj.params.limit
        this.getList()
      }else{
        uni.showToast({
          title:'没有更多数据了',
          icon:'none'
        })
      }
    },
    // 点击图片跳转
    onToVideo(item){
      // 将数据保存到全局
      getApp().globalData.video=item
      // 
      uni.navigateTo({
        url:"/pages/videoPlay/index"
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.video-main{
  display: flex;
  flex-wrap: wrap;
  height: calc(100vh - 72rpx);
  .video-item{
    width: 33.33%;
    border: 5rpx solid #fff;
  }
}
</style>