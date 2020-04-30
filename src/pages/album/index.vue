<template>
  <view>
    <!-- 专辑背景 开始 -->
    <view class="album-bg">
      <image mode="widthFix" :src="album.cover" />
      <view class="album-info">
        <view class="album-name">{{ album.name }}</view>
        <view class="album-btn">关注专辑</view>
      </view>
    </view>
    <!-- 专辑背景 结束 -->

    <!-- 专辑作者 开始 -->
    <view class="album-author">
      <view class="album-author-info">
        <image mode="widthFix" :src="album.user.avatar" />
        <view class="author-name">{{ album.user.name }}</view>
      </view>
      <view class="album-author-desc">
        <text>{{ album.desc }}</text>
      </view>
    </view>
    <!-- 专辑作者 结束 -->

    <!-- 列表 开始 -->
    <view class="album-list">
      <view class="album-item" v-for="(item, index) in wallpaper" :key="item.id">
        <go-detail :list="wallpaper" :index="index">
          <image
            mode="aspectFill"
            :src="item.thumb + item.rule.replace('$<Height>', 360)"
          />
        </go-detail>
      </view>
    </view>
    <!-- 列表 结束 -->
  </view>
</template>

<script>
import goDetail from "@/components/goDetail";
export default {
  // fuck,不注册组件的话也不报错，垃圾查了好久
  components:{
    goDetail
  },
  data() {
    return {
      params: {
        limit: 30,
        order: "new",
        skip: 0,
        // 1 返回值中 有album对象， 表示第一次请求数据
        // 0 返回值中，只有wallpaper数组， 不是第一次请求数据
        first: 1,
      },
      id: -1,
      album: {},
      wallpaper: [],
      hasMore: true,
    };
  },
  onLoad(options) {
    console.log(options);
    this.id = options.id
    // this.id = "5d5f8e45e7bce75ae7fb8278";
    this.getList();
  },
  // 页面触底  上拉加载下一页事件，与scroll-view不同的是，此方法是全屏(没有其他组件)情况下下拉加载
  onReachBottom() {
    if (this.hasMore) {
      this.params.first = 0;
      this.params.skip += this.params.limit;
      this.getList();
    } else {
      uni.showToast({
        title: "没有更多数据了",
        icon: "none",
      });
    }
  },
  methods: {
    getList() {
      this.request({
        url: `http://157.122.54.189:9088/image/v1/wallpaper/album/${this.id}/wallpaper`,
        data: this.params,
      }).then((result) => {
        console.log(result);

        if (Object.keys(this.album).length === 0) {
          this.album = result.data.res.album;
        }

        if (result.data.res.wallpaper.length === 0) {
          this.hasMore = false;
          uni.showToast({
            title: "没有更多数据了",
            icon: "none",
          });
          return;
        }
        this.wallpaper = [...this.wallpaper, ...result.data.res.wallpaper];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.album-bg {
  position: relative;
  image {
  }

  .album-info {
    position: absolute;
    width: 100%;
    height: 80rpx;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    padding: 0 15rpx;
    .album-name {
      font-size: 40rpx;
    }

    .album-btn {
      background-color: $color;
      width: 152rpx;
      height: 60rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10rpx;
    }
  }
}
// 专辑作者
.album-author {
  padding: 10rpx 0;
  .album-author-info {
    padding: 10rpx 0;
    display: flex;
    image {
      width: 50rpx;
    }

    .author-name {
      color: #000;
      margin-left: 15rpx;
    }
  }

  .album-author-desc {
  }
}

// 列表开始
.album-list {
  display: flex;
  flex-wrap: wrap;
  .album-item {
    width: 33.33%;
    border: 3rpx solid #fff;
    image {
      height: 160rpx;
    }
  }
}
</style>
