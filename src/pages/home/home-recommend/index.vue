<template>
  <scroll-view
    @scrolltolower="onToLower"
    class="recommends-scroll"
    scroll-y
    v-if="recommends.length > 0"
  >
    <!-- 推荐 开始 -->
    <view class="recommend-box">
      <navigator class="recommend-item" v-for="item in recommends" :key="item.id" :url="`/pages/album/index?id=${item.target}`" >
        <image mode="widthFix" :src="item.thumb"></image>
      </navigator>
    </view>
    <!-- 推荐 结束 -->

    <!-- 月份 开始 -->
    <view class="months-box">
      <view class="months-title-box">
        <view class="months-title-info">
          <view class="months-info">
            <text>{{ months.DD }}/</text>
            {{ months.MM }}月
          </view>
          <view class="months-text">{{ months.title }}</view>
        </view>
        <view class="months-title-more">更多 ></view>
      </view>
      <view class="months-content">
        <view class="months-item" v-for="(item, index) in months.items" :key="item.id">
          <go-detail :list="months.items" :index="index">
            <image
              mode="aspectFill"
              :src="item.thumb + item.rule.replace('$<Height>', 360)"
            />
          </go-detail>
        </view>
      </view>
    </view>
    <!-- 月份 结束 -->

    <!-- 热门 开始-->
    <view class="hots-box">
      <view class="hots-title">
        <text>热门</text>
      </view>
      <view class="hots-content">
        <view class="hot-item" v-for="(item, index) in hots" :key="item.id">
          <go-detail :list="hots" :index="index">
            <image mode="widthFix" :src="item.thumb" />
          </go-detail>
        </view>
      </view>
    </view>
    <!-- 热门 结束-->
  </scroll-view>
</template>

<script>
import moment from "moment";
import goDetail from "@/components/goDetail";
export default {
  components:{
    goDetail
  },
  data() {
    return {
      recommends: [],
      months: {},
      hots: [],
      params: {
        limit: 30,
        order: "hot",
        skip: 0,
      },
      // 是否还有下一页
      hasMore: true,
    };
  },
  mounted() {
    // 修改页面的标题
    uni.setNavigationBarTitle({
      title: "推荐",
    });

    this.getList();
  },
  methods: {
    onToLower() {
      // 1 修改请求参数skip
      // 2 重新发送请求
      // 3 host 数据做拼接 getList()里面的hots数据做拼接
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
    // 获取数据
    getList() {
      this.request({
        url: "http://157.122.54.189:9088/image/v3/homepage/vertical",
        data: this.params,
      }).then((result) => {
        // console.log(result);
        // 判断还有没有下一页
        if (result.data.res.vertical.length === 0) {
          this.hasMore = false;
          uni.showToast({
            title: "没有数据了",
            icon: "none",
          });
          return;
        }
        // 条件判断做第一次请求
        if (this.recommends.length === 0) {
          // 推荐模块
          this.recommends = result.data.res.homepage[1].items;
          // 月份
          this.months = result.data.res.homepage[2];
          // 将时间戳转为 18 号 1月 moment.js
          this.months.MM = moment(this.months.stime).format("MM");
          this.months.DD = moment(this.months.stime).format("DD");
          // console.log(this.months);
        }

        // 获取热门数据列表
        this.hots = [...this.hots, ...result.data.res.vertical];
        console.log(this.hots);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.recommends-scroll {
  // 高度： 屏幕高度 - 头部tab标题的高度
  height: calc(100vh - 72rpx);
}
// 推荐
.recommend-box {
  display: flex;
  flex-wrap: wrap;
  .recommend-item {
    width: 50%;
    border: 3rpx solid #fff;
  }
}
// 月份
.months-box {
  .months-title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    .months-title-info {
      color: $color;
      font-size: 30rpx;
      font-weight: 600;
      display: flex;
      .months-info {
        text {
          font-size: 36rpx;
        }
      }

      .months-text {
        font-size: 32rpx;
        color: #666;
        margin-left: 30rpx;
      }
    }

    .months-title-more {
      font-size: 26rpx;
      color: $color;
    }
  }

  .months-content {
    display: flex;
    flex-wrap: wrap;
    .months-item {
      width: 33.33%;
      border: 3rpx solid #fff;
    }
  }
}

// 热门
.hots-box {
  .hots-title {
    padding: 20rpx;
    text {
      border-left: 10rpx solid $color;
      padding-left: 20rpx;
      font-size: 30rpx;
      font-weight: 600;
    }
  }

  .hots-content {
    display: flex;
    flex-wrap: wrap;

    .hot-item {
      width: 33.33%;
      border: 3rpx solid #fff;
      image {
      }
    }
  }
}
</style>
