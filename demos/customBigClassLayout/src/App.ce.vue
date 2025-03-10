<template>
  <div class="big-class-portrait-custom">
    <div class="class-header">
      <div
        class="board-area"
        :style="{width: videoShow ? 'calc(100% - 115px)' : '100%'}"
      >
        <BoardWrap />
      </div>
      <div
        class="video-area"
        :style="{transform: videoShow ? 'translateX(0)' : 'translateX(115px)'}"
      >
        <div
          class="video-toggle"
          @click="toggleShow"
        >
          <i :class="videoShow ? 'close' : ''" />
        </div>
        <div
          ref="videoAreaRef"
          class="video-area-inner"
        />
      </div>
    </div>
    <div
      ref="footerAreaRef"
      class="footer-area"
    />
    <div class="tabs">
      <div class="tab" :class="{active: tabIndex === 0}" @click="tabIndex = 0">聊天</div>
      <div class="tab" :class="{active: tabIndex === 1}" @click="tabIndex = 1">直播介绍</div>
    </div>
    <div class="im-area" v-show="tabIndex === 0">
      <PortraitIMWrap />
    </div>
    <div class="live-info" v-show="tabIndex === 1">
      直播介绍内容
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref, nextTick, watchEffect } from 'vue';
import BoardWrap from './components/BoardWrap.vue';
import PortraitIMWrap from './components/PortraitIMWrap.vue';
import { useVideos } from './useVideos';

const videoAreaRef = ref();
const footerAreaRef = ref();
const tabIndex = ref(0);
const { teacherVideo, studentVideos } = useVideos();

// video 是否默认展示
const videoShow = ref(true);

const toggleShow = () => {
  videoShow.value = !videoShow.value;
};

onMounted(() => {
  nextTick(() => {
    TCIC.SDK.instance.loadComponent('footer-component', {
      left: '0',
      top: '0',
      zIndex: 11,
      width: '100%',
      height: '40px',
      display: 'block',
    })
      .then((ele) => {
        footerAreaRef.value.appendChild(ele);
        const footerVue = TCIC.SDK.instance.getComponent('footer-component').getVueInstance();
        footerVue.disableQuickIM = true;
      })
      .catch((err) => {
        console.log('initLayout', err);
      });
  });
  initVideos({ teacherVideo, studentVideos });
});

const initVideos = ({ teacherVideo, studentVideos }) => {
  console.warn('bigClass-video-sync::initVideos', teacherVideo, studentVideos);
  const promiseArr = [];
  if (teacherVideo.value) {
    promiseArr.push(TCIC.SDK.instance.updateComponent('teacher-component', {
      left: '0',
      top: '0',
      width: '115px',
      height: '80px',
      display: 'block',
      position: 'relative',
    }).then(() => {
      const ele = TCIC.SDK.instance.getComponent('teacher-component');
      if (ele) {
        videoAreaRef.value?.appendChild(ele);
      }
    }));
  }
  studentVideos.value?.forEach((info) => {
    promiseArr.push(TCIC.SDK.instance.updateComponent('student-component', {
      left: '0',
      top: '0',
      width: '115px',
      height: '80px',
      display: 'block',
      position: 'relative',
    }, info.userId).then(() => {
      const studentDom = TCIC.SDK.instance.getComponent('student-component', info.userId);
      if (studentDom) {
        videoAreaRef.value?.appendChild(studentDom);
      }
    }));
  });
  return Promise.all(promiseArr);
};

watchEffect(() => {
    initVideos({
      teacherVideo,
      studentVideos,
    });
  }
);

</script>

<!-- 这里写的 css不会被打包到 css 文件 -->
<style lang="less" scoped>

</style>
