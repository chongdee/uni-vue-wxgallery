<template>
  <scroll-view
    class="album-scroll-view"
    scroll-y
    @scrolltolower="onScrollToLower"
  >
    <!-- 轮播图 开始 -->
    <view class="album-swiper">
      <swiper autoplay indicator-dots indicator-active-color="#d4237a" circular>
        <swiper-item v-for="item in banner" :key="item.id">
          <image :src="item.thumb" />
        </swiper-item>
      </swiper>
    </view>
    <!-- 轮播图 结束 -->

    <!-- 列表 开始 -->
    <view class="album-list">
      <navigator
        :url="`/pages/album/index?id=${item.id}`"
        class="album-item"
        v-for="item in album"
        :key="item.id"
      >
        <view class="album-img">
          <image :src="item.cover" mode="aspectFill" />
        </view>
        <view class="album-info">
          <view class="album-name">{{ item.name }}</view>
          <view class="album-desc">{{ item.desc }}</view>
          <view class="album-btn">
            <view class="album-follow">+ 关注</view>
          </view>
        </view>
      </navigator>
    </view>
    <!-- 列表 结束 -->
  </scroll-view>
</template>

<script>

export default {
  data() {
    return {
      params: {
        limit: 30,
        order: "new",
        skip: 0,
      },
      // 轮播图
      banner: [],
      album: [],
      hasMore: true,
    };
  },
  mounted() {
    // 修改页面的标题
    uni.setNavigationBarTitle({
      title: "专辑",
    });

    this.getList();
  },
  methods: {
    getList() {
      this.request({
        url: "http://157.122.54.189:9088/image/v1/wallpaper/album",
        data: this.params,
      }).then((result) => {
        console.log(result);

        if (this.banner.length === 0) {
          this.banner = result.data.res.banner;
        }

        if (result.data.res.album.length === 0) {
          this.hasMore = false;
          uni.showToast({
            title: "没有数据了",
            icon: "none",
          });
          return;
        }

        this.album = [...this.album, ...result.data.res.album];
      });
    },

    onScrollToLower() {
      if (this.hasMore) {
        this.params.skip += this.params.limit;
        this.getList();
      } else {
        uni.showToast({
          title: "没有数据了",
          icon: "none",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.album-scroll-view {
  height: calc(100vh - 72rpx);
}
// 轮播图
.album-swiper {
  swiper {
    // 高度计算 原图宽高比例
    height: calc(750rpx / 2.3);
    image {
      height: 100%;
    }
  }
}

// 列表
.album-list {
  padding: 10rpx;
  .album-item {
    padding: 10rpx 0;
    display: flex;
    border-bottom: 1rpx solid #ccc;
    .album-img {
      flex: 1;
      padding: 10rpx;
      image {
        width: 200rpx;
        height: 200rpx;
      }
    }

    .album-info {
      flex: 2;
      padding: 0 10rpx;
      overflow: hidden;
      .album-name {
        font-size: 30rpx;
        color: #000;
        padding: 10rpx 0;
      }

      .album-desc {
        padding: 10rpx 0;
        font-size: 24rpx;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .album-btn {
        padding: 10px;
        display: flex;
        justify-content: flex-end;
        .album-follow {
          color: $color;
          border: 1rpx solid $color;
          padding: 10rpx;
        }
      }
    }
  }
}
</style>
