<template>
  <view>
    <view class="category-tab">
      <view class="category-tab-title">
        <view class="title inner">
          <uni-segmented-control
            :current="current"
            :values="items.map((v) => v.title)"
            @clickItem="onClickItem"
            style-type="text"
            active-color="#d4237a"
          ></uni-segmented-control>
        </view>
        <view class="iconfont iconsearch"></view>
      </view>
      <!-- 调试器报警告'enable-flex属性 使flexbox布局生效 -->
      <scroll-view @scrolltolower="onScrollToLower" enable-flex scroll-y class="category-tab-content">
        <view class="cate-item"
          v-for="item in vertical"
          :key="item.id"
        >
          <image :src="item.thumb" mode="widthFix" />
        </view>
      </scroll-view> 
    </view>
  </view>
</template>

<script>
import { uniSegmentedControl } from "@dcloudio/uni-ui";
export default {
  components: {
    uniSegmentedControl
  },
  data() {
    return {
      items: [
        {
          title: "最新",
          order:"new"
        },
        {
          title: "热门",
          order:"hot"
        }
      ],
      current: 0,
      params:{
        limit:30,
        skip:0,
        order:"new"
      },
      id:0,
      // 页面数据
      vertical:[],
      hasMore:true
    };
  },
  methods: {
    onLoad(options){
      this.id = options.id
      this.getList()

    },
    /*
    1. 点击tab切换内容
    2. 切换order
    */ 

    onClickItem(e) {
      // 判断点击是否是同一个tab
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }else{
        return
      }
      this.params.order= this.items[e.currentIndex].order
      // 切换热门时候 重置skip
      this.params.skip=0
      this.vertical=[]
      this.getList()
    },

    // 获取数据
    getList(){
      this.request({
        url:`http://157.122.54.189:9088/image/v1/vertical/category/${this.id}/vertical`,
        data:this.params
      })
      .then(result=>{
        // console.log(result);
        if(result.data.res.vertical.length===0){
          this.hasMore=false;
          uni.showToast({
            title:'没有更多数据了',
            icon:'none'
          })
          return
        }
        this.vertical = [...this.vertical,...result.data.res.vertical]
      })
    },

    // 滚动到底部获取下一页数据
    onScrollToLower(){
      if(this.hasMore){
        this.params.skip+=this.params.limit
        this.getList()

      }else{
        uni.showToast({
          titile:'没有更多数据了',
          icon:'none'
        })
      }
    }
  },
};
</script>

<style lang="scss">
.category-tab {
  .category-tab-title {
    position: relative;
    .title.inner {
      width: 60%;
      margin: 0 auto;
    }

    .iconsearch {
      position: absolute;
      top: 50%;
      right: 5%;
      transform: translateY(-50%);
    }
  }

  .category-tab-content {
    // 调试器报警告'enable-flex属性 使flexbox布局生效'
    display: flex;
    flex-wrap: wrap;
    height: calc(100vh - 72rpx);
    .cate-item{
      width: 33.33%;
      border: 5rpx solid #fff;
      image{

      }
    }
  }
}
</style>
