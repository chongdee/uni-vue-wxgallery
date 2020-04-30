<template>
  <view
    @touchstart="onTouchstart"
    @touchend="onTouchend"
  >
    学习手势事件
  </view>
</template>

<script>
export default {
  data() {
    return {
      startTime: 0,
      startX:0,
      startY:0
    }
  },
  methods: {
    onTouchstart(e) {
      console.log(e);
      console.log("按下" + e.changedTouches[0].clientX);
      console.log("按下" + e.changedTouches[0].clientY);

      this.startTime=Date.now()
      this.startX=e.changedTouches[0].clientX
      this.startY=e.changedTouches[0].clientY
      
    },
    onTouchend(e) {
      console.log(e);
      console.log("离开" + e.changedTouches[0].clientX);
      console.log("离开" + e.changedTouches[0].clientY);

      let endTime = Date.now()
      let endX = e.changedTouches[0].clientX
      let endY = e.changedTouches[0].clientY

      // 判断按下的时长
      if(endTime - this.startTime > 2000){
        return
      }

      // 滑动方向
      let direction = ''
      // 先判断滑动距离的合法性
      if(Math.abs(endX - this.startX) > 10){
        // 滑动方向
        direction = endX - this.startX > 0? 'right' : 'left'
      }else{
        return
      }

      console.log(direction);
      
    }
  },
}
</script>

<style>
view{
  width: 100%;
  height: 500rpx;
  background-color: pink;
}
</style>