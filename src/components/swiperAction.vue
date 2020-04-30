<template>
  <view @touchstart="onTouchStart" @touchend="onTouchEnd">
    <slot></slot>
  </view>
</template>

<script>
export default {
  data() {
    return {
      startTime: 0,
      startX:0,
      startY:0
    };
  },

  methods: {
    onTouchStart(e) {
      // console.log(e);
      this.startTime=Date.now()
      this.startX=e.changedTouches[0].clientX
      this.startY=e.changedTouches[0].clientY
    },

    onTouchEnd(e) {
      // console.log(e);
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
      if(Math.abs(endX - this.startX) > 10 && Math.abs(endY - this.startY) < 10){
        // 滑动方向
        direction = endX - this.startX > 0? 'right' : 'left'
      }else{
        return
      }

      console.log(direction);
      // 向父组件传递自定义事件swiperAction
      this.$emit('swiperAction', {direction})
    },
  },
};
</script>

<style></style>
