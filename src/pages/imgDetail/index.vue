<template>
  <view>
    <!-- 用户信息 开始 -->
    <view class="user-info">
      <view class="user-icon">
        <image mode="widthFix" :src="imgDetail.user.avatar" />
      </view>
      <view class="user-desc">
        <view class="user-name">
          {{ imgDetail.user.name }}
        </view>
        <view class="user-time">{{ imgDetail.cnTime }}</view>
      </view>
    </view>
    <!-- 用户信息 结束 -->

    <!-- 大图 开始 -->
    <view class="big-img">
      <swiper-action @swiperAction="onSwiperAction">
        <image mode="widthFix" :src="imgDetail.thumb" />
      </swiper-action>
    </view>
    <!-- 大图 结束 -->

    <!-- 点赞 开始 -->
    <view class="user-likes">
      <view class="likes">
        <text class="iconfont iconzansel">
          {{ imgDetail.rank }}
        </text>
      </view>
      <view class="user-fav">
        <text class="iconfont iconshoucang-chanpinxiangqing">
          收藏
        </text>
      </view>
    </view>
    <!-- 点赞 结束 -->

    <!-- 专辑 开始 -->
    <view class="album-box" v-if="album.length">
      <!-- 标题 -->
      <view class="album-title">相关</view>
      <!-- 内容 -->
      <view class="album-list-box">
        <view class="album-item" v-for="item in album" :key="item.id">
          <view class="album-cover">
            <image mode="aspectFill" :src="item.cover" />
          </view>

          <!-- 右边 -->
          <view class="album-info-box">
            <view class="album-info-text">专辑</view>
            <view class="album-name">{{ item.name }}</view>
            <text class="iconfont iconjiantouyou"></text>
          </view>
        </view>
      </view>
    </view>
    <!-- 专辑 结束 -->

    <!-- 最热评论 开始 -->
    <view class="comment hot" v-if="hot.length">
      <view class="comment-title">
        <text class="iconfont iconhot3"></text>
        <text class="comment-text">最热评论</text>
      </view>
      <view class="comment-list-box">
        <view class="comment-item" v-for="item in hot" :key="item.id">
          <!-- 用户信息 -->
          <view class="comment-user">
            <!-- 用户头像 -->
            <view class="user-icon"
              ><image mode="widthFix" :src="item.user.avatar"
            /></view>
            <!-- 用户名称 -->
            <view class="user-name">
              <view class="user-nickname">{{ item.user.name }}</view>
              <view class="user-time">{{ item.cnTime }}</view>
            </view>
            <!-- 徽章 -->
            <view class="user-badge">
              <image
                v-for="item2 in item.user.title"
                :key="item2.icon"
                :src="item2.icon"
              />
            </view>
          </view>
          <!-- 评论信息 -->
          <view class="comment-desc">
            <view class="comment-content">{{ item.content }}</view>
            <view class="comment-likes">
              <text class="iconfont iconzansel">{{ item.size }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 最热评论 结束 -->

    <!-- 最新评论 开始 -->
    <view class="comment new" v-if="comment.length">
      <view class="comment-title">
        <text class="iconfont iconpinglun"></text>
        <text class="comment-text">最新评论</text>
      </view>
      <view class="comment-list-box">
        <view class="comment-item" v-for="item in comment" :key="item.id">
          <!-- 用户信息 -->
          <view class="comment-user">
            <!-- 用户头像 -->
            <view class="user-icon"
              ><image mode="widthFix" :src="item.user.avatar"
            /></view>
            <!-- 用户名称 -->
            <view class="user-name">
              <view class="user-nickname">{{ item.user.name }}</view>
              <view class="user-time">{{ item.cnTime }}</view>
            </view>
            <!-- 徽章 -->
            <view class="user-badge">
              <image
                v-for="item2 in item.user.title"
                :key="item2.icon"
                :src="item2.icon"
              />
            </view>
          </view>
          <!-- 评论信息 -->
          <view class="comment-desc">
            <view class="comment-content">{{ item.content }}</view>
            <view class="comment-likes">
              <text class="iconfont iconzansel">{{ item.size }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 最新评论 结束 -->

    <!-- 下载图片 开始 -->
    <view class="download-box">
      <view class="donload-btn" @click="onDownload">下载图片</view>
    </view>
    <!-- 下载图片 结束 -->
  </view>
</template>

<script>
import moment from "moment";
moment.locale("zh-cn");
import swiperAction from "@/components/swiperAction";

export default {
  components: {
    swiperAction,
  },
  data() {
    return {
      imgDetail: {},
      album: [],
      hot: [],
      comment: [],

      // 图片索引
      imgIndex: 0,
    };
  },
  onLoad() {
    // console.log(getApp().globalData);
    let { imgIndex } = getApp().globalData;
    this.imgIndex = imgIndex;

    this.getData();
  },

  methods: {
    // 给当前页面赋值
    getData() {
      let { imgList } = getApp().globalData;
      this.imgDetail = imgList[this.imgIndex];

      // 相对时间处理
      this.imgDetail.cnTime = moment(this.imgDetail.atime * 1000).fromNow();

      this.getComments(this.imgDetail.id);
    },
    getComments(id) {
      this.request({
        url: `http://157.122.54.189:9088/image/v2/wallpaper/wallpaper/${id}/comment`,
      }).then((result) => {
        console.log(result);
        this.album = result.data.res.album;
        // 时间戳转换为
        result.data.res.hot.forEach(
          (v) => (v.cnTime = moment(v.atime * 1000).fromNow())
        );
        result.data.res.comment.forEach(
          (v) => (v.cnTime = moment(v.atime * 1000).fromNow())
        );

        this.hot = result.data.res.hot;
        this.comment = result.data.res.comment;
      });
    },
    //手势滑动 监听子组件传递过来的数据通过参数 e事件源对象获取 
    onSwiperAction(e) {
      // console.log(e);
      /*
      1. 用户 左滑 imgIndex ++
      2. 用户 右滑 imgIndex --
      3. 判断 数组是否越界
      4. 左滑 e.direction =='left' && this.imgIndex<imgList.length-1
      5. 右滑 e.direction =='right' && this.imgIndex>0
      */
      let { imgList } = getApp().globalData
      if (e.direction == "left" && this.imgIndex < imgList.length - 1) {
        this.imgIndex++;
        this.getData();
      } else if (e.direction == "right" && this.imgIndex > 0) {
        this.imgIndex--;
        this.getData();
      }else{
        uni.showToast({
          title:'没有数据',
          icon:'none'
        })
      }
    },
    // 下载
    async onDownload(){
      
      // uni.downloadFile({
      //   url:this.imgDetail.img
      // })
      // .then(result=>{
      //   console.log(result);
        
      // })
      await uni.showLoading({
        title: "下载中",
    
      });
      // 将远程文件下载到小程序内存中  tempFilePath
      let result1 = await uni.downloadFile({ url:this.imgDetail.img })
      let { tempFilePath } = result1[1]

      // 将小程序内存中的临时文件下载到本地
      let result2 =await uni.saveImageToPhotosAlbum({filePath:tempFilePath})
      console.log(result2, '用户下载成功');
      
      uni.hideLoading()
      await uni.showToast({
        title:'下载成功',
        icon:'none'
      })
      
    }
  },
};
</script>

<style lang="scss" scoped>
// 用户信息
.user-info {
  display: flex;
  padding: 20rpx;
  .user-icon {
    padding: 0 20rpx;
    image {
      width: 88rpx;
      border-radius: 50%;
    }
  }

  .user-desc {
    .user-name {
      color: #000;
      font-weight: normal;
    }

    .user-time {
      color: #ccc;
      font-size: 24rpx;
      padding: 10rpx 0;
    }
  }
}
// 点赞
.user-likes {
  display: flex;
  height: 80rpx;
  border-bottom: 4rpx solid #eee;
  .likes {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }

  .user-fav {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.big-img {
  border-bottom: 1rpx solid #eee;
}
// 专辑
.album-box {
  padding: 20rpx;

  .album-title {
    padding: 10rpx 0;
  }

  .album-list-box {
    .album-item {
      display: flex;
      padding: 10rpx 0;
      border-bottom: 10rpx solid #eee;
      .album-cover {
        flex: 1;
        image {
          width: 180rpx;
          height: 180rpx;
        }
      }

      .album-info-box {
        flex: 3;
        position: relative;
        padding-left: 20rpx;
        .album-info-text {
          width: 100rpx;
          height: 50rpx;
          background-color: $color;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .album-name {
          padding: 10rpx 0;
          color: #888;
        }
        .iconfont {
          font-size: 40rpx;
          position: absolute;
          top: 50%;
          right: 0;
          transform: translateY(-50%);
        }
      }
    }
  }
}

// 最热评论
.comment {
  .comment-title {
    padding: 15rpx;
    .iconfont {
      color: red;
      font-size: 40rpx;
    }

    .comment-text {
      font-weight: 600;
      font-size: 28rpx;
      color: #666;
      margin-left: 10rpx;
    }
  }

  .comment-list {
  }
}

// 最热评论列表
.comment-list-box {
  .comment-item {
    border-bottom: 10rpx solid #eee;
    // 用户信息
    .comment-user {
      display: flex;
      padding: 20rpx 0;
      .user-icon {
        width: 15%;
        display: flex;
        justify-content: center;
        align-items: center;
        image {
          width: 90%;
        }
      }

      .user-name {
        flex: 1;
        .user-nickname {
          color: #777;
        }

        .user-time {
          color: #ccc;
          font-size: 24rpx;
          padding: 5rpx;
        }
      }

      .user-badge {
        image {
          width: 40rpx;
          height: 40rpx;
          display: inline-block;
        }
      }
    }
    // 评论数据
    .comment-desc {
      display: flex;
      padding: 30rpx 0;
      .comment-content {
        flex: 1;
        padding-left: 15%;
        color: #000;
      }

      .comment-likes {
        text-align: right;
        .iconzansel {
        }
      }
    }
  }
}
// 下载
.download-box{
  height: 120rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .donload-btn{
    width: 90%;
    height: 80%;
    background-color: $color;
    color: #fff;
    font-size: 50rpx;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
  

</style>
